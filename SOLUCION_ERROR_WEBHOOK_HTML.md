# Solución: Error "Unexpected token '<', "<!DOCTYPE "... is not valid JSON"

## Problema
El webhook está devolviendo HTML en lugar de JSON, lo que indica que:
1. El servidor no está corriendo, O
2. Hay un error en el endpoint que causa que Next.js devuelva una página de error

## Soluciones Aplicadas

### 1. Archivos Corregidos

#### `lib/services/inbox/EmailProcessor.ts`
- ✅ Movido el import de `prisma` al inicio del archivo
- ✅ Archivo recreado completamente

#### `app/api/inbox/webhook/email/route.ts`
- ✅ Agregado `export const dynamic = 'force-dynamic'`
- ✅ Mejorado el manejo de errores con más detalles en desarrollo
- ✅ Archivo recreado completamente

#### `scripts/probar-webhook-email.ts`
- ✅ Mejorado el manejo de errores de conexión
- ✅ Verificación del Content-Type antes de parsear JSON
- ✅ Mensajes de error más descriptivos

## Pasos para Probar

### 1. Verificar que el servidor esté corriendo

```powershell
# En una terminal, ejecuta:
npm run dev
```

Deberías ver:
```
✓ Ready in Xs
○ Local:        http://localhost:3000
```

### 2. Probar el webhook

En otra terminal:

```powershell
npx tsx scripts/probar-webhook-email.ts
```

### 3. Si el servidor NO está corriendo

El script mostrará:
```
❌ Error al conectar con el servidor:
[Error details]
💡 Verifica que el servidor esté corriendo:
   npm run dev
```

### 4. Si el servidor devuelve HTML

El script mostrará:
```
❌ El servidor devolvió HTML en lugar de JSON:
Status: 500
Content-Type: text/html
Primeros 500 caracteres de la respuesta:
[HTML content]
```

Esto te ayudará a identificar el error específico.

## Verificación Manual

También puedes probar manualmente con curl o Postman:

```bash
curl -X POST http://localhost:3000/api/inbox/webhook/email \
  -H "Content-Type: application/json" \
  -d '{
    "from": {
      "email": "operador@naova.com",
      "name": "Operador Naova"
    },
    "to": ["compras@naova.com"],
    "subject": "Test",
    "text": "Test message",
    "messageId": "test-123",
    "timestamp": "2025-01-29T00:00:00.000Z"
  }'
```

## Próximos Pasos

1. ✅ Asegúrate de que el servidor esté corriendo (`npm run dev`)
2. ✅ Ejecuta el script de prueba
3. ✅ Revisa los logs del servidor para ver errores específicos
4. ✅ Si hay errores de base de datos, verifica que las columnas `category` y `subcategory` existan en la tabla `Request`

