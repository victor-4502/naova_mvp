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
  /**
   * Número de mensajes automáticos ya enviados (para variar el tono)
   */
  previousAutoReplyCount?: number
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
Tu objetivo es ayudar a los clientes a completar sus requerimientos de compra de manera AMIGABLE, PERSONAL y HUMANA.

NUESTRA PROPUESTA DE VALOR se centra en el trato personal y humano, así que es CRÍTICO que los mensajes:
- Suenen como si los escribiera una persona real, no un robot
- Varíen según el número de mensajes ya enviados (no repitas la misma introducción)
- Sean naturales, conversacionales y empáticos
- Eviten sonar repetitivos o robóticos

INSTRUCCIONES:
- Sé amigable, cercano y humano - esto es nuestra propuesta de valor
- Varía el tono según cuántos mensajes automáticos ya se hayan enviado
- Personaliza el mensaje según el contexto del cliente
- Menciona específicamente qué información falta, pero de forma natural
- NO repitas la misma introducción en mensajes subsecuentes
- Haz referencia a lo que el cliente ya proporcionó antes de pedir lo que falta
- Mantén el mensaje conciso pero completo
- Proporciona ejemplos breves solo cuando sean útiles`,
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
  const { requestContent, category, missingFields, presentFields, clientInfo, conversationHistory, channel, previousAutoReplyCount = 0 } = options

  const previousCount = previousAutoReplyCount || 0

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

  // Número de mensajes automáticos previos
  prompt += `NÚMERO DE MENSAJES AUTOMÁTICOS YA ENVIADOS: ${previousCount}\n\n`

  // Instrucciones finales - MEJORADAS para variar según el número de mensajes
  prompt += `INSTRUCCIONES PARA GENERAR EL MENSAJE (MUY IMPORTANTE):\n`
  prompt += `1. Analiza el historial de conversación para identificar qué información el cliente YA proporcionó\n`
  prompt += `2. Solo menciona y solicita los campos que están en "INFORMACIÓN QUE TODAVÍA FALTA"\n`
  prompt += `3. NO vuelvas a pedir información que ya está en "INFORMACIÓN QUE EL CLIENTE YA PROPORCIONÓ"\n`
  prompt += `4. Sé conciso: solo pide lo que realmente falta\n`
  prompt += `5. Mantén un tono MUY personal, humano y amigable - esto es clave para nuestra propuesta de valor\n`
  prompt += `6. Variación según número de mensajes:\n`
  prompt += `   - PRIMER mensaje (previousAutoReplyCount = 0): Puedes empezar con "¡Gracias por tu mensaje! Detecté que quieres hacer un requerimiento relacionado con ${category}..."\n`
  prompt += `   - SEGUNDO mensaje (previousAutoReplyCount = 1): Usa variaciones como "Perfecto, ya tengo [información que ya tiene]. Nos sigue faltando...", "Excelente, ya tenemos [X]. Para continuar, necesito...", "Muy bien, ya tengo [X]. Solo me falta..."\n`
  prompt += `   - TERCER mensaje o más (previousAutoReplyCount >= 2): Usa un tono más cercano como "Disculpa, pero aún nos falta...", "Para poder ayudarte mejor, todavía necesito...", "Gracias por la información. Me ayudarías mucho si me proporcionas..."\n`
  prompt += `7. NO repitas la misma introducción "¡Gracias por tu mensaje! Detecté que quieres hacer un requerimiento relacionado con..." en mensajes subsecuentes\n`
  prompt += `8. Haz referencia natural a lo que el cliente ya proporcionó antes de pedir lo que falta\n`
  prompt += `9. Si hay múltiples campos faltantes, enuméralos de manera clara pero natural\n`
  prompt += `10. Proporciona ejemplos solo cuando sean útiles y breves\n`
  prompt += `11. El mensaje debe sonar como si lo escribiera una persona real, no un robot\n\n`
  
  prompt += `EJEMPLOS DE MENSAJES:\n\n`
  prompt += `PRIMER MENSAJE (previousCount = 0):\n`
  prompt += `"¡Hola! Gracias por contactarnos. Veo que necesitas un servicio de ${category}. Para poder cotizarlo con nuestros proveedores, me ayudarías compartiendo:\n`
  prompt += `- [campo que falta]\n`
  prompt += `- [campo que falta]\n`
  prompt += `Con esta información podremos ayudarte mejor."\n\n`
  
  prompt += `SEGUNDO MENSAJE (previousCount = 1):\n`
  prompt += `"Perfecto, ya tengo que necesitas [información que ya proporcionó]. Para continuar, solo me falta conocer:\n`
  prompt += `- [campo que falta]\n`
  prompt += `¡Gracias!"\n\n`
  
  prompt += `TERCER MENSAJE O MÁS (previousCount >= 2):\n`
  prompt += `"Disculpa, pero aún me falta conocer [campo que falta]. Con esa información podremos darte las mejores opciones de proveedores."\n\n`
  
  prompt += `IMPORTANTE: Sé natural, conversacional y humano. Evita sonar repetitivo o robótico. NO uses la misma introducción en todos los mensajes.`

  return prompt
}

/**
 * Verifica si el servicio de IA está disponible
 */
export function isAIAvailable(): boolean {
  return !!openaiClient && !!process.env.OPENAI_API_KEY
}

