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

    // Heurísticas simples para marcar campos presentes usando ExtractedContent
    // (En el futuro se puede enriquecer con normalizedContent / IA externa)
    const firstItem = extracted.items[0]

    // quantity
    const hasQuantity =
      extracted.quantities.length > 0 ||
      (firstItem && typeof firstItem.quantity === 'number' && firstItem.quantity > 0)

    // unit
    const hasUnit =
      extracted.units.length > 0 ||
      (firstItem && typeof firstItem.unit === 'string' && firstItem.unit.trim().length > 0)

    if (hasQuantity) presentFields.push('quantity')
    if (hasUnit) presentFields.push('unit')

    // deliveryLocation / deliveryDate:
    // de momento no tenemos un parser dedicado aquí, dejamos que IA externa
    // o lógica futura los marque; por ahora asumimos que faltan.

    // Campos opcionales brand / model / serviceScope / equipmentType
    // también se considerarán ausentes por defecto, pero como no son requeridos
    // no penalizan la completitud.

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


