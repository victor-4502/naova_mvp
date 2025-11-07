import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendContactLeadEmail } from '@/lib/email'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  company: z.string().optional(),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  planInterest: z.enum(['trial', 'basic', 'enterprise', 'other']).optional(),
  message: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validation = contactSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validation.error.errors },
        { status: 400 }
      )
    }

    const data = validation.data

    // Save lead to database
    const lead = await prisma.contactLead.create({
      data: {
        name: data.name,
        company: data.company,
        email: data.email,
        phone: data.phone,
        planInterest: data.planInterest,
        message: data.message,
        status: 'new',
      },
    })

    // Send notification email to sales team
    await sendContactLeadEmail({
      name: data.name,
      company: data.company,
      email: data.email,
      phone: data.phone,
      planInterest: data.planInterest,
      message: data.message,
    })

    // TODO: Optional webhook to CRM or Slack
    // await sendWebhook({ leadId: lead.id, ...data })

    return NextResponse.json(
      {
        success: true,
        message: 'Gracias por tu interés. Nuestro equipo se pondrá en contacto contigo pronto.',
        leadId: lead.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Error al enviar formulario de contacto' },
      { status: 500 }
    )
  }
}

