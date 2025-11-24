// @ts-nocheck
// TODO: Activar cuando el schema POS esté activo

// Payment Service - Gestiona pagos de Purchase Orders

import { prisma } from '@/lib/prisma'
import type { PaymentStatus } from '@/lib/types/po'
import { PurchaseOrderService } from './PurchaseOrderService'

export interface PaymentInput {
  poId: string
  amount: number
  paymentMethod: string
  paymentReference: string
  metadata?: Record<string, any>
}

export class PaymentService {
  /**
   * Registra un pago
   */
  static async recordPayment(input: PaymentInput): Promise<void> {
    const po = await prisma.purchaseOrder.findUnique({
      where: { id: input.poId },
    })

    if (!po) {
      throw new Error('Purchase Order no encontrado')
    }

    // Verificar que el monto coincide
    if (Math.abs(input.amount - po.totalAmount) > 0.01) {
      throw new Error(
        `El monto del pago (${input.amount}) no coincide con el total del PO (${po.totalAmount})`
      )
    }

    // Actualizar estado de pago
    await prisma.purchaseOrder.update({
      where: { id: input.poId },
      data: {
        paymentStatus: 'completed',
        paymentMethod: input.paymentMethod,
        paymentReference: input.paymentReference,
        paidAt: new Date(),
      },
    })

    // Avanzar estado del PO
    await PurchaseOrderService.updatePOStatus(
      input.poId,
      'payment_received',
      `Pago recibido: ${input.paymentMethod} - ${input.paymentReference}`
    )
  }

  /**
   * Marca un pago como procesando
   */
  static async markPaymentProcessing(poId: string): Promise<void> {
    await prisma.purchaseOrder.update({
      where: { id: poId },
      data: {
        paymentStatus: 'processing',
      },
    })
  }

  /**
   * Marca un pago como fallido
   */
  static async markPaymentFailed(poId: string, reason?: string): Promise<void> {
    await prisma.purchaseOrder.update({
      where: { id: poId },
      data: {
        paymentStatus: 'failed',
      },
    })

    // Agregar al timeline
    await PurchaseOrderService.updatePOStatus(
      poId,
      'payment_pending',
      `Pago fallido${reason ? `: ${reason}` : ''}`
    )
  }
}

