// API Endpoint: CRUD de Requests

import { NextRequest, NextResponse } from 'next/server'
import { InboxService } from '@/lib/services/inbox/InboxService'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const requests = await InboxService.getClientRequests(user.userId)

    return NextResponse.json({ requests }, { status: 200 })
  } catch (error) {
    console.error('Error al obtener requests:', error)
    return NextResponse.json(
      { error: 'Error al obtener requests' },
      { status: 500 }
    )
  }
}

