// Score Calculator - Calcula score final de matching

import type { SupplierMatch } from '@/lib/types/supplier'

export interface MatchingWeights {
  category: number
  history: number
  geography: number
  overallScore: number
}

const DEFAULT_WEIGHTS: MatchingWeights = {
  category: 0.4, // 40%
  history: 0.3, // 30%
  geography: 0.2, // 20%
  overallScore: 0.1, // 10%
}

export class ScoreCalculator {
  /**
   * Calcula el score final combinando múltiples factores
   */
  static calculateFinalScore(
    categoryScore: number,
    historyScore: number,
    geographyScore: number,
    supplierOverallScore: number,
    weights: MatchingWeights = DEFAULT_WEIGHTS
  ): number {
    // Normalizar scores a 0-100
    const normalizedCategory = Math.min(categoryScore, 100)
    const normalizedHistory = Math.min(historyScore, 100)
    const normalizedGeography = Math.min(geographyScore, 100)
    const normalizedOverall = Math.min(supplierOverallScore * 10, 100) // Convertir de 0-10 a 0-100

    // Calcular score ponderado
    const finalScore =
      normalizedCategory * weights.category +
      normalizedHistory * weights.history +
      normalizedGeography * weights.geography +
      normalizedOverall * weights.overallScore

    return Math.round(finalScore)
  }

  /**
   * Combina múltiples matches en un resultado final
   */
  static combineMatches(matches: SupplierMatch[]): SupplierMatch[] {
    // Agrupar por supplier
    const supplierMap = new Map<string, SupplierMatch>()

    matches.forEach((match) => {
      const supplierId = match.supplier.id
      if (supplierMap.has(supplierId)) {
        const existing = supplierMap.get(supplierId)!
        // Combinar scores (promedio ponderado)
        existing.score = (existing.score + match.score) / 2
        // Combinar razones
        existing.reasons = [
          ...new Set([...existing.reasons, ...match.reasons]),
        ]
      } else {
        supplierMap.set(supplierId, { ...match })
      }
    })

    // Convertir a array y ordenar por score
    return Array.from(supplierMap.values()).sort(
      (a, b) => b.score - a.score
    )
  }

  /**
   * Filtra matches por score mínimo
   */
  static filterByMinScore(
    matches: SupplierMatch[],
    minScore: number = 30
  ): SupplierMatch[] {
    return matches.filter((match) => match.score >= minScore)
  }

  /**
   * Limita el número de resultados
   */
  static limitResults(
    matches: SupplierMatch[],
    limit: number = 10
  ): SupplierMatch[] {
    return matches.slice(0, limit)
  }
}

