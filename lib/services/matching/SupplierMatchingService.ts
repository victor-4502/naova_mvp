// Supplier Matching Service - Servicio principal de matching

import { prisma } from '@/lib/prisma'
import { CategoryMatcher } from './CategoryMatcher'
import { HistoryMatcher } from './HistoryMatcher'
import { GeographyMatcher } from './GeographyMatcher'
import { ScoreCalculator } from './ScoreCalculator'
import type { SupplierMatch } from '@/lib/types/supplier'

export interface MatchingOptions {
  category?: string
  subcategory?: string
  clientId?: string
  clientCity?: string
  clientState?: string
  clientCountry?: string
  itemName?: string
  minScore?: number
  limit?: number
}

export class SupplierMatchingService {
  /**
   * Encuentra proveedores relevantes para un request
   */
  static async findSuppliers(
    options: MatchingOptions
  ): Promise<SupplierMatch[]> {
    const matches: SupplierMatch[] = []

    // 1. Matching por categoría
    if (options.category) {
      const categoryMatches = await CategoryMatcher.matchByCategory(
        options.category,
        options.subcategory
      )
      categoryMatches.forEach((match) => {
        matches.push({
          supplier: match.supplier,
          score: match.matchScore,
          reasons: match.reasons,
        })
      })
    }

    // 2. Matching por histórico
    if (options.clientId) {
      const historyMatches = await HistoryMatcher.matchByHistory(
        options.clientId,
        options.category,
        options.itemName
      )
      historyMatches.forEach((match) => {
        matches.push({
          supplier: match.supplier,
          score: match.matchScore,
          reasons: match.reasons,
        })
      })
    }

    // 3. Matching por geografía
    if (options.clientCity || options.clientState) {
      const geographyMatches = await GeographyMatcher.matchByGeography(
        options.clientCity,
        options.clientState,
        options.clientCountry || 'México'
      )
      geographyMatches.forEach((match) => {
        matches.push({
          supplier: match.supplier,
          score: match.matchScore,
          reasons: match.reasons,
        })
      })
    }

    // 4. Combinar y calcular scores finales
    const combinedMatches = ScoreCalculator.combineMatches(matches)

    // 5. Calcular scores finales considerando todos los factores
    const finalMatches: SupplierMatch[] = combinedMatches.map((match) => {
      const categoryScore = this.getCategoryScore(match, options.category)
      const historyScore = this.getHistoryScore(match, options.clientId)
      const geographyScore = this.getGeographyScore(
        match,
        options.clientCity,
        options.clientState
      )
      const overallScore = match.supplier.score?.overallScore || 0

      const finalScore = ScoreCalculator.calculateFinalScore(
        categoryScore,
        historyScore,
        geographyScore,
        overallScore
      )

      return {
        supplier: match.supplier,
        score: finalScore,
        reasons: match.reasons,
      }
    })

    // 6. Filtrar por score mínimo
    const filtered = ScoreCalculator.filterByMinScore(
      finalMatches,
      options.minScore || 30
    )

    // 7. Limitar resultados
    return ScoreCalculator.limitResults(filtered, options.limit || 10)
  }

  /**
   * Obtiene el score de categoría para un match
   */
  private static getCategoryScore(
    match: SupplierMatch,
    category?: string
  ): number {
    if (!category) return 0

    const hasCategory = match.supplier.categories.some(
      (c) => c.category === category
    )
    if (hasCategory) return 80

    const hasSpecialty = match.supplier.specialties?.includes(category)
    if (hasSpecialty) return 60

    return 0
  }

  /**
   * Obtiene el score de histórico para un match
   */
  private static getHistoryScore(
    match: SupplierMatch,
    clientId?: string
  ): number {
    if (!clientId) return 0

    // El score ya viene del HistoryMatcher
    // Por ahora retornamos un score basado en el score general
    return match.supplier.score?.totalOrders
      ? Math.min(match.supplier.score.totalOrders * 10, 100)
      : 0
  }

  /**
   * Obtiene el score geográfico para un match
   */
  private static getGeographyScore(
    match: SupplierMatch,
    clientCity?: string,
    clientState?: string
  ): number {
    if (!clientCity && !clientState) return 0

    if (clientCity && match.supplier.city === clientCity) return 100
    if (clientState && match.supplier.state === clientState) return 70
    if (match.supplier.country === 'México') return 30

    return 0
  }
}

