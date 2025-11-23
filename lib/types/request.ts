// Type definitions for Request module

import { z } from 'zod'

export const RequestSourceSchema = z.enum([
  'whatsapp',
  'email',
  'web',
  'chat',
  'file',
  'api',
])

export const RequestStatusSchema = z.enum([
  'new_request',
  'incomplete_information',
  'ready_for_supplier_matching',
  'supplier_matching',
  'rfq_sent',
  'quotes_received',
  'selecting_quote',
  'quote_selected',
  'po_created',
  'in_progress',
  'delivered',
  'closed',
  'cancelled',
])

export const PipelineStageSchema = z.enum([
  'new_request',
  'needs_info',
  'finding_suppliers',
  'quotes_in_progress',
  'selecting_quote',
  'purchase_in_progress',
  'delivered',
  'closed',
])

export const UrgencyLevelSchema = z.enum(['low', 'normal', 'high', 'urgent'])

export type RequestSource = z.infer<typeof RequestSourceSchema>
export type RequestStatus = z.infer<typeof RequestStatusSchema>
export type PipelineStage = z.infer<typeof PipelineStageSchema>
export type UrgencyLevel = z.infer<typeof UrgencyLevelSchema>

export interface Request {
  id: string
  source: RequestSource
  sourceId?: string
  clientId: string
  status: RequestStatus
  pipelineStage: PipelineStage
  rawContent: string
  normalizedContent?: Record<string, any>
  category?: string
  subcategory?: string
  urgency: UrgencyLevel
  createdAt: Date
  updatedAt: Date
}

export interface SpecItem {
  id: string
  name: string
  description?: string
  category: string
  subcategory?: string
  quantity: number
  unit: string
  unitPrice?: number
  totalPrice?: number
  specifications?: Record<string, any>
  brand?: string
  model?: string
  sku?: string
  budget?: number
  deliveryDate?: Date
}

export interface RequestSpec {
  id: string
  requestId: string
  normalizedSpecs: Record<string, any>
  completeness: number // 0-1
  missingFields: string[]
  isValid: boolean
  validationErrors?: Record<string, any>
  items: SpecItem[]
}

