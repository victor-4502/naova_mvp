// @ts-nocheck
// TODO: Activar cuando el schema POS esté activo

// Quote Receiver - Recibe y procesa cotizaciones de proveedores

import { prisma } from '@/lib/prisma'
import type { SupplierQuote, QuoteItem } from '@/lib/types/rfq'

export interface QuoteSubmissionInput {
  rfqId: string
  supplierId: string
  items: Array<{
    rfqItemId?: string
    name: string
    quantity: number
    unit: string
    unitPrice: number
    brand?: string
    model?: string
    specifications?: Record<string, any>
  }>
  subtotal: number
  taxes?: number
  shipping?: number
  total: number
  validUntil: Date
  deliveryDays: number
  paymentTerms?: string
  warranty?: string
  availability?: string
  notes?: string
}

export class QuoteReceiver {
  /**
   * Recibe y procesa una cotización de un proveedor
   */
  static async receiveQuote(input: QuoteSubmissionInput): Promise<SupplierQuote> {
    // Verificar que el RFQ existe y está activo
    const rfq = await prisma.rFQ.findUnique({
      where: { id: input.rfqId },
      include: {
        invitedSuppliers: {
          where: {
            supplierId: input.supplierId,
          },
        },
      },
    })

    if (!rfq) {
      throw new Error('RFQ no encontrado')
    }

    if (rfq.status !== 'sent' && rfq.status !== 'in_progress') {
      throw new Error('RFQ no está disponible para cotizaciones')
    }

    // Verificar que el proveedor fue invitado
    if (rfq.invitedSuppliers.length === 0) {
      throw new Error('Proveedor no fue invitado a este RFQ')
    }

    // Calcular total si no se proporciona
    const calculatedTotal =
      input.subtotal + (input.taxes || 0) + (input.shipping || 0)

    if (Math.abs(calculatedTotal - input.total) > 0.01) {
      throw new Error(
        `El total no coincide con subtotal + impuestos + envío (esperado: ${calculatedTotal.toFixed(2)})`
      )
    }

    // Crear cotización
    const quote = await prisma.supplierQuote.create({
      data: {
        rfqId: input.rfqId,
        supplierId: input.supplierId,
        status: 'submitted',
        subtotal: input.subtotal,
        taxes: input.taxes || 0,
        shipping: input.shipping || 0,
        total: input.total,
        validUntil: input.validUntil,
        deliveryDays: input.deliveryDays,
        paymentTerms: input.paymentTerms,
        warranty: input.warranty,
        availability: input.availability,
        notes: input.notes,
        items: {
          create: input.items.map((item) => ({
            rfqItemId: item.rfqItemId,
            name: item.name,
            quantity: item.quantity,
            unit: item.unit,
            unitPrice: item.unitPrice,
            subtotal: item.unitPrice * item.quantity,
            brand: item.brand,
            model: item.model,
            specifications: item.specifications,
          })),
        },
      },
      include: {
        items: true,
        supplier: true,
      },
    })

    // Actualizar RFQ si es la primera cotización
    if (rfq.status === 'sent') {
      await prisma.rFQ.update({
        where: { id: input.rfqId },
        data: {
          status: 'in_progress',
        },
      })
    }

    // Actualizar fecha de respuesta del proveedor
    await prisma.rFQSupplier.updateMany({
      where: {
        rfqId: input.rfqId,
        supplierId: input.supplierId,
      },
      data: {
        respondedAt: new Date(),
      },
    })

    // Mapear a tipo SupplierQuote
    return {
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
    }
  }

  /**
   * Obtiene todas las cotizaciones de un RFQ
   */
  static async getRFQQuotes(rfqId: string): Promise<SupplierQuote[]> {
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
        total: 'asc', // Ordenar por precio
      },
    })

    return quotes.map((quote) => ({
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
  }
}

