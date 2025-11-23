// Purchase Order Service - Servicio principal de Purchase Orders

import { prisma } from '@/lib/prisma'
import type { PurchaseOrder, POStatus, PaymentStatus } from '@/lib/types/po'

export interface CreatePOInput {
  requestId: string
  quoteId: string
  clientId: string
}

export class PurchaseOrderService {
  /**
   * Crea un Purchase Order desde una cotización seleccionada
   */
  static async createPO(input: CreatePOInput): Promise<PurchaseOrder> {
    // Obtener quote con información completa
    const quote = await prisma.supplierQuote.findUnique({
      where: { id: input.quoteId },
      include: {
        rfq: {
          include: {
            request: true,
          },
        },
        supplier: true,
        items: true,
      },
    })

    if (!quote) {
      throw new Error('Cotización no encontrada')
    }

    // Generar número de PO
    const poNumber = await this.generatePONumber()

    // Crear PO
    const po = await prisma.purchaseOrder.create({
      data: {
        requestId: input.requestId,
        quoteId: input.quoteId,
        supplierId: quote.supplierId,
        clientId: input.clientId,
        status: 'approved_by_client',
        poNumber,
        totalAmount: quote.total,
        items: {
          create: quote.items.map((item) => ({
            specItemId: item.specItemId,
            name: item.name,
            description: item.description,
            quantity: item.quantity,
            unit: item.unit,
            unitPrice: item.unitPrice,
            subtotal: item.subtotal,
          })),
        },
        timeline: {
          create: {
            status: 'approved_by_client',
            description: 'Purchase Order creado y aprobado por el cliente',
          },
        },
      },
      include: {
        items: true,
        timeline: true,
      },
    })

    // Actualizar quote como aceptada
    await prisma.supplierQuote.update({
      where: { id: input.quoteId },
      data: {
        status: 'accepted',
      },
    })

    // Actualizar request
    await prisma.request.update({
      where: { id: input.requestId },
      data: {
        status: 'po_created',
        pipelineStage: 'purchase_in_progress',
      },
    })

    return this.mapPO(po)
  }

  /**
   * Genera un número único de PO
   */
  private static async generatePONumber(): Promise<string> {
    const year = new Date().getFullYear()
    const count = await prisma.purchaseOrder.count({
      where: {
        createdAt: {
          gte: new Date(`${year}-01-01`),
        },
      },
    })

    return `PO-${year}-${String(count + 1).padStart(5, '0')}`
  }

  /**
   * Obtiene un PO por ID
   */
  static async getPO(poId: string): Promise<PurchaseOrder | null> {
    const po = await prisma.purchaseOrder.findUnique({
      where: { id: poId },
      include: {
        items: true,
        timeline: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!po) return null

    return this.mapPO(po)
  }

  /**
   * Actualiza el estado de un PO
   */
  static async updatePOStatus(
    poId: string,
    status: POStatus,
    description?: string
  ): Promise<PurchaseOrder> {
    // Actualizar PO
    const po = await prisma.purchaseOrder.update({
      where: { id: poId },
      data: {
        status,
        updatedAt: new Date(),
      },
      include: {
        items: true,
        timeline: true,
      },
    })

    // Agregar evento al timeline
    await prisma.pOTimelineEvent.create({
      data: {
        poId,
        status,
        description: description || this.getDefaultDescription(status),
      },
    })

    // Actualizar request si es necesario
    if (status === 'delivered') {
      await prisma.request.update({
        where: { id: po.requestId },
        data: {
          status: 'delivered',
          pipelineStage: 'delivered',
        },
      })
    }

    return this.mapPO(po)
  }

  /**
   * Obtiene descripción por defecto para un estado
   */
  private static getDefaultDescription(status: POStatus): string {
    const descriptions: Record<POStatus, string> = {
      approved_by_client: 'Purchase Order aprobado por el cliente',
      purchase_order_created: 'Purchase Order formal creado',
      payment_pending: 'Pendiente de pago',
      payment_received: 'Pago recibido',
      supplier_confirmed: 'Proveedor confirmó la orden',
      in_transit: 'En tránsito',
      delivered: 'Entregado',
      closed: 'Cerrado',
      cancelled: 'Cancelado',
    }

    return descriptions[status] || `Estado actualizado a ${status}`
  }

  /**
   * Mapea PO de Prisma a tipo PurchaseOrder
   */
  private static mapPO(po: any): PurchaseOrder {
    return {
      id: po.id,
      requestId: po.requestId,
      quoteId: po.quoteId,
      supplierId: po.supplierId,
      clientId: po.clientId,
      status: po.status,
      poNumber: po.poNumber,
      totalAmount: po.totalAmount,
      timeline: po.timeline.map((event: any) => ({
        id: event.id,
        poId: event.poId,
        status: event.status,
        description: event.description,
        metadata: (event.metadata as Record<string, any>) || undefined,
        createdAt: event.createdAt,
      })),
      items: po.items.map((item: any) => ({
        id: item.id,
        poId: item.poId,
        specItemId: item.specItemId || undefined,
        name: item.name,
        description: item.description || undefined,
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal,
      })),
      paymentStatus: po.paymentStatus,
      paymentMethod: po.paymentMethod || undefined,
      paymentReference: po.paymentReference || undefined,
      paidAt: po.paidAt || undefined,
      estimatedDelivery: po.estimatedDelivery || undefined,
      actualDelivery: po.actualDelivery || undefined,
      deliveryAddress: po.deliveryAddress || undefined,
      createdAt: po.createdAt,
      updatedAt: po.updatedAt,
    }
  }
}

