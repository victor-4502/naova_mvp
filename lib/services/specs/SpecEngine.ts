// Spec Engine - Motor principal de especificaciones

import { prisma } from '@/lib/prisma'
import { SpecNormalizer } from './SpecNormalizer'
import { SpecValidator } from './SpecValidator'
import { SpecEnricher } from './SpecEnricher'
import { QuestionGenerator } from './QuestionGenerator'
import type { SpecItem } from '@/lib/types/request'

export interface ProcessSpecResult {
  specId: string
  isValid: boolean
  completeness: number
  normalizedItems: SpecItem[]
  missingFields: string[]
  errors: string[]
  warnings: string[]
  questions: Array<{
    id: string
    field: string
    question: string
    type: string
    required: boolean
  }>
  suggestions: Array<{
    field: string
    value: any
    confidence: number
  }>
}

export class SpecEngine {
  /**
   * Procesa y normaliza una especificación completa
   */
  static async processSpec(
    requestId: string,
    items: SpecItem[],
    clientId: string
  ): Promise<ProcessSpecResult> {
    // Normalizar items
    const normalizedItems = items.map((item) => {
      const normalized = SpecNormalizer.normalizeSpec(
        item.quantity || 0,
        item.unit || '',
        item.category
      )
      
      return {
        ...item,
        unit: normalized.normalizedUnit,
        ...(normalized.errors.length > 0 && {
          _errors: normalized.errors,
        }),
      }
    })
    
    // Validar
    const validation = SpecValidator.validateSpec(normalizedItems)
    
    // Enriquecer con datos históricos
    const enrichmentResults = await Promise.all(
      normalizedItems.map((item) => SpecEnricher.enrichItem(item, clientId))
    )
    
    const suggestions = enrichmentResults.flatMap((result) => result.suggestions)
    
    // Generar preguntas
    const questions = QuestionGenerator.generateQuestions(normalizedItems)
    
    // Guardar o actualizar spec en la base de datos
    const spec = await prisma.requestSpec.upsert({
      where: { requestId },
      create: {
        requestId,
        normalizedSpecs: {
          items: normalizedItems,
          validation,
          enrichment: enrichmentResults,
        },
        completeness: validation.completeness,
        missingFields: validation.missingFields,
        isValid: validation.isValid,
        validationErrors: validation.errors.length > 0 ? validation.errors : undefined,
        items: {
          create: normalizedItems.map((item) => ({
            name: item.name || '',
            description: item.description,
            category: item.category || '',
            subcategory: item.subcategory,
            quantity: item.quantity || 0,
            unit: item.unit || '',
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            specifications: item.specifications,
            brand: item.brand,
            model: item.model,
            sku: item.sku,
            budget: item.budget,
            deliveryDate: item.deliveryDate,
          })),
        },
      },
      update: {
        normalizedSpecs: {
          items: normalizedItems,
          validation,
          enrichment: enrichmentResults,
        },
        completeness: validation.completeness,
        missingFields: validation.missingFields,
        isValid: validation.isValid,
        validationErrors: validation.errors.length > 0 ? validation.errors : undefined,
        updatedAt: new Date(),
        items: {
          deleteMany: {},
          create: normalizedItems.map((item) => ({
            name: item.name || '',
            description: item.description,
            category: item.category || '',
            subcategory: item.subcategory,
            quantity: item.quantity || 0,
            unit: item.unit || '',
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            specifications: item.specifications,
            brand: item.brand,
            model: item.model,
            sku: item.sku,
            budget: item.budget,
            deliveryDate: item.deliveryDate,
          })),
        },
      },
      include: {
        items: true,
      },
    })
    
    return {
      specId: spec.id,
      isValid: validation.isValid,
      completeness: validation.completeness,
      normalizedItems,
      missingFields: validation.missingFields,
      errors: validation.errors.map((e) => e.message),
      warnings: validation.warnings.map((w) => w.message),
      questions: questions.map((q) => ({
        id: q.id,
        field: q.field,
        question: q.question,
        type: q.type,
        required: q.required,
      })),
      suggestions: suggestions.map((s) => ({
        field: s.field,
        value: s.value,
        confidence: s.confidence,
      })),
    }
  }

  /**
   * Obtiene la spec de un request
   */
  static async getSpec(requestId: string) {
    return prisma.requestSpec.findUnique({
      where: { requestId },
      include: {
        items: true,
      },
    })
  }

  /**
   * Valida una spec existente
   */
  static async validateSpec(requestId: string) {
    const spec = await this.getSpec(requestId)
    if (!spec) {
      throw new Error('Spec no encontrada')
    }
    
    const items: SpecItem[] = spec.items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description || undefined,
      category: item.category,
      subcategory: item.subcategory || undefined,
      quantity: item.quantity,
      unit: item.unit,
      unitPrice: item.unitPrice || undefined,
      totalPrice: item.totalPrice || undefined,
      specifications: (item.specifications as Record<string, any>) || undefined,
      brand: item.brand || undefined,
      model: item.model || undefined,
      sku: item.sku || undefined,
      budget: item.budget || undefined,
      deliveryDate: item.deliveryDate || undefined,
    }))
    
    const validation = SpecValidator.validateSpec(items)
    
    // Actualizar spec con nueva validación
    await prisma.requestSpec.update({
      where: { requestId },
      data: {
        completeness: validation.completeness,
        missingFields: validation.missingFields,
        isValid: validation.isValid,
        validationErrors: validation.errors.length > 0 ? validation.errors : undefined,
      },
    })
    
    return validation
  }
}

