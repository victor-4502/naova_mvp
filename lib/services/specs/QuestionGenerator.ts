// Question Generator - Genera preguntas inteligentes para completar specs

import type { SpecItem } from '@/lib/types/request'
import { SpecValidator } from './SpecValidator'

export interface Question {
  id: string
  field: string
  question: string
  type: 'text' | 'number' | 'select' | 'date'
  options?: string[]
  required: boolean
  priority: 'high' | 'medium' | 'low'
}

export class QuestionGenerator {
  /**
   * Genera preguntas para completar una spec
   */
  static generateQuestions(items: SpecItem[]): Question[] {
    const questions: Question[] = []
    
    if (items.length === 0) {
      questions.push({
        id: 'no-items',
        field: 'items',
        question: '¿Qué productos o servicios necesitas?',
        type: 'text',
        required: true,
        priority: 'high',
      })
      return questions
    }
    
    items.forEach((item, index) => {
      const prefix = `items[${index}]`
      
      // Preguntas de campos requeridos faltantes
      if (!item.name) {
        questions.push({
          id: `${prefix}-name`,
          field: `${prefix}.name`,
          question: `¿Cuál es el nombre del producto ${index + 1}?`,
          type: 'text',
          required: true,
          priority: 'high',
        })
      }
      
      if (!item.category) {
        questions.push({
          id: `${prefix}-category`,
          field: `${prefix}.category`,
          question: `¿A qué categoría pertenece "${item.name || 'este producto'}"?`,
          type: 'select',
          options: ['materiales', 'herramientas', 'seguridad', 'consumibles', 'refacciones', 'servicios'],
          required: true,
          priority: 'high',
        })
      }
      
      if (!item.quantity || item.quantity <= 0) {
        questions.push({
          id: `${prefix}-quantity`,
          field: `${prefix}.quantity`,
          question: `¿Cuántas unidades de "${item.name || 'este producto'}" necesitas?`,
          type: 'number',
          required: true,
          priority: 'high',
        })
      }
      
      if (!item.unit) {
        questions.push({
          id: `${prefix}-unit`,
          field: `${prefix}.unit`,
          question: `¿En qué unidad se mide "${item.name || 'este producto'}"? (kg, pcs, l, m, etc.)`,
          type: 'select',
          options: ['pcs', 'kg', 'g', 'l', 'ml', 'm', 'cm', 'mm', 'm2', 'hours', 'days'],
          required: true,
          priority: 'high',
        })
      }
      
      // Preguntas de campos recomendados
      if (!item.description) {
        questions.push({
          id: `${prefix}-description`,
          field: `${prefix}.description`,
          question: `¿Puedes describir "${item.name || 'este producto'}" con más detalle?`,
          type: 'text',
          required: false,
          priority: 'medium',
        })
      }
      
      if (!item.specifications || Object.keys(item.specifications || {}).length === 0) {
        questions.push({
          id: `${prefix}-specifications`,
          field: `${prefix}.specifications`,
          question: `¿Hay especificaciones técnicas importantes para "${item.name || 'este producto'}"? (marca, modelo, estándares, etc.)`,
          type: 'text',
          required: false,
          priority: 'medium',
        })
      }
      
      if (!item.budget && item.category) {
        questions.push({
          id: `${prefix}-budget`,
          field: `${prefix}.budget`,
          question: `¿Tienes un presupuesto estimado para "${item.name || 'este producto'}"?`,
          type: 'number',
          required: false,
          priority: 'low',
        })
      }
      
      if (!item.deliveryDate) {
        questions.push({
          id: `${prefix}-deliveryDate`,
          field: `${prefix}.deliveryDate`,
          question: `¿Cuándo necesitas recibir "${item.name || 'este producto'}"?`,
          type: 'date',
          required: false,
          priority: 'medium',
        })
      }
    })
    
    return questions.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
  }

  /**
   * Genera preguntas basadas en validación
   */
  static generateQuestionsFromValidation(items: SpecItem[]): Question[] {
    const validation = SpecValidator.validateSpec(items)
    const questions: Question[] = []
    
    validation.missingFields.forEach((field) => {
      const fieldParts = field.split('.')
      const itemIndex = fieldParts[0] === 'items' ? parseInt(fieldParts[1]) : -1
      const fieldName = fieldParts[fieldParts.length - 1]
      
      if (itemIndex >= 0 && items[itemIndex]) {
        const item = items[itemIndex]
        questions.push({
          id: field,
          field,
          question: this.getQuestionForField(fieldName, item),
          type: this.getQuestionType(fieldName),
          required: true,
          priority: 'high',
        })
      }
    })
    
    return questions
  }

  /**
   * Obtiene la pregunta apropiada para un campo
   */
  private static getQuestionForField(field: string, item: SpecItem): string {
    const fieldQuestions: Record<string, string> = {
      name: `¿Cuál es el nombre del producto?`,
      category: `¿A qué categoría pertenece "${item.name || 'este producto'}"?`,
      quantity: `¿Cuántas unidades necesitas?`,
      unit: `¿En qué unidad se mide?`,
      description: `¿Puedes describir "${item.name || 'este producto'}"?`,
      specifications: `¿Hay especificaciones técnicas?`,
      budget: `¿Cuál es el presupuesto estimado?`,
      deliveryDate: `¿Cuándo necesitas recibirlo?`,
    }
    
    return fieldQuestions[field] || `¿Cuál es el valor de ${field}?`
  }

  /**
   * Obtiene el tipo de pregunta para un campo
   */
  private static getQuestionType(field: string): Question['type'] {
    const typeMap: Record<string, Question['type']> = {
      name: 'text',
      category: 'select',
      quantity: 'number',
      unit: 'select',
      description: 'text',
      specifications: 'text',
      budget: 'number',
      deliveryDate: 'date',
    }
    
    return typeMap[field] || 'text'
  }
}

