// API Endpoint: Obtener timeline de un PO

import { NextRequest, NextResponse } from 'next/server'
import { TrackingService } from '@/lib/services/purchase-orders/TrackingService'
import { getCurrentUser } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const tracking = await TrackingService.getTrackingInfo(params.id)

    if (!tracking) {
      return NextResponse.json(
        { error: 'Purchase Order no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ tracking }, { status: 200 })
  } catch (error) {
    console.error('Error al obtener timeline:', error)
    return NextResponse.json(
      { error: 'Error al obtener timeline' },
      { status: 500 }
    )
  }
}

