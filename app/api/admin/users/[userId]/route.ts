import { NextRequest, NextResponse } from 'next/server'
import { updateUser, deleteUser, getAllUsers } from '@/lib/users'

// PATCH - Actualizar usuario
export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const body = await request.json()
    const { userId } = params

    // Validar que el usuario existe
    const allUsers = await getAllUsers()
    const existingUser = allUsers.find(user => user.id === userId)
    if (!existingUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Actualizar usuario
    const updatedUser = await updateUser(userId, body)
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Error al actualizar usuario' },
        { status: 500 }
      )
    }

    // Return user without password
    const { password: _, ...safeUser } = updatedUser

    return NextResponse.json({
      success: true,
      user: safeUser,
      message: 'Usuario actualizado exitosamente'
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Error al actualizar usuario' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar usuario
export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params

    // Eliminar usuario
    const success = await deleteUser(userId)
    if (!success) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Error al eliminar usuario' },
      { status: 500 }
    )
  }
}
