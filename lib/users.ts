// Sistema de gesti├│n de usuarios - Compatible con desarrollo y producci├│n
// En desarrollo: usa archivos (server-users.json)
// En producci├│n: usa Prisma (base de datos)

import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'
import { UserRole } from '@prisma/client'

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

// Detectar si estamos usando Prisma (si DATABASE_URL existe, usar Prisma)
// Usar Prisma siempre que DATABASE_URL esté configurado, sin importar el entorno
const USE_PRISMA = !!process.env.DATABASE_URL

// ==================== FUNCIONES PARA PRISMA (PRODUCCI├ôN) ====================

function prismaUserToLegacy(user: any): User {
  return {
    id: user.id,
    email: user.email,
    password: '', // Nunca devolvemos la contrase├▒a
    role: user.role === UserRole.admin_naova ? 'ADMIN' : 'CLIENT',
    company: user.company || '',
    name: user.name || undefined,
    phone: user.phone || undefined,
    createdAt: user.createdAt?.toISOString().split('T')[0],
    isActive: user.active,
  }
}

async function getAllUsersPrisma(): Promise<User[]> {
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

async function findUserByEmailPrisma(email: string): Promise<User | undefined> {
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

async function addUserToServerPrisma(userData: Omit<User, 'id'>): Promise<User> {
  try {
    const passwordHash = await bcrypt.hash(userData.password, 10)
    const newUser = await prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name || userData.email.split('@')[0],
        passwordHash,
        role: userData.role === 'ADMIN' ? UserRole.admin_naova : UserRole.client_enterprise,
        company: userData.company || '',
        phone: userData.phone || null,
        active: userData.isActive !== false,
      },
    })

    if (userData.role === 'CLIENT') {
      await prisma.clientProfile.create({
        data: {
          userId: newUser.id,
          billingPlan: 'trial',
          trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      })
    }

    return prismaUserToLegacy(newUser)
  } catch (error) {
    console.error('Error adding user to Prisma:', error)
    throw error
  }
}

async function verifyCredentialsPrisma(email: string, password: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || !user.active) return null

    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) return null

    return prismaUserToLegacy(user)
  } catch (error) {
    console.error('Error verifying credentials:', error)
    return null
  }
}

