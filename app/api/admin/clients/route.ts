import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    const userRole = request.headers.get('x-user-role')
    if (userRole !== 'admin' && userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      )
    }

    // Get all clients with their profiles and contacts
    const clients = await prisma.user.findMany({
      where: { role: UserRole.client_enterprise },
      include: {
        clientProfile: true,
        clientContacts: {
          orderBy: [
            { isPrimary: 'desc' },
            { createdAt: 'asc' },
          ],
        },
        _count: {
          select: {
            legacyRequirements: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Transform data for response
    const clientsData = clients.map(client => ({
      id: client.id,  // ID único generado por Prisma cuid()
      name: client.name,
      email: client.email,
      company: client.company,
      phone: client.phone,
      active: client.active,
      plan: client.clientProfile?.billingPlan,
      trialEndsAt: client.clientProfile?.trialEndsAt,
      requirementsCount: client._count.legacyRequirements,
      contacts: client.clientContacts.map(contact => ({
        id: contact.id,
        type: contact.type,
        value: contact.value,
        label: contact.label,
        isPrimary: contact.isPrimary,
        verified: contact.verified,
      })),
      createdAt: client.createdAt,
    }))

    return NextResponse.json({
      success: true,
      clients: clientsData,
    })
  } catch (error) {
    console.error('Get clients error:', error)
    return NextResponse.json(
      { error: 'Error al obtener clientes' },
      { status: 500 }
    )
  }
}

// Update client (activate/deactivate, change plan)
export async function PATCH(request: NextRequest) {
  try {
    const userRole = request.headers.get('x-user-role')
    if (userRole !== 'admin' && userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { clientId, active, plan } = body

    if (!clientId) {
      return NextResponse.json(
        { error: 'clientId es requerido' },
        { status: 400 }
      )
    }

    // Update user
    const updateData: any = {}
    if (typeof active === 'boolean') {
      updateData.active = active
    }

    const updatedClient = await prisma.user.update({
      where: { id: clientId },
      data: updateData,
      include: { clientProfile: true },
    })

    // Update plan if provided
    if (plan && updatedClient.clientProfile) {
      await prisma.clientProfile.update({
        where: { userId: clientId },
        data: { billingPlan: plan },
      })
    }

    // Audit log
    const adminUserId = request.headers.get('x-user-id')
    await prisma.auditLog.create({
      data: {
        action: 'update_client',
        userId: adminUserId,
        metadata: {
          clientId,
          changes: { active, plan },
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Cliente actualizado',
    })
  } catch (error) {
    console.error('Update client error:', error)
    return NextResponse.json(
      { error: 'Error al actualizar cliente' },
      { status: 500 }
    )
  }
}



