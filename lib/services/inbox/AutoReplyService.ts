import { prisma } from '@/lib/prisma'
import { findCategoryRule, type FieldId } from '@/lib/rules/requestSchemas'
import { generateFollowUpMessage } from './FollowUpGenerator'

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

    // Obtener información adicional del request para contexto de IA
    const requestWithDetails = await prisma.request.findUnique({
      where: { id: request.id },
      include: {
        client: {
          select: {
            name: true,
            company: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 10, // Últimos 10 mensajes para contexto
          select: {
            direction: true,
            content: true,
            createdAt: true,
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

    // Registrar mensaje outbound asociado al request.
    // En el futuro, un worker puede tomar estos mensajes y
    // enviarlos por WhatsApp/email/plataforma según el source.
    await prisma.message.create({
      data: {
        requestId: request.id,
        source: request.source,
        direction: 'outbound',
        content: text,
        // TODO: Rellenar from/to según el canal y metadata cuando se integre con proveedores reales
        processed: false,
      },
    })
  }
}


