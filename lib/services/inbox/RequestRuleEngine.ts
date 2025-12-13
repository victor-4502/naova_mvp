import type { ExtractedContent } from './ContentExtractor'
import type { ClassificationResult } from './ClassificationService'
import {
  type FieldId,
  type RequestCategoryRule,
  REQUEST_CATEGORY_RULES,
  findCategoryRule,
} from '@/lib/rules/requestSchemas'

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
   */
  static analyze(
    extracted: ExtractedContent,
    classification: ClassificationResult,
    rawContent?: string, // Agregar contenido original para búsqueda directa
  ): RuleAnalysisResult {
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
    // Palabras clave comunes: inyección, compresor, montacargas, máquina, equipo, sistema, línea
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
    // Palabras clave: preventivo, correctivo, reparación, revisión, mantenimiento, diagnóstico, instalación
    const serviceScopeKeywords = [
      'preventivo', 'correctivo', 'reparación', 'reparacion', 'revisión', 'revision',
      'diagnóstico', 'diagnostico', 'instalación', 'instalacion', 'calibración', 'calibracion',
      'inspección', 'inspeccion', 'limpieza', 'ajuste', 'optimización', 'optimizacion'
    ]
    const hasServiceScope = serviceScopeKeywords.some(kw => contentText.includes(kw))
    if (hasServiceScope) presentFields.push('serviceScope')

    // deliveryLocation: buscar ubicaciones comunes en México o palabras relacionadas
    // Palabras clave: monterrey, guadalajara, cdmx, planta, sucursal, nave, ubicación, ubicacion, dirección, direccion
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

    // brand y model: buscar en items extraídos
    // Estos son opcionales, pero los detectamos si están presentes
    if (firstItem && firstItem.name && firstItem.name.length > 3) {
      // Si el item tiene un nombre descriptivo, podría ser brand/model
      // Por ahora no los marcamos como presentes a menos que haya una heurística más específica
    }

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


