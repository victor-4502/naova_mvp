// Quote Comparator - Compara cotizaciones

import { prisma } from '@/lib/prisma'
import { ValueNormalizer, type NormalizedQuote } from './ValueNormalizer'
import { ScoreCalculator, type ComparisonScore } from './ScoreCalculator'
import type { SupplierQuote } from '@/lib/types/rfq'

export interface ComparisonResult {
  rfqId: string
  quotes: NormalizedQuote[]
  scores: ComparisonScore[]
  bestQuote: NormalizedQuote | null
  summary: {
    totalQuotes: number
    priceRange: { min: number; max: number }
    deliveryRange: { min: number; max: number }
    averagePrice: number
  }
}

export class QuoteComparator {
  /**
   * Compara todas las cotizaciones de un RFQ
   */
  static async compareRFQQuotes(rfqId: string): Promise<ComparisonResult> {
    // Obtener cotizaciones
    const quotes = await prisma.supplierQuote.findMany({
      where: {
        rfqId,
        status: {
          in: ['submitted', 'accepted'],
        },
      },
      include: {
        items: true,
        supplier: true,
      },
      orderBy: {
        total: 'asc',
      },
    })

    if (quotes.length === 0) {
      return {
        rfqId,
        quotes: [],
        scores: [],
        bestQuote: null,
        summary: {
          totalQuotes: 0,
          priceRange: { min: 0, max: 0 },
          deliveryRange: { min: 0, max: 0 },
          averagePrice: 0,
        },
      }
    }

    // Mapear a tipo SupplierQuote
    const supplierQuotes: SupplierQuote[] = quotes.map((quote) => ({
      id: quote.id,
      rfqId: quote.rfqId,
      supplierId: quote.supplierId,
      status: quote.status as any,
      subtotal: quote.subtotal,
      taxes: quote.taxes,
      shipping: quote.shipping,
      total: quote.total,
      validUntil: quote.validUntil,
      deliveryDays: quote.deliveryDays,
      paymentTerms: quote.paymentTerms || undefined,
      warranty: quote.warranty || undefined,
      availability: quote.availability || undefined,
      items: quote.items.map((item) => ({
        id: item.id,
        quoteId: item.quoteId,
        rfqItemId: item.rfqItemId || undefined,
        specItemId: item.specItemId || undefined,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal,
        brand: item.brand || undefined,
        model: item.model || undefined,
        specifications: (item.specifications as Record<string, any>) || undefined,
      })),
      comparisonScore: quote.comparisonScore || undefined,
      notes: quote.notes || undefined,
      submittedAt: quote.submittedAt,
      updatedAt: quote.updatedAt,
    }))

    // Normalizar cotizaciones
    const normalizedQuotes = ValueNormalizer.normalizeQuotes(supplierQuotes)

    // Agregar nombre del proveedor
    normalizedQuotes.forEach((nq, index) => {
      nq.supplierName = quotes[index].supplier.companyName
    })

    // Calcular scores
    const scores = ScoreCalculator.calculateScores(normalizedQuotes)

    // Actualizar scores en la base de datos
    await Promise.all(
      scores.map((score) =>
        prisma.supplierQuote.update({
          where: { id: score.quoteId },
          data: {
            comparisonScore: score.totalScore,
          },
        })
      )
    )

    // Calcular resumen
    const prices = normalizedQuotes.map((q) => q.normalizedTotal)
    const deliveryDays = normalizedQuotes.map((q) => q.deliveryDays)

    const summary = {
      totalQuotes: normalizedQuotes.length,
      priceRange: {
        min: Math.min(...prices),
        max: Math.max(...prices),
      },
      deliveryRange: {
        min: Math.min(...deliveryDays),
        max: Math.max(...deliveryDays),
      },
      averagePrice:
        prices.reduce((a, b) => a + b, 0) / prices.length,
    }

    // Mejor cotización (mayor score)
    const bestQuote =
      scores.length > 0
        ? normalizedQuotes.find((q) => q.quoteId === scores[0].quoteId) || null
        : null

    return {
      rfqId,
      quotes: normalizedQuotes,
      scores,
      bestQuote,
      summary,
    }
  }
}

