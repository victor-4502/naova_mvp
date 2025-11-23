// API Endpoint: Webhook para WhatsApp

import { NextRequest, NextResponse } from 'next/server'
import { WhatsAppProcessor } from '@/lib/services/inbox/WhatsAppProcessor'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Verificar que es un webhook válido de WhatsApp
    // TODO: Agregar verificación de firma
    
    // Identificar cliente
    const clientId = await WhatsAppProcessor.identifyClient(body.from)
    
    if (!clientId) {
      // Cliente no encontrado, pero procesar igual para logging
      console.warn(`Cliente no encontrado para WhatsApp: ${body.from}`)
      return NextResponse.json({ received: true }, { status: 200 })
    }
    
    // Procesar mensaje
    const request = await WhatsAppProcessor.processWebhook(body, clientId)
    
    return NextResponse.json(
      {
        success: true,
        requestId: request.id,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error en webhook WhatsApp:', error)
    return NextResponse.json(
      { error: 'Error al procesar webhook' },
      { status: 500 }
    )
  }
}

// GET para verificación de webhook
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')
  
  // TODO: Verificar token con variable de entorno
  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return NextResponse.json(challenge, { status: 200 })
  }
  
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

