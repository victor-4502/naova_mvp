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
   * Campos que ya están presentes en el request (opcional)
   */
  presentFields?: Array<{
    id: string
    label: string
    description: string
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
  const { requestContent, category, missingFields, presentFields, clientInfo, conversationHistory, channel } = options

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

  // Historial de conversación (si existe) - esto es CRUCIAL para entender el contexto
  if (conversationHistory && conversationHistory.length > 0) {
    prompt += `HISTORIAL COMPLETO DE LA CONVERSACIÓN (orden cronológico):\n`
    conversationHistory.forEach((msg, idx) => {
      const role = msg.direction === 'inbound' ? 'Cliente' : 'Naova'
      const date = new Date(msg.timestamp).toLocaleString('es-MX')
      prompt += `${idx + 1}. [${date}] ${role}: "${msg.content}"\n`
    })
    prompt += `\n`
  } else {
    // Si no hay historial, usar el contenido original
    prompt += `MENSAJE DEL CLIENTE:\n"${requestContent}"\n\n`
  }

  // Campos que YA están presentes (información importante para contexto)
  if (presentFields && presentFields.length > 0) {
    prompt += `INFORMACIÓN QUE EL CLIENTE YA PROPORCIONÓ:\n`
    presentFields.forEach((field) => {
      prompt += `- ${field.label}: ${field.description}\n`
    })
    prompt += `\n`
  }

  // Campos faltantes
  prompt += `INFORMACIÓN QUE TODAVÍA FALTA:\n`
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

  // Instrucciones finales - MEJORADAS para que analice el historial
  prompt += `INSTRUCCIONES PARA GENERAR EL MENSAJE:\n`
  prompt += `1. Analiza el historial de conversación para identificar qué información el cliente YA proporcionó\n`
  prompt += `2. Solo menciona y solicita los campos que están en "INFORMACIÓN QUE TODAVÍA FALTA"\n`
  prompt += `3. NO vuelvas a pedir información que ya está en "INFORMACIÓN QUE EL CLIENTE YA PROPORCIONÓ"\n`
  prompt += `4. Si el cliente ya mencionó algo en mensajes anteriores, haz referencia a eso de manera natural\n`
  prompt += `5. Sé conciso: solo pide lo que realmente falta, sin repetir lo que ya sabes\n`
  prompt += `6. Mantén un tono amigable y profesional, apropiado para ${channel}\n`
  prompt += `7. Si hay múltiples campos faltantes, enuméralos de manera clara\n`
  prompt += `8. Proporciona ejemplos solo cuando sean útiles\n\n`
  
  prompt += `EJEMPLO CORRECTO:\n`
  prompt += `Si el cliente ya mencionó "máquina de inyección plásticos" y "mantenimiento correctivo", y solo falta la ubicación, di:\n`
  prompt += `"Perfecto, ya tengo que necesitas mantenimiento correctivo para una máquina de inyección plásticos. Solo me falta saber dónde se encuentra el equipo (ubicación)."\n\n`
  
  prompt += `EJEMPLO INCORRECTO:\n`
  prompt += `NO repitas toda la lista completa de campos, solo menciona lo que falta.\n\n`
  
  prompt += `IMPORTANTE: El mensaje debe ser natural, conversacional y profesional. Evita formato markdown excesivo.`

  return prompt
}

/**
 * Verifica si el servicio de IA está disponible
 */
export function isAIAvailable(): boolean {
  return !!openaiClient && !!process.env.OPENAI_API_KEY
}

