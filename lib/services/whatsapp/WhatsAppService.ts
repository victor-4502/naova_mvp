/**
 * WhatsApp Service - Integración con Meta WhatsApp Business API
 * 
 * Permite enviar mensajes de texto y templates a través de WhatsApp
 */

interface SendTextMessageOptions {
  to: string // Número de teléfono en formato internacional sin + (ej: 523312283639)
  message: string // Contenido del mensaje
}

interface SendTemplateMessageOptions {
  to: string
  templateName: string
  languageCode?: string // Default: es
  parameters?: Record<string, string>
}

interface WhatsAppApiResponse {
  messaging_product: string
  contacts: Array<{
    input: string
    wa_id: string
  }>
  messages: Array<{
    id: string
  }>
}

interface WhatsAppApiError {
  error: {
    message: string
    type: string
    code: number
    error_subcode?: number
    fbtrace_id?: string
  }
}

export class WhatsAppService {
  private static readonly API_VERSION = 'v22.0'
  private static readonly BASE_URL = 'https://graph.facebook.com'

  /**
   * Obtiene el Phone Number ID desde las variables de entorno
   */
  private static getPhoneNumberId(): string {
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
    if (!phoneNumberId) {
      throw new Error(
        'WHATSAPP_PHONE_NUMBER_ID no está configurado en las variables de entorno'
      )
    }
    return phoneNumberId
  }

  /**
   * Obtiene el Access Token desde las variables de entorno
   */
  private static getAccessToken(): string {
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN
    if (!accessToken) {
      throw new Error(
        'WHATSAPP_ACCESS_TOKEN no está configurado en las variables de entorno'
      )
    }
    return accessToken
  }

  /**
   * Normaliza el número de teléfono
   * Remueve espacios, guiones, paréntesis y el signo +
   */
  private static normalizePhoneNumber(phone: string): string {
    return phone.replace(/[\s\+\-\(\)]/g, '')
  }

  /**
   * Envía un mensaje de texto libre (requiere conversación iniciada)
   * 
   * NOTA: Para mensajes libres, el cliente debe haber iniciado la conversación
   * dentro de las últimas 24 horas. Si no, usar sendTemplateMessage.
   */
  static async sendTextMessage(options: SendTextMessageOptions): Promise<{
    success: boolean
    messageId?: string
    error?: string
  }> {
    try {
      const phoneNumberId = this.getPhoneNumberId()
      const accessToken = this.getAccessToken()
      const normalizedTo = this.normalizePhoneNumber(options.to)

      const url = `${this.BASE_URL}/${this.API_VERSION}/${phoneNumberId}/messages`

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: normalizedTo,
          type: 'text',
          text: {
            body: options.message,
          },
        }),
      })

      const data: WhatsAppApiResponse | WhatsAppApiError = await response.json()

      if (!response.ok) {
        const error = data as WhatsAppApiError
        console.error('[WhatsAppService] Error enviando mensaje:', error)
        return {
          success: false,
          error: error.error?.message || 'Error desconocido al enviar mensaje',
        }
      }

      const success = data as WhatsAppApiResponse
      const messageId = success.messages?.[0]?.id

      console.log('[WhatsAppService] Mensaje enviado exitosamente:', {
        to: normalizedTo,
        messageId,
      })

      return {
        success: true,
        messageId,
      }
    } catch (error) {
      console.error('[WhatsAppService] Error inesperado:', error)
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Error inesperado al enviar mensaje',
      }
    }
  }

  /**
   * Envía un mensaje usando un template pre-aprobado
   * 
   * Los templates deben estar aprobados en Meta Business Manager.
   * Útil para iniciar conversaciones o cuando han pasado 24 horas.
   */
  static async sendTemplateMessage(
    options: SendTemplateMessageOptions
  ): Promise<{
    success: boolean
    messageId?: string
    error?: string
  }> {
    try {
      const phoneNumberId = this.getPhoneNumberId()
      const accessToken = this.getAccessToken()
      const normalizedTo = this.normalizePhoneNumber(options.to)

      const url = `${this.BASE_URL}/${this.API_VERSION}/${phoneNumberId}/messages`

      const templatePayload: any = {
        messaging_product: 'whatsapp',
        to: normalizedTo,
        type: 'template',
        template: {
          name: options.templateName,
          language: {
            code: options.languageCode || 'es',
          },
        },
      }

      // Agregar parámetros si existen
      if (options.parameters && Object.keys(options.parameters).length > 0) {
        templatePayload.template.components = [
          {
            type: 'body',
            parameters: Object.values(options.parameters).map((value) => ({
              type: 'text',
              text: value,
            })),
          },
        ]
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templatePayload),
      })

      const data: WhatsAppApiResponse | WhatsAppApiError = await response.json()

      if (!response.ok) {
        const error = data as WhatsAppApiError
        console.error('[WhatsAppService] Error enviando template:', error)
        return {
          success: false,
          error: error.error?.message || 'Error desconocido al enviar template',
        }
      }

      const success = data as WhatsAppApiResponse
      const messageId = success.messages?.[0]?.id

      console.log('[WhatsAppService] Template enviado exitosamente:', {
        to: normalizedTo,
        templateName: options.templateName,
        messageId,
      })

      return {
        success: true,
        messageId,
      }
    } catch (error) {
      console.error('[WhatsAppService] Error inesperado:', error)
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Error inesperado al enviar template',
      }
    }
  }

  /**
   * Intenta enviar un mensaje de texto libre, y si falla (ventana de 24h cerrada),
   * intenta enviar un template alternativo
   */
  static async sendMessageWithFallback(
    to: string,
    message: string,
    fallbackTemplateName?: string
  ): Promise<{
    success: boolean
    messageId?: string
    usedTemplate: boolean
    error?: string
  }> {
    // Intentar enviar texto libre primero
    const textResult = await this.sendTextMessage({ to, message })

    if (textResult.success) {
      return {
        ...textResult,
        usedTemplate: false,
      }
    }

    // Si falla y hay template de respaldo, usarlo
    if (fallbackTemplateName) {
      console.log(
        '[WhatsAppService] Mensaje libre falló, usando template:',
        fallbackTemplateName
      )
      const templateResult = await this.sendTemplateMessage({
        to,
        templateName: fallbackTemplateName,
      })

      return {
        ...templateResult,
        usedTemplate: true,
      }
    }

    // Si no hay template de respaldo, devolver el error
    return {
      ...textResult,
      usedTemplate: false,
    }
  }
}

