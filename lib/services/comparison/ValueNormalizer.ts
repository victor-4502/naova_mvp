// Value Normalizer - Normaliza valores entre proveedores para comparación

import type { SupplierQuote, QuoteItem } from '@/lib/types/rfq'

export interface NormalizedQuote {
  quoteId: string
  supplierId: string
  supplierName: string
  normalizedTotal: number
  normalizedSubtotal: number
  normalizedTaxes: number
  normalizedShipping: number
  deliveryDays: number
  paymentTerms?: string
  warranty?: string
  availability?: string
  items: NormalizedQuoteItem[]
  originalQuote: SupplierQuote
}

export interface NormalizedQuoteItem {
  name: string
  quantity: number
  unit: string
  normalizedUnitPrice: number
  normalizedSubtotal: number
  brand?: string
  model?: string
}

export class ValueNormalizer {
  /**
   * Normaliza múltiples cotizaciones para comparación
   */
  static normalizeQuotes(quotes: SupplierQuote[]): NormalizedQuote[] {
    return quotes.map((quote) => this.normalizeQuote(quote))
  }

  /**
   * Normaliza una cotización individual
   */
  static normalizeQuote(quote: SupplierQuote): NormalizedQuote {
    // Por ahora, simplemente mapeamos los valores
    // En el futuro, aquí se podría hacer conversión de monedas, unidades, etc.
    
    return {
      quoteId: quote.id,
      supplierId: quote.supplierId,
      supplierName: '', // Se llenará desde el supplier
      normalizedTotal: quote.total,
      normalizedSubtotal: quote.subtotal,
      normalizedTaxes: quote.taxes,
      normalizedShipping: quote.shipping,
      deliveryDays: quote.deliveryDays,
      paymentTerms: quote.paymentTerms,
      warranty: quote.warranty,
      availability: quote.availability,
      items: quote.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        normalizedUnitPrice: item.unitPrice,
        normalizedSubtotal: item.subtotal,
        brand: item.brand,
        model: item.model,
      })),
      originalQuote: quote,
    }
  }

  /**
   * Convierte moneda (stub para futura implementación)
   */
  static convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): number {
    // Por ahora, asumimos misma moneda
    // TODO: Implementar conversión real con API de cambio
    if (fromCurrency === toCurrency) {
      return amount
    }
    
    // Stub: conversión básica MXN/USD
    const rates: Record<string, number> = {
      'MXN-USD': 0.05,
      'USD-MXN': 20,
    }
    
    const key = `${fromCurrency}-${toCurrency}`
    return rates[key] ? amount * rates[key] : amount
  }

  /**
   * Normaliza unidades para comparación
   */
  static normalizeUnit(unit: string): string {
    const normalized = unit.toLowerCase().trim()
    
    // Mapeo de unidades comunes
    const unitMap: Record<string, string> = {
      'pcs': 'pcs',
      'piezas': 'pcs',
      'unidades': 'pcs',
      'kg': 'kg',
      'kilogramos': 'kg',
      'g': 'g',
      'gramos': 'g',
      'l': 'l',
      'litros': 'l',
      'ml': 'ml',
      'mililitros': 'ml',
    }
    
    return unitMap[normalized] || normalized
  }
}

