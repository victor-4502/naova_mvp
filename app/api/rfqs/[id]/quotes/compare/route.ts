// API Endpoint: Comparar cotizaciones de un RFQ

import { NextRequest, NextResponse } from 'next/server'
import { QuoteComparator } from '@/lib/services/comparison/QuoteComparator'
import { getCurrentUser } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const comparison = await QuoteComparator.compareRFQQuotes(params.id)

    return NextResponse.json({ comparison }, { status: 200 })
  } catch (error) {
    console.error('Error al comparar cotizaciones:', error)
    return NextResponse.json(
      { error: 'Error al comparar cotizaciones' },
      { status: 500 }
    )
  }
}

