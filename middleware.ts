import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple token verification for edge runtime
function verifyToken(token: string): any {
  try {
    // Decode base64 token
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString())
    
    // Check if token is expired
    if (decoded.exp && Date.now() > decoded.exp) {
      return null
    }
    
    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name
    }
  } catch (error) {
    return null
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  console.log('Middleware checking:', pathname) // Debug log

  // Get token from cookies
  const token = request.cookies.get('naova_token')?.value
  console.log('Token found:', !!token) // Debug log

  // Public paths that don't require authentication
  const publicPaths = ['/', '/login', '/precios', '/contact']
  const isPublicPath = publicPaths.includes(pathname) || 
                       pathname.startsWith('/api/auth/login') ||
                       pathname.startsWith('/api/contact')

  // If accessing public path, allow
  if (isPublicPath) {
    console.log('Public path, allowing:', pathname)
    return NextResponse.next()
  }

  // Check if trying to access protected route
  const isProtectedRoute = pathname.startsWith('/app') || pathname.startsWith('/admin')
  const isProtectedAPI = pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/login')

  if (isProtectedRoute || isProtectedAPI) {
    console.log('Protected route detected:', pathname)
    // No token, redirect to login
    if (!token) {
      console.log('No token, redirecting to login')
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Verify token
    console.log('Verifying token...')
    const payload = verifyToken(token)
    console.log('Token payload:', payload)
    if (!payload) {
      console.log('Invalid token, redirecting to login')
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Check role-based access
    if (pathname.startsWith('/admin') && payload.role !== 'ADMIN') {
      // Client trying to access admin area
      return NextResponse.redirect(new URL('/app/dashboard', request.url))
    }

    if (pathname.startsWith('/app') && payload.role === 'ADMIN') {
      // Admin trying to access client area, redirect to admin
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }

    // Add user info to headers for API routes to use
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', payload.userId)
    requestHeaders.set('x-user-role', payload.role)
    requestHeaders.set('x-user-email', payload.email)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

