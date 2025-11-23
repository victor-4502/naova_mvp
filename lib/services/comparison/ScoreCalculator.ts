// Score Calculator - Calcula scores de comparación para cotizaciones

import type { NormalizedQuote } from './ValueNormalizer'

export interface ComparisonScore {
  quoteId: string
  supplierId: string
  totalScore: number
  priceScore: number
  deliveryScore: number
  termsScore: number
  reliabilityScore: number
  breakdown: {
    price: { score: number; rank: number }
    delivery: { score: number; rank: number }
    terms: { score: number; rank: number }
    reliability: { score: number; rank: number }
  }
}

export class ScoreCalculator {
  /**
   * Calcula scores de comparación para todas las cotizaciones
   */
  static calculateScores(quotes: NormalizedQuote[]): ComparisonScore[] {
    if (quotes.length === 0) return []

    // Calcular scores individuales
    const scores = quotes.map((quote, index) => {
      const priceScore = this.calculatePriceScore(quote, quotes)
      const deliveryScore = this.calculateDeliveryScore(quote, quotes)
      const termsScore = this.calculateTermsScore(quote)
      const reliabilityScore = this.calculateReliabilityScore(quote)

      return {
        quoteId: quote.quoteId,
        supplierId: quote.supplierId,
        priceScore,
        deliveryScore,
        termsScore,
        reliabilityScore,
        totalScore: 0, // Se calculará después
        breakdown: {
          price: { score: priceScore, rank: 0 },
          delivery: { score: deliveryScore, rank: 0 },
          terms: { score: termsScore, rank: 0 },
          reliability: { score: reliabilityScore, rank: 0 },
        },
      }
    })

    // Calcular ranks
    this.calculateRanks(scores, quotes)

    // Calcular score total (ponderado)
    scores.forEach((score) => {
      score.totalScore =
        score.priceScore * 0.4 + // 40% precio
        score.deliveryScore * 0.3 + // 30% entrega
        score.termsScore * 0.15 + // 15% términos
        score.reliabilityScore * 0.15 // 15% confiabilidad
    })

    // Ordenar por score total
    return scores.sort((a, b) => b.totalScore - a.totalScore)
  }

  /**
   * Calcula score de precio (más bajo = mejor)
   */
  private static calculatePriceScore(
    quote: NormalizedQuote,
    allQuotes: NormalizedQuote[]
  ): number {
    if (allQuotes.length === 1) return 100

    const prices = allQuotes.map((q) => q.normalizedTotal)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const priceRange = maxPrice - minPrice

    if (priceRange === 0) return 100

    // Score inverso: precio más bajo = score más alto
    const score = 100 - ((quote.normalizedTotal - minPrice) / priceRange) * 100

    return Math.max(0, Math.min(100, score))
  }

  /**
   * Calcula score de entrega (más rápido = mejor)
   */
  private static calculateDeliveryScore(
    quote: NormalizedQuote,
    allQuotes: NormalizedQuote[]
  ): number {
    if (allQuotes.length === 1) return 100

    const deliveryDays = allQuotes.map((q) => q.deliveryDays)
    const minDays = Math.min(...deliveryDays)
    const maxDays = Math.max(...deliveryDays)
    const dayRange = maxDays - minDays

    if (dayRange === 0) return 100

    // Score inverso: menos días = score más alto
    const score = 100 - ((quote.deliveryDays - minDays) / dayRange) * 100

    return Math.max(0, Math.min(100, score))
  }

  /**
   * Calcula score de términos de pago
   */
  private static calculateTermsScore(quote: NormalizedQuote): number {
    let score = 50 // Base

    // Términos de pago favorables
    if (quote.paymentTerms) {
      const terms = quote.paymentTerms.toLowerCase()
      if (terms.includes('30 días') || terms.includes('30 days')) {
        score += 20
      } else if (terms.includes('15 días') || terms.includes('15 days')) {
        score += 10
      } else if (terms.includes('contado') || terms.includes('cash')) {
        score -= 10
      }
    }

    // Garantía
    if (quote.warranty) {
      score += 20
      const warrantyMatch = quote.warranty.match(/(\d+)/)
      if (warrantyMatch) {
        const months = parseInt(warrantyMatch[1])
        if (months >= 12) score += 10
      }
    }

    // Disponibilidad
    if (quote.availability === 'in_stock' || quote.availability === 'disponible') {
      score += 10
    }

    return Math.max(0, Math.min(100, score))
  }

  /**
   * Calcula score de confiabilidad (basado en histórico del proveedor)
   */
  private static calculateReliabilityScore(quote: NormalizedQuote): number {
    // Por ahora, score base
    // TODO: Integrar con datos históricos del proveedor
    return 70
  }

  /**
   * Calcula ranks para cada métrica
   */
  private static calculateRanks(
    scores: ComparisonScore[],
    quotes: NormalizedQuote[]
  ) {
    // Rank de precio (menor precio = rank 1)
    const priceSorted = [...scores].sort(
      (a, b) =>
        quotes.find((q) => q.quoteId === a.quoteId)!.normalizedTotal -
        quotes.find((q) => q.quoteId === b.quoteId)!.normalizedTotal
    )
    priceSorted.forEach((score, index) => {
      score.breakdown.price.rank = index + 1
    })

    // Rank de entrega (menor días = rank 1)
    const deliverySorted = [...scores].sort(
      (a, b) =>
        quotes.find((q) => q.quoteId === a.quoteId)!.deliveryDays -
        quotes.find((q) => q.quoteId === b.quoteId)!.deliveryDays
    )
    deliverySorted.forEach((score, index) => {
      score.breakdown.delivery.rank = index + 1
    })

    // Rank de términos (mayor score = rank 1)
    const termsSorted = [...scores].sort(
      (a, b) => b.termsScore - a.termsScore
    )
    termsSorted.forEach((score, index) => {
      score.breakdown.terms.rank = index + 1
    })

    // Rank de confiabilidad (mayor score = rank 1)
    const reliabilitySorted = [...scores].sort(
      (a, b) => b.reliabilityScore - a.reliabilityScore
    )
    reliabilitySorted.forEach((score, index) => {
      score.breakdown.reliability.rank = index + 1
    })
  }
}

