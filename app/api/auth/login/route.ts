import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyCredentials } from '@/lib/users'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Contraseña debe tener al menos 6 caracteres'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validation = loginSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { email, password } = validation.data

    // Verify credentials using the user system
    const user = await verifyCredentials(email, password)

    if (!user) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // Obtener el rol real de Prisma (no el legacy)
    let actualRole = user.role
    if (USE_PRISMA) {
      const prismaUser = await prisma.user.findUnique({
        where: { email },
        select: { role: true }
      })
      if (prismaUser) {
        actualRole = prismaUser.role as string
      }
    }

    // Generate simple base64 token for edge runtime compatibility
    const tokenData = {
      userId: user.id,
      email: user.email,
      role: actualRole, // Usar el rol real de Prisma
      name: user.company || user.email,
      exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
    }
    const token = Buffer.from(JSON.stringify(tokenData)).toString('base64')

    // Set cookie and return response
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: actualRole, // Usar el rol real de Prisma
        company: user.company,
      },
      token,
    })

    // Set HTTP-only cookie
    response.cookies.set('naova_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Error al iniciar sesión' },
      { status: 500 }
    )
  }
}

