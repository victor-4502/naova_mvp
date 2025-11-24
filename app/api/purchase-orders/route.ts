// API Endpoint: CRUD de Purchase Orders

import { NextRequest, NextResponse } from 'next/server'
import { PurchaseOrderService } from '@/lib/services/purchase-orders/PurchaseOrderService'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { requestId, quoteId } = body

    if (!requestId || !quoteId) {
      return NextResponse.json(
        { error: 'requestId y quoteId son requeridos' },
        { status: 400 }
      )
    }

    // Crear PO
    const po = await PurchaseOrderService.createPO({
      requestId,
      quoteId,
      clientId: user.id,
    })

    return NextResponse.json({ po }, { status: 201 })
  } catch (error: any) {
    console.error('Error al crear PO:', error)
    return NextResponse.json(
      { error: error.message || 'Error al crear PO' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // TODO: Implementar listado de POs con filtros
    return NextResponse.json({ pos: [] }, { status: 200 })
  } catch (error) {
    console.error('Error al obtener POs:', error)
    return NextResponse.json(
      { error: 'Error al obtener POs' },
      { status: 500 }
    )
  }
}

