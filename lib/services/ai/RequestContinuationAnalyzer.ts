/**
 * Servicio para analizar si un mensaje es continuación de un request existente
 * o representa un nuevo requerimiento usando IA
 */

import OpenAI from 'openai'

// Inicializar cliente de OpenAI (solo si hay API key)
let openaiClient: OpenAI | null = null

if (process.env.OPENAI_API_KEY) {
  openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

export interface RequestContext {
  id: string
  category?: string | null
  subcategory?: string | null
  rawContent: string
  lastClientMessage?: string
  lastNaovaMessage?: string
  messages: Array<{
    direction: 'inbound' | 'outbound'
    content: string
    timestamp: string
  }>
}

export interface ContinuationAnalysisResult {
  isContinuation: boolean
  confidence: number // 0-1
  reason?: string
}

/**
 * Analiza si un mensaje nuevo es continuación de un request existente
 * o representa un nuevo requerimiento
 * 
 * @param newMessage El mensaje nuevo del cliente
 * @param existingRequest El request existente a comparar
 * @returns Análisis de si es continuación o nuevo requerimiento
 */
export async function analyzeRequestContinuation(
  newMessage: string,
  existingRequest: RequestContext
): Promise<ContinuationAnalysisResult> {
  // Si no hay IA disponible, usar lógica de fallback (siempre continuar si está en ventana de tiempo)
  if (!openaiClient) {
    console.log('[RequestContinuationAnalyzer] OpenAI no configurado, usando lógica de fallback (continuar)')
    return {
      isContinuation: true,
      confidence: 0.7, // Baja confianza porque no hay análisis real
      reason: 'Análisis de IA no disponible, asumiendo continuación por defecto',
    }
  }

  try {
    // Construir el contexto del request existente
    const requestSummary = existingRequest.messages
      .slice(-5) // Últimos 5 mensajes para contexto
      .map((msg, idx) => {
        const role = msg.direction === 'inbound' ? 'Cliente' : 'Naova'
        return `${idx + 1}. [${role}]: "${msg.content.substring(0, 200)}"` // Limitar longitud
      })
      .join('\n')

    const lastClientMsg = existingRequest.messages
      .filter(m => m.direction === 'inbound')
      .pop()?.content || 'N/A'
    
    const lastNaovaMsg = existingRequest.messages
      .filter(m => m.direction === 'outbound')
      .pop()?.content || 'N/A'

    const prompt = `
Eres un asistente experto en análisis de conversaciones de negocios B2B.

Tu tarea es determinar si un nuevo mensaje del cliente es una **CONTINUACIÓN** del mismo requerimiento o un **NUEVO REQUERIMIENTO** diferente.

CONTEXTO DEL REQUEST EXISTENTE:
- ID: ${existingRequest.id}
- Categoría: ${existingRequest.category || 'No especificada'}
- Subcategoría: ${existingRequest.subcategory || 'No especificada'}
- Resumen de la conversación:
${requestSummary}

- Último mensaje del Cliente: "${lastClientMsg.substring(0, 300)}"
- Último mensaje de Naova: "${lastNaovaMsg.substring(0, 300)}"

NUEVO MENSAJE DEL CLIENTE:
"${newMessage}"

INSTRUCCIONES:
1. Analiza el tema principal del request existente
2. Analiza el tema del nuevo mensaje
3. Determina si el nuevo mensaje es:
   - Una **CONTINUACIÓN**: Respuesta a una pregunta previa, información adicional solicitada, aclaración sobre el mismo requerimiento
   - Un **NUEVO REQUERIMIENTO**: Cambio de tema, solicitud diferente, producto/servicio distinto

EJEMPLOS:
- CONTINUACIÓN: "De acero inoxidable" (respuesta a "¿qué tipo de tornillos?")
- CONTINUACIÓN: "Planta Monterrey" (respuesta a "¿dónde se entrega?")
- CONTINUACIÓN: "Sí, también necesito 50 más" (ampliación del mismo pedido)
- NUEVO REQUERIMIENTO: "Ahora también necesito una cotización de montacargas" (mientras el request original era de tornillos)
- NUEVO REQUERIMIENTO: "Olvídalo, mejor necesito servicio de mantenimiento" (cambio completo de tema)

Responde ÚNICAMENTE con un objeto JSON que contenga:
- "isContinuation": true o false
- "confidence": un número entre 0 y 1 (1 = muy seguro, 0.5 = dudoso)
- "reason": una breve explicación de por qué es continuación o nuevo requerimiento (máximo 100 caracteres)
`

    const completion = await openaiClient.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Eres un asistente experto en análisis de conversaciones. Responde únicamente con JSON válido.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3, // Baja temperatura para análisis más preciso
      max_tokens: 200,
      response_format: { type: 'json_object' },
    })

    const rawResponse = completion.choices[0]?.message?.content
    if (!rawResponse) {
      console.warn('[RequestContinuationAnalyzer] No se recibió respuesta de OpenAI')
      // Fallback: asumir continuación
      return {
        isContinuation: true,
        confidence: 0.5,
        reason: 'No se recibió respuesta de IA, asumiendo continuación',
      }
    }

    const result: ContinuationAnalysisResult = JSON.parse(rawResponse)
    
    // Validar estructura
    if (typeof result.isContinuation !== 'boolean') {
      console.warn('[RequestContinuationAnalyzer] Respuesta de IA inválida:', rawResponse)
      return {
        isContinuation: true,
        confidence: 0.5,
        reason: 'Respuesta de IA inválida, asumiendo continuación',
      }
    }

    // Asegurar que confidence esté en rango 0-1
    result.confidence = Math.max(0, Math.min(1, result.confidence || 0.5))

    console.log('[RequestContinuationAnalyzer] Análisis completado:', {
      isContinuation: result.isContinuation,
      confidence: result.confidence,
      reason: result.reason,
    })

    return result

  } catch (error) {
    console.error('[RequestContinuationAnalyzer] Error analizando continuación:', error)
    // En caso de error, asumir continuación (más seguro)
    return {
      isContinuation: true,
      confidence: 0.5,
      reason: 'Error en análisis, asumiendo continuación',
    }
  }
}

/**
 * Verifica si el servicio de IA está disponible
 */
export function isContinuationAnalysisAvailable(): boolean {
  return !!openaiClient && !!process.env.OPENAI_API_KEY
}

