// API Endpoint: Enviar RFQ

import { NextRequest, NextResponse } from 'next/server'
import { RFQEngine } from '@/lib/services/rfq/RFQEngine'
import { getCurrentUser } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Solo admins y operators pueden enviar RFQs
    if (user.role !== 'admin_naova' && user.role !== 'operator_naova') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const result = await RFQEngine.sendRFQ(params.id)

    return NextResponse.json({ result }, { status: 200 })
  } catch (error: any) {
    console.error('Error al enviar RFQ:', error)
    return NextResponse.json(
      { error: error.message || 'Error al enviar RFQ' },
      { status: 500 }
    )
  }
}

