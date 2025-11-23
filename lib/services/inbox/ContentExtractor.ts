// Content Extractor - Extrae información básica del texto

import { CATEGORY_MAPPINGS } from '@/lib/utils/constants'
import type { RequestSource, UrgencyLevel } from '@/lib/types/request'

export interface ExtractedContent {
  category?: string
  subcategory?: string
  urgency: UrgencyLevel
  items: ExtractedItem[]
  quantities: number[]
  units: string[]
  keywords: string[]
}

export interface ExtractedItem {
  name?: string
  description?: string
  quantity?: number
  unit?: string
  category?: string
}

export class ContentExtractor {
  /**
   * Extrae información básica del contenido de texto
   */
  static extract(content: string): ExtractedContent {
    const normalizedContent = content.toLowerCase()
    
    // Extraer categoría
    const category = this.extractCategory(normalizedContent)
    
    // Extraer urgencia
    const urgency = this.extractUrgency(normalizedContent)
    
    // Extraer cantidades y unidades
    const { quantities, units } = this.extractQuantitiesAndUnits(content)
    
    // Extraer items mencionados
    const items = this.extractItems(content)
    
    // Extraer keywords
    const keywords = this.extractKeywords(normalizedContent)
    
    return {
      category,
      urgency,
      items,
      quantities,
      units,
      keywords,
    }
  }

  /**
   * Extrae la categoría del contenido
   */
  private static extractCategory(content: string): string | undefined {
    for (const [category, keywords] of Object.entries(CATEGORY_MAPPINGS)) {
      for (const keyword of keywords) {
        if (content.includes(keyword)) {
          return category
        }
      }
    }
    return undefined
  }

  /**
   * Extrae el nivel de urgencia
   */
  private static extractUrgency(content: string): UrgencyLevel {
    const urgentKeywords = ['urgente', 'urgent', 'inmediato', 'asap', 'ya', 'ahora']
    const highKeywords = ['importante', 'important', 'pronto', 'rápido', 'quick']
    const lowKeywords = ['cuando puedas', 'sin prisa', 'no rush', 'eventual']
    
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
    
    return 'normal'
  }

  /**
   * Extrae cantidades y unidades del texto
   */
  private static extractQuantitiesAndUnits(content: string): {
    quantities: number[]
    units: string[]
  } {
    const quantities: number[] = []
    const units: string[] = []
    
    // Patrones para encontrar cantidades
    const quantityPatterns = [
      /(\d+(?:\.\d+)?)\s*(kg|kilogramos?|g|gramos?|lb|libras?)/gi,
      /(\d+(?:\.\d+)?)\s*(l|litros?|ml|mililitros?|gal|galones?)/gi,
      /(\d+(?:\.\d+)?)\s*(m|metros?|cm|centimetros?|mm|milimetros?|ft|pies?|in|pulgadas?)/gi,
      /(\d+(?:\.\d+)?)\s*(pcs|piezas?|unidades?|un|ud)/gi,
      /(\d+(?:\.\d+)?)\s*(m2|metros?\s*cuadrados?|m²)/gi,
    ]
    
    quantityPatterns.forEach(pattern => {
      const matches = content.matchAll(pattern)
      for (const match of matches) {
        const quantity = parseFloat(match[1])
        const unit = match[2].toLowerCase()
        if (!isNaN(quantity)) {
          quantities.push(quantity)
          units.push(unit)
        }
      }
    })
    
    // También buscar números simples
    const simpleNumbers = content.match(/\b\d+\b/g)
    if (simpleNumbers && quantities.length === 0) {
      simpleNumbers.forEach(num => {
        const quantity = parseInt(num)
        if (!isNaN(quantity) && quantity > 0 && quantity < 1000000) {
          quantities.push(quantity)
        }
      })
    }
    
    return { quantities, units }
  }

  /**
   * Extrae items mencionados en el texto
   */
  private static extractItems(content: string): ExtractedItem[] {
    const items: ExtractedItem[] = []
    
    // Buscar patrones comunes de listas
    const listPatterns = [
      /[-•*]\s*(.+?)(?:\n|$)/g,
      /\d+[\.\)]\s*(.+?)(?:\n|$)/g,
    ]
    
    listPatterns.forEach(pattern => {
      const matches = content.matchAll(pattern)
      for (const match of matches) {
        const itemText = match[1].trim()
        if (itemText.length > 3) {
          items.push({
            name: itemText,
            description: itemText,
          })
        }
      }
    })
    
    // Si no hay items en formato de lista, intentar extraer del texto general
    if (items.length === 0) {
      // Buscar nombres de productos comunes
      const productKeywords = [
        'tornillos', 'screws', 'tuercas', 'nuts',
        'arandelas', 'washers', 'clavos', 'nails',
        'cables', 'wires', 'tubos', 'pipes',
        'válvulas', 'valves', 'bombas', 'pumps',
      ]
      
      productKeywords.forEach(keyword => {
        if (content.toLowerCase().includes(keyword)) {
          items.push({
            name: keyword,
            category: 'herramientas',
          })
        }
      })
    }
    
    return items
  }

  /**
   * Extrae keywords relevantes
   */
  private static extractKeywords(content: string): string[] {
    const keywords: string[] = []
    
    // Palabras clave comunes en compras
    const commonKeywords = [
      'cotización', 'quote', 'precio', 'price',
      'entrega', 'delivery', 'envío', 'shipping',
      'proveedor', 'supplier', 'marca', 'brand',
      'especificaciones', 'specs', 'calidad', 'quality',
    ]
    
    commonKeywords.forEach(keyword => {
      if (content.includes(keyword)) {
        keywords.push(keyword)
      }
    })
    
    return keywords
  }
}

