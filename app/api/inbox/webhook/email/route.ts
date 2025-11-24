// API Endpoint: Webhook para Email

import { NextRequest, NextResponse } from 'next/server'
import { EmailProcessor } from '@/lib/services/inbox/EmailProcessor'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Verificar que es un webhook válido
    // TODO: Agregar verificación de firma
    
    // Identificar cliente desde el email
    const clientId = await EmailProcessor.identifyClient(body.from.email)
    
    if (!clientId) {
      // Cliente no encontrado
      console.warn(`Cliente no encontrado para email: ${body.from.email}`)
      return NextResponse.json({ received: true }, { status: 200 })
    }
    
    // Procesar email
    const newRequest = await EmailProcessor.processEmail(body, clientId)
    
    return NextResponse.json(
      {
        success: true,
        requestId: newRequest.id,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error en webhook Email:', error)
    return NextResponse.json(
      { error: 'Error al procesar webhook' },
      { status: 500 }
    )
  }
}

