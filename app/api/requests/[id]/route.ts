// API Endpoint: Obtener un request específico

import { NextRequest, NextResponse } from 'next/server'
import { InboxService } from '@/lib/services/inbox/InboxService'
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

    const request = await InboxService.getRequestById(params.id)

    if (!request) {
      return NextResponse.json(
        { error: 'Request no encontrado' },
        { status: 404 }
      )
    }

    // Verificar que el request pertenece al usuario
    if (request.clientId !== user.userId && user.role !== 'admin_naova') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    return NextResponse.json({ request }, { status: 200 })
  } catch (error) {
    console.error('Error al obtener request:', error)
    return NextResponse.json(
      { error: 'Error al obtener request' },
      { status: 500 }
    )
  }
}

