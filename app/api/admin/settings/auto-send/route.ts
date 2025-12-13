import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { setGlobalAutoSendCache, isGlobalAutoSendEnabled } from '@/lib/utils/autoSendConfig'

export const dynamic = 'force-dynamic'

/**
 * GET: Obtener preferencia de envío automático global
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    if (user.role !== 'admin_naova' && user.role !== 'operator_naova') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    // Leer del cache compartido
    const enabled = isGlobalAutoSendEnabled()

    return NextResponse.json({ enabled }, { status: 200 })
  } catch (error) {
    console.error('Error al obtener preferencia:', error)
    return NextResponse.json(
      { error: 'Error al obtener preferencia' },
      { status: 500 }
    )
  }
}

/**
 * POST: Guardar preferencia de envío automático global
 */
export async function POST(request: NextRequest) {
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

    // Guardar en cache compartido
    // NOTA: En producción, esto debería guardarse en BD (tabla Settings o User preferences)
    // Para persistir entre reinicios del servidor
    setGlobalAutoSendCache(enabled)

    console.log('[Settings] Preferencia de envío automático global actualizada:', enabled)

    return NextResponse.json(
      { success: true, enabled },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error al guardar preferencia:', error)
    return NextResponse.json(
      { error: 'Error al guardar preferencia' },
      { status: 500 }
    )
  }
}

