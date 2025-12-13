import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { WhatsAppService } from '@/lib/services/whatsapp/WhatsAppService'
import { EmailService } from '@/lib/services/email/EmailService'

export const dynamic = 'force-dynamic'

/**
 * POST /api/admin/requests/[requestId]/messages/[messageId]/send
 * Envía un mensaje pendiente que ya existe en la base de datos
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { requestId: string; messageId: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Solo admins / operadores
    if (
      user.role !== 'admin_naova' &&
      user.role !== 'operator_naova'
    ) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    // Obtener el mensaje existente
    const message = await prisma.message.findUnique({
      where: { id: params.messageId },
      include: {
        request: {
          include: {
            client: {
              select: {
                id: true,
                email: true,
                phone: true,
              },
            },
            messages: {
              where: { direction: 'inbound' },
              orderBy: { createdAt: 'desc' },
              take: 1,
              select: {
                id: true,
                from: true,
                to: true,
                source: true,
                subject: true,
                sourceId: true,
              },
            },
          },
        },
      },
    })

    if (!message) {
      return NextResponse.json({ error: 'Mensaje no encontrado' }, { status: 404 })
    }

    // Verificar que el mensaje pertenece al request
    if (message.requestId !== params.requestId) {
      return NextResponse.json({ error: 'El mensaje no pertenece a este request' }, { status: 400 })
    }

    // Verificar que el mensaje es outbound
    if (message.direction !== 'outbound') {
      return NextResponse.json({ error: 'Solo se pueden enviar mensajes outbound' }, { status: 400 })
    }

    // Verificar que el mensaje no ha sido enviado ya
    if (message.processed) {
      return NextResponse.json({ error: 'El mensaje ya fue enviado' }, { status: 400 })
    }

    // Verificar que el request existe
    if (!message.request) {
      return NextResponse.json(
        { error: 'Request asociado no encontrado' },
        { status: 404 }
      )
    }

    const request = message.request // Guardar en variable para TypeScript

    // Obtener contacto del destinatario
    const toContact = message.to || request.messages[0]?.from || request.client?.email || request.client?.phone

    if (!toContact || toContact === 'pendiente') {
      return NextResponse.json(
        { error: 'No se pudo determinar el contacto para enviar el mensaje' },
        { status: 400 }
      )
    }

    // Intentar enviar según el canal
    let sendResult: { success: boolean; messageId?: string; error?: string } | null = null

    if (message.source === 'whatsapp') {
      try {
        console.log('[Send Message] Attempting to send WhatsApp message:', {
          messageId: message.id,
          to: toContact,
        })
        
        const result = await WhatsAppService.sendMessageWithFallback(
          toContact,
          message.content,
          'hello_world' // Template de respaldo
        )

        sendResult = {
          success: result.success,
          messageId: result.messageId,
          error: result.error,
        }

        if (result.success && result.messageId) {
          await prisma.message.update({
            where: { id: message.id },
            data: {
              processed: true,
              processedAt: new Date(),
              sourceId: result.messageId,
            },
          })
          console.log('[Send Message] WhatsApp message sent successfully:', result.messageId)
        } else {
          console.warn('[Send Message] WhatsApp message failed:', result.error)
        }
      } catch (error) {
        console.error('[Send Message] Error sending WhatsApp message:', error)
        sendResult = {
          success: false,
          error: error instanceof Error ? error.message : 'Error desconocido',
        }
      }
    } else if (message.source === 'email') {
      try {
        console.log('[Send Message] Attempting to send email:', {
          messageId: message.id,
          to: toContact,
        })
        
        // Obtener información del email original para threading
        const originalMessage = request.messages[0]
        const originalSubject = message.subject || originalMessage?.subject || `Requerimiento ${params.requestId}`
        
        const result = await EmailService.sendReply(
          toContact,
          originalSubject,
          message.content,
          originalMessage?.sourceId || undefined
        )

        sendResult = {
          success: result.success,
          messageId: result.messageId,
          error: result.error,
        }

        if (result.success && result.messageId) {
          await prisma.message.update({
            where: { id: message.id },
            data: {
              processed: true,
              processedAt: new Date(),
              sourceId: result.messageId,
              subject: originalSubject,
            },
          })
          console.log('[Send Message] Email sent successfully:', result.messageId)
        } else {
          console.warn('[Send Message] Email failed:', result.error)
        }
      } catch (error) {
        console.error('[Send Message] Error sending email:', error)
        sendResult = {
          success: false,
          error: error instanceof Error ? error.message : 'Error desconocido',
        }
      }
    } else {
      return NextResponse.json(
        { error: 'Este tipo de mensaje no se puede enviar (solo WhatsApp y Email)' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: sendResult.success,
        message: {
          id: message.id,
          processed: sendResult.success,
          processedAt: sendResult.success ? new Date().toISOString() : null,
          sourceId: sendResult.messageId,
        },
        error: sendResult.error,
      },
      { status: sendResult.success ? 200 : 500 }
    )
  } catch (error) {
    console.error('[Send Message] Error:', error)
    return NextResponse.json(
      {
        error: 'Error al enviar mensaje',
        details: process.env.NODE_ENV === 'development'
          ? (error instanceof Error ? error.message : 'Error desconocido')
          : undefined,
      },
      { status: 500 }
    )
  }
}

