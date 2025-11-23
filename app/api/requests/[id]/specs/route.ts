// API Endpoint: CRUD de Specs

import { NextRequest, NextResponse } from 'next/server'
import { SpecEngine } from '@/lib/services/specs/SpecEngine'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const spec = await SpecEngine.getSpec(params.id)

    if (!spec) {
      return NextResponse.json({ error: 'Spec no encontrada' }, { status: 404 })
    }

    // Verificar que el request pertenece al usuario
    const requestRecord = await prisma.request.findUnique({
      where: { id: params.id },
    })

    if (!requestRecord) {
      return NextResponse.json(
        { error: 'Request no encontrado' },
        { status: 404 }
      )
    }

    if (
      requestRecord.clientId !== user.id &&
      user.role !== 'admin_naova' &&
      user.role !== 'operator_naova'
    ) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    return NextResponse.json({ spec }, { status: 200 })
  } catch (error) {
    console.error('Error al obtener spec:', error)
    return NextResponse.json(
      { error: 'Error al obtener spec' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { items } = body

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'items es requerido y debe ser un array' },
        { status: 400 }
      )
    }

    // Verificar que el request pertenece al usuario
    const requestRecord = await prisma.request.findUnique({
      where: { id: params.id },
    })

    if (!requestRecord) {
      return NextResponse.json(
        { error: 'Request no encontrado' },
        { status: 404 }
      )
    }

    if (
      requestRecord.clientId !== user.id &&
      user.role !== 'admin_naova' &&
      user.role !== 'operator_naova'
    ) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    // Procesar spec
    const result = await SpecEngine.processSpec(
      params.id,
      items,
      requestRecord.clientId
    )

    return NextResponse.json({ result }, { status: 200 })
  } catch (error) {
    console.error('Error al procesar spec:', error)
    return NextResponse.json(
      { error: 'Error al procesar spec' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Validar spec
    const validation = await SpecEngine.validateSpec(params.id)

    return NextResponse.json({ validation }, { status: 200 })
  } catch (error) {
    console.error('Error al validar spec:', error)
    return NextResponse.json(
      { error: 'Error al validar spec' },
      { status: 500 }
    )
  }
}

