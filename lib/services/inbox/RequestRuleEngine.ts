import type { ExtractedContent } from './ContentExtractor'
import type { ClassificationResult } from './ClassificationService'
import {
  type FieldId,
  type RequestCategoryRule,
  REQUEST_CATEGORY_RULES,
  findCategoryRule,
} from '@/lib/rules/requestSchemas'
import { extractFieldsWithAI } from '@/lib/services/ai/AIContentExtractor'

export interface RuleAnalysisResult {
  categoryRule: RequestCategoryRule | null
  presentFields: FieldId[]
  missingFields: FieldId[]
  completeness: number // 0-1 respecto a campos requeridos
}

export class RequestRuleEngine {
  /**
   * Analiza el request usando las reglas por categoría para determinar
   * qué campos mínimos están presentes y cuáles faltan.
   * Usa IA si está disponible, keywords como fallback.
   */
  static async analyze(
    extracted: ExtractedContent,
    classification: ClassificationResult,
    rawContent?: string, // Contenido original para análisis
    conversationHistory?: Array<{ // Historial de conversación para contexto de IA
      direction: 'inbound' | 'outbound'
      content: string
      timestamp: string
    }>
  ): Promise<RuleAnalysisResult> {
    // Intentar encontrar regla a partir de la categoría clasificada o extraída
    const categoryFromClassifier = classification.category || extracted.category
    let categoryRule = findCategoryRule(categoryFromClassifier)

    // Si no hay regla directa, intentar mapear por keywords en extracted.keywords
    if (!categoryRule) {
      const contentKeywords = extracted.keywords.join(' ').toLowerCase()
      categoryRule =
        REQUEST_CATEGORY_RULES.find((rule) =>
          rule.keywords.some((kw) => contentKeywords.includes(kw.toLowerCase())),
        ) || null
    }

    // Si aún no hay regla, buscar directamente en el contenido original (rawContent)
    if (!categoryRule && rawContent) {
      const normalizedContent = rawContent.toLowerCase()
      categoryRule =
        REQUEST_CATEGORY_RULES.find((rule) =>
          rule.keywords.some((kw) => normalizedContent.includes(kw.toLowerCase())),
        ) || null
    }

    if (!categoryRule) {
      // Sin regla: asumimos que no podemos evaluar completitud
      return {
        categoryRule: null,
        presentFields: [],
        missingFields: [],
        completeness: 0,
      }
    }

    // Intentar usar IA para detectar campos presentes (si está disponible)
    let presentFields: FieldId[] = []
    let aiExtraction: Awaited<ReturnType<typeof extractFieldsWithAI>> | null = null

    if (rawContent) {
      try {
        aiExtraction = await extractFieldsWithAI(rawContent, categoryRule, conversationHistory)
        if (aiExtraction && aiExtraction.presentFields.length > 0) {
          presentFields = aiExtraction.presentFields
          console.log('[RequestRuleEngine] Campos detectados con IA:', presentFields)
        }
      } catch (error) {
        console.warn('[RequestRuleEngine] Error en extracción con IA, usando fallback de keywords:', error)
      }
    }

    // Si la IA no detectó campos o no está disponible, usar keywords como fallback
    if (presentFields.length === 0) {
      presentFields = this.detectFieldsWithKeywords(extracted, rawContent)
      console.log('[RequestRuleEngine] Campos detectados con keywords (fallback):', presentFields)
    }

  /**
   * Detecta campos presentes usando keywords (fallback cuando IA no está disponible)
   */
  private static detectFieldsWithKeywords(
    extracted: ExtractedContent,
    rawContent?: string
  ): FieldId[] {
    const presentFields: FieldId[] = []

    // Normalizar contenido para búsqueda
    const normalizedContent = rawContent ? rawContent.toLowerCase() : ''
    const contentText = normalizedContent || extracted.keywords.join(' ').toLowerCase()

    // Heurísticas simples para marcar campos presentes usando ExtractedContent y rawContent
    const firstItem = extracted.items[0]

    // quantity
    const hasQuantity =
      extracted.quantities.length > 0 ||
      (firstItem && typeof firstItem.quantity === 'number' && firstItem.quantity > 0)
    if (hasQuantity) presentFields.push('quantity')

    // unit
    const hasUnit =
      extracted.units.length > 0 ||
      (firstItem && typeof firstItem.unit === 'string' && firstItem.unit.trim().length > 0)
    if (hasUnit) presentFields.push('unit')

    // equipmentType: buscar nombres de equipos o sistemas en el contenido
    const equipmentKeywords = [
      'equipo', 'maquina', 'máquina', 'sistema', 'línea', 'linea',
      'compresor', 'montacargas', 'inyección', 'inyeccion', 'plastico', 'plástico',
      'empaque', 'producción', 'produccion', 'maquinaria', 'motor', 'generador',
      'refrigeración', 'refrigeracion', 'aire acondicionado', 'caldera', 'turbina'
    ]
    const hasEquipmentType = equipmentKeywords.some(kw => contentText.includes(kw)) ||
                            (firstItem && firstItem.name && firstItem.name.trim().length > 0)
    if (hasEquipmentType) presentFields.push('equipmentType')

    // serviceScope: buscar palabras relacionadas con tipo de servicio
    const serviceScopeKeywords = [
      'preventivo', 'correctivo', 'reparación', 'reparacion', 'revisión', 'revision',
      'diagnóstico', 'diagnostico', 'instalación', 'instalacion', 'calibración', 'calibracion',
      'inspección', 'inspeccion', 'limpieza', 'ajuste', 'optimización', 'optimizacion'
    ]
    const hasServiceScope = serviceScopeKeywords.some(kw => contentText.includes(kw))
    if (hasServiceScope) presentFields.push('serviceScope')

    // deliveryLocation: buscar ubicaciones comunes
    const locationKeywords = [
      'monterrey', 'guadalajara', 'cdmx', 'ciudad de méxico', 'ciudad de mexico',
      'planta', 'sucursal', 'nave', 'ubicación', 'ubicacion', 'dirección', 'direccion',
      'parque industrial', 'colonia', 'calle', 'avenida', 'avenue', 'león', 'leon',
      'puebla', 'querétaro', 'queretaro', 'toluca', 'tijuana', 'mérida', 'merida'
    ]
    const hasDeliveryLocation = locationKeywords.some(kw => contentText.includes(kw))
    if (hasDeliveryLocation) presentFields.push('deliveryLocation')

    // deliveryDate: buscar palabras relacionadas con fechas o tiempo
    const dateKeywords = [
      'semana', 'mes', 'días', 'dias', 'fecha', 'límite', 'limite', 'antes', 'urgente',
      'inmediato', 'pronto', 'cuando', 'disponible', 'ventana', 'periodo', 'período'
    ]
    const hasDeliveryDate = dateKeywords.some(kw => contentText.includes(kw))
    if (hasDeliveryDate) presentFields.push('deliveryDate')

    return presentFields

    const requiredFieldIds = categoryRule.fields.filter((f) => f.required).map((f) => f.id)

    const missingFields = requiredFieldIds.filter((fieldId) => !presentFields.includes(fieldId))

    const totalRequired = requiredFieldIds.length || 1
    const completeness = (totalRequired - missingFields.length) / totalRequired

    return {
      categoryRule,
      presentFields,
      missingFields,
      completeness,
    }
  }
}


