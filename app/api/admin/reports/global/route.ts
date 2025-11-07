import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { subMonths, format } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    const userRole = request.headers.get('x-user-role')
    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      )
    }

    // Get date range from query params (default: last 12 months)
    const { searchParams } = new URL(request.url)
    const months = parseInt(searchParams.get('months') || '12')
    const startDate = subMonths(new Date(), months)

    // 1. Total clients
    const totalClients = await prisma.user.count({
      where: { role: 'client', active: true },
    })

    // 2. Total volume (from purchase history)
    const totalVolume = await prisma.purchaseHistory.aggregate({
      where: {
        date: { gte: startDate },
      },
      _sum: {
        totalPrice: true,
      },
    })

    // 3. Total tenders
    const totalTenders = await prisma.tender.count()
    const activeTenders = await prisma.tender.count({
      where: { status: 'active' },
    })

    // 4. Average savings calculation
    // Get all purchase history with category averages
    const categoryAverages = await prisma.purchaseHistory.groupBy({
      by: ['category'],
      where: {
        date: { gte: startDate },
      },
      _avg: {
        unitPrice: true,
      },
    })

    // Get best tender prices by category
    const tendersByCategory = await prisma.tender.findMany({
      where: {
        status: 'closed',
        requirement: {
          category: {
            in: categoryAverages.map(c => c.category),
          },
        },
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

    // Calculate savings
    let totalSavings = 0
    const savingsByCategory: Record<string, number> = {}

    categoryAverages.forEach(cat => {
      const avgPrice = cat._avg.unitPrice || 0
      const tenders = tendersByCategory.filter(
        t => t.requirement.category === cat.category
      )
      
      tenders.forEach(tender => {
        if (tender.offers[0]) {
          const bestPrice = tender.offers[0].price
          const saving = (avgPrice - bestPrice) * tender.requirement.quantity
          if (saving > 0) {
            totalSavings += saving
            savingsByCategory[cat.category] = 
              (savingsByCategory[cat.category] || 0) + saving
          }
        }
      })
    })

    // 5. Top providers
    const topProviders = await prisma.provider.findMany({
      take: 5,
      orderBy: {
        rating: 'desc',
      },
      include: {
        _count: {
          select: {
            offers: true,
            purchaseHistory: true,
          },
        },
      },
    })

    // 6. Monthly volume trend
    const monthlyData = await prisma.purchaseHistory.groupBy({
      by: ['date'],
      where: {
        date: { gte: startDate },
      },
      _sum: {
        totalPrice: true,
      },
      _count: true,
      orderBy: {
        date: 'asc',
      },
    })

    // Group by month
    const monthlyVolume = monthlyData.reduce((acc: any[], item) => {
      const month = format(new Date(item.date), 'yyyy-MM')
      const existing = acc.find(x => x.month === month)
      
      if (existing) {
        existing.volume += item._sum.totalPrice || 0
        existing.count += item._count
      } else {
        acc.push({
          month,
          volume: item._sum.totalPrice || 0,
          count: item._count,
        })
      }
      
      return acc
    }, [])

    // 7. Category breakdown
    const categoryBreakdown = await prisma.purchaseHistory.groupBy({
      by: ['category'],
      where: {
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
      take: 10,
    })

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalClients,
          totalVolume: totalVolume._sum.totalPrice || 0,
          totalTenders,
          activeTenders,
          totalSavings,
        },
        savingsByCategory,
        topProviders: topProviders.map(p => ({
          id: p.id,
          name: p.name,
          category: p.category,
          rating: p.rating,
          offersCount: p._count.offers,
          purchasesCount: p._count.purchaseHistory,
        })),
        monthlyVolume,
        categoryBreakdown: categoryBreakdown.map(c => ({
          category: c.category,
          volume: c._sum.totalPrice || 0,
          count: c._count,
        })),
      },
    })
  } catch (error) {
    console.error('Get global reports error:', error)
    return NextResponse.json(
      { error: 'Error al obtener reportes globales' },
      { status: 500 }
    )
  }
}

