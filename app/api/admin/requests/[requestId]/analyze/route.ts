import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { analyzeRequestOnly, applyRequestAction } from '@/lib/services/inbox/RequestManagementService'
import type { RequestStatus, PipelineStage } from '@/lib/types/request'

export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/requests/[requestId]/analyze
 * Analiza un request y retorna recomendaciones (sin aplicar acciones)
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

    if (user.role !== 'admin_naova' && user.role !== 'operator_naova') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const analysis = await analyzeRequestOnly(params.requestId)

    return NextResponse.json({
      success: true,
      analysis,
    }, { status: 200 })
  } catch (error) {
    console.error('Error analizando request:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/requests/[requestId]/analyze
 * Aplica una acción específica a un request (después de que el admin la revise)
 * Body: { action: 'close' | 'delete' | 'update_status', data?: { status?, pipelineStage? } }
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

    if (user.role !== 'admin_naova' && user.role !== 'operator_naova') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const body = await request.json()
    const { action, data } = body as {
      action: 'close' | 'delete' | 'update_status'
      data?: {
        status?: RequestStatus
        pipelineStage?: PipelineStage
        mergeWithRequestId?: string
      }
    }

    if (!action || !['close', 'delete', 'update_status'].includes(action)) {
      return NextResponse.json(
        { error: 'Acción inválida. Debe ser: close, delete o update_status' },
        { status: 400 }
      )
    }

    await applyRequestAction(params.requestId, action, data)

    return NextResponse.json({
      success: true,
      message: `Acción "${action}" aplicada exitosamente al request ${params.requestId}`,
    }, { status: 200 })
  } catch (error) {
    console.error('Error aplicando acción a request:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

