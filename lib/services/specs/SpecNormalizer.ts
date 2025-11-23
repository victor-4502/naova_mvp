// Spec Normalizer - Normaliza unidades y formatos

import { UNIT_NORMALIZATION } from '@/lib/utils/constants'

export interface NormalizedSpec {
  quantity: number
  unit: string
  normalizedUnit: string
  isValid: boolean
  errors: string[]
}

export class SpecNormalizer {
  /**
   * Normaliza una unidad de medida
   */
  static normalizeUnit(unit: string): string {
    const normalized = unit.toLowerCase().trim()
    return UNIT_NORMALIZATION[normalized] || normalized
  }

  /**
   * Normaliza una especificación completa
   */
  static normalizeSpec(
    quantity: number,
    unit: string,
    category?: string
  ): NormalizedSpec {
    const normalizedUnit = this.normalizeUnit(unit)
    const errors: string[] = []
    
    // Validar cantidad
    if (isNaN(quantity) || quantity <= 0) {
      errors.push('La cantidad debe ser un número positivo')
    }
    
    // Validar unidad
    if (!normalizedUnit || normalizedUnit.length === 0) {
      errors.push('La unidad es requerida')
    }
    
    // Validar consistencia de unidad con categoría
    if (category) {
      const categoryUnitValidation = this.validateCategoryUnit(
        category,
        normalizedUnit
      )
      if (!categoryUnitValidation.valid) {
        errors.push(categoryUnitValidation.error)
      }
    }
    
    return {
      quantity,
      unit,
      normalizedUnit,
      isValid: errors.length === 0,
      errors,
    }
  }

  /**
   * Valida que la unidad sea apropiada para la categoría
   */
  private static validateCategoryUnit(
    category: string,
    unit: string
  ): { valid: boolean; error?: string } {
    const categoryUnits: Record<string, string[]> = {
      materiales: ['kg', 'g', 'lb', 'm', 'cm', 'mm', 'm2'],
      herramientas: ['pcs', 'unidades'],
      seguridad: ['pcs', 'unidades'],
      consumibles: ['pcs', 'l', 'ml', 'kg', 'g'],
      refacciones: ['pcs', 'unidades'],
      servicios: ['hours', 'days', 'weeks'],
    }
    
    const allowedUnits = categoryUnits[category] || []
    
    if (allowedUnits.length > 0 && !allowedUnits.includes(unit)) {
      return {
        valid: false,
        error: `La unidad "${unit}" no es apropiada para la categoría "${category}"`,
      }
    }
    
    return { valid: true }
  }

  /**
   * Convierte entre unidades compatibles
   */
  static convertUnit(
    value: number,
    fromUnit: string,
    toUnit: string
  ): number | null {
    const conversions: Record<string, Record<string, number>> = {
      // Peso
      kg: { g: 1000, lb: 2.20462 },
      g: { kg: 0.001, lb: 0.00220462 },
      lb: { kg: 0.453592, g: 453.592 },
      
      // Volumen
      l: { ml: 1000, gal: 0.264172 },
      ml: { l: 0.001, gal: 0.000264172 },
      gal: { l: 3.78541, ml: 3785.41 },
      
      // Longitud
      m: { cm: 100, mm: 1000, ft: 3.28084, in: 39.3701 },
      cm: { m: 0.01, mm: 10, ft: 0.0328084, in: 0.393701 },
      mm: { m: 0.001, cm: 0.1, ft: 0.00328084, in: 0.0393701 },
      ft: { m: 0.3048, cm: 30.48, mm: 304.8, in: 12 },
      in: { m: 0.0254, cm: 2.54, mm: 25.4, ft: 0.0833333 },
      
      // Área
      m2: { ft: 10.7639 }, // m² a ft² (simplificado)
    }
    
    const fromNormalized = this.normalizeUnit(fromUnit)
    const toNormalized = this.normalizeUnit(toUnit)
    
    if (fromNormalized === toNormalized) {
      return value
    }
    
    const conversion = conversions[fromNormalized]?.[toNormalized]
    if (conversion) {
      return value * conversion
    }
    
    return null // Conversión no disponible
  }
}

