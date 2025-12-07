import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateRandomPassword } from '@/lib/auth'
import { sendWelcomeEmail } from '@/lib/email'
import { z } from 'zod'
import { UserRole } from '@prisma/client'

export const dynamic = 'force-dynamic'

const createClientSchema = z.object({
  name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  company: z.string().optional(),
  phone: z.string().optional(),
  plan: z.enum(['trial', 'basic', 'enterprise']).default('trial'),
  // Múltiples contactos adicionales
  additionalEmails: z.array(z.object({
    email: z.string().email(),
    label: z.string().optional(),
    isPrimary: z.boolean().default(false),
  })).optional(),
  additionalPhones: z.array(z.object({
    phone: z.string(),
    label: z.string().optional(),
    isPrimary: z.boolean().default(false),
  })).optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin (from middleware)
    const userRole = request.headers.get('x-user-role')
    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'No autorizado. Solo administradores pueden crear clientes.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    
    // Validate input
    const validation = createClientSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos invÃ¡lidos', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { name, email, company, phone, plan, additionalEmails, additionalPhones } = validation.data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Ya existe un usuario con este email' },
        { status: 409 }
      )
    }

    // Generate temporary password
    const temporaryPassword = generateRandomPassword(12)
    const passwordHash = await hashPassword(temporaryPassword)

    // Calculate trial end date (30 days from now)
    const trialEndsAt = new Date()
    trialEndsAt.setDate(trialEndsAt.getDate() + 30)

    // Preparar contactos adicionales
    const clientContacts = []
    
    // Agregar emails adicionales
    if (additionalEmails && additionalEmails.length > 0) {
      for (const emailContact of additionalEmails) {
        clientContacts.push({
          type: 'email',
          value: emailContact.email,
          label: emailContact.label || 'Email adicional',
          isPrimary: emailContact.isPrimary,
          verified: false,
        })
      }
    }
    
    // Agregar teléfonos adicionales
    if (additionalPhones && additionalPhones.length > 0) {
      for (const phoneContact of additionalPhones) {
        clientContacts.push({
          type: 'phone',
          value: phoneContact.phone,
          label: phoneContact.label || 'Teléfono adicional',
          isPrimary: phoneContact.isPrimary,
          verified: false,
        })
      }
    }

    // Create user with client profile and contacts
    const newClient = await prisma.user.create({
      data: {
        name,
        email,
        company,
        phone,
        passwordHash,
        role: UserRole.client_enterprise,
        clientProfile: {
          create: {
            billingPlan: plan,
            trialEndsAt: plan === 'trial' ? trialEndsAt : null,
          },
        },
        clientContacts: clientContacts.length > 0 ? {
          create: clientContacts,
        } : undefined,
      },
      include: {
        clientProfile: true,
        clientContacts: true,
      },
    })

    // Send welcome email with credentials
    await sendWelcomeEmail(email, name, temporaryPassword)

    // Create audit log
    const adminUserId = request.headers.get('x-user-id')
    await prisma.auditLog.create({
      data: {
        action: 'create_client',
        userId: adminUserId,
        metadata: {
          clientId: newClient.id,
          clientEmail: email,
        },
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Cliente creado exitosamente',
        client: {
          id: newClient.id,
          name: newClient.name,
          email: newClient.email,
          company: newClient.company,
          phone: newClient.phone,
          plan: newClient.clientProfile?.billingPlan,
          contacts: newClient.clientContacts || [],
        },
        temporaryPassword, // Return for admin to share if email fails
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create client error:', error)
    return NextResponse.json(
      { error: 'Error al crear cliente' },
      { status: 500 }
    )
  }
}



