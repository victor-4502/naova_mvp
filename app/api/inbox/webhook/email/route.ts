// API Endpoint: Webhook para Email

import { NextRequest, NextResponse } from 'next/server'
import { EmailProcessor } from '@/lib/services/inbox/EmailProcessor'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Verificar que es un webhook válido
    // TODO: Agregar verificación de firma
    
    // Identificar cliente desde el email
    const clientId = await EmailProcessor.identifyClient(body.from.email)
    
    // Procesar email incluso si no se encuentra cliente (clientId puede ser null)
    const newRequest = await EmailProcessor.processEmail(body, clientId || undefined)
    
    // Si no se encontró cliente, responder con mensaje genérico
    if (!clientId) {
      console.warn(`Cliente no encontrado para email: ${body.from.email}. Request creado sin cliente asignado.`)
      // TODO: Enviar respuesta genérica al email
      return NextResponse.json({ 
        received: true,
        message: 'Request creado sin cliente asignado. Se requiere asignación manual.',
        requestId: newRequest.id
      }, { status: 200 })
    }
    
    return NextResponse.json(
      {
        success: true,
        requestId: newRequest.id,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error en webhook Email:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    const errorStack = error instanceof Error ? error.stack : undefined
    console.error('Error details:', { errorMessage, errorStack })
    return NextResponse.json(
      { 
        error: 'Error al procesar webhook',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}

