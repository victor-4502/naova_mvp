import { prisma } from '@/lib/prisma'
import { findCategoryRule, type FieldId } from '@/lib/rules/requestSchemas'
import { generateFollowUpMessage } from './FollowUpGenerator'
import { WhatsAppService } from '@/lib/services/whatsapp/WhatsAppService'
import { EmailService } from '@/lib/services/email/EmailService'

export class AutoReplyService {
  /**
   * Crea un mensaje de salida automático cuando el request está incompleto
   * y la auto-respuesta está habilitada. No envía todavía al canal externo,
   * solo registra el mensaje outbound en la tabla Message.
   */
  static async maybeSendAutoReply(request: any) {
    // Parsear normalizedContent si viene como string JSON (desde Prisma)
    let normalized = request.normalizedContent
    if (typeof normalized === 'string') {
      try {
        normalized = JSON.parse(normalized)
      } catch (e) {
        console.warn('Error parsing normalizedContent:', e)
        normalized = {}
      }
    }
    normalized = normalized || {}
    
    const rules = normalized.rules || {}

    const autoReplyEnabled: boolean =
      typeof rules.autoReplyEnabled === 'boolean' ? rules.autoReplyEnabled : true

    if (!autoReplyEnabled) {
      console.log('[AutoReply] Auto-reply disabled for request:', request.id)
      return
    }

    const missingFields = (rules.missingFields || []) as FieldId[]
    const categoryRuleId = rules.categoryRuleId as string | null | undefined

    console.log('[AutoReply] Checking request:', {
      requestId: request.id,
      categoryRuleId,
      missingFields: missingFields.length,
      autoReplyEnabled,
    })

    if (!categoryRuleId || !missingFields || missingFields.length === 0) {
      console.log('[AutoReply] Skipping - missing categoryRuleId or missingFields:', {
        categoryRuleId,
        missingFieldsLength: missingFields.length,
      })
      return
    }

    const categoryRule = findCategoryRule(categoryRuleId)
    if (!categoryRule) {
      return
    }

    // Obtener información adicional del request para contexto de IA y envío
    const requestWithDetails = await prisma.request.findUnique({
      where: { id: request.id },
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
          orderBy: { createdAt: 'asc' },
          take: 10, // Últimos 10 mensajes para contexto
          select: {
            direction: true,
            content: true,
            createdAt: true,
            from: true,
            to: true,
            subject: true,
            sourceId: true,
          },
        },
      },
    })

    // Preparar contexto para IA
    const clientInfo = requestWithDetails?.client
      ? {
          name: requestWithDetails.client.name,
          company: requestWithDetails.client.company,
        }
      : undefined

    const conversationHistory = requestWithDetails?.messages
      ? requestWithDetails.messages.map((msg) => ({
          direction: msg.direction as 'inbound' | 'outbound',
          content: msg.content,
          timestamp: msg.createdAt.toISOString(),
        }))
      : undefined

    // Determinar el canal
    const channel = request.source === 'whatsapp' 
      ? 'whatsapp' as const
      : request.source === 'email'
      ? 'email' as const
      : 'web' as const

    const text = await generateFollowUpMessage({
      categoryRule,
      missingFields,
      requestContent: request.rawContent || request.content || '',
      clientInfo,
      conversationHistory,
      channel,
    })

    if (!text) {
      return
    }

    // Determinar el contacto del cliente para enviar el mensaje
    let toContact: string | null = null
    const messageWithFrom = requestWithDetails?.messages.find(msg => msg.from)
    
    if (channel === 'whatsapp') {
      // Para WhatsApp, obtener el número del mensaje original
      if (messageWithFrom?.from) {
        toContact = messageWithFrom.from
      } else if (requestWithDetails?.client?.phone) {
        toContact = requestWithDetails.client.phone
      }
    } else if (channel === 'email') {
      // Para email, obtener del mensaje o del cliente
      if (messageWithFrom?.from) {
        toContact = messageWithFrom.from
      } else if (requestWithDetails?.client?.email) {
        toContact = requestWithDetails.client.email
      }
    }

    // Si no hay contacto, no podemos enviar el mensaje
    if (!toContact) {
      console.warn('[AutoReply] No se pudo determinar el contacto para enviar auto-respuesta', {
        requestId: request.id,
        source: request.source,
        hasClient: !!requestWithDetails?.client,
        messagesCount: requestWithDetails?.messages.length || 0,
      })
      // Aún así, guardamos el mensaje para que pueda enviarse manualmente después
    }

    // Obtener el "from" (remitente) - usar un valor por defecto para auto-respuestas
    const fromContact = 'Sistema Naova'

    // Guardar información del email original para threading (si aplica)
    const originalMessage = requestWithDetails?.messages.find(m => m.direction === 'inbound')
    const originalSubject = channel === 'email' 
      ? (originalMessage?.subject || `Requerimiento ${request.id}`)
      : null

    // Registrar mensaje outbound asociado al request
    // NO se envía automáticamente - se debe activar desde el panel con el toggle
    const newMessage = await prisma.message.create({
      data: {
        requestId: request.id,
        source: request.source,
        direction: 'outbound',
        content: text,
        from: fromContact,
        to: toContact || 'pendiente', // Usar 'pendiente' si no hay contacto (campo NOT NULL)
        subject: originalSubject || null,
        processed: false, // Queda pendiente de envío - se envía solo si auto-reply está activado
      },
    })

    console.log('[AutoReply] Mensaje generado y guardado (pendiente de envío). ID:', newMessage.id)
    if (!toContact) {
      console.warn('[AutoReply] No se pudo determinar el contacto. El mensaje quedó guardado pero requiere contacto para enviarse.')
    }
  }
}


