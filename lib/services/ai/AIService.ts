/**
 * Servicio de Inteligencia Artificial para generar mensajes personalizados
 * Usa OpenAI GPT para crear respuestas contextualizadas basadas en el request del cliente
 */

import OpenAI from 'openai'

// Inicializar cliente de OpenAI (solo si hay API key)
let openaiClient: OpenAI | null = null

if (process.env.OPENAI_API_KEY) {
  openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

export interface GenerateMessageOptions {
  /**
   * Contenido del request del cliente
   */
  requestContent: string
  
  /**
   * Categoría del request (ej: "servicios", "herramientas")
   */
  category: string
  
  /**
   * Campos que faltan en el request
   */
  missingFields: Array<{
    id: string
    label: string
    description: string
    examples?: string[]
  }>
  
  /**
   * Información del cliente (opcional)
   */
  clientInfo?: {
    name?: string | null
    company?: string | null
  }
  
  /**
   * Historial de mensajes de la conversación (opcional)
   */
  conversationHistory?: Array<{
    direction: 'inbound' | 'outbound'
    content: string
    timestamp: string
  }>
  
  /**
   * Canal de comunicación (whatsapp, email, etc.)
   */
  channel: 'whatsapp' | 'email' | 'web'
}

/**
 * Genera un mensaje personalizado usando IA
 * Si la IA no está disponible, retorna null para usar el fallback
 */
export async function generateAIMessage(
  options: GenerateMessageOptions
): Promise<string | null> {
  // Si no hay cliente de OpenAI configurado, retornar null para usar fallback
  if (!openaiClient) {
    console.log('[AIService] OpenAI no configurado, usando fallback')
    return null
  }

  try {
    // Construir el prompt con contexto completo
    const prompt = buildPrompt(options)

    console.log('[AIService] Generando mensaje con IA...', {
      category: options.category,
      missingFields: options.missingFields.length,
      hasClientInfo: !!options.clientInfo,
      hasHistory: !!options.conversationHistory?.length,
    })

    const completion = await openaiClient.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini', // Usar gpt-4o-mini por defecto (más económico)
      messages: [
        {
          role: 'system',
          content: `Eres un asistente virtual profesional de Naova, una plataforma de compras B2B para empresas industriales en México. 
Tu objetivo es ayudar a los clientes a completar sus requerimientos de compra de manera amigable y profesional.

INSTRUCCIONES:
- Sé amigable pero profesional
- Usa un tono conversacional apropiado para WhatsApp/Email
- Personaliza el mensaje según el contexto del cliente
- Menciona específicamente qué información falta
- Proporciona ejemplos cuando sea útil
- Mantén el mensaje conciso pero completo
- Si hay historial de conversación, haz referencia a mensajes anteriores cuando sea relevante`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7, // Balance entre creatividad y consistencia
      max_tokens: 500, // Limitar longitud del mensaje
    })

    const message = completion.choices[0]?.message?.content

    if (!message) {
      console.warn('[AIService] No se recibió mensaje de OpenAI')
      return null
    }

    console.log('[AIService] Mensaje generado exitosamente')
    return message.trim()
  } catch (error) {
    console.error('[AIService] Error generando mensaje con IA:', error)
    // En caso de error, retornar null para usar fallback
    return null
  }
}

/**
 * Construye el prompt con todo el contexto necesario
 */
function buildPrompt(options: GenerateMessageOptions): string {
  const { requestContent, category, missingFields, clientInfo, conversationHistory, channel } = options

  let prompt = `Necesito generar un mensaje de seguimiento para un cliente que hizo un requerimiento incompleto.\n\n`

  // Información del cliente
  if (clientInfo) {
    prompt += `INFORMACIÓN DEL CLIENTE:\n`
    if (clientInfo.name) {
      prompt += `- Nombre: ${clientInfo.name}\n`
    }
    if (clientInfo.company) {
      prompt += `- Empresa: ${clientInfo.company}\n`
    }
    prompt += `\n`
  }

  // Categoría del request
  prompt += `CATEGORÍA DEL REQUERIMIENTO: ${category}\n\n`

  // Contenido del request
  prompt += `MENSAJE ORIGINAL DEL CLIENTE:\n"${requestContent}"\n\n`

  // Historial de conversación (si existe)
  if (conversationHistory && conversationHistory.length > 0) {
    prompt += `HISTORIAL DE LA CONVERSACIÓN:\n`
    conversationHistory.slice(-5).forEach((msg, idx) => {
      const role = msg.direction === 'inbound' ? 'Cliente' : 'Naova'
      const date = new Date(msg.timestamp).toLocaleString('es-MX')
      prompt += `${idx + 1}. [${date}] ${role}: "${msg.content}"\n`
    })
    prompt += `\n`
  }

  // Campos faltantes
  prompt += `INFORMACIÓN QUE FALTA:\n`
  missingFields.forEach((field, idx) => {
    prompt += `${idx + 1}. ${field.label}: ${field.description}`
    if (field.examples && field.examples.length > 0) {
      prompt += ` (Ejemplos: ${field.examples.join(', ')})`
    }
    prompt += `\n`
  })
  prompt += `\n`

  // Canal de comunicación
  prompt += `CANAL: ${channel === 'whatsapp' ? 'WhatsApp' : channel === 'email' ? 'Email' : 'Plataforma web'}\n\n`

  // Instrucciones finales
  prompt += `GENERA UN MENSAJE que:\n`
  prompt += `- Agradezca al cliente por su mensaje\n`
  prompt += `- Mencione que detectaste que necesita ${category}\n`
  prompt += `- Liste de manera clara y amigable qué información falta\n`
  prompt += `- Proporcione ejemplos cuando sea útil\n`
  prompt += `- Sea apropiado para el canal ${channel}\n`
  if (conversationHistory && conversationHistory.length > 0) {
    prompt += `- Haga referencia al contexto de la conversación cuando sea relevante\n`
  }
  prompt += `- Termine de manera profesional invitando a proporcionar la información faltante\n\n`
  prompt += `IMPORTANTE: El mensaje debe ser natural, conversacional y profesional. No uses formato markdown excesivo.`

  return prompt
}

/**
 * Verifica si el servicio de IA está disponible
 */
export function isAIAvailable(): boolean {
  return !!openaiClient && !!process.env.OPENAI_API_KEY
}

