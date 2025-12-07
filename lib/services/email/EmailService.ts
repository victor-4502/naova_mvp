/**
 * Email Service - Envío de emails desde la plataforma
 * 
 * Permite enviar emails a clientes desde la plataforma admin
 */

import { sendEmail } from '@/lib/email'

interface SendEmailOptions {
  to: string // Email del destinatario
  subject: string // Asunto del email
  message: string // Contenido del mensaje (texto plano)
  replyTo?: string // Email para responder (opcional)
  inReplyTo?: string // Message-ID del email original (para threading)
  references?: string[] // Referencias para threading
}

export class EmailService {
  /**
   * Envía un email simple
   */
  static async sendEmail(options: SendEmailOptions): Promise<{
    success: boolean
    messageId?: string
    error?: string
  }> {
    try {
      // Convertir mensaje de texto plano a HTML básico
      const htmlContent = this.textToHtml(options.message)
      
      // Preparar headers para threading si hay inReplyTo
      const headers: Record<string, string> = {}
      if (options.inReplyTo) {
        headers['In-Reply-To'] = options.inReplyTo
        headers['References'] = options.references?.join(' ') || options.inReplyTo
      }

      // Usar la función existente sendEmail de lib/email.ts
      const result = await sendEmail({
        to: options.to,
        subject: options.subject,
        html: htmlContent,
        text: options.message,
      })

      if (result.success) {
        console.log('[EmailService] Email enviado exitosamente:', {
          to: options.to,
          subject: options.subject,
          messageId: result.messageId,
        })

        return {
          success: true,
          messageId: result.messageId,
        }
      } else {
        return {
          success: false,
          error: result.error?.toString() || 'Error desconocido al enviar email',
        }
      }
    } catch (error) {
      console.error('[EmailService] Error inesperado:', error)
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Error inesperado al enviar email',
      }
    }
  }

  /**
   * Envía una respuesta a un email existente (con threading)
   */
  static async sendReply(
    to: string,
    originalSubject: string,
    message: string,
    originalMessageId?: string,
    originalReferences?: string[]
  ): Promise<{
    success: boolean
    messageId?: string
    error?: string
  }> {
    // Formatear asunto como respuesta (agregar "Re: " si no lo tiene)
    const replySubject = originalSubject.startsWith('Re: ')
      ? originalSubject
      : `Re: ${originalSubject}`

    return this.sendEmail({
      to,
      subject: replySubject,
      message,
      inReplyTo: originalMessageId,
      references: originalReferences,
    })
  }

  /**
   * Convierte texto plano a HTML básico
   * Preserva saltos de línea y formato básico
   */
  private static textToHtml(text: string): string {
    // Escapar caracteres HTML
    const escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

    // Convertir saltos de línea a <br>
    const withBreaks = escaped.replace(/\n/g, '<br>')

    // Envolver en HTML básico
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px;">
            ${withBreaks}
          </div>
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
            <p>Este email fue enviado desde la plataforma Naova.</p>
            <p>Por favor, no respondas directamente a este email. Usa la plataforma para continuar la conversación.</p>
          </div>
        </body>
      </html>
    `.trim()
  }
}

