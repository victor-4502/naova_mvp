import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function verifyToken(token: string): any {
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString())
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
  const token = request.cookies.get('naova_token')?.value

  const publicPaths = ['/', '/login', '/precios', '/contact']
  const isPublicPath = publicPaths.includes(pathname) || 
                       pathname.startsWith('/api/auth/login') ||
                       pathname.startsWith('/api/contact') ||
                       pathname.startsWith('/api/inbox/webhook')

  if (isPublicPath) {
    return NextResponse.next()
  }

  const isProtectedRoute = pathname.startsWith('/app') || pathname.startsWith('/admin')
  const isProtectedAPI = pathname.startsWith('/api/') && 
                         !pathname.startsWith('/api/auth/login') && 
                         !pathname.startsWith('/api/inbox/webhook')

  if (isProtectedRoute || isProtectedAPI) {
    if (!token) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    const payload = verifyToken(token)
    if (!payload) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Verificar acceso a rutas de admin (solo admin_naova y operator_naova)
    if (pathname.startsWith('/admin') && payload.role !== 'admin_naova' && payload.role !== 'operator_naova') {
      return NextResponse.redirect(new URL('/app/dashboard', request.url))
    }

    // Redirigir admins que intentan acceder a rutas de cliente
    if (pathname.startsWith('/app') && (payload.role === 'admin_naova' || payload.role === 'operator_naova')) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }

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
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}