import type { FieldId } from '@/lib/rules/requestSchemas'
import type { RequestCategoryRule } from '@/lib/rules/requestSchemas'
import { generateAIMessage, type GenerateMessageOptions } from '@/lib/services/ai/AIService'

export interface FollowUpInput {
  categoryRule: RequestCategoryRule | null
  missingFields: FieldId[]
  /**
   * Campos que ya están presentes (opcional, para contexto de IA)
   */
  presentFields?: Array<{
    id: string
    label: string
    description: string
  }>
  /**
   * Contenido original del request (para contexto de IA)
   */
  requestContent?: string
  /**
   * Información del cliente (opcional)
   */
  clientInfo?: {
    name?: string | null
    company?: string | null
  }
  /**
   * Historial de mensajes (opcional)
   */
  conversationHistory?: Array<{
    direction: 'inbound' | 'outbound'
    content: string
    timestamp: string
  }>
  /**
   * Canal de comunicación
   */
  channel?: 'whatsapp' | 'email' | 'web'
}

/**
 * Genera un mensaje de seguimiento usando IA si está disponible,
 * o plantilla predefinida como fallback
 */
export async function generateFollowUpMessage(input: FollowUpInput): Promise<string | null> {
  const { categoryRule, missingFields, presentFields, requestContent, clientInfo, conversationHistory, channel = 'web' } = input

  if (!categoryRule || missingFields.length === 0) {
    // Nada que pedir
    return null
  }

  const missingFieldRules = categoryRule.fields.filter((f) =>
    missingFields.includes(f.id),
  )

  if (missingFieldRules.length === 0) {
    return null
  }

  // Intentar generar con IA si está disponible y tenemos contexto
  if (requestContent) {
    const aiOptions: GenerateMessageOptions = {
      requestContent,
      category: categoryRule.name,
      missingFields: missingFieldRules.map((f) => ({
        id: f.id,
        label: f.label,
        description: f.description,
        examples: f.examples,
      })),
      presentFields: presentFields?.map((f) => ({
        id: f.id,
        label: f.label,
        description: f.description,
      })),
      clientInfo,
      conversationHistory,
      channel,
    }

    const aiMessage = await generateAIMessage(aiOptions)
    if (aiMessage) {
      console.log('[FollowUpGenerator] Mensaje generado con IA')
      return aiMessage
    }
  }

  // Fallback: usar plantilla predefinida
  console.log('[FollowUpGenerator] Usando plantilla predefinida (fallback)')
  return generateTemplateMessage(categoryRule, missingFieldRules)
}

/**
 * Genera mensaje usando plantilla predefinida (fallback cuando IA no está disponible)
 */
function generateTemplateMessage(
  categoryRule: RequestCategoryRule,
  missingFieldRules: Array<{ id: string; label: string; description: string; examples?: string[] }>
): string {
  const intro = `¡Gracias por tu mensaje! Detecté que quieres hacer un requerimiento relacionado con **${categoryRule.name}**. Para poder cotizarlo bien con proveedores, me falta lo siguiente:`

  const bulletLines = missingFieldRules.map((field) => {
    const examples =
      field.examples && field.examples.length > 0
        ? ` Ejemplos: ${field.examples.join(', ')}.`
        : ''
    return `- **${field.label}**: ${field.description}.${examples}`
  })

  const outro =
    'Con esa información ya puedo estructurar bien el requerimiento y moverlo con los proveedores adecuados.'

  return [intro, '', ...bulletLines, '', outro].join('\n')
}


