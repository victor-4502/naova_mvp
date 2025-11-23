// Type definitions for Supplier module

import { z } from 'zod'

export const SupplierStatusSchema = z.enum([
  'active',
  'inactive',
  'suspended',
  'pending_verification',
])

export type SupplierStatus = z.infer<typeof SupplierStatusSchema>

export interface Supplier {
  id: string
  name: string
  companyName: string
  email: string
  phone?: string
  website?: string
  address?: string
  city?: string
  state?: string
  country: string
  zipCode?: string
  categories: SupplierCategory[]
  specialties: string[]
  score?: SupplierScore
  status: SupplierStatus
  verified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface SupplierCategory {
  id: string
  supplierId: string
  category: string
  subcategory?: string
}

export interface SupplierScore {
  id: string
  supplierId: string
  priceScore: number
  qualityScore: number
  deliveryScore: number
  responseTimeScore: number
  communicationScore: number
  overallScore: number
  totalOrders: number
  totalVolume: number
  averageResponseTime?: number
  onTimeDeliveryRate: number
  updatedAt: Date
}

export interface SupplierMatch {
  supplier: Supplier
  score: number
  reasons: string[]
}

