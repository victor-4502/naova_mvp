/**
 * Servicio para generar mensajes de confirmación cuando un request está completo
 * Usa plantillas rotativas (NO IA)
 */

import { prisma } from '@/lib/prisma'
import { generateCompletionMessage } from './CompletionMessageTemplates'
import { WhatsAppService } from '@/lib/services/whatsapp/WhatsAppService'
import { EmailService } from '@/lib/services/email/EmailService'
import { REQUEST_STATUSES } from '@/lib/utils/constants'
import { isGlobalAutoSendEnabled } from '@/lib/utils/autoSendConfig'

export class CompletionMessageService {
  /**
   * Genera y guarda un mensaje de confirmación cuando un request está completo
   * Solo se llama cuando el request pasa de INCOMPLETE a READY_FOR_SUPPLIER_MATCHING
   */
  static async maybeSendCompletionMessage(
    requestId: string,
    previousStatus: string,
    newStatus: string
  ) {
    // Solo generar si el nuevo estado es READY_FOR_SUPPLIER_MATCHING
    // Y el estado anterior era INCOMPLETE (o vacío, para requests nuevos que ya vienen completos)
    if (newStatus !== REQUEST_STATUSES.READY_FOR_SUPPLIER_MATCHING) {
      return
    }

    // Si el estado anterior era INCOMPLETE o vacío, generar mensaje
    const shouldGenerate =
      previousStatus === REQUEST_STATUSES.INCOMPLETE_INFORMATION ||
      previousStatus === '' ||
      !previousStatus

    if (!shouldGenerate) {
      return
    }

    console.log('[CompletionMessage] Request completado, generando mensaje de confirmación:', requestId)

    // Obtener información del request
    const request = await prisma.request.findUnique({
      where: { id: requestId },
      include: {
        client: {
          select: {
            name: true,
            company: true,
            email: true,
            phone: true,
          },
        },
        messages: {
          where: { direction: 'outbound' },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!request) {
      console.warn('[CompletionMessage] Request no encontrado:', requestId)
      return
    }

    // Verificar si auto-reply está habilitado
    let normalized = request.normalizedContent
    if (typeof normalized === 'string') {
      try {
        normalized = JSON.parse(normalized)
      } catch (e) {
        normalized = {}
      }
    }
    normalized = normalized || {}
    const rules = normalized.rules || {}
    const autoReplyEnabled: boolean =
      typeof rules.autoReplyEnabled === 'boolean' ? rules.autoReplyEnabled : true

    if (!autoReplyEnabled) {
      console.log('[CompletionMessage] Auto-reply deshabilitado, no se envía mensaje de confirmación')
      return
    }

    // Contar mensajes previos enviados para rotar plantilla
    const previousMessagesCount = request.messages.length

    // Generar mensaje usando plantillas rotativas
    const messageText = generateCompletionMessage(
      {
        clientName: request.client?.name,
        clientCompany: request.client?.company,
        category: request.category || null,
      },
      previousMessagesCount
    )

    // Determinar contacto y canal
    let toContact: string | null = null
    const channel = request.source === 'whatsapp' 
      ? 'whatsapp' as const
      : request.source === 'email'
      ? 'email' as const
      : 'web' as const

    // Obtener contacto del último mensaje inbound
    const lastInboundMessage = await prisma.message.findFirst({
      where: {
        requestId,
        direction: 'inbound',
      },
      orderBy: { createdAt: 'desc' },
    })

    if (channel === 'whatsapp') {
      toContact = lastInboundMessage?.from || request.client?.phone || null
    } else if (channel === 'email') {
      toContact = lastInboundMessage?.from || request.client?.email || null
    }

    if (!toContact) {
      console.warn('[CompletionMessage] No se pudo determinar contacto para enviar mensaje de confirmación')
      // Aún así, guardamos el mensaje
    }

    // Obtener subject original si es email
    const originalSubject = lastInboundMessage?.subject || `Requerimiento ${requestId}`

    // Guardar mensaje outbound
    const fromContact = 'Sistema Naova'
    const newMessage = await prisma.message.create({
      data: {
        requestId,
        source: request.source,
        direction: 'outbound',
        content: messageText,
        from: fromContact,
        to: toContact || 'pendiente',
        ...(channel === 'email' && { subject: originalSubject }),
        processed: false, // Por defecto pendiente, se actualizará si se envía
      },
    })

    console.log('[CompletionMessage] Mensaje de confirmación guardado:', newMessage.id)

    // Si el envío automático global está habilitado Y tenemos contacto, enviar automáticamente
    const shouldAutoSend = isGlobalAutoSendEnabled()
    
    if (shouldAutoSend && toContact) {
      try {
        console.log('[CompletionMessage] Envío automático habilitado, enviando mensaje de confirmación...')
        
        if (channel === 'whatsapp') {
          const result = await WhatsAppService.sendMessageWithFallback(
            toContact,
            messageText,
            'hello_world'
          )

          if (result.success && result.messageId) {
            await prisma.message.update({
              where: { id: newMessage.id },
              data: {
                processed: true,
                processedAt: new Date(),
                sourceId: result.messageId,
                to: toContact,
              },
            })
            console.log('[CompletionMessage] Mensaje de WhatsApp enviado automáticamente:', result.messageId)
          }
        } else if (channel === 'email') {
          const result = await EmailService.sendReply(
            toContact,
            originalSubject,
            messageText,
            lastInboundMessage?.sourceId || undefined
          )

          if (result.success && result.messageId) {
            await prisma.message.update({
              where: { id: newMessage.id },
              data: {
                processed: true,
                processedAt: new Date(),
                sourceId: result.messageId,
                to: toContact,
              },
            })
            console.log('[CompletionMessage] Mensaje de Email enviado automáticamente:', result.messageId)
          }
        }
      } catch (error) {
        console.error('[CompletionMessage] Error al enviar mensaje automáticamente:', error)
      }
    } else {
      console.log('[CompletionMessage] Envío automático deshabilitado. Mensaje guardado como borrador (processed: false)')
    }
  }
}

