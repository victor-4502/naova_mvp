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

    const text = generateFollowUpMessage({
      categoryRule,
      missingFields,
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


