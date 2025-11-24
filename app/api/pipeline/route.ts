// API Endpoint: Obtener pipeline

import { NextRequest, NextResponse } from 'next/server'
import { PipelineService } from '@/lib/services/pipeline/PipelineService'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Si es cliente, solo ver sus requests
    const clientId =
      user.role === 'client_enterprise' ? user.userId : undefined

    const pipeline = await PipelineService.getPipeline(clientId)

    return NextResponse.json({ pipeline }, { status: 200 })
  } catch (error) {
    console.error('Error al obtener pipeline:', error)
    return NextResponse.json(
      { error: 'Error al obtener pipeline' },
      { status: 500 }
    )
  }
}

