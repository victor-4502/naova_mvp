# Solución: Problema con middleware.ts y OneDrive

## Problema
El archivo `middleware.ts` se está borrando constantemente, probablemente debido a problemas de sincronización con OneDrive.

## Solución Temporal

### Opción 1: Desactivar sincronización de OneDrive para esta carpeta

1. Cierra VS Code/Cursor
2. Abre OneDrive Settings
3. Selecciona la carpeta `naova2.0` y desactiva la sincronización
4. O mueve el proyecto fuera de OneDrive

### Opción 2: Recrear el archivo manualmente

Copia y pega este contenido en `middleware.ts`:

```typescript
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

    if (pathname.startsWith('/admin') && payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/app/dashboard', request.url))
    }

    if (pathname.startsWith('/app') && payload.role === 'ADMIN') {
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
```

## Después de recrear el archivo

1. **Detén el servidor** (Ctrl+C)
2. **Elimina la caché de Next.js**:
   ```powershell
   Remove-Item -Recurse -Force .next
   ```
3. **Reinicia el servidor**:
   ```powershell
   npm run dev
   ```

## Nota importante

Si OneDrive sigue borrando el archivo, considera mover el proyecto a una ubicación fuera de OneDrive (por ejemplo, `C:\Projects\naova2.0`).

