import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { WhatsAppService } from '@/lib/services/whatsapp/WhatsAppService'

export const dynamic = 'force-dynamic'

/**
 * POST /api/admin/requests/[requestId]/messages
 * Crea un nuevo mensaje de respuesta desde el admin
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { requestId: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Solo admins / operadores
    if (
      user.role !== 'ADMIN' &&
      user.role !== 'admin' &&
      user.role !== 'admin_naova' &&
      user.role !== 'operator_naova'
    ) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const body = await request.json()
    const { content } = body as { content?: string }

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'El contenido del mensaje es obligatorio' },
        { status: 400 }
      )
    }

    // Verificar que el request existe y obtener su información
    const requestData = await prisma.request.findUnique({
      where: { id: params.requestId },
      include: {
        client: {
          select: {
            id: true,
            email: true,
          },
        },
        messages: {
          where: { direction: 'inbound' },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    })

    if (!requestData) {
      return NextResponse.json({ error: 'Request no encontrado' }, { status: 404 })
    }

    // Determinar el source del mensaje (usar el mismo que el request)
    // MessageSource solo acepta: whatsapp, email, web, chat, system
    // RequestSource puede tener: whatsapp, email, web, chat, file, api
    const requestSource = String(requestData.source)
    let messageSource: 'whatsapp' | 'email' | 'web' | 'chat' | 'system' = 'web'
    
    console.log('[Create Message] Request source:', requestSource)
    
    if (requestSource === 'whatsapp') {
      messageSource = 'whatsapp'
    } else if (requestSource === 'email') {
      messageSource = 'email'
    } else if (requestSource === 'web') {
      messageSource = 'web'
    } else if (requestSource === 'chat') {
      messageSource = 'chat'
    } else if (requestSource === 'file' || requestSource === 'api') {
      messageSource = 'web' // Convertir file/api a web
    }
    // Si no coincide, usa 'web' como default (ya está asignado)

    // Obtener información de contacto del cliente si existe
    let toContact: string | null = null
    if (requestData.client) {
      // Intentar obtener el contacto del mensaje original
      const lastInboundMessage = requestData.messages[0]
      if (lastInboundMessage?.from) {
        toContact = lastInboundMessage.from
      } else if (requestData.client.email) {
        toContact = requestData.client.email
      }
    }

    // Obtener el "from" (remitente) - usar el email del admin o un valor por defecto
    const fromContact = user.email || user.name || 'Sistema Naova'

    // Crear el mensaje outbound
    const messageData = {
      requestId: params.requestId,
      source: messageSource,
      direction: 'outbound' as const,
      content: content.trim(),
      from: fromContact, // Campo requerido en la base de datos
      to: toContact,
      processed: false,
    }
    
    console.log('[Create Message] Creating message with:', {
      ...messageData,
      contentLength: messageData.content.length,
    })

    const newMessage = await prisma.message.create({
      data: messageData,
      include: {
        attachments: true,
      },
    })
    
    console.log('[Create Message] Message created successfully:', {
      id: newMessage.id,
      source: newMessage.source,
      direction: newMessage.direction,
    })

    // Si el mensaje es de WhatsApp, intentar enviarlo realmente
    let whatsappSendResult: { success: boolean; messageId?: string; error?: string } | null = null
    if (messageSource === 'whatsapp' && toContact) {
      try {
        console.log('[Create Message] Attempting to send WhatsApp message to:', toContact)
        
        // Intentar enviar mensaje de texto libre
        // Si falla (ventana de 24h cerrada), intentar con template
        const result = await WhatsAppService.sendMessageWithFallback(
          toContact,
          content.trim(),
          'hello_world' // Template de respaldo (puedes cambiarlo)
        )

        whatsappSendResult = {
          success: result.success,
          messageId: result.messageId,
          error: result.error,
        }

        // Actualizar el mensaje con el resultado
        if (result.success && result.messageId) {
          await prisma.message.update({
            where: { id: newMessage.id },
            data: {
              processed: true,
              processedAt: new Date(),
              sourceId: result.messageId, // Guardar el ID del mensaje de WhatsApp
            },
          })
          console.log('[Create Message] WhatsApp message sent and updated:', result.messageId)
        } else {
          console.warn('[Create Message] WhatsApp message failed to send:', result.error)
        }
      } catch (error) {
        console.error('[Create Message] Error sending WhatsApp message:', error)
        whatsappSendResult = {
          success: false,
          error: error instanceof Error ? error.message : 'Error desconocido',
        }
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: {
          id: newMessage.id,
          source: newMessage.source,
          direction: newMessage.direction,
          content: newMessage.content,
          to: newMessage.to,
          createdAt: newMessage.createdAt.toISOString(),
          processed: whatsappSendResult?.success || newMessage.processed,
        },
        ...(whatsappSendResult && {
          whatsapp: {
            sent: whatsappSendResult.success,
            messageId: whatsappSendResult.messageId,
            error: whatsappSendResult.error,
          },
        }),
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error al crear mensaje:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    const errorStack = error instanceof Error ? error.stack : undefined
    
    // Log detallado para diagnóstico
    console.error('Error completo:', {
      message: errorMessage,
      stack: errorStack,
      error: error,
    })

    // Si es un error de Prisma, puede haber más detalles
    if (error && typeof error === 'object' && 'code' in error) {
      console.error('Error de Prisma:', {
        code: (error as any).code,
        meta: (error as any).meta,
      })
    }

    return NextResponse.json(
      {
        error: 'Error al crear mensaje',
        details: process.env.NODE_ENV === 'development' 
          ? errorMessage 
          : 'Revisa los logs del servidor para más detalles',
        ...(process.env.NODE_ENV === 'development' && errorStack && { stack: errorStack }),
      },
      { status: 500 }
    )
  }
}

