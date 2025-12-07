import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const updateContactSchema = z.object({
  label: z.string().optional(),
  isPrimary: z.boolean().optional(),
  verified: z.boolean().optional(),
})

// PATCH - Actualizar contacto
export async function PATCH(
  request: NextRequest,
  { params }: { params: { clientId: string; contactId: string } }
) {
  try {
    const userRole = request.headers.get('x-user-role')
    if (userRole !== 'admin' && userRole !== 'operator_naova') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      )
    }

    // Verificar que el contacto pertenece al cliente
    const contact = await prisma.clientContact.findUnique({
      where: { id: params.contactId },
    })

    if (!contact || contact.userId !== params.clientId) {
      return NextResponse.json(
        { error: 'Contacto no encontrado' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const validation = updateContactSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { label, isPrimary, verified } = validation.data

    // Si se marca como principal, desmarcar otros del mismo tipo
    if (isPrimary) {
      await prisma.clientContact.updateMany({
        where: {
          userId: params.clientId,
          type: contact.type,
          isPrimary: true,
          id: { not: params.contactId },
        },
        data: {
          isPrimary: false,
        },
      })
    }

    // Actualizar contacto
    const updatedContact = await prisma.clientContact.update({
      where: { id: params.contactId },
      data: {
        ...(label !== undefined && { label }),
        ...(isPrimary !== undefined && { isPrimary }),
        ...(verified !== undefined && { verified }),
      },
    })

    // Crear audit log
    const adminUserId = request.headers.get('x-user-id')
    await prisma.auditLog.create({
      data: {
        action: 'update_client_contact',
        userId: adminUserId,
        metadata: {
          clientId: params.clientId,
          contactId: params.contactId,
        },
      },
    })

    return NextResponse.json({
      success: true,
      contact: updatedContact,
    })
  } catch (error) {
    console.error('Error updating contact:', error)
    return NextResponse.json(
      { error: 'Error al actualizar contacto' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar contacto
export async function DELETE(
  request: NextRequest,
  { params }: { params: { clientId: string; contactId: string } }
) {
  try {
    const userRole = request.headers.get('x-user-role')
    if (userRole !== 'admin' && userRole !== 'operator_naova') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      )
    }

    // Verificar que el contacto pertenece al cliente
    const contact = await prisma.clientContact.findUnique({
      where: { id: params.contactId },
    })

    if (!contact || contact.userId !== params.clientId) {
      return NextResponse.json(
        { error: 'Contacto no encontrado' },
        { status: 404 }
      )
    }

    // Eliminar contacto
    await prisma.clientContact.delete({
      where: { id: params.contactId },
    })

    // Crear audit log
    const adminUserId = request.headers.get('x-user-id')
    await prisma.auditLog.create({
      data: {
        action: 'delete_client_contact',
        userId: adminUserId,
        metadata: {
          clientId: params.clientId,
          contactId: params.contactId,
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Contacto eliminado exitosamente',
    })
  } catch (error) {
    console.error('Error deleting contact:', error)
    return NextResponse.json(
      { error: 'Error al eliminar contacto' },
      { status: 500 }
    )
  }
}

