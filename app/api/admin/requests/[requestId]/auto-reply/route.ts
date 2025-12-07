import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

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