async function updateUserPrisma(userId: string, updates: Partial<User>): Promise<User | null> {
  try {
    const prismaUpdates: any = {}
    
    if (updates.name !== undefined) prismaUpdates.name = updates.name
    if (updates.email !== undefined) prismaUpdates.email = updates.email
    if (updates.company !== undefined) prismaUpdates.company = updates.company
    if (updates.phone !== undefined) prismaUpdates.phone = updates.phone
    if (updates.isActive !== undefined) prismaUpdates.active = updates.isActive
    if (updates.role !== undefined) {
      prismaUpdates.role = updates.role === 'ADMIN' ? UserRole.admin_naova : UserRole.client_enterprise
    }
    
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

async function deleteUserPrisma(userId: string): Promise<boolean> {
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

// ==================== FUNCIONES PARA ARCHIVOS (DESARROLLO) ====================

const baseUsers: User[] = [
  {
    id: 'admin-001',
    email: 'admin@naova.com',
    password: 'password123',
    role: 'ADMIN',
    company: 'Naova Admin',
    name: 'Admin Principal',
    isActive: true,
    createdAt: '2024-01-15'
  },
  {
    id: 'client-001',
    email: 'juan@abc.com',
    password: 'password123',
    role: 'CLIENT',
    company: 'Industrias ABC',
    name: 'Juan P├⌐rez',
    isActive: true,
    createdAt: '2024-02-10'
  },
  {
    id: 'client-002',
    email: 'maria@xyz.com',
    password: 'password123',
    role: 'CLIENT',
    company: 'Comercial XYZ',
    name: 'Mar├¡a Gonz├ílez',
    isActive: true,
    createdAt: '2024-03-05'
  },
  {
    id: 'client-003',
    email: 'carlos@pro.com',
    password: 'password123',
    role: 'CLIENT',
    company: 'Servicios Pro',
    name: 'Carlos Rodr├¡guez',
    isActive: true,
    createdAt: '2024-03-20'
  }
]

const SERVER_USERS_FILE = path.join(process.cwd(), 'server-users.json')

function loadServerUsers(): User[] {
  try {
    if (fs.existsSync(SERVER_USERS_FILE)) {
      const data = fs.readFileSync(SERVER_USERS_FILE, 'utf8')
      const users = JSON.parse(data)
      return users
    }
  } catch (error) {
    console.error('Error loading server users:', error)
  }
  return []
}

function saveServerUsers(users: User[]): void {
  try {
    fs.writeFileSync(SERVER_USERS_FILE, JSON.stringify(users, null, 2))
  } catch (error) {
    console.error('Error saving server users:', error)
  }
}

let dynamicUsers: User[] = loadServerUsers()

function getAllUsersFile(): User[] {
  return [...baseUsers, ...dynamicUsers]
}

function findUserByEmailFile(email: string): User | undefined {
  return getAllUsersFile().find(user => user.email === email)
}

function addUserToServerFile(userData: Omit<User, 'id'>): User {
  const newUser: User = {
    ...userData,
    id: `user-${Date.now()}`,
    isActive: true,
    createdAt: new Date().toISOString().split('T')[0]
  }
  dynamicUsers.push(newUser)
  saveServerUsers(dynamicUsers)
  return newUser
}

function verifyCredentialsFile(email: string, password: string): User | null {
  const user = findUserByEmailFile(email)
  if (user && user.password === password && user.isActive) {
    return user
  }
  return null
}

function updateUserFile(userId: string, updates: Partial<User>): User | null {
  const allUsers = getAllUsersFile()
  const userIndex = allUsers.findIndex(user => user.id === userId)
  if (userIndex === -1) return null

  const updatedUser = { ...allUsers[userIndex], ...updates }
  
  if (baseUsers.find(u => u.id === userId)) {
    const baseIndex = baseUsers.findIndex(u => u.id === userId)
    baseUsers[baseIndex] = updatedUser
  } else {
    const dynamicIndex = dynamicUsers.findIndex(u => u.id === userId)
    if (dynamicIndex !== -1) {
      dynamicUsers[dynamicIndex] = updatedUser
      saveServerUsers(dynamicUsers)
    }
  }
  
  return updatedUser
}

function deleteUserFile(userId: string): boolean {
  const dynamicIndex = dynamicUsers.findIndex(user => user.id === userId)
  if (dynamicIndex !== -1) {
    dynamicUsers.splice(dynamicIndex, 1)
    saveServerUsers(dynamicUsers)
    return true
  }
  return false
}

// ==================== API P├ÜBLICA (DETECTA AUTOM├üTICAMENTE) ====================

export async function getAllUsers(): Promise<User[]> {
  if (USE_PRISMA) {
    return getAllUsersPrisma()
  }
  return getAllUsersFile()
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  if (USE_PRISMA) {
    return findUserByEmailPrisma(email)
  }
  return findUserByEmailFile(email)
}

export async function addUserToServer(userData: Omit<User, 'id'>): Promise<User> {
  if (USE_PRISMA) {
    return addUserToServerPrisma(userData)
  }
  return addUserToServerFile(userData)
}

export async function verifyCredentials(email: string, password: string): Promise<User | null> {
  if (USE_PRISMA) {
    return verifyCredentialsPrisma(email, password)
  }
  return verifyCredentialsFile(email, password)
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
  if (USE_PRISMA) {
    return updateUserPrisma(userId, updates)
  }
  return updateUserFile(userId, updates)
}

export async function deleteUser(userId: string): Promise<boolean> {
  if (USE_PRISMA) {
    return deleteUserPrisma(userId)
  }
  return deleteUserFile(userId)
}

export function getUsersByRole(role: 'ADMIN' | 'CLIENT'): User[] | Promise<User[]> {
  if (USE_PRISMA) {
    return prisma.user.findMany({
      where: { role: role === 'ADMIN' ? UserRole.admin_naova : UserRole.client_enterprise },
      orderBy: { createdAt: 'desc' },
    }).then(users => users.map(prismaUserToLegacy))
  }
  return getAllUsersFile().filter(user => user.role === role)
}

export function addUser(userData: Omit<User, 'id'>): User | Promise<User> {
  return addUserToServer(userData)
}

export function reloadServerUsers(): void {
  if (!USE_PRISMA) {
    dynamicUsers = loadServerUsers()
  }
}

export function reloadUsersFromStorage(): void {
  reloadServerUsers()
}
