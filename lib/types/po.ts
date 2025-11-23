// Type definitions for Purchase Order module

import { z } from 'zod'

export const POStatusSchema = z.enum([
  'approved_by_client',
  'purchase_order_created',
  'payment_pending',
  'payment_received',
  'supplier_confirmed',
  'in_transit',
  'delivered',
  'closed',
  'cancelled',
])

export const PaymentStatusSchema = z.enum([
  'pending',
  'processing',
  'completed',
  'failed',
  'refunded',
])

export type POStatus = z.infer<typeof POStatusSchema>
export type PaymentStatus = z.infer<typeof PaymentStatusSchema>

export interface PurchaseOrder {
  id: string
  requestId: string
  quoteId: string
  supplierId: string
  clientId: string
  status: POStatus
  poNumber: string
  totalAmount: number
  timeline: POTimelineEvent[]
  items: POItem[]
  paymentStatus: PaymentStatus
  paymentMethod?: string
  paymentReference?: string
  paidAt?: Date
  estimatedDelivery?: Date
  actualDelivery?: Date
  deliveryAddress?: string
  createdAt: Date
  updatedAt: Date
}

export interface POTimelineEvent {
  id: string
  poId: string
  status: POStatus
  description: string
  metadata?: Record<string, any>
  createdAt: Date
}

export interface POItem {
  id: string
  poId: string
  specItemId?: string
  name: string
  description?: string
  quantity: number
  unit: string
  unitPrice: number
  subtotal: number
}

