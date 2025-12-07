// API Endpoint: Webhook para WhatsApp

import { NextRequest, NextResponse } from 'next/server'
import { WhatsAppProcessor } from '@/lib/services/inbox/WhatsAppProcessor'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('[WhatsApp Webhook] Received payload:', JSON.stringify(body, null, 2))
    
    // El formato de Meta es: { object: 'whatsapp_business_account', entry: [...] }
    // Necesitamos extraer el mensaje real del formato de Meta
    if (body.object === 'whatsapp_business_account' && body.entry) {
      // Procesar cada entrada (entry)
      for (const entry of body.entry) {
        const changes = entry.changes || []
        
        for (const change of changes) {
          if (change.value?.messages) {
            // Procesar cada mensaje
            for (const message of change.value.messages) {
              const from = message.from // Número del remitente
              const to = entry.id || change.value.metadata?.phone_number_id // Número de destino (nuestro)
              const messageId = message.id
              const timestamp = message.timestamp
              
              // Identificar cliente
              const clientId = await WhatsAppProcessor.identifyClient(from)
              
              // Extraer contenido según el tipo de mensaje
              let content = ''
              let messageType: 'text' | 'image' | 'document' | 'audio' | 'video' = 'text'
              
              if (message.type === 'text' && message.text) {
                content = message.text.body
                messageType = 'text'
              } else if (message.type === 'image' && message.image) {
                content = message.image.caption || 'Imagen recibida'
                messageType = 'image'
              } else if (message.type === 'document' && message.document) {
                content = message.document.caption || 'Documento recibido'
                messageType = 'document'
              } else if (message.type === 'audio' && message.audio) {
                content = 'Audio recibido'
                messageType = 'audio'
              } else if (message.type === 'video' && message.video) {
                content = message.video.caption || 'Video recibido'
                messageType = 'video'
              }
              
              if (!content && message.type !== 'text') {
                content = `${message.type} recibido` // Por lo menos algún contenido
              }
              
              // Procesar mensaje con formato esperado por WhatsAppProcessor
              const webhookPayload = {
                from,
                to: to || 'unknown',
                message: {
                  id: messageId,
                  type: messageType,
                  text: message.type === 'text' ? message.text : undefined,
                  image: message.type === 'image' ? message.image : undefined,
                  document: message.type === 'document' ? message.document : undefined,
                },
                timestamp: timestamp?.toString() || Date.now().toString(),
              }
              
              // Procesar mensaje incluso si no se encuentra cliente (clientId puede ser null)
              const newRequest = await WhatsAppProcessor.processWebhook(
                webhookPayload as any,
                clientId || undefined
              )
              
              // Si no se encontró cliente, log warning
              if (!clientId) {
                console.warn(
                  `[WhatsApp Webhook] Cliente no encontrado para WhatsApp: ${from}. Request creado sin cliente asignado.`
                )
              }
              
              console.log('[WhatsApp Webhook] Message processed:', {
                messageId,
                from,
                clientId,
                requestId: newRequest.id,
              })
            }
          }
        }
      }
      
      return NextResponse.json(
        {
          success: true,
          message: 'Webhook procesado correctamente',
        },
        { status: 200 }
      )
    } else {
      // Formato antiguo (para compatibilidad)
      // Identificar cliente
      const clientId = await WhatsAppProcessor.identifyClient(body.from)
      
      // Procesar mensaje incluso si no se encuentra cliente (clientId puede ser null)
      const newRequest = await WhatsAppProcessor.processWebhook(body, clientId || undefined)
      
      // Si no se encontró cliente, responder con mensaje genérico
      if (!clientId) {
        console.warn(
          `[WhatsApp Webhook] Cliente no encontrado para WhatsApp: ${body.from}. Request creado sin cliente asignado.`
        )
      }
      
      return NextResponse.json(
        {
          success: true,
          requestId: newRequest.id,
        },
        { status: 200 }
      )
    }
  } catch (error) {
    console.error('[WhatsApp Webhook] Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    const errorStack = error instanceof Error ? error.stack : undefined
    console.error('[WhatsApp Webhook] Error details:', { errorMessage, errorStack })
    return NextResponse.json(
      {
        error: 'Error al procesar webhook',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    )
  }
}

// GET para verificación de webhook (Meta requiere esto)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')
  
  console.log('[WhatsApp Webhook] Verification request:', { 
    mode, 
    token: token ? '***' : 'none', 
    challenge,
    expectedToken: process.env.WHATSAPP_VERIFY_TOKEN ? '***' : 'not set'
  })
  
  // Verificar token con variable de entorno
  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log('[WhatsApp Webhook] Verification successful')
    // Meta espera el challenge como texto plano, no JSON
    // IMPORTANTE: Debe ser texto plano, no JSON
    return new NextResponse(challenge || '', { 
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  }
  
  console.warn('[WhatsApp Webhook] Verification failed', {
    modeMatch: mode === 'subscribe',
    tokenMatch: token === process.env.WHATSAPP_VERIFY_TOKEN,
    hasToken: !!token,
    hasExpectedToken: !!process.env.WHATSAPP_VERIFY_TOKEN,
  })
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

