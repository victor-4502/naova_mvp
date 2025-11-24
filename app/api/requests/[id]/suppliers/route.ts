// API Endpoint: Obtener proveedores sugeridos para un request

import { NextRequest, NextResponse } from 'next/server'
import { SupplierMatchingService } from '@/lib/services/matching/SupplierMatchingService'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Obtener request
    const requestRecord = await prisma.request.findUnique({
      where: { id: params.id },
      include: {
        specs: {
          include: {
            items: true,
          },
        },
      },
    })

    if (!requestRecord) {
      return NextResponse.json(
        { error: 'Request no encontrado' },
        { status: 404 }
      )
    }

    // Verificar permisos
    if (
      requestRecord.clientId !== user.userId &&
      user.role !== 'admin_naova' &&
      user.role !== 'operator_naova'
    ) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    // Obtener información del cliente para matching geográfico
    const client = await prisma.user.findUnique({
      where: { id: requestRecord.clientId },
    })

    // Preparar opciones de matching
    const matchingOptions = {
      category: requestRecord.category || undefined,
      subcategory: requestRecord.subcategory || undefined,
      clientId: requestRecord.clientId,
      clientCity: undefined, // TODO: Obtener de perfil del cliente
      clientState: undefined, // TODO: Obtener de perfil del cliente
      clientCountry: 'México',
      itemName:
        requestRecord.specs?.items[0]?.name || undefined,
      minScore: 30,
      limit: 10,
    }

    // Encontrar proveedores
    const suppliers = await SupplierMatchingService.findSuppliers(
      matchingOptions
    )

    return NextResponse.json({ suppliers }, { status: 200 })
  } catch (error) {
    console.error('Error al obtener proveedores:', error)
    return NextResponse.json(
      { error: 'Error al obtener proveedores' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { force } = body

    // Forzar nuevo matching (útil para refrescar resultados)
    const result = await GET(request, { params })

    return result
  } catch (error) {
    console.error('Error al forzar matching:', error)
    return NextResponse.json(
      { error: 'Error al forzar matching' },
      { status: 500 }
    )
  }
}

