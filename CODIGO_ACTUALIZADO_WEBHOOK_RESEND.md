# ✅ Código Actualizado para Soporte de Resend

## 🔧 Cambios Realizados

He actualizado el endpoint `/api/inbox/webhook/email` para:

1. **Agregar logging detallado**:
   - Ahora logea el payload completo que recibe
   - Facilita diagnosticar problemas

2. **Soportar múltiples formatos de Resend**:
   - Formato directo: `{ from: {...}, to: [...], ... }`
   - Formato con `data`: `{ type: "...", data: {...} }`
   - Formato con `payload`: `{ event: "...", payload: {...} }`

3. **Normalizar el formato**:
   - Convierte cualquier formato de Resend al formato esperado
   - Procesa el email correctamente

---

## 📋 Próximos Pasos

### Paso 1: Esperar Deploy en Vercel

1. Ve a: https://vercel.com
2. Selecciona tu proyecto `naova`
3. Espera a que termine el deploy (normalmente 2-5 minutos)
4. Verifica que el deploy fue exitoso

### Paso 2: Enviar Email de Prueba

1. **Desde cualquier email** (tu Gmail personal, etc.)
2. **Envía un email a**: `test@naova.com.mx` o `compras@naova.com.mx`
3. **Asunto**: "Prueba de email"
4. **Contenido**: "Este es un email de prueba"

### Paso 3: Verificar Logs de Vercel

1. Ve a: https://vercel.com
2. Selecciona tu proyecto `naova`
3. Ve a la pestaña **"Logs"**
4. Busca líneas que contengan:
   - `[Email Webhook] Received payload:`
   - `[Email Webhook] Normalized payload:`
   - `Error en webhook Email:`

### Paso 4: Verificar en Naova

1. Ve a: https://www.naova.com.mx/admin/requests
2. Inicia sesión como admin
3. Deberías ver un **nuevo request** creado desde el email

---

## 🔍 Qué Ver en los Logs

### Si Funciona Correctamente:

Deberías ver en los logs:
```
[Email Webhook] Received payload: { ... }
[Email Webhook] Normalized payload: { ... }
```

Y luego:
- Request creado exitosamente
- O error específico si algo falla

### Si Hay Error:

Los logs mostrarán:
- El payload completo que recibió
- El error específico
- Con esta información podemos solucionarlo

---

## ⚠️ Si Aún No Funciona

### Después del Deploy y Probar:

1. **Ve a los logs de Vercel**
2. **Busca** líneas con `[Email Webhook]`
3. **Copia** el payload completo que aparece en los logs
4. **Compártelo conmigo** y adapto el código específicamente para el formato que Resend está enviando

---

## ✅ Checklist

- [ ] Deploy completado en Vercel
- [ ] Email de prueba enviado a `@naova.com.mx`
- [ ] Logs de Vercel revisados
- [ ] Payload visible en los logs
- [ ] Request aparece en `/admin/requests` (o error identificado)

---

## 💡 Nota

El código ahora es más flexible y puede manejar diferentes formatos. Si Resend envía un formato que aún no contemplamos, los logs nos dirán exactamente qué formato es y lo podemos agregar fácilmente.

---

¡Espera el deploy y prueba de nuevo!

