// @ts-nocheck
// TODO: Activar cuando el schema POS esté activo

// Geography Matcher - Matching por ubicación geográfica

import { prisma } from '@/lib/prisma'
import type { Supplier } from '@/lib/types/supplier'

export interface GeographyMatchResult {
  supplier: Supplier
  matchScore: number
  reasons: string[]
  distance?: number // km (si se puede calcular)
}

export class GeographyMatcher {
  /**
   * Encuentra proveedores por proximidad geográfica
   */
  static async matchByGeography(
    clientCity?: string,
    clientState?: string,
    clientCountry: string = 'México'
  ): Promise<GeographyMatchResult[]> {
    if (!clientCity && !clientState) {
      return []
    }

    // Buscar proveedores en la misma ubicación
    const whereClause: any = {
      status: 'active',
      verified: true,
      country: clientCountry,
    }

    if (clientState) {
      whereClause.state = clientState
    }

    if (clientCity) {
      whereClause.city = clientCity
    }

    const suppliers = await prisma.supplier.findMany({
      where: whereClause,
      include: {
        categories: true,
        score: true,
      },
    })

    // Calcular scores
    const results: GeographyMatchResult[] = suppliers.map((supplier) => {
      const matchScore = this.calculateGeographyScore(
        supplier,
        clientCity,
        clientState,
        clientCountry
      )
      const reasons = this.getMatchReasons(
        supplier,
        clientCity,
        clientState
      )

      return {
        supplier: this.mapSupplier(supplier),
        matchScore,
        reasons,
      }
    })

    // Ordenar por score descendente
    return results.sort((a, b) => b.matchScore - a.matchScore)
  }

  /**
   * Calcula el score de matching geográfico
   */
  private static calculateGeographyScore(
    supplier: any,
    clientCity?: string,
    clientState?: string,
    clientCountry?: string
  ): number {
    let score = 0

    // Mismo país
    if (supplier.country === clientCountry) {
      score += 30
    }

    // Mismo estado
    if (clientState && supplier.state === clientState) {
      score += 40
    }

    // Misma ciudad
    if (clientCity && supplier.city === clientCity) {
      score += 30
    }

    // Bonus por score del proveedor
    if (supplier.score && supplier.score.overallScore > 0) {
      score += supplier.score.overallScore * 0.1
    }

    return Math.min(score, 100)
  }

  /**
   * Obtiene las razones del match
   */
  private static getMatchReasons(
    supplier: any,
    clientCity?: string,
    clientState?: string
  ): string[] {
    const reasons: string[] = []

    if (clientCity && supplier.city === clientCity) {
      reasons.push(`Misma ciudad: ${supplier.city}`)
    } else if (clientState && supplier.state === clientState) {
      reasons.push(`Mismo estado: ${supplier.state}`)
    } else {
      reasons.push(`Ubicación: ${supplier.city || ''}, ${supplier.state || ''}`)
    }

    return reasons
  }

  /**
   * Mapea supplier de Prisma a tipo Supplier
   */
  private static mapSupplier(supplier: any): Supplier {
    return {
      id: supplier.id,
      name: supplier.name,
      companyName: supplier.companyName,
      email: supplier.email,
      phone: supplier.phone,
      website: supplier.website,
      address: supplier.address,
      city: supplier.city,
      state: supplier.state,
      country: supplier.country,
      zipCode: supplier.zipCode,
      categories: supplier.categories.map((c: any) => ({
        id: c.id,
        supplierId: c.supplierId,
        category: c.category,
        subcategory: c.subcategory,
      })),
      specialties: supplier.specialties,
      score: supplier.score
        ? {
            id: supplier.score.id,
            supplierId: supplier.score.supplierId,
            priceScore: supplier.score.priceScore,
            qualityScore: supplier.score.qualityScore,
            deliveryScore: supplier.score.deliveryScore,
            responseTimeScore: supplier.score.responseTimeScore,
            communicationScore: supplier.score.communicationScore,
            overallScore: supplier.score.overallScore,
            totalOrders: supplier.score.totalOrders,
            totalVolume: supplier.score.totalVolume,
            averageResponseTime: supplier.score.averageResponseTime,
            onTimeDeliveryRate: supplier.score.onTimeDeliveryRate,
            updatedAt: supplier.score.updatedAt,
          }
        : undefined,
      status: supplier.status,
      verified: supplier.verified,
      createdAt: supplier.createdAt,
      updatedAt: supplier.updatedAt,
    }
  }
}

