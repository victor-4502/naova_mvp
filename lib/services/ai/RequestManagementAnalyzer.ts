/**
 * Servicio para analizar y gestionar requests usando IA
 * Ayuda a determinar:
 * - Si se debe crear un nuevo request
 * - Si se debe eliminar/cerrar un request existente
 * - El estado actual del request
 */

import OpenAI from 'openai'

// Inicializar cliente de OpenAI (solo si hay API key)
let openaiClient: OpenAI | null = null

if (process.env.OPENAI_API_KEY) {
  openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

export interface RequestAnalysisContext {
  id: string
  category?: string | null
  subcategory?: string | null
  status: string
  pipelineStage: string
  rawContent: string
  createdAt: string
  updatedAt: string
  messages: Array<{
    direction: 'inbound' | 'outbound'
    content: string
    timestamp: string
  }>
  client?: {
    name?: string | null
    company?: string | null
  } | null
}

export interface RequestManagementAnalysis {
  /**
   * Acción recomendada para el request
   */
  recommendedAction: 'keep' | 'create_new' | 'close' | 'delete' | 'merge'
  
  /**
   * Confianza en la recomendación (0-1)
   */
  confidence: number
  
  /**
   * Razón de la recomendación
   */
  reason: string
  
  /**
   * Estado recomendado si la acción es 'keep'
   */
  recommendedStatus?: string
  
  /**
   * Pipeline stage recomendado si la acción es 'keep'
   */
  recommendedPipelineStage?: string
  
  /**
   * ID del request con el que debería fusionarse (si recommendedAction es 'merge')
   */
  mergeWithRequestId?: string
}

/**
 * Analiza un request para determinar si debe mantenerse, cerrarse, eliminarse o si se debe crear uno nuevo
 * 
 * @param request El request a analizar
 * @param allActiveRequests Todos los requests activos del mismo cliente (opcional, para detectar duplicados)
 * @returns Análisis con recomendación de acción
 */
export async function analyzeRequestManagement(
  request: RequestAnalysisContext,
  allActiveRequests?: RequestAnalysisContext[]
): Promise<RequestManagementAnalysis> {
  // Si no hay IA disponible, retornar recomendación por defecto
  if (!openaiClient) {
    console.log('[RequestManagementAnalyzer] OpenAI no configurado, usando recomendación por defecto (keep)')
    return {
      recommendedAction: 'keep',
      confidence: 0.5,
      reason: 'Análisis de IA no disponible, manteniendo request por defecto',
      recommendedStatus: request.status,
      recommendedPipelineStage: request.pipelineStage,
    }
  }

  try {
    // Construir contexto del request
    const requestSummary = request.messages
      .slice(-10) // Últimos 10 mensajes para contexto completo
      .map((msg, idx) => {
        const role = msg.direction === 'inbound' ? 'Cliente' : 'Naova'
        return `${idx + 1}. [${role}]: "${msg.content.substring(0, 200)}"`
      })
      .join('\n')

    const requestAge = Math.floor(
      (new Date().getTime() - new Date(request.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    ) // Días desde creación

    const lastActivityDays = Math.floor(
      (new Date().getTime() - new Date(request.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
    ) // Días desde última actividad

    // Información sobre requests similares del mismo cliente (para detectar duplicados)
    let similarRequestsInfo = ''
    if (allActiveRequests && allActiveRequests.length > 1) {
      const similar = allActiveRequests
        .filter(r => r.id !== request.id)
        .slice(0, 3) // Máximo 3 requests similares
        .map(r => `- Request ${r.id}: ${r.category || 'Sin categoría'} - Estado: ${r.status} - Creado: ${r.createdAt}`)
        .join('\n')
      
      if (similar) {
        similarRequestsInfo = `\n\nREQUESTS SIMILARES DEL MISMO CLIENTE:\n${similar}`
      }
    }

    const prompt = `
Eres un asistente experto en gestión de procesos de compras B2B.

Tu tarea es analizar un request y determinar la mejor acción a tomar.

CONTEXTO DEL REQUEST:
- ID: ${request.id}
- Categoría: ${request.category || 'No especificada'}
- Subcategoría: ${request.subcategory || 'No especificada'}
- Estado actual: ${request.status}
- Etapa del pipeline: ${request.pipelineStage}
- Edad del request: ${requestAge} días
- Última actividad: ${lastActivityDays} días atrás
- Cliente: ${request.client?.name || request.client?.company || 'No identificado'}${similarRequestsInfo}

HISTORIAL DE MENSAJES (últimos 10):
${requestSummary}

CONTENIDO ORIGINAL DEL REQUEST:
"${request.rawContent.substring(0, 500)}"

ACCIONES POSIBLES:
1. **keep**: Mantener el request y actualizar su estado si es necesario (ACCION POR DEFECTO si no hay indicación clara)
2. **close**: Cerrar el request SOLO si el cliente EXPLÍCITAMENTE dice que:
   - Ya compró en otro lugar ("ya lo compré", "ya lo conseguí en otro lugar", "ya no lo necesito porque...")
   - Canceló la solicitud ("cancelar", "ya no necesito", "olvídalo")
   - Expresó satisfacción y ya no requiere nada más
3. **delete**: Eliminar SOLO si es claramente:
   - Spam obvio (múltiples mensajes sin sentido, enlaces sospechosos, etc.)
   - Error del sistema (request vacío sin mensajes, datos corruptos)
   - Duplicado EXACTO creado hace menos de 1 hora
4. **create_new**: Este request contiene múltiples requerimientos no relacionados que deberían estar separados
5. **merge**: Fusionar este request con otro request existente (si hay duplicados claros)

⚠️ IMPORTANTE - NO ELIMINAR NI CERRAR SI:
- El mensaje solo dice "Hola", "Buen día", "Buenas tardes" → Es inicio de conversación normal, mantener
- El mensaje es corto pero puede ser inicio de conversación → Mantener
- Hay menos de 3 mensajes en total → Probablemente es inicio de conversación, mantener
- No hay indicación EXPLÍCITA del cliente de que ya no necesita la cotización → Mantener

ESTADOS POSIBLES (si recommendedAction es 'keep'):
- incomplete_information: Falta información del cliente
- ready_for_supplier_matching: Listo para buscar proveedores
- supplier_matching: En proceso de buscar proveedores
- rfq_sent: Cotización enviada a proveedores
- quotes_received: Cotizaciones recibidas
- negotiation: En negociación
- order_placed: Orden colocada
- completed: Completado
- cancelled: Cancelado

PIPELINE STAGES (si recommendedAction es 'keep'):
- needs_info: Necesita información
- finding_suppliers: Buscando proveedores
- comparing_quotes: Comparando cotizaciones
- negotiation: Negociación
- order_management: Gestión de orden
- completed: Completado
- closed: Cerrado

INSTRUCCIONES:
1. Por defecto, mantener el request (keep) a menos que haya indicación clara de lo contrario
2. Solo cerrar (close) si el cliente EXPLÍCITAMENTE dice que ya no necesita la cotización o que ya compró en otro lugar
3. Solo eliminar (delete) si es claramente spam, error del sistema, o duplicado exacto reciente
4. Detectar si hay múltiples requerimientos no relacionados (create_new)
5. Si el request debe mantenerse, recomienda el estado y pipeline stage más apropiados basado en:
   - Si tiene toda la información necesaria
   - Si hay cotizaciones o negociaciones en curso
   - El contexto de la conversación

EJEMPLOS CORRECTOS:
- ✅ "Necesito tornillos" y cliente responde "Perfecto, ya los compré en otro lugar" → close
- ✅ "Necesito tornillos" y cliente responde "Ya no necesito cotización, gracias" → close
- ✅ Request con solo "Hola" o "Buen día" → keep (inicio normal de conversación)
- ✅ Request con "Hola, necesito cotización" → keep (inicio válido con intención)
- ❌ NO eliminar si solo dice "Hola" → Es inicio normal, mantener
- ✅ Request idéntico a otro creado hace 30 minutos → delete o merge (duplicado exacto)
- ✅ Request de hace 60 días sin actividad, sin cotizaciones, sin respuestas → close (abandonado)
- ✅ Request con "Necesito tornillos y también servicio de mantenimiento" → create_new (dos temas diferentes)

Responde ÚNICAMENTE con un objeto JSON que contenga:
- "recommendedAction": una de las acciones posibles (keep, close, delete, create_new, merge)
- "confidence": un número entre 0 y 1 (1 = muy seguro, 0.5 = dudoso)
- "reason": una explicación breve de la recomendación (máximo 150 caracteres)
- "recommendedStatus": el estado recomendado si recommendedAction es 'keep' (opcional)
- "recommendedPipelineStage": el pipeline stage recomendado si recommendedAction es 'keep' (opcional)
- "mergeWithRequestId": el ID del request con el que fusionar si recommendedAction es 'merge' (opcional)
`

    const completion = await openaiClient.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Eres un asistente experto en gestión de procesos B2B. Responde únicamente con JSON válido.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3, // Baja temperatura para análisis más preciso
      max_tokens: 400,
      response_format: { type: 'json_object' },
    })

    const rawResponse = completion.choices[0]?.message?.content
    if (!rawResponse) {
      console.warn('[RequestManagementAnalyzer] No se recibió respuesta de OpenAI')
      return {
        recommendedAction: 'keep',
        confidence: 0.5,
        reason: 'No se recibió respuesta de IA, manteniendo request',
        recommendedStatus: request.status,
        recommendedPipelineStage: request.pipelineStage,
      }
    }

    const result: RequestManagementAnalysis = JSON.parse(rawResponse)
    
    // Validar estructura
    const validActions = ['keep', 'close', 'delete', 'create_new', 'merge']
    if (!validActions.includes(result.recommendedAction)) {
      console.warn('[RequestManagementAnalyzer] Acción inválida en respuesta de IA:', result.recommendedAction)
      result.recommendedAction = 'keep'
    }

    // Asegurar que confidence esté en rango 0-1
    result.confidence = Math.max(0, Math.min(1, result.confidence || 0.5))

    console.log('[RequestManagementAnalyzer] Análisis completado:', {
      requestId: request.id,
      recommendedAction: result.recommendedAction,
      confidence: result.confidence,
      reason: result.reason,
    })

    return result

  } catch (error) {
    console.error('[RequestManagementAnalyzer] Error analizando request:', error)
    // En caso de error, mantener el request (acción más segura)
    return {
      recommendedAction: 'keep',
      confidence: 0.5,
      reason: 'Error en análisis, manteniendo request',
      recommendedStatus: request.status,
      recommendedPipelineStage: request.pipelineStage,
    }
  }
}

/**
 * Verifica si el servicio de IA está disponible
 */
export function isRequestManagementAnalysisAvailable(): boolean {
  return !!openaiClient && !!process.env.OPENAI_API_KEY
}

