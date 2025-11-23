// Spec Enricher - Enriquece specs con datos históricos

import { prisma } from '@/lib/prisma'
import type { SpecItem } from '@/lib/types/request'

export interface EnrichmentResult {
  enriched: boolean
  suggestions: EnrichmentSuggestion[]
}

export interface EnrichmentSuggestion {
  field: string
  value: any
  confidence: number
  source: 'history' | 'category' | 'similar'
}

export class SpecEnricher {
  /**
   * Enriquece un item con datos históricos
   */
  static async enrichItem(
    item: SpecItem,
    clientId: string
  ): Promise<EnrichmentResult> {
    const suggestions: EnrichmentSuggestion[] = []
    
    // Buscar compras históricas similares
    if (item.category) {
      const historicalData = await this.getHistoricalData(
        clientId,
        item.category,
        item.name
      )
      
      if (historicalData.length > 0) {
        // Sugerir precio promedio
        const avgPrice = this.calculateAveragePrice(historicalData)
        if (avgPrice && !item.unitPrice) {
          suggestions.push({
            field: 'unitPrice',
            value: avgPrice,
            confidence: 0.7,
            source: 'history',
          })
        }
        
        // Sugerir proveedores frecuentes
        const frequentSuppliers = this.getFrequentSuppliers(historicalData)
        if (frequentSuppliers.length > 0) {
          suggestions.push({
            field: 'suggestedSuppliers',
            value: frequentSuppliers,
            confidence: 0.8,
            source: 'history',
          })
        }
      }
    }
    
    // Sugerir unidades comunes para la categoría
    if (item.category && !item.unit) {
      const commonUnit = this.getCommonUnitForCategory(item.category)
      if (commonUnit) {
        suggestions.push({
          field: 'unit',
          value: commonUnit,
          confidence: 0.6,
          source: 'category',
        })
      }
    }
    
    return {
      enriched: suggestions.length > 0,
      suggestions,
    }
  }

  /**
   * Obtiene datos históricos de compras
   */
  private static async getHistoricalData(
    clientId: string,
    category: string,
    itemName?: string
  ) {
    // Buscar en PurchaseHistory (modelo legacy)
    const history = await prisma.purchaseHistory.findMany({
      where: {
        clientId,
        category,
        ...(itemName && {
          item: {
            contains: itemName,
            mode: 'insensitive',
          },
        }),
      },
      orderBy: {
        date: 'desc',
      },
      take: 20,
    })
    
    return history
  }

  /**
   * Calcula el precio promedio de datos históricos
   */
  private static calculateAveragePrice(historicalData: any[]): number | null {
    if (historicalData.length === 0) return null
    
    const prices = historicalData
      .map((h) => h.unitPrice)
      .filter((p) => p && p > 0)
    
    if (prices.length === 0) return null
    
    const sum = prices.reduce((a, b) => a + b, 0)
    return sum / prices.length
  }

  /**
   * Obtiene proveedores más frecuentes
   */
  private static getFrequentSuppliers(historicalData: any[]): string[] {
    const supplierCounts: Record<string, number> = {}
    
    historicalData.forEach((h) => {
      if (h.providerId) {
        supplierCounts[h.providerId] = (supplierCounts[h.providerId] || 0) + 1
      }
    })
    
    return Object.entries(supplierCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([id]) => id)
  }

  /**
   * Obtiene unidad común para una categoría
   */
  private static getCommonUnitForCategory(category: string): string | null {
    const categoryUnits: Record<string, string> = {
      materiales: 'kg',
      herramientas: 'pcs',
      seguridad: 'pcs',
      consumibles: 'pcs',
      refacciones: 'pcs',
      servicios: 'hours',
    }
    
    return categoryUnits[category] || null
  }
}

