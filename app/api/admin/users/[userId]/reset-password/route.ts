import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'

export const dynamic = 'force-dynamic'

// POST - Resetear contraseña de un usuario
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    console.log('Reset password request:', { userId: params.userId })
    
    const userRole = request.headers.get('x-user-role')
    console.log('User role:', userRole)
    
    // Aceptar admin_naova, operator_naova, o los valores legacy 'admin', 'ADMIN'
    if (
      userRole !== 'admin_naova' && 
      userRole !== 'operator_naova' && 
      userRole !== 'admin' && 
      userRole !== 'ADMIN'
    ) {
      console.log('Unauthorized access attempt')
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { newPassword, generatePassword } = body
    console.log('Request body:', { hasNewPassword: !!newPassword, generatePassword })

    // Verificar que el usuario existe
    console.log('Looking for user:', params.userId)
    const user = await prisma.user.findUnique({
      where: { id: params.userId },
    })

    if (!user) {
      console.log('User not found:', params.userId)
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }
    
    console.log('User found:', user.email)

    let passwordToUse: string

    // Si se solicita generar contraseña automáticamente
    if (generatePassword || !newPassword) {
      console.log('Generating random password')
      // Generar contraseña aleatoria segura
      const length = 12
      const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
      const randomBytesArray = randomBytes(length)
      passwordToUse = Array.from(randomBytesArray)
        .map(x => charset[x % charset.length])
        .join('')
      console.log('Password generated')
    } else if (newPassword) {
      console.log('Using provided password')
      // Usar la contraseña proporcionada
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: 'La contraseña debe tener al menos 6 caracteres' },
          { status: 400 }
        )
      }
      passwordToUse = newPassword
    } else {
      return NextResponse.json(
        { error: 'Debes proporcionar una nueva contraseña o solicitar generar una' },
        { status: 400 }
      )
    }

    // Hashear la contraseña
    const passwordHash = await bcrypt.hash(passwordToUse, 10)

    // Actualizar la contraseña
    await prisma.user.update({
      where: { id: params.userId },
      data: { passwordHash },
    })

    // Crear audit log (opcional - no falla si la tabla no existe)
    try {
      const adminUserId = request.headers.get('x-user-id')
      await prisma.auditLog.create({
        data: {
          action: 'reset_user_password',
          userId: adminUserId || null,
          metadata: {
            targetUserId: params.userId,
            targetUserEmail: user.email,
          },
        },
      })
    } catch (auditError) {
      // Si falla el audit log, solo lo registramos pero no fallamos la operación
      console.warn('No se pudo crear el audit log (puede que la tabla no exista):', auditError)
    }

    return NextResponse.json({
      success: true,
      newPassword: passwordToUse, // Devolver la contraseña en texto plano para mostrarla al admin
      message: 'Contraseña actualizada exitosamente',
    })
  } catch (error: any) {
    console.error('Error resetting password:', error)
    // Devolver un mensaje de error más descriptivo
    const errorMessage = error?.message || 'Error desconocido al resetear contraseña'
    return NextResponse.json(
      { 
        error: 'Error al resetear contraseña',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}

