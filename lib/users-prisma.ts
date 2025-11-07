// Sistema de gestión de usuarios usando Prisma (para producción)
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

interface User {
  id: string
  email: string
  password: string
  role: 'ADMIN' | 'CLIENT'
  company: string
  name?: string
  phone?: string
  createdAt?: string
  isActive?: boolean
}

// Función para convertir User de Prisma a formato legacy
function prismaUserToLegacy(user: any): User {
  return {
    id: user.id,
    email: user.email,
    password: '', // Nunca devolvemos la contraseña
    role: user.role === 'admin' ? 'ADMIN' : 'CLIENT',
    company: user.company || '',
    name: user.name || undefined,
    phone: user.phone || undefined,
    createdAt: user.createdAt?.toISOString().split('T')[0],
    isActive: user.active,
  }
}

// Función para obtener todos los usuarios desde Prisma
export async function getAllUsers(): Promise<User[]> {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return users.map(prismaUserToLegacy)
  } catch (error) {
    console.error('Error fetching users from Prisma:', error)
    return []
  }
}

// Función para buscar usuario por email
export async function findUserByEmail(email: string): Promise<User | undefined> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })
    return user ? prismaUserToLegacy(user) : undefined
  } catch (error) {
    console.error('Error finding user by email:', error)
    return undefined
  }
}

// Función para agregar nuevo usuario
export async function addUserToServer(userData: Omit<User, 'id'>): Promise<User> {
  try {
    // Hashear contraseña
    const passwordHash = await bcrypt.hash(userData.password, 10)

    // Crear usuario en Prisma
    const newUser = await prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name || userData.email.split('@')[0],
        passwordHash,
        role: userData.role === 'ADMIN' ? 'admin' : 'client',
        company: userData.company || '',
        phone: userData.phone || null,
        active: userData.isActive !== false,
      },
    })

    // Si es cliente, crear perfil de cliente
    if (userData.role === 'CLIENT') {
      await prisma.clientProfile.create({
        data: {
          userId: newUser.id,
          billingPlan: 'trial',
          trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
        },
      })
    }

    console.log('User added to Prisma:', newUser.email)
    return prismaUserToLegacy(newUser)
  } catch (error) {
    console.error('Error adding user to Prisma:', error)
    throw error
  }
}

// Función para verificar credenciales
export async function verifyCredentials(email: string, password: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || !user.active) {
      return null
    }

    // Verificar contraseña
    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      return null
    }

    return prismaUserToLegacy(user)
  } catch (error) {
    console.error('Error verifying credentials:', error)
    return null
  }
}

// Función para obtener usuarios por rol
export async function getUsersByRole(role: 'ADMIN' | 'CLIENT'): Promise<User[]> {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: role === 'ADMIN' ? 'admin' : 'client',
      },
      orderBy: { createdAt: 'desc' },
    })
    return users.map(prismaUserToLegacy)
  } catch (error) {
    console.error('Error fetching users by role:', error)
    return []
  }
}

// Función para actualizar usuario
export async function updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
  try {
    // Preparar datos para Prisma
    const prismaUpdates: any = {}
    
    if (updates.name !== undefined) prismaUpdates.name = updates.name
    if (updates.email !== undefined) prismaUpdates.email = updates.email
    if (updates.company !== undefined) prismaUpdates.company = updates.company
    if (updates.phone !== undefined) prismaUpdates.phone = updates.phone
    if (updates.isActive !== undefined) prismaUpdates.active = updates.isActive
    if (updates.role !== undefined) {
      prismaUpdates.role = updates.role === 'ADMIN' ? 'admin' : 'client'
    }
    
    // Si hay nueva contraseña, hashearla
    if (updates.password) {
      prismaUpdates.passwordHash = await bcrypt.hash(updates.password, 10)
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: prismaUpdates,
    })

    return prismaUserToLegacy(updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
    return null
  }
}

// Función para eliminar usuario
export async function deleteUser(userId: string): Promise<boolean> {
  try {
    await prisma.user.delete({
      where: { id: userId },
    })
    return true
  } catch (error) {
    console.error('Error deleting user:', error)
    return false
  }
}

// Función para recargar usuarios (no-op en Prisma, pero mantiene compatibilidad)
export function reloadServerUsers(): void {
  // No-op: Prisma siempre lee de la base de datos
  console.log('reloadServerUsers called (no-op with Prisma)')
}

// Función legacy para compatibilidad (no hace nada en Prisma)
export function addUser(userData: Omit<User, 'id'>): Promise<User> {
  return addUserToServer(userData)
}

// Función legacy para compatibilidad
export function reloadUsersFromStorage(): void {
  // No-op: Prisma siempre lee de la base de datos
}

