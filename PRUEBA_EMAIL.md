# 📧 Cómo Probar con Email

## ⚠️ Estado Actual

**El correo NO está conectado todavía** - Falta la integración con proveedores (SendGrid, AWS SES, etc.).

**PERO puedes probarlo con el script de simulación** ✅

---

## 🧪 Cómo Probar Email AHORA

### Opción 1: Script de Prueba (Recomendado)

```bash
npm run tsx scripts/probar-webhook-email.ts
```

**Qué hace:**
- Busca un cliente registrado con email
- Simula un email entrante desde ese cliente
- Crea el request en la base de datos
- Genera auto-respuesta automáticamente (si está incompleto)

**Resultado:**
- El request aparece en `/admin/requests` con source "Email"
- Se genera el mensaje de auto-respuesta si falta información

---

### Opción 2: Plataforma Web (Funciona Realmente)

1. Ve a `http://localhost:3000/login`
2. Inicia sesión como cliente
3. Ve a `/app/requests`
4. Escribe tu requerimiento
5. Haz clic en "Enviar a Naova"

**✅ Esto SÍ funciona en tiempo real** - No es simulado.

---

## 📧 Correos Configurados

**Email principal:** `compras@naova.com`

**Emails alternativos:**
- `pedidos@naova.com`
- `contacto@naova.com`

**Estado:** ⚠️ Configurados pero NO conectados todavía

**Para que funcione:** Necesitas configurar SendGrid, AWS SES, Mailgun, etc.

---

## 🔧 Qué Falta para que Funcione Realmente

### Para Email:

1. **Configurar un servicio de email** (SendGrid, AWS SES, Mailgun, etc.)
2. **Configurar el dominio** `naova.com` para recibir emails
3. **Configurar el webhook** para que envíe emails entrantes a:
   ```
   https://tu-dominio.com/api/inbox/webhook/email
   ```
4. **Configurar los emails** `compras@naova.com`, `pedidos@naova.com`, etc. en el servicio

---

## 🎯 Resumen

| Método | Estado | Cómo usar |
|--------|--------|-----------|
| **Email real** | ❌ No funciona | Falta integración con proveedor |
| **Script de prueba** | ✅ Funciona | `npm run tsx scripts/probar-webhook-email.ts` |
| **Plataforma web** | ✅ Funciona | Ve a `/app/requests` |

---

## 💡 Recomendación

**Para probar el sistema completo ahora:**

1. **Prueba WhatsApp (simulado):**
   ```bash
   npm run tsx scripts/probar-webhook-whatsapp.ts
   ```

2. **Prueba Email (simulado):**
   ```bash
   npm run tsx scripts/probar-webhook-email.ts
   ```

3. **Prueba Plataforma (real):**
   - Ve a `/app/requests` y crea un requerimiento

4. **Verifica en `/admin/requests`:**
   - Deberías ver los 3 requests
   - Cada uno con su source (WhatsApp/Email/Plataforma)
   - Cada uno con su mensaje sugerido si está incompleto

---

## 📝 Ejemplo de lo que hace el script

El script simula un email así:

```json
{
  "from": {
    "email": "cliente@empresa.com",
    "name": "Nombre del Cliente"
  },
  "to": ["compras@naova.com"],
  "subject": "Solicitud de cotización - Tornillos",
  "text": "Necesito tornillos para mi proyecto",
  "messageId": "test-email-1234567890",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

Y el sistema:
1. ✅ Identifica al cliente por su email
2. ✅ Crea el request en la base de datos
3. ✅ Analiza el contenido con reglas
4. ✅ Genera auto-respuesta si falta información

---

## ✅ Checklist

Después de ejecutar el script:

- [ ] El script muestra "✅ Webhook procesado exitosamente"
- [ ] Aparece un request en `/admin/requests` con source "Email"
- [ ] El request tiene estado `INCOMPLETE_INFORMATION` (si está incompleto)
- [ ] Se muestra el "Mensaje sugerido para pedir información faltante"
- [ ] Se creó un mensaje en la tabla `Message` con `direction='outbound'`

---

## 🐛 Si algo no funciona

### "No se encontró ningún cliente registrado"
→ Crea un cliente desde `/admin/users` con un email válido

### "Error al procesar webhook"
→ Verifica que el servidor esté corriendo (`npm run dev`)

### No se genera auto-respuesta
→ Verifica que el requerimiento esté incompleto (ej: "Necesito tornillos" sin más detalles)

