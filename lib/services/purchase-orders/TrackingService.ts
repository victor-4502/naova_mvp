// @ts-nocheck
// TODO: Activar cuando el schema POS esté activo

// Tracking Service - Rastrea estados de Purchase Orders

import { prisma } from '@/lib/prisma'
import type { POStatus } from '@/lib/types/po'

export interface TrackingInfo {
  currentStatus: POStatus
  nextStatus?: POStatus
  canAdvance: boolean
  timeline: Array<{
    status: POStatus
    description: string
    date: Date
  }>
  estimatedCompletion?: Date
}

export class TrackingService {
  /**
   * Obtiene información de tracking de un PO
   */
  static async getTrackingInfo(poId: string): Promise<TrackingInfo | null> {
    const po = await prisma.purchaseOrder.findUnique({
      where: { id: poId },
      include: {
        timeline: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!po) return null

    const nextStatus = this.getNextStatus(po.status)
    const canAdvance = !!nextStatus

    return {
      currentStatus: po.status as POStatus,
      nextStatus,
      canAdvance,
      timeline: po.timeline.map((event) => ({
        status: event.status as POStatus,
        description: event.description,
        date: event.createdAt,
      })),
      estimatedCompletion: po.estimatedDelivery || undefined,
    }
  }

  /**
   * Obtiene el siguiente estado posible
   */
  private static getNextStatus(currentStatus: POStatus): POStatus | undefined {
    const statusFlow: Record<POStatus, POStatus[]> = {
      approved_by_client: ['purchase_order_created'],
      purchase_order_created: ['payment_pending'],
      payment_pending: ['payment_received'],
      payment_received: ['supplier_confirmed'],
      supplier_confirmed: ['in_transit'],
      in_transit: ['delivered'],
      delivered: ['closed'],
      closed: [],
      cancelled: [],
    }

    const next = statusFlow[currentStatus]
    return next && next.length > 0 ? next[0] : undefined
  }

  /**
   * Avanza el estado de un PO al siguiente
   */
  static async advanceStatus(
    poId: string,
    metadata?: Record<string, any>
  ): Promise<boolean> {
    const tracking = await this.getTrackingInfo(poId)
    if (!tracking || !tracking.nextStatus) {
      return false
    }

    const { PurchaseOrderService } = await import('./PurchaseOrderService')
    await PurchaseOrderService.updatePOStatus(poId, tracking.nextStatus)

    return true
  }
}

