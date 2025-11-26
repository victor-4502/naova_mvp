import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const requirementSchema = z.object({
  title: z.string().min(3, 'T├¡tulo debe tener al menos 3 caracteres'),
  category: z.string().min(1, 'Categor├¡a es requerida'),
  description: z.string().min(10, 'Descripci├│n debe tener al menos 10 caracteres'),
  quantity: z.number().positive('Cantidad debe ser positiva'),
  unit: z.string().min(1, 'Unidad es requerida'),
  fileUrl: z.string().optional(),
})

// GET - List requirements
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

    // Clients see only their requirements, admins see all
    const where = userRole === 'admin' 
      ? {}
      : { clientId: userId }

    const requirements = await prisma.requirement.findMany({
      where,
      include: {
        client: {
          select: {
            name: true,
            email: true,
            company: true,
          },
        },
        tender: {
          select: {
            id: true,
            status: true,
            startAt: true,
            endAt: true,
            _count: {
              select: {
                offers: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      requirements,
    })
  } catch (error) {
    console.error('Get requirements error:', error)
    return NextResponse.json(
      { error: 'Error al obtener requerimientos' },
      { status: 500 }
    )
  }
}

// POST - Create requirement
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    const userRole = request.headers.get('x-user-role')

    if (!userId || userRole !== 'client') {
      return NextResponse.json(
        { error: 'Solo clientes pueden crear requerimientos' },
        { status: 403 }
      )
    }

    const body = await request.json()
    
    // Validate input
    const validation = requirementSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos inv├ílidos', details: validation.error.errors },
        { status: 400 }
      )
    }

    const data = validation.data

    // Create requirement
    const requirement = await prisma.requirement.create({
      data: {
        clientId: userId,
        title: data.title,
        category: data.category,
        description: data.description,
        quantity: data.quantity,
        unit: data.unit,
        fileUrl: data.fileUrl,
        status: 'pending',
      },
      include: {
        client: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'create_requirement',
        userId,
        metadata: {
          requirementId: requirement.id,
          title: requirement.title,
        },
      },
    })

    // TODO: Send notification to admin
    // await sendRequirementNotification(adminEmail, requirement.client.name, requirement.title)

    return NextResponse.json(
      {
        success: true,
        message: 'Requerimiento creado exitosamente',
        requirement,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create requirement error:', error)
    return NextResponse.json(
      { error: 'Error al crear requerimiento' },
      { status: 500 }
    )
  }
}

