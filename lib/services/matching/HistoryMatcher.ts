// History Matcher - Matching por histórico de compras

import { prisma } from '@/lib/prisma'
import type { Supplier } from '@/lib/types/supplier'

export interface HistoryMatchResult {
  supplier: Supplier
  matchScore: number
  reasons: string[]
  historicalData: {
    totalOrders: number
    totalVolume: number
    lastOrderDate: Date | null
    averagePrice: number | null
  }
}

export class HistoryMatcher {
  /**
   * Encuentra proveedores basado en histórico de compras
   */
  static async matchByHistory(
    clientId: string,
    category?: string,
    itemName?: string
  ): Promise<HistoryMatchResult[]> {
    // Buscar histórico de compras
    const purchaseHistory = await prisma.purchaseHistory.findMany({
      where: {
        clientId,
        ...(category && { category }),
        ...(itemName && {
          item: {
            contains: itemName,
            mode: 'insensitive',
          },
        }),
        providerId: {
          not: null,
        },
      },
      include: {
        provider: {
          include: {
            categories: true,
            score: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    })

    // Agrupar por proveedor
    const supplierMap = new Map<string, any>()

    purchaseHistory.forEach((purchase) => {
      if (!purchase.providerId || !purchase.provider) return

      const supplierId = purchase.providerId
      if (!supplierMap.has(supplierId)) {
        supplierMap.set(supplierId, {
          supplier: purchase.provider,
          purchases: [],
          totalVolume: 0,
          totalOrders: 0,
          lastOrderDate: null,
          prices: [] as number[],
        })
      }

      const data = supplierMap.get(supplierId)!
      data.purchases.push(purchase)
      data.totalVolume += purchase.totalPrice
      data.totalOrders += 1
      if (purchase.unitPrice) {
        data.prices.push(purchase.unitPrice)
      }
      if (!data.lastOrderDate || purchase.date > data.lastOrderDate) {
        data.lastOrderDate = purchase.date
      }
    })

    // Calcular scores
    const results: HistoryMatchResult[] = Array.from(supplierMap.values()).map(
      (data) => {
        const matchScore = this.calculateHistoryScore(data)
        const reasons = this.getMatchReasons(data)
        const averagePrice =
          data.prices.length > 0
            ? data.prices.reduce((a, b) => a + b, 0) / data.prices.length
            : null

        return {
          supplier: this.mapSupplier(data.supplier),
          matchScore,
          reasons,
          historicalData: {
            totalOrders: data.totalOrders,
            totalVolume: data.totalVolume,
            lastOrderDate: data.lastOrderDate,
            averagePrice,
          },
        }
      }
    )

    // Ordenar por score descendente
    return results.sort((a, b) => b.matchScore - a.matchScore)
  }

  /**
   * Calcula el score basado en histórico
   */
  private static calculateHistoryScore(data: any): number {
    let score = 0

    // Score por número de órdenes
    if (data.totalOrders >= 10) {
      score += 40
    } else if (data.totalOrders >= 5) {
      score += 30
    } else if (data.totalOrders >= 2) {
      score += 20
    } else {
      score += 10
    }

    // Score por volumen total
    if (data.totalVolume >= 100000) {
      score += 30
    } else if (data.totalVolume >= 50000) {
      score += 20
    } else if (data.totalVolume >= 10000) {
      score += 10
    }

    // Score por recencia (más reciente = mejor)
    if (data.lastOrderDate) {
      const daysSinceLastOrder = Math.floor(
        (Date.now() - data.lastOrderDate.getTime()) / (1000 * 60 * 60 * 24)
      )
      if (daysSinceLastOrder < 30) {
        score += 20
      } else if (daysSinceLastOrder < 90) {
        score += 10
      } else if (daysSinceLastOrder < 180) {
        score += 5
      }
    }

    // Bonus por score del proveedor
    if (data.supplier.score && data.supplier.score.overallScore > 0) {
      score += data.supplier.score.overallScore * 0.1
    }

    return Math.min(score, 100)
  }

  /**
   * Obtiene las razones del match
   */
  private static getMatchReasons(data: any): string[] {
    const reasons: string[] = []

    if (data.totalOrders >= 5) {
      reasons.push(`${data.totalOrders} órdenes previas`)
    } else {
      reasons.push(`${data.totalOrders} orden(es) previa(s)`)
    }

    if (data.totalVolume >= 50000) {
      reasons.push(`Volumen histórico: ${data.totalVolume.toLocaleString()}`)
    }

    if (data.lastOrderDate) {
      const daysSince = Math.floor(
        (Date.now() - data.lastOrderDate.getTime()) / (1000 * 60 * 60 * 24)
      )
      if (daysSince < 30) {
        reasons.push('Compra reciente')
      } else if (daysSince < 90) {
        reasons.push('Compra en últimos 3 meses')
      }
    }

    if (data.supplier.score && data.supplier.score.overallScore > 7) {
      reasons.push('Alta calificación')
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

