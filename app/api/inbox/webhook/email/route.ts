// API Endpoint: Webhook para Email

import { NextRequest, NextResponse } from 'next/server'
import { EmailProcessor } from '@/lib/services/inbox/EmailProcessor'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const body = await request.json()
    
    // Log completo del payload recibido para diagnóstico
    console.log('[Email Webhook] Received payload:', JSON.stringify(body, null, 2))
    console.log(`[Email Webhook] Tiempo inicio: ${startTime}ms`)
    
    // Verificar que es un webhook válido
    // TODO: Agregar verificación de firma
    
    // Resend puede enviar el formato de diferentes maneras
    // Normalizar el formato del payload
    let normalizedPayload: {
      from: { email: string; name?: string }
      to: string[]
      subject: string
      text: string
      html?: string
      messageId: string
      timestamp: string
      attachments?: Array<{
        filename: string
        mimeType: string
        size: number
        url: string
      }>
    }
    
    // Caso 1: Formato directo (lo que esperamos)
    if (body.from && (body.from.email || typeof body.from === 'string')) {
      normalizedPayload = {
        from: typeof body.from === 'string' 
          ? { email: body.from }
          : { email: body.from.email || '', name: body.from.name },
        to: Array.isArray(body.to) ? body.to : (body.to ? [body.to] : []),
        subject: body.subject || '',
        text: body.text || '',
        html: body.html,
        messageId: body.messageId || body.message_id || `email-${Date.now()}`,
        timestamp: body.timestamp || body.created_at || new Date().toISOString(),
        attachments: body.attachments,
      }
    }
    // Caso 2: Formato Resend con "data"
    else if (body.data) {
      const data = body.data
      // Resend puede enviar 'from' como string o como objeto
      const fromEmail = typeof data.from === 'string' 
        ? data.from 
        : (data.from?.email || data.from || '')
      
      normalizedPayload = {
        from: typeof data.from === 'string' 
          ? { email: data.from }
          : { 
              email: data.from?.email || data.from || '', 
              name: data.from?.name 
            },
        to: Array.isArray(data.to) ? data.to : (data.to ? [data.to] : []),
        subject: data.subject || '',
        text: data.text || '',
        html: data.html,
        messageId: data.messageId || data.message_id || `email-${Date.now()}`,
        timestamp: data.timestamp || data.created_at || new Date().toISOString(),
        attachments: data.attachments,
      }
    }
    // Caso 3: Formato Resend con "payload"
    else if (body.payload) {
      const payload = body.payload
      normalizedPayload = {
        from: typeof payload.from === 'string'
          ? { email: payload.from }
          : { 
              email: payload.from?.email || payload.from || '', 
              name: payload.from?.name 
            },
        to: Array.isArray(payload.to) ? payload.to : (payload.to ? [payload.to] : []),
        subject: payload.subject || '',
        text: payload.text || '',
        html: payload.html,
        messageId: payload.messageId || payload.message_id || `email-${Date.now()}`,
        timestamp: payload.timestamp || payload.created_at || new Date().toISOString(),
        attachments: payload.attachments,
      }
    }
    // Caso 4: Formato con campos directos pero sin 'from' como objeto
    else if (body.from || body.sender || body['from-email']) {
      // Intentar extraer el email de diferentes campos posibles
      const fromEmail = body.from || body.sender || body['from-email'] || body['from_email'] || ''
      normalizedPayload = {
        from: typeof fromEmail === 'string' 
          ? { email: fromEmail }
          : { email: fromEmail?.email || fromEmail || '', name: fromEmail?.name },
        to: Array.isArray(body.to) ? body.to : (body.to ? [body.to] : []),
        subject: body.subject || '',
        text: body.text || '',
        html: body.html,
        messageId: body.messageId || body.message_id || body.id || `email-${Date.now()}`,
        timestamp: body.timestamp || body.created_at || body.date || new Date().toISOString(),
        attachments: body.attachments,
      }
    }
    // Formato no reconocido
    else {
      console.error('[Email Webhook] Formato no reconocido:', JSON.stringify(body, null, 2))
      return NextResponse.json(
        {
          error: 'Formato de webhook no reconocido',
          received: body,
          details: 'El payload no coincide con ningún formato conocido. Verifica la documentación de Resend.',
        },
        { status: 400 }
      )
    }
    
    // Validar que tenemos al menos un email de origen
    if (!normalizedPayload.from.email || normalizedPayload.from.email.trim().length === 0) {
      console.error('[Email Webhook] Email de origen no encontrado en payload:', JSON.stringify(body, null, 2))
      return NextResponse.json(
        {
          error: 'Email de origen no encontrado',
          received: body,
          details: 'No se pudo extraer el email del remitente del payload.',
        },
        { status: 400 }
      )
    }
    
    console.log('[Email Webhook] Normalized payload:', JSON.stringify(normalizedPayload, null, 2))
    console.log('[Email Webhook] 🔍 Análisis del contenido:', {
      hasSubject: !!normalizedPayload.subject,
      hasText: !!normalizedPayload.text && normalizedPayload.text.length > 0,
      hasHtml: !!normalizedPayload.html && normalizedPayload.html.length > 0,
      textLength: normalizedPayload.text?.length || 0,
      htmlLength: normalizedPayload.html?.length || 0,
      textPreview: normalizedPayload.text?.substring(0, 100) || '(vacío)',
      htmlPreview: normalizedPayload.html?.substring(0, 100) || '(vacío)',
    })
    
    // Verificar si este mensaje ya fue procesado (prevenir duplicados)
    if (normalizedPayload.messageId) {
      const existingMessage = await prisma.message.findFirst({
        where: {
          sourceId: normalizedPayload.messageId,
          source: 'email',
        },
      })
      
      if (existingMessage) {
        console.log(`[Email Webhook] Mensaje ya procesado, ignorando duplicado: ${normalizedPayload.messageId}`)
        return NextResponse.json(
          {
            success: true,
            message: 'Mensaje ya procesado (duplicado ignorado)',
            requestId: existingMessage.requestId,
          },
          { status: 200 }
        )
      }
    }
    
    const identifyStart = Date.now()
    // Identificar cliente desde el email
    const clientId = await EmailProcessor.identifyClient(normalizedPayload.from.email)
    console.log(`[Email Webhook] Tiempo identificar cliente: ${Date.now() - identifyStart}ms`)
    
    const processStart = Date.now()
    // Procesar email incluso si no se encuentra cliente (clientId puede ser null)
    const newRequest = await EmailProcessor.processEmail(normalizedPayload, clientId || undefined)
    console.log(`[Email Webhook] Tiempo procesar email: ${Date.now() - processStart}ms`)
    
    const totalTime = Date.now() - startTime
    console.log(`[Email Webhook] ⏱️ Tiempo total de procesamiento: ${totalTime}ms`)
    
    // Si no se encontró cliente, responder con mensaje genérico
    if (!clientId) {
      console.warn(`Cliente no encontrado para email: ${normalizedPayload.from.email}. Request creado sin cliente asignado.`)
      // TODO: Enviar respuesta genérica al email
      return NextResponse.json({ 
        received: true,
        message: 'Request creado sin cliente asignado. Se requiere asignación manual.',
        requestId: newRequest.id,
        processingTime: totalTime
      }, { status: 200 })
    }
    
    return NextResponse.json(
      {
        success: true,
        requestId: newRequest.id,
        processingTime: totalTime
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

