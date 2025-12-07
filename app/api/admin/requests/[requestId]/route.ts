import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/requests/[requestId]
 * Obtiene un request específico con todos sus mensajes
 */
export async function GET(
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

    const requestData = await prisma.request.findUnique({
      where: { id: params.requestId },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            attachments: {
              select: {
                id: true,
                filename: true,
                mimeType: true,
                size: true,
                url: true,
              },
            },
          },
        },
        attachments: {
          select: {
            id: true,
            filename: true,
            mimeType: true,
            size: true,
            url: true,
          },
        },
      },
    })

    if (!requestData) {
      return NextResponse.json({ error: 'Request no encontrado' }, { status: 404 })
    }

    const normalized = (requestData.normalizedContent as any) || {}
    const rules = normalized.rules || null

    return NextResponse.json(
      {
        request: {
          id: requestData.id,
          source: requestData.source,
          clientId: requestData.clientId,
          status: requestData.status,
          pipelineStage: requestData.pipelineStage,
          rawContent: requestData.rawContent,
          category: requestData.category,
          urgency: requestData.urgency,
          createdAt: requestData.createdAt.toISOString(),
          updatedAt: requestData.updatedAt.toISOString(),
          client: requestData.client,
          rules,
          messages: requestData.messages.map((msg) => ({
            id: msg.id,
            source: msg.source,
            direction: msg.direction,
            content: msg.content,
            from: msg.from,
            to: msg.to,
            subject: msg.subject,
            processed: msg.processed,
            processedAt: msg.processedAt?.toISOString() || null,
            createdAt: msg.createdAt.toISOString(),
            attachments: msg.attachments,
          })),
          attachments: requestData.attachments,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error al obtener request:', error)
    return NextResponse.json(
      {
        error: 'Error al obtener request',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : undefined) : undefined,
      },
      { status: 500 }
    )
  }
}

