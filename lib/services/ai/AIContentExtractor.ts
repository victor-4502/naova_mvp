/**
 * Servicio de IA para extraer información estructurada del contenido de un request
 * Usa OpenAI para detectar qué campos están presentes en el texto del cliente
 */

import OpenAI from 'openai'
import type { RequestCategoryRule, FieldId } from '@/lib/rules/requestSchemas'

// Inicializar cliente de OpenAI (solo si hay API key)
let openaiClient: OpenAI | null = null

if (process.env.OPENAI_API_KEY) {
  openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

export interface FieldDetectionResult {
  fieldId: FieldId
  detected: boolean
  extractedValue?: string // Valor extraído si está presente
}

export interface AIContentExtractionResult {
  presentFields: FieldId[]
  extractedValues: Record<FieldId, string | undefined> // Valores extraídos para cada campo
}

/**
 * Usa IA para detectar qué campos del request están presentes en el contenido
 */
export async function extractFieldsWithAI(
  content: string,
  categoryRule: RequestCategoryRule,
  conversationHistory?: Array<{
    direction: 'inbound' | 'outbound'
    content: string
    timestamp: string
  }>
): Promise<AIContentExtractionResult | null> {
  // Si no hay cliente de OpenAI configurado, retornar null
  if (!openaiClient) {
    console.log('[AIContentExtractor] OpenAI no configurado, usando detección por keywords')
    return null
  }

  try {
    // Construir el prompt para extracción de información
    const prompt = buildExtractionPrompt(content, categoryRule, conversationHistory)

    console.log('[AIContentExtractor] Analizando contenido con IA para detectar campos presentes...', {
      category: categoryRule.name,
      requiredFields: categoryRule.fields.filter(f => f.required).length,
      contentLength: content.length,
    })

    const completion = await openaiClient.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Eres un asistente experto en análisis de textos de requerimientos comerciales B2B.
Tu tarea es analizar el contenido de un mensaje y determinar qué información está presente.

INSTRUCCIONES:
- Analiza el texto cuidadosamente
- Identifica si la información requerida está presente, aunque se mencione de manera indirecta o informal
- Sé flexible en la interpretación: si el cliente menciona "máquina de inyección", eso cuenta como "equipo"
- Si hay historial de conversación, considera TODO el historial, no solo el último mensaje
- Para cada campo, indica si está presente (true) o ausente (false)
- Si está presente, extrae el valor exacto o una descripción del valor mencionado`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3, // Baja temperatura para mayor precisión en extracción
      max_tokens: 1000,
      response_format: { type: 'json_object' }, // Forzar respuesta JSON
    })

    const responseContent = completion.choices[0]?.message?.content
    if (!responseContent) {
      console.warn('[AIContentExtractor] No se recibió respuesta de OpenAI')
      return null
    }

    // Parsear respuesta JSON
    let parsedResponse: {
      fields: Array<{
        fieldId: string
        detected: boolean
        extractedValue?: string
      }>
    }

    try {
      parsedResponse = JSON.parse(responseContent)
    } catch (error) {
      console.error('[AIContentExtractor] Error parseando respuesta JSON:', error)
      return null
    }

    // Validar y convertir respuesta
    const presentFields: FieldId[] = []
    const extractedValues: Record<FieldId, string | undefined> = {} as any

    for (const field of parsedResponse.fields || []) {
      if (field.detected && categoryRule.fields.some(f => f.id === field.fieldId)) {
        presentFields.push(field.fieldId as FieldId)
        extractedValues[field.fieldId as FieldId] = field.extractedValue
      }
    }

    console.log('[AIContentExtractor] Campos detectados:', {
      presentFields,
      total: presentFields.length,
      extractedValues: Object.keys(extractedValues).length,
    })

    return {
      presentFields,
      extractedValues,
    }
  } catch (error) {
    console.error('[AIContentExtractor] Error en extracción con IA:', error)
    // En caso de error, retornar null para usar fallback de keywords
    return null
  }
}

/**
 * Construye el prompt para extracción de información
 */
function buildExtractionPrompt(
  content: string,
  categoryRule: RequestCategoryRule,
  conversationHistory?: Array<{
    direction: 'inbound' | 'outbound'
    content: string
    timestamp: string
  }>
): string {
  let prompt = `Analiza el siguiente requerimiento y determina qué información está presente.\n\n`

  prompt += `CATEGORÍA: ${categoryRule.name}\n\n`

  // Incluir historial completo si existe
  if (conversationHistory && conversationHistory.length > 0) {
    prompt += `HISTORIAL DE LA CONVERSACIÓN (orden cronológico):\n`
    conversationHistory.forEach((msg, idx) => {
      const role = msg.direction === 'inbound' ? 'Cliente' : 'Naova'
      prompt += `${idx + 1}. [${role}]: "${msg.content}"\n`
    })
    prompt += `\n`
  } else {
    prompt += `MENSAJE DEL CLIENTE:\n"${content}"\n\n`
  }

  prompt += `CAMPOS A VERIFICAR:\n`
  categoryRule.fields.forEach((field, idx) => {
    prompt += `${idx + 1}. ${field.id} (${field.label}): ${field.description}`
    if (field.examples && field.examples.length > 0) {
      prompt += ` Ejemplos: ${field.examples.join(', ')}`
    }
    prompt += `\n`
  })

  prompt += `\nRESPONDE EN FORMATO JSON:\n`
  prompt += `{\n`
  prompt += `  "fields": [\n`
  prompt += `    {\n`
  prompt += `      "fieldId": "equipmentType",\n`
  prompt += `      "detected": true/false,\n`
  prompt += `      "extractedValue": "valor extraído si está presente"\n`
  prompt += `    },\n`
  prompt += `    ...\n`
  prompt += `  ]\n`
  prompt += `}\n\n`

  prompt += `IMPORTANTE:\n`
  prompt += `- Analiza TODO el contenido e historial para determinar qué información está presente\n`
  prompt += `- Sé flexible: "máquina de inyección plásticos" cuenta como equipmentType\n`
  prompt += `- "mantenimiento preventivo" cuenta como serviceScope\n`
  prompt += `- "Monterrey" o "planta X" cuenta como deliveryLocation\n`
  prompt += `- Si un campo NO está mencionado en ninguna parte, marca detected: false\n`
  prompt += `- Si está presente, extrae el valor exacto o una descripción clara\n`

  return prompt
}

/**
 * Verifica si el extractor de IA está disponible
 */
export function isAIExtractorAvailable(): boolean {
  return !!openaiClient && !!process.env.OPENAI_API_KEY
}

