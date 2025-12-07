import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { UserRole } from '@prisma/client'

export const dynamic = 'force-dynamic'

const contactSchema = z.object({
  type: z.enum(['email', 'phone']),
  value: z.string().min(1),
  label: z.string().optional(),
  isPrimary: z.boolean().default(false),
})

// GET - Obtener contactos de un cliente
export async function GET(
  request: NextRequest,
  { params }: { params: { clientId: string } }
) {
  try {
    const userRole = request.headers.get('x-user-role')
    if (userRole !== 'admin' && userRole !== 'ADMIN' && userRole !== 'operator_naova') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      )
    }

    const contacts = await prisma.clientContact.findMany({
      where: {
        userId: params.clientId,
      },
      orderBy: [
        { isPrimary: 'desc' },
        { createdAt: 'asc' },
      ],
    })

    return NextResponse.json({ contacts })
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json(
      { error: 'Error al obtener contactos' },
      { status: 500 }
    )
  }
}

// POST - Agregar contacto a un cliente
export async function POST(
  request: NextRequest,
  { params }: { params: { clientId: string } }
) {
  try {
    const userRole = request.headers.get('x-user-role')
    if (userRole !== 'admin' && userRole !== 'ADMIN' && userRole !== 'operator_naova') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      )
    }

    // Verificar que el cliente existe y es cliente
    const client = await prisma.user.findUnique({
      where: { id: params.clientId },
    })

    if (!client || client.role !== UserRole.client_enterprise) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const validation = contactSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { type, value, label, isPrimary } = validation.data

    // Validar formato según tipo
    if (type === 'email' && !z.string().email().safeParse(value).success) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    // Validar límite de contactos (máximo 5 por tipo)
    const existingContactsCount = await prisma.clientContact.count({
      where: {
        userId: params.clientId,
        type,
      },
    })

    if (existingContactsCount >= 5) {
      return NextResponse.json(
        { error: `Ya se alcanzó el límite de 5 ${type === 'email' ? 'emails' : 'teléfonos'} por cliente` },
        { status: 400 }
      )
    }

    // Si se marca como principal, desmarcar otros del mismo tipo
    if (isPrimary) {
      await prisma.clientContact.updateMany({
        where: {
          userId: params.clientId,
          type,
          isPrimary: true,
        },
        data: {
          isPrimary: false,
        },
      })
    }

    // Crear contacto
    console.log('Creando contacto:', {
      userId: params.clientId,
      type,
      value,
      label: label || (type === 'email' ? 'Email adicional' : 'Teléfono adicional'),
      isPrimary,
    })

    const contact = await prisma.clientContact.create({
      data: {
        userId: params.clientId,
        type,
        value,
        label: label || (type === 'email' ? 'Email adicional' : 'Teléfono adicional'),
        isPrimary,
        verified: false,
      },
    })

    console.log('Contacto creado exitosamente:', contact)

    // Crear audit log
    const adminUserId = request.headers.get('x-user-id')
    await prisma.auditLog.create({
      data: {
        action: 'add_client_contact',
        userId: adminUserId,
        metadata: {
          clientId: params.clientId,
          contactId: contact.id,
          contactType: type,
        },
      },
    })

    return NextResponse.json(
      {
        success: true,
        contact,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating contact:', error)
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      meta: error.meta,
      stack: error.stack
    })
    
    // Error de duplicado
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Este contacto ya existe para este cliente' },
        { status: 409 }
      )
    }

    // Error de foreign key (userId no existe)
    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'El cliente especificado no existe en la base de datos' },
        { status: 404 }
      )
    }

    // Error de constraint
    if (error.code === 'P2011') {
      return NextResponse.json(
        { error: 'Error de validación: ' + (error.meta?.target || 'campo requerido') },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Error al crear contacto',
        details: error.message || 'Error desconocido',
        code: error.code || 'UNKNOWN'
      },
      { status: 500 }
    )
  }
}

