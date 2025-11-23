// Classification Service - Clasifica requests por categoría y urgencia

import type { RequestSource, UrgencyLevel } from '@/lib/types/request'
import { CATEGORY_MAPPINGS } from '@/lib/utils/constants'

export interface ClassificationResult {
  category: string | null
  subcategory: string | null
  urgency: UrgencyLevel
  confidence: number // 0-1
}

export class ClassificationService {
  /**
   * Clasifica un request basado en su contenido
   */
  static classify(
    content: string,
    source: RequestSource,
    metadata?: Record<string, any>
  ): ClassificationResult {
    const normalizedContent = content.toLowerCase()
    
    // Clasificar categoría
    const categoryResult = this.classifyCategory(normalizedContent)
    
    // Determinar urgencia
    const urgency = this.determineUrgency(normalizedContent, source, metadata)
    
    // Calcular confianza
    const confidence = this.calculateConfidence(
      categoryResult,
      normalizedContent
    )
    
    return {
      category: categoryResult.category,
      subcategory: categoryResult.subcategory,
      urgency,
      confidence,
    }
  }

  /**
   * Clasifica la categoría del request
   */
  private static classifyCategory(content: string): {
    category: string | null
    subcategory: string | null
  } {
    let bestMatch: { category: string; score: number } | null = null
    
    for (const [category, keywords] of Object.entries(CATEGORY_MAPPINGS)) {
      let score = 0
      for (const keyword of keywords) {
        if (content.includes(keyword)) {
          score += 1
        }
      }
      
      if (score > 0 && (!bestMatch || score > bestMatch.score)) {
        bestMatch = { category, score }
      }
    }
    
    if (bestMatch) {
      return {
        category: bestMatch.category,
        subcategory: null, // TODO: Implementar subcategorías
      }
    }
    
    return { category: null, subcategory: null }
  }

  /**
   * Determina el nivel de urgencia
   */
  private static determineUrgency(
    content: string,
    source: RequestSource,
    metadata?: Record<string, any>
  ): UrgencyLevel {
    // Urgencia basada en keywords
    const urgentKeywords = ['urgente', 'urgent', 'inmediato', 'asap', 'ya', 'ahora', 'emergencia']
    const highKeywords = ['importante', 'important', 'pronto', 'rápido', 'quick', 'prioridad']
    const lowKeywords = ['cuando puedas', 'sin prisa', 'no rush', 'eventual', 'futuro']
    
    const lowerContent = content.toLowerCase()
    
    if (urgentKeywords.some(kw => lowerContent.includes(kw))) {
      return 'urgent'
    }
    if (highKeywords.some(kw => lowerContent.includes(kw))) {
      return 'high'
    }
    if (lowKeywords.some(kw => lowerContent.includes(kw))) {
      return 'low'
    }
    
    // Urgencia basada en fuente
    if (source === 'whatsapp') {
      // WhatsApp suele ser más urgente
      return 'high'
    }
    
    if (source === 'email') {
      // Email puede ser menos urgente
      return 'normal'
    }
    
    // Urgencia basada en metadata (si hay fecha límite)
    if (metadata?.deadline) {
      const deadline = new Date(metadata.deadline)
      const now = new Date()
      const daysUntilDeadline = Math.ceil(
        (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      )
      
      if (daysUntilDeadline < 1) return 'urgent'
      if (daysUntilDeadline < 3) return 'high'
      if (daysUntilDeadline < 7) return 'normal'
      return 'low'
    }
    
    return 'normal'
  }

  /**
   * Calcula la confianza de la clasificación
   */
  private static calculateConfidence(
    categoryResult: { category: string | null; subcategory: string | null },
    content: string
  ): number {
    if (!categoryResult.category) {
      return 0.3 // Baja confianza si no hay categoría
    }
    
    // Aumentar confianza si hay múltiples keywords
    const categoryKeywords = CATEGORY_MAPPINGS[categoryResult.category] || []
    const matches = categoryKeywords.filter(kw => content.includes(kw)).length
    const maxMatches = categoryKeywords.length
    
    if (maxMatches === 0) return 0.5
    
    const keywordConfidence = matches / maxMatches
    
    // Aumentar confianza si el contenido es largo (más información)
    const lengthConfidence = Math.min(content.length / 500, 1)
    
    // Confianza final
    return (keywordConfidence * 0.7 + lengthConfidence * 0.3)
  }
}

