// API Endpoint: Webhook para Email

import { NextRequest, NextResponse } from 'next/server'
import { EmailProcessor } from '@/lib/services/inbox/EmailProcessor'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * Obtiene el contenido completo del email desde Resend API
 * Resend no envía el contenido en el webhook, hay que obtenerlo con una llamada API
 */
async function getEmailContentFromResend(emailId: string): Promise<{ text?: string; html?: string } | null> {
  const resendApiKey = process.env.RESEND_API_KEY
  
  if (!resendApiKey) {
    console.warn('[Email Webhook] RESEND_API_KEY no configurado, no se puede obtener el contenido del email')
    return null
  }

  try {
    console.log(`[Email Webhook] 📥 Obteniendo contenido del email desde Resend API, email_id: ${emailId}`)
    
    // Resend usa el endpoint específico para emails recibidos (receiving)
    const response = await fetch(`https://api.resend.com/emails/receiving/${emailId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[Email Webhook] Error al obtener email desde Resend: ${response.status} - ${errorText}`)
      return null
    }

    const emailData = await response.json()
    console.log('[Email Webhook] ✅ Contenido obtenido desde Resend:', {
      hasText: !!emailData.text,
      hasHtml: !!emailData.html,
      textLength: emailData.text?.length || 0,
      htmlLength: emailData.html?.length || 0,
    })

    return {
      text: emailData.text || emailData.body_text || undefined,
      html: emailData.html || emailData.body_html || undefined,
    }
  } catch (error) {
    console.error('[Email Webhook] Error al obtener contenido desde Resend API:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const body = await request.json()
    
    // Log completo del payload recibido para diagnóstico (ANTES de cualquier procesamiento)
    console.log('='.repeat(80))
    console.log('[Email Webhook] 📨 PAYLOAD COMPLETO RECIBIDO:')
    console.log(JSON.stringify(body, null, 2))
    console.log('='.repeat(80))
    console.log(`[Email Webhook] Tiempo inicio: ${startTime}ms`)
    
    // Análisis inmediato del payload
    console.log('[Email Webhook] 🔍 ANÁLISIS INMEDIATO:')
    console.log('  - body.from:', body.from)
    console.log('  - body.data:', !!body.data)
    console.log('  - body.payload:', !!body.payload)
    console.log('  - body.text:', body.text ? `${body.text.substring(0, 50)}... (${body.text.length} chars)` : '(vacío)')
    console.log('  - body.html:', body.html ? `${body.html.substring(0, 50)}... (${body.html.length} chars)` : '(vacío)')
    console.log('  - body.subject:', body.subject)
    
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
    
    // ⚠️ DIAGNÓSTICO: Si no hay contenido, buscar en campos alternativos
    if (!normalizedPayload.text && !normalizedPayload.html) {
      console.warn('[Email Webhook] ⚠️ CONTENIDO NO ENCONTRADO EN PAYLOAD')
      console.log('[Email Webhook] Campos disponibles en body.data:', Object.keys(body.data || {}))
      console.log('[Email Webhook] Buscando campos alternativos...')
      
      // Buscar en campos alternativos que Resend puede usar
      const data = body.data || {}
      if (data.body) {
        console.log('[Email Webhook] ✅ Encontrado body:', typeof data.body)
        normalizedPayload.text = typeof data.body === 'string' ? data.body : data.body.text || ''
        normalizedPayload.html = typeof data.body === 'object' ? data.body.html : ''
      }
      if (data.content) {
        console.log('[Email Webhook] ✅ Encontrado content:', typeof data.content)
        normalizedPayload.text = typeof data.content === 'string' ? data.content : data.content.text || normalizedPayload.text
        normalizedPayload.html = typeof data.content === 'object' ? data.content.html : normalizedPayload.html
      }
      if (data.body_text) {
        console.log('[Email Webhook] ✅ Encontrado body_text')
        normalizedPayload.text = data.body_text
      }
      if (data.body_html) {
        console.log('[Email Webhook] ✅ Encontrado body_html')
        normalizedPayload.html = data.body_html
      }
      if (data.message) {
        console.log('[Email Webhook] ✅ Encontrado message:', typeof data.message)
        if (typeof data.message === 'string') {
          normalizedPayload.text = data.message
        } else {
          normalizedPayload.text = data.message.text || normalizedPayload.text
          normalizedPayload.html = data.message.html || normalizedPayload.html
        }
      }
      
      console.log('[Email Webhook] Después de buscar campos alternativos:', {
        hasText: !!normalizedPayload.text && normalizedPayload.text.length > 0,
        hasHtml: !!normalizedPayload.html && normalizedPayload.html.length > 0,
        textLength: normalizedPayload.text?.length || 0,
        htmlLength: normalizedPayload.html?.length || 0,
      })
      
      // Si aún no hay contenido, intentar obtenerlo desde Resend API
      if (!normalizedPayload.text && !normalizedPayload.html) {
        const data = body.data || {}
        const emailId = data.email_id || body.email_id
        
        if (emailId) {
          console.log(`[Email Webhook] 🔄 Obteniendo contenido desde Resend API usando email_id: ${emailId}`)
          const emailContent = await getEmailContentFromResend(emailId)
          
          if (emailContent) {
            normalizedPayload.text = emailContent.text || normalizedPayload.text
            normalizedPayload.html = emailContent.html || normalizedPayload.html
            console.log('[Email Webhook] ✅ Contenido obtenido desde API:', {
              hasText: !!normalizedPayload.text && normalizedPayload.text.length > 0,
              hasHtml: !!normalizedPayload.html && normalizedPayload.html.length > 0,
              textLength: normalizedPayload.text?.length || 0,
              htmlLength: normalizedPayload.html?.length || 0,
            })
          } else {
            console.warn('[Email Webhook] ⚠️ No se pudo obtener el contenido desde Resend API')
          }
        } else {
          console.warn('[Email Webhook] ⚠️ No se encontró email_id en el payload para obtener el contenido')
        }
      }
    }
    
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

