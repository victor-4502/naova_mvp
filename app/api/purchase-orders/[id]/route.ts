// API Endpoint: Obtener y actualizar Purchase Order

import { NextRequest, NextResponse } from 'next/server'
import { PurchaseOrderService } from '@/lib/services/purchase-orders/PurchaseOrderService'
import { getCurrentUser } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const po = await PurchaseOrderService.getPO(params.id)

    if (!po) {
      return NextResponse.json(
        { error: 'Purchase Order no encontrado' },
        { status: 404 }
      )
    }

    // Verificar permisos
    if (
      po.clientId !== user.id &&
      user.role !== 'admin_naova' &&
      user.role !== 'operator_naova'
    ) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    return NextResponse.json({ po }, { status: 200 })
  } catch (error) {
    console.error('Error al obtener PO:', error)
    return NextResponse.json(
      { error: 'Error al obtener PO' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { status, description } = body

    if (!status) {
      return NextResponse.json(
        { error: 'status es requerido' },
        { status: 400 }
      )
    }

    // Solo admins y operators pueden actualizar estado
    if (user.role !== 'admin_naova' && user.role !== 'operator_naova') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const po = await PurchaseOrderService.updatePOStatus(
      params.id,
      status,
      description
    )

    return NextResponse.json({ po }, { status: 200 })
  } catch (error: any) {
    console.error('Error al actualizar PO:', error)
    return NextResponse.json(
      { error: error.message || 'Error al actualizar PO' },
      { status: 500 }
    )
  }
}

