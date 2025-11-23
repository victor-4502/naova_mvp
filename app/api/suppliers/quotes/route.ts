// API Endpoint: Proveedor envía cotización

import { NextRequest, NextResponse } from 'next/server'
import { RFQEngine } from '@/lib/services/rfq/RFQEngine'
import { QuoteReceiver } from '@/lib/services/rfq/QuoteReceiver'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      rfqId,
      supplierId,
      items,
      subtotal,
      taxes,
      shipping,
      total,
      validUntil,
      deliveryDays,
      paymentTerms,
      warranty,
      availability,
      notes,
    } = body

    // Validar campos requeridos
    if (!rfqId || !supplierId || !items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'rfqId, supplierId e items son requeridos' },
        { status: 400 }
      )
    }

    if (!subtotal || !total || !validUntil || !deliveryDays) {
      return NextResponse.json(
        { error: 'subtotal, total, validUntil y deliveryDays son requeridos' },
        { status: 400 }
      )
    }

    // Recibir cotización
    const quote = await QuoteReceiver.receiveQuote({
      rfqId,
      supplierId,
      items,
      subtotal,
      taxes,
      shipping,
      total,
      validUntil: new Date(validUntil),
      deliveryDays: parseInt(deliveryDays),
      paymentTerms,
      warranty,
      availability,
      notes,
    })

    return NextResponse.json({ quote }, { status: 201 })
  } catch (error: any) {
    console.error('Error al recibir cotización:', error)
    return NextResponse.json(
      { error: error.message || 'Error al recibir cotización' },
      { status: 500 }
    )
  }
}

