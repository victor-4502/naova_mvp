// API Endpoint: Mover request en el pipeline

import { NextRequest, NextResponse } from 'next/server'
import { PipelineService } from '@/lib/services/pipeline/PipelineService'
import { getCurrentUser } from '@/lib/auth'
import type { PipelineStage } from '@/lib/types/request'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Solo admins y operators pueden mover requests
    if (user.role !== 'admin_naova' && user.role !== 'operator_naova') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const body = await request.json()
    const { newStage } = body

    if (!newStage) {
      return NextResponse.json(
        { error: 'newStage es requerido' },
        { status: 400 }
      )
    }

    await PipelineService.moveRequest(params.id, newStage as PipelineStage)

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error('Error al mover request:', error)
    return NextResponse.json(
      { error: error.message || 'Error al mover request' },
      { status: 500 }
    )
  }
}

