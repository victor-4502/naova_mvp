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

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { content } = body as { content?: string }

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'El contenido del requerimiento es obligatorio' },
        { status: 400 }
      )
    }

    const newRequest = await InboxService.createRequest({
      source: 'web',
      clientId: user.userId,
      content,
      metadata: {
        createdFrom: 'web_form',
      },
    })

    return NextResponse.json(
      { success: true, request: newRequest },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error al crear request:', error)
    return NextResponse.json(
      { error: 'Error al crear request' },
      { status: 500 }
    )
  }
}

