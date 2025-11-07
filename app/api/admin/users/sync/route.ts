import { NextRequest, NextResponse } from 'next/server'
import { getAllUsers } from '@/lib/users'

// POST - Sincronizar usuarios desde el cliente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { dynamicUsers } = body

    // Aquí podrías guardar los usuarios en una base de datos real
    // Por ahora, solo los mantenemos en memoria del servidor
    console.log('Syncing users from client:', dynamicUsers.length, 'users')

    return NextResponse.json({
      success: true,
      message: 'Usuarios sincronizados exitosamente',
      syncedUsers: dynamicUsers.length
    })
  } catch (error) {
    console.error('Error syncing users:', error)
    return NextResponse.json(
      { error: 'Error al sincronizar usuarios' },
      { status: 500 }
    )
  }
}

// GET - Obtener usuarios para sincronización
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
    console.error('Error fetching users for sync:', error)
    return NextResponse.json(
      { error: 'Error al obtener usuarios' },
      { status: 500 }
    )
  }
}
