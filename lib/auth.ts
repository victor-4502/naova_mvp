import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production'
const TOKEN_NAME = 'naova_token'

export interface JWTPayload {
  userId: string
  email: string
  role: 'admin_naova' | 'operator_naova' | 'client_enterprise' | 'supplier' | 'ADMIN' | 'CLIENT'
  name?: string
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Generate JWT token
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d', // 7 days
  })
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  console.log('Verifying token:', token.substring(0, 50) + '...') // Debug log
  try {
    // First try JWT verification
    const jwtPayload = jwt.verify(token, JWT_SECRET) as JWTPayload
    console.log('JWT verification successful:', jwtPayload) // Debug log
    return jwtPayload
  } catch (error) {
    console.log('JWT verification failed, trying custom format:', error instanceof Error ? error.message : String(error)) // Debug log
    // If JWT fails, try our custom token format
    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString())
      console.log('Custom token decoded:', decoded) // Debug log
      
      // Check if token is expired
      if (decoded.exp && Date.now() > decoded.exp) {
        console.log('Token expired') // Debug log
        return null
      }
      
      const payload = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name
      } as JWTPayload
      console.log('Custom token verification successful:', payload) // Debug log
      return payload
    } catch (decodeError) {
      console.log('Custom token decode failed:', decodeError instanceof Error ? decodeError.message : String(decodeError)) // Debug log
      return null
    }
  }
}

// Get current user from cookies (server-side)
export async function getCurrentUser(): Promise<JWTPayload | null> {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get(TOKEN_NAME)?.value

    if (!token) {
      return null
    }

    return verifyToken(token)
  } catch (error) {
    return null
  }
}

// Set auth cookie (for API routes)
export function setAuthCookie(token: string) {
  const cookieStore = cookies()
  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

// Clear auth cookie
export function clearAuthCookie() {
  const cookieStore = cookies()
  cookieStore.delete(TOKEN_NAME)
}

// Generate random password
export function generateRandomPassword(length: number = 12): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  let password = ''
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}


