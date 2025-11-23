// Spec Validator - Valida completitud y consistencia de specs

import type { SpecItem } from '@/lib/types/request'

export interface ValidationResult {
  isValid: boolean
  completeness: number // 0-1
  missingFields: string[]
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationWarning {
  field: string
  message: string
}

export class SpecValidator {
  /**
   * Valida una especificación completa
   */
  static validateSpec(items: SpecItem[]): ValidationResult {
    if (items.length === 0) {
      return {
        isValid: false,
        completeness: 0,
        missingFields: ['items'],
        errors: [
          {
            field: 'items',
            message: 'Debe haber al menos un item en la especificación',
          },
        ],
        warnings: [],
      }
    }
    
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []
    const missingFields: string[] = []
    
    let totalFields = 0
    let filledFields = 0
    
    items.forEach((item, index) => {
      const itemPrefix = `items[${index}]`
      
      // Validar campos requeridos
      if (!item.name || item.name.trim().length === 0) {
        errors.push({
          field: `${itemPrefix}.name`,
          message: 'El nombre del item es requerido',
        })
        missingFields.push(`${itemPrefix}.name`)
      } else {
        filledFields++
      }
      totalFields++
      
      if (!item.category || item.category.trim().length === 0) {
        errors.push({
          field: `${itemPrefix}.category`,
          message: 'La categoría es requerida',
        })
        missingFields.push(`${itemPrefix}.category`)
      } else {
        filledFields++
      }
      totalFields++
      
      if (!item.quantity || item.quantity <= 0) {
        errors.push({
          field: `${itemPrefix}.quantity`,
          message: 'La cantidad debe ser mayor a 0',
        })
        missingFields.push(`${itemPrefix}.quantity`)
      } else {
        filledFields++
      }
      totalFields++
      
      if (!item.unit || item.unit.trim().length === 0) {
        errors.push({
          field: `${itemPrefix}.unit`,
          message: 'La unidad es requerida',
        })
        missingFields.push(`${itemPrefix}.unit`)
      } else {
        filledFields++
      }
      totalFields++
      
      // Validar campos opcionales pero recomendados
      if (!item.description || item.description.trim().length === 0) {
        warnings.push({
          field: `${itemPrefix}.description`,
          message: 'Se recomienda agregar una descripción',
        })
      } else {
        filledFields++
      }
      totalFields++
      
      if (!item.specifications || Object.keys(item.specifications).length === 0) {
        warnings.push({
          field: `${itemPrefix}.specifications`,
          message: 'Se recomienda agregar especificaciones técnicas',
        })
      } else {
        filledFields++
      }
      totalFields++
      
      // Validar consistencia
      if (item.unitPrice && item.quantity && item.totalPrice) {
        const expectedTotal = item.unitPrice * item.quantity
        const tolerance = 0.01
        if (Math.abs(item.totalPrice - expectedTotal) > tolerance) {
          errors.push({
            field: `${itemPrefix}.totalPrice`,
            message: `El total no coincide con cantidad × precio unitario (esperado: ${expectedTotal.toFixed(2)})`,
          })
        }
      }
    })
    
    const completeness = totalFields > 0 ? filledFields / totalFields : 0
    
    return {
      isValid: errors.length === 0,
      completeness,
      missingFields,
      errors,
      warnings,
    }
  }

  /**
   * Valida un item individual
   */
  static validateItem(item: SpecItem): ValidationResult {
    return this.validateSpec([item])
  }

  /**
   * Detecta campos faltantes críticos
   */
  static detectMissingFields(item: SpecItem): string[] {
    const missing: string[] = []
    
    if (!item.name) missing.push('name')
    if (!item.category) missing.push('category')
    if (!item.quantity || item.quantity <= 0) missing.push('quantity')
    if (!item.unit) missing.push('unit')
    
    return missing
  }
}

