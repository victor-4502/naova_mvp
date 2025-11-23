// API Endpoint: Procesar automatizaciones

import { NextRequest, NextResponse } from 'next/server'
import { AutomationEngine } from '@/lib/services/pipeline/AutomationEngine'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Solo admins pueden ejecutar automatizaciones manualmente
    if (user.role !== 'admin_naova') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const body = await request.json()
    const { requestId, processAll } = body

    if (processAll) {
      await AutomationEngine.processAllPending()
      return NextResponse.json(
        { success: true, message: 'Todos los requests procesados' },
        { status: 200 }
      )
    }

    if (!requestId) {
      return NextResponse.json(
        { error: 'requestId es requerido' },
        { status: 400 }
      )
    }

    await AutomationEngine.processRequest(requestId)

    return NextResponse.json(
      { success: true, message: 'Request procesado' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error al procesar automatización:', error)
    return NextResponse.json(
      { error: error.message || 'Error al procesar automatización' },
      { status: 500 }
    )
  }
}

