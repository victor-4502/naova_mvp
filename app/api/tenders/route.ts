import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET - List tenders
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    const userRole = request.headers.get('x-user-role')

    if (!userId) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    // Get query params
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    // Build where clause
    let where: any = {}
    
    if (userRole === 'client') {
      // Clients see only their tenders
      where.requirement = {
        clientId: userId,
      }
    }
    
    if (status) {
      where.status = status
    }

    const tenders = await prisma.tender.findMany({
      where,
      include: {
        requirement: {
          select: {
            id: true,
            title: true,
            category: true,
            quantity: true,
            unit: true,
            description: true,
          },
        },
        offers: {
          include: {
            provider: {
              select: {
                id: true,
                name: true,
                category: true,
                rating: true,
              },
            },
          },
          orderBy: {
            price: 'asc',
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      tenders,
    })
  } catch (error) {
    console.error('Get tenders error:', error)
    return NextResponse.json(
      { error: 'Error al obtener licitaciones' },
      { status: 500 }
    )
  }
}
