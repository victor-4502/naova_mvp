// @ts-nocheck
// TODO: Activar cuando el schema POS esté activo

// Category Matcher - Matching por categoría

import { prisma } from '@/lib/prisma'
import type { Supplier } from '@/lib/types/supplier'

export interface CategoryMatchResult {
  supplier: Supplier
  matchScore: number
  reasons: string[]
}

export class CategoryMatcher {
  /**
   * Encuentra proveedores que coinciden con una categoría
   */
  static async matchByCategory(
    category: string,
    subcategory?: string
  ): Promise<CategoryMatchResult[]> {
    if (!category) {
      return []
    }

    // Buscar proveedores con esta categoría
    const suppliers = await prisma.supplier.findMany({
      where: {
        status: 'active',
        verified: true,
        categories: {
          some: {
            category,
            ...(subcategory && { subcategory }),
          },
        },
      },
      include: {
        categories: true,
        score: true,
      },
    })

    // Calcular score de matching
    const results: CategoryMatchResult[] = suppliers.map((supplier) => {
      const matchScore = this.calculateCategoryScore(
        supplier,
        category,
        subcategory
      )
      const reasons = this.getMatchReasons(supplier, category, subcategory)

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
   * Calcula el score de matching por categoría
   */
  private static calculateCategoryScore(
    supplier: any,
    category: string,
    subcategory?: string
  ): number {
    let score = 0

    // Score base si tiene la categoría
    const hasCategory = supplier.categories.some(
      (c: any) => c.category === category
    )
    if (hasCategory) {
      score += 50
    }

    // Score adicional si tiene la subcategoría exacta
    if (subcategory) {
      const hasSubcategory = supplier.categories.some(
        (c: any) => c.category === category && c.subcategory === subcategory
      )
      if (hasSubcategory) {
        score += 30
      }
    }

    // Score por especialidades
    if (supplier.specialties && supplier.specialties.includes(category)) {
      score += 20
    }

    // Bonus por score general del proveedor
    if (supplier.score && supplier.score.overallScore > 0) {
      score += supplier.score.overallScore * 0.1 // 10% del score general
    }

    return Math.min(score, 100) // Cap a 100
  }

  /**
   * Obtiene las razones del match
   */
  private static getMatchReasons(
    supplier: any,
    category: string,
    subcategory?: string
  ): string[] {
    const reasons: string[] = []

    const hasCategory = supplier.categories.some(
      (c: any) => c.category === category
    )
    if (hasCategory) {
      reasons.push(`Tiene experiencia en ${category}`)
    }

    if (subcategory) {
      const hasSubcategory = supplier.categories.some(
        (c: any) => c.category === category && c.subcategory === subcategory
      )
      if (hasSubcategory) {
        reasons.push(`Especializado en ${subcategory}`)
      }
    }

    if (supplier.specialties && supplier.specialties.includes(category)) {
      reasons.push(`Listado como especialidad`)
    }

    if (supplier.score && supplier.score.overallScore > 7) {
      reasons.push(`Alta calificación general`)
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

