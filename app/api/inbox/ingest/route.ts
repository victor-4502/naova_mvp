// API Endpoint: Ingestión manual de requests

import { NextRequest, NextResponse } from 'next/server'
import { InboxService } from '@/lib/services/inbox/InboxService'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { source, content, attachments, metadata } = body

    if (!source || !content) {
      return NextResponse.json(
        { error: 'source y content son requeridos' },
        { status: 400 }
      )
    }

    // Crear request
    const newRequest = await InboxService.createRequest({
      source,
      clientId: user.id,
      content,
      attachments,
      metadata,
    })

    return NextResponse.json(
      {
        success: true,
        request: newRequest,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error en ingest:', error)
    return NextResponse.json(
      { error: 'Error al procesar request' },
      { status: 500 }
    )
  }
}

