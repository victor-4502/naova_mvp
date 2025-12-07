import type { FieldId } from '@/lib/rules/requestSchemas'
import type { RequestCategoryRule } from '@/lib/rules/requestSchemas'

export interface FollowUpInput {
  categoryRule: RequestCategoryRule | null
  missingFields: FieldId[]
}

export function generateFollowUpMessage(input: FollowUpInput): string | null {
  const { categoryRule, missingFields } = input

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


