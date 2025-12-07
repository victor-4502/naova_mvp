# Solución: Error 405 en Webhook de Email

## Problema
El servidor devuelve error 405 (Method Not Allowed) porque el archivo `app/api/inbox/webhook/email/route.ts` está vacío debido a problemas con OneDrive.

## Solución

### Paso 1: Detener sincronización de OneDrive
1. Cierra VS Code/Cursor completamente
2. Desactiva la sincronización de OneDrive para la carpeta `naova2.0`
3. O mueve el proyecto fuera de OneDrive (ej: `C:\Projects\naova2.0`)

### Paso 2: Recrear el archivo `app/api/inbox/webhook/email/route.ts`

Copia y pega este contenido completo:

```typescript
// API Endpoint: Webhook para Email

import { NextRequest, NextResponse } from 'next/server'
import { EmailProcessor } from '@/lib/services/inbox/EmailProcessor'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Verificar que es un webhook válido
    // TODO: Agregar verificación de firma
    
    // Identificar cliente desde el email
    const clientId = await EmailProcessor.identifyClient(body.from.email)
    
    // Procesar email incluso si no se encuentra cliente (clientId puede ser null)
    const newRequest = await EmailProcessor.processEmail(body, clientId || undefined)
    
    // Si no se encontró cliente, responder con mensaje genérico
    if (!clientId) {
      console.warn(`Cliente no encontrado para email: ${body.from.email}. Request creado sin cliente asignado.`)
      // TODO: Enviar respuesta genérica al email
      return NextResponse.json({ 
        received: true,
        message: 'Request creado sin cliente asignado. Se requiere asignación manual.',
        requestId: newRequest.id
      }, { status: 200 })
    }
    
    return NextResponse.json(
      {
        success: true,
        requestId: newRequest.id,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error en webhook Email:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    const errorStack = error instanceof Error ? error.stack : undefined
    console.error('Error details:', { errorMessage, errorStack })
    return NextResponse.json(
      { 
        error: 'Error al procesar webhook',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}
```

### Paso 3: Verificar que `lib/services/inbox/EmailProcessor.ts` existe

Si este archivo también está vacío, cópialo desde `SOLUCION_MIDDLEWARE_ONEDRIVE.md` o recrea el contenido completo.

### Paso 4: Reiniciar el servidor

1. Detén el servidor (Ctrl+C)
2. Elimina la caché:
   ```powershell
   Remove-Item -Recurse -Force .next
   ```
3. Reinicia:
   ```powershell
   npm run dev
   ```

### Paso 5: Probar el webhook

```powershell
npx tsx scripts/probar-webhook-email.ts
```

## Nota Importante

Si OneDrive sigue borrando archivos, **mueve el proyecto fuera de OneDrive** antes de continuar. Esto evitará problemas futuros.




