import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { WhatsAppService } from '@/lib/services/whatsapp/WhatsAppService'
import { EmailService } from '@/lib/services/email/EmailService'

export const dynamic = 'force-dynamic'

export async function PATCH(
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
      user.role !== 'admin_naova' &&
      user.role !== 'operator_naova'
    ) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const body = await request.json()
    const { enabled } = body as { enabled?: boolean }

    if (typeof enabled !== 'boolean') {
      return NextResponse.json(
        { error: 'Parámetro "enabled" inválido' },
        { status: 400 }
      )
    }

    // Leer normalizedContent actual
    const existing = await prisma.request.findUnique({
      where: { id: params.requestId },
      select: { normalizedContent: true },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Request no encontrado' },
        { status: 404 }
      )
    }

    const normalized = (existing.normalizedContent as any) || {}
    const currentRules = normalized.rules || {}

    const updatedNormalized = {
      ...normalized,
      rules: {
        ...currentRules,
        autoReplyEnabled: enabled,
      },
    }

    await prisma.request.update({
      where: { id: params.requestId },
      data: {
        normalizedContent: updatedNormalized as any,
      },
    })

    // Si se activa el auto-reply, buscar mensaje pendiente y enviarlo
    if (enabled) {
      try {
        // Buscar el último mensaje outbound no procesado de este request
        const pendingMessage = await prisma.message.findFirst({
          where: {
            requestId: params.requestId,
            direction: 'outbound',
            processed: false,
          },
          orderBy: {
            createdAt: 'desc',
          },
        })

        if (pendingMessage && pendingMessage.to && pendingMessage.to !== 'pendiente') {
          console.log('[Auto-Reply Toggle] Enviando mensaje pendiente:', pendingMessage.id)

          // Obtener información del request para determinar el canal
          const requestInfo = await prisma.request.findUnique({
            where: { id: params.requestId },
            select: { source: true },
          })

          const channel = requestInfo?.source

          // Enviar según el canal
          if (channel === 'whatsapp') {
            const result = await WhatsAppService.sendMessageWithFallback(
              pendingMessage.to,
              pendingMessage.content,
              'hello_world'
            )

            if (result.success && result.messageId) {
              await prisma.message.update({
                where: { id: pendingMessage.id },
                data: {
                  processed: true,
                  processedAt: new Date(),
                  sourceId: result.messageId,
                },
              })
              console.log('[Auto-Reply Toggle] Mensaje de WhatsApp enviado:', result.messageId)
            }
          } else if (channel === 'email') {
            // Obtener subject del mensaje o del request original
            const originalMessage = await prisma.message.findFirst({
              where: {
                requestId: params.requestId,
                direction: 'inbound',
              },
              orderBy: { createdAt: 'asc' },
            })

            const subject = pendingMessage.subject || originalMessage?.subject || `Requerimiento ${params.requestId}`

            const result = await EmailService.sendReply(
              pendingMessage.to,
              subject,
              pendingMessage.content,
              originalMessage?.sourceId || undefined
            )

            if (result.success && result.messageId) {
              await prisma.message.update({
                where: { id: pendingMessage.id },
                data: {
                  processed: true,
                  processedAt: new Date(),
                  sourceId: result.messageId,
                },
              })
              console.log('[Auto-Reply Toggle] Mensaje de Email enviado:', result.messageId)
            }
          }
        }
      } catch (error) {
        console.error('[Auto-Reply Toggle] Error al enviar mensaje pendiente:', error)
        // No fallar el toggle si hay error al enviar, solo loguear
      }
    }

    return NextResponse.json(
      { success: true, autoReplyEnabled: enabled },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error al actualizar auto-reply:', error)
    return NextResponse.json(
      { error: 'Error al actualizar auto-reply' },
      { status: 500 }
    )
  }
}


