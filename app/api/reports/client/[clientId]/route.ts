import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { subMonths, format, startOfMonth } from 'date-fns'

export async function GET(
  request: NextRequest,
  { params }: { params: { clientId: string } }
) {
  try {
    const userId = request.headers.get('x-user-id')
    const userRole = request.headers.get('x-user-role')
    const { clientId } = params

    // Authorization: admin can see all, clients can only see their own
    if (userRole !== 'admin' && userId !== clientId) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      )
    }

    const startDate = subMonths(new Date(), 12)

    // ========================================
    // REPORTE 1: Ahorro Generado
    // ========================================
    
    // Get historical average prices by category
    const historicalAverages = await prisma.purchaseHistory.groupBy({
      by: ['category'],
      where: {
        clientId,
        date: { gte: startDate },
      },
      _avg: {
        unitPrice: true,
      },
    })

    // Get tenders for this client with best offers
    const clientTenders = await prisma.tender.findMany({
      where: {
        requirement: {
          clientId,
        },
        status: 'closed',
      },
      include: {
        requirement: true,
        offers: {
          orderBy: {
            price: 'asc',
          },
          take: 1,
        },
      },
    })

    // Calculate total savings
    let totalSavings = 0
    const savingsByCategory: Record<string, { savings: number; percentage: number }> = {}

    historicalAverages.forEach(cat => {
      const avgPrice = cat._avg.unitPrice || 0
      const relatedTenders = clientTenders.filter(
        t => t.requirement.category === cat.category
      )

      relatedTenders.forEach(tender => {
        if (tender.offers[0]) {
          const bestPrice = tender.offers[0].price
          const saving = (avgPrice - bestPrice) * tender.requirement.quantity
          
          if (saving > 0) {
            totalSavings += saving
            
            if (!savingsByCategory[cat.category]) {
              savingsByCategory[cat.category] = { savings: 0, percentage: 0 }
            }
            
            savingsByCategory[cat.category].savings += saving
            savingsByCategory[cat.category].percentage = 
              ((avgPrice - bestPrice) / avgPrice) * 100
          }
        }
      })
    })

    // ========================================
    // REPORTE 2: Top 5 Categorías de Gasto
    // ========================================
    
    const topCategories = await prisma.purchaseHistory.groupBy({
      by: ['category'],
      where: {
        clientId,
        date: { gte: startDate },
      },
      _sum: {
        totalPrice: true,
      },
      _count: true,
      orderBy: {
        _sum: {
          totalPrice: 'desc',
        },
      },
      take: 5,
    })

    // ========================================
    // REPORTE 3: Top 5 Proveedores
    // ========================================
    
    const topProviders = await prisma.purchaseHistory.groupBy({
      by: ['providerId'],
      where: {
        clientId,
        date: { gte: startDate },
        providerId: { not: null },
      },
      _sum: {
        totalPrice: true,
      },
      _count: true,
      orderBy: {
        _sum: {
          totalPrice: 'desc',
        },
      },
      take: 5,
    })

    // Get provider details
    const providerIds = topProviders
      .map(p => p.providerId)
      .filter(id => id !== null) as string[]

    const providers = await prisma.provider.findMany({
      where: {
        id: { in: providerIds },
      },
    })

    const topProvidersWithDetails = topProviders.map(tp => {
      const provider = providers.find(p => p.id === tp.providerId)
      return {
        providerId: tp.providerId,
        providerName: provider?.name || 'Desconocido',
        category: provider?.category,
        rating: provider?.rating || 0,
        totalSpent: tp._sum.totalPrice || 0,
        ordersCount: tp._count,
      }
    })

    // ========================================
    // REPORTE 4: Histórico de Compras (12 meses)
    // ========================================
    
    const monthlyPurchases = await prisma.purchaseHistory.findMany({
      where: {
        clientId,
        date: { gte: startDate },
      },
      select: {
        date: true,
        totalPrice: true,
      },
      orderBy: {
        date: 'asc',
      },
    })

    // Group by month
    const monthlyData: Record<string, { month: string; total: number; count: number }> = {}

    monthlyPurchases.forEach(purchase => {
      const monthKey = format(startOfMonth(new Date(purchase.date)), 'yyyy-MM')
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthKey,
          total: 0,
          count: 0,
        }
      }
      
      monthlyData[monthKey].total += purchase.totalPrice
      monthlyData[monthKey].count += 1
    })

    const historicalPurchases = Object.values(monthlyData).sort((a, b) => 
      a.month.localeCompare(b.month)
    )

    // ========================================
    // REPORTE 5: Comparativa Precio Promedio vs Mejor Precio
    // ========================================
    
    const priceComparison = historicalAverages.map(cat => {
      const relatedTenders = clientTenders.filter(
        t => t.requirement.category === cat.category
      )

      const bestPrices = relatedTenders
        .map(t => t.offers[0]?.price)
        .filter(p => p !== undefined) as number[]

      const avgBestPrice = bestPrices.length > 0
        ? bestPrices.reduce((a, b) => a + b, 0) / bestPrices.length
        : 0

      return {
        category: cat.category,
        avgHistoricalPrice: cat._avg.unitPrice || 0,
        avgBestPrice,
        savingsPercentage: cat._avg.unitPrice
          ? ((cat._avg.unitPrice - avgBestPrice) / cat._avg.unitPrice) * 100
          : 0,
      }
    })

    // ========================================
    // Insight Rápido
    // ========================================
    
    const currentMonth = format(new Date(), 'yyyy-MM')
    const thisMonthData = monthlyData[currentMonth]
    const lastMonthKey = format(subMonths(new Date(), 1), 'yyyy-MM')
    const lastMonthData = monthlyData[lastMonthKey]

    const monthSavingsPercentage = lastMonthData && thisMonthData
      ? ((lastMonthData.total - thisMonthData.total) / lastMonthData.total) * 100
      : 0

    const mostCompetitiveProvider = topProvidersWithDetails[0]

    const insight = {
      monthlySavings: monthSavingsPercentage > 0 
        ? `${monthSavingsPercentage.toFixed(1)}%`
        : 'N/A',
      topProvider: mostCompetitiveProvider?.providerName || 'N/A',
      totalSavingsThisYear: totalSavings,
    }

    // ========================================
    // Return All Reports
    // ========================================
    
    return NextResponse.json({
      success: true,
      data: {
        // Report 1: Savings
        savings: {
          total: totalSavings,
          byCategory: savingsByCategory,
        },
        
        // Report 2: Top Categories
        topCategories: topCategories.map(c => ({
          category: c.category,
          total: c._sum.totalPrice || 0,
          count: c._count,
        })),
        
        // Report 3: Top Providers
        topProviders: topProvidersWithDetails,
        
        // Report 4: Historical Purchases
        historicalPurchases,
        
        // Report 5: Price Comparison
        priceComparison,
        
        // Insight
        insight,
      },
    })
  } catch (error) {
    console.error('Get client reports error:', error)
    return NextResponse.json(
      { error: 'Error al obtener reportes' },
      { status: 500 }
    )
  }
}

