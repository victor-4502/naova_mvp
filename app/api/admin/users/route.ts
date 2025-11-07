import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { addUserToServer, getAllUsers, findUserByEmail } from '@/lib/users'

const createUserSchema = z.object({
  name: z.string().min(1, 'Nombre es requerido'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Contraseña debe tener al menos 6 caracteres'),
  role: z.enum(['ADMIN', 'CLIENT']),
  company: z.string().optional(),
  phone: z.string().optional(),
})

// GET - Obtener todos los usuarios
export async function GET() {
  try {
    const users = await getAllUsers()
    
    // Remover passwords de la respuesta
    const safeUsers = users.map(user => {
      const { password, ...safeUser } = user
      return safeUser
    })
    
    return NextResponse.json({
      success: true,
      users: safeUsers
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Error al obtener usuarios' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo usuario
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validation = createUserSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { name, email, password, role, company, phone } = validation.data

    // Check if user already exists
    const existingUser = await findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'Ya existe un usuario con este email' },
        { status: 409 }
      )
    }

    // Create new user
    const newUser = await addUserToServer({
      name,
      email,
      password,
      role,
      company: company || '',
      phone: phone || ''
    })

    // Return user without password
    const { password: _, ...safeUser } = newUser

    return NextResponse.json({
      success: true,
      user: safeUser,
      message: 'Usuario creado exitosamente'
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Error al crear usuario' },
      { status: 500 }
    )
  }
}
