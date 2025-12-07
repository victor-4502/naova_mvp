# 🧪 Cómo Probar el Sistema de Auto-Respuesta

## 📋 Resumen

El sistema de auto-respuesta funciona así:
1. **Cliente envía requerimiento** por WhatsApp, email o plataforma web
2. **Sistema analiza** el mensaje con reglas (categoría, campos faltantes)
3. **Si está incompleto** y `autoReplyEnabled=true`, se genera un mensaje automático
4. **Mensaje se registra** en la tabla `Message` con `direction='outbound'` y `processed=false`
5. **En el futuro**, un worker/integración tomará estos mensajes y los enviará por el canal correspondiente

---

## 🔍 ¿A qué correo/número llegan los mensajes?

**Respuesta corta:** Los mensajes de auto-respuesta se **registran en la base de datos** pero **NO se envían automáticamente** todavía. Esto es intencional para que puedas revisarlos antes de enviarlos.

### Canales de entrada (donde los clientes envían requerimientos):

1. **Email**: 
   - Los clientes envían emails a **cualquier correo que configures** (ej: `compras@naova.com`, `pedidos@naova.com`)
   - El webhook `/api/inbox/webhook/email` recibe el email
   - El sistema identifica al cliente por su email (principal o adicional)

2. **WhatsApp**:
   - Los clientes envían mensajes a **cualquier número de WhatsApp** que configures
   - El webhook `/api/inbox/webhook/whatsapp` recibe el mensaje
   - El sistema identifica al cliente por su número (principal o adicional)

3. **Plataforma Web**:
   - Los clientes crean requerimientos desde `/app/requests`
   - Se crean directamente en la base de datos con `source='web'`

### Canales de salida (donde se enviarían las auto-respuestas):

- **Email**: Se enviarían al mismo email desde el que el cliente escribió
- **WhatsApp**: Se enviarían al mismo número desde el que el cliente escribió
- **Plataforma Web**: Se mostrarían como notificación en la plataforma

**⚠️ IMPORTANTE:** Actualmente, las auto-respuestas se **registran en la tabla `Message`** pero **NO se envían automáticamente**. Esto te permite:
- Revisar los mensajes antes de enviarlos
- Integrar con proveedores reales de WhatsApp/email más adelante
- Probar el sistema sin enviar mensajes reales

---

## 🧪 Formas de Probar

### Opción 1: Probar desde la Plataforma Web (Más Fácil)

1. **Inicia sesión como cliente** en `http://localhost:3000/login`
2. Ve a `/app/requests`
3. Crea un requerimiento **incompleto**, por ejemplo:
   ```
   Necesito tornillos
   ```
   (Falta cantidad, especificaciones, etc.)

4. **Verifica en `/admin/requests`**:
   - Deberías ver el requerimiento con estado `INCOMPLETE_INFORMATION`
   - Deberías ver el "Mensaje sugerido para pedir información faltante"
   - El toggle "Activar respuesta automática" debería estar activado por defecto

5. **Verifica en la base de datos**:
   ```sql
   -- Ver el request creado
   SELECT id, source, status, "normalizedContent"->'rules' as rules
   FROM "Request"
   ORDER BY "createdAt" DESC
   LIMIT 1;

   -- Ver el mensaje de auto-respuesta generado
   SELECT id, source, direction, content, processed, "requestId"
   FROM "Message"
   WHERE direction = 'outbound' AND processed = false
   ORDER BY "createdAt" DESC
   LIMIT 1;
   ```

---

### Opción 2: Probar con Webhook de Email (Simulado)

Usa el script `scripts/probar-webhook-email.ts`:

```bash
npm run tsx scripts/probar-webhook-email.ts
```

Este script:
- Simula un email entrante desde un cliente registrado
- Crea un request en la base de datos
- Genera automáticamente la auto-respuesta si está incompleto

**Requisitos:**
- Tener un cliente registrado con email (ej: `juan@abc.com`)
- El servidor debe estar corriendo (`npm run dev`)

---

### Opción 3: Probar con Webhook de WhatsApp (Simulado)

Usa el script `scripts/probar-webhook-whatsapp.ts`:

```bash
npm run tsx scripts/probar-webhook-whatsapp.ts
```

Este script:
- Simula un mensaje de WhatsApp entrante desde un cliente registrado
- Crea un request en la base de datos
- Genera automáticamente la auto-respuesta si está incompleto

**Requisitos:**
- Tener un cliente registrado con teléfono (ej: `+52 33 1234 5678`)
- El servidor debe estar corriendo (`npm run dev`)

---

## 📊 Verificar Resultados

### 1. En la Interfaz Web

**Admin Panel (`/admin/requests`):**
- ✅ Ver el requerimiento con su estado
- ✅ Ver el mensaje sugerido
- ✅ Activar/desactivar auto-respuesta con el toggle

**Cliente Panel (`/app/requests`):**
- ✅ Ver sus propios requerimientos
- ✅ Ver el estado y canal de origen

### 2. En la Base de Datos

```sql
-- Ver todos los requests recientes
SELECT 
  id,
  source,
  status,
  "normalizedContent"->'rules'->>'categoryRuleId' as categoria,
  "normalizedContent"->'rules'->>'completeness' as completitud,
  "normalizedContent"->'rules'->>'autoReplyEnabled' as auto_respuesta,
  "createdAt"
FROM "Request"
ORDER BY "createdAt" DESC
LIMIT 10;

-- Ver mensajes de auto-respuesta generados
SELECT 
  m.id,
  m.source,
  m.direction,
  m.content,
  m.processed,
  r.id as request_id,
  r.source as request_source,
  r.status as request_status
FROM "Message" m
LEFT JOIN "Request" r ON m."requestId" = r.id
WHERE m.direction = 'outbound'
ORDER BY m."createdAt" DESC
LIMIT 10;

-- Ver mensajes pendientes de enviar (processed=false)
SELECT 
  m.id,
  m.source,
  m.content,
  r.id as request_id,
  r.status
FROM "Message" m
LEFT JOIN "Request" r ON m."requestId" = r.id
WHERE m.direction = 'outbound' 
  AND m.processed = false
ORDER BY m."createdAt" DESC;
```

---

## 🔧 Configurar Clientes de Prueba

Para probar con email/WhatsApp, necesitas clientes registrados. Puedes crearlos desde `/admin/users` o directamente en Supabase:

```sql
-- Crear cliente de prueba para email
INSERT INTO "User" (id, name, email, "passwordHash", role, active, "createdAt", "updatedAt")
VALUES (
  'cliente-test-email',
  'Cliente Test Email',
  'test-email@cliente.com',
  '$2a$10$ejemplo...', -- Hash de alguna contraseña
  'client_enterprise',
  true,
  NOW(),
  NOW()
);

-- Crear cliente de prueba para WhatsApp
INSERT INTO "User" (id, name, email, phone, "passwordHash", role, active, "createdAt", "updatedAt")
VALUES (
  'cliente-test-whatsapp',
  'Cliente Test WhatsApp',
  'test-whatsapp@cliente.com',
  '+52 33 1234 5678',
  '$2a$10$ejemplo...',
  'client_enterprise',
  true,
  NOW(),
  NOW()
);
```

---

## 🚀 Próximos Pasos (Integración Real)

Para que las auto-respuestas se **envíen realmente**, necesitarás:

1. **Integración con proveedor de Email** (SendGrid, AWS SES, etc.):
   - Leer mensajes con `direction='outbound'` y `processed=false`
   - Enviar por email usando el `source` y metadata del request
   - Marcar `processed=true` después de enviar

2. **Integración con proveedor de WhatsApp** (Twilio, WhatsApp Business API, etc.):
   - Leer mensajes con `direction='outbound'` y `processed=false`
   - Enviar por WhatsApp usando el número del cliente
   - Marcar `processed=true` después de enviar

3. **Notificaciones en Plataforma Web**:
   - Para requests con `source='web'`, mostrar notificaciones en tiempo real
   - Usar WebSockets o polling para actualizar la UI

---

## 📝 Ejemplos de Requerimientos para Probar

### Requerimiento Incompleto (debería generar auto-respuesta):
```
Necesito tornillos
```

### Requerimiento Más Completo (puede que no genere auto-respuesta):
```
Necesito 100 tornillos de acero inoxidable, cabeza plana, tamaño M8x20mm, para proyecto urgente
```

### Requerimiento de Servicio (incompleto):
```
Quiero servicio de mantenimiento
```

### Requerimiento de Servicio (completo):
```
Necesito servicio de mantenimiento preventivo para máquina CNC, frecuencia mensual, presupuesto requerido, inicio en 2 semanas
```

---

## ❓ Preguntas Frecuentes

**P: ¿Los mensajes se envían automáticamente?**
R: No, actualmente solo se registran en la base de datos. Esto te permite revisarlos antes de enviarlos.

**P: ¿Cómo cambio las reglas de categorización?**
R: Edita `lib/rules/requestSchemas.ts` y agrega/modifica las reglas en `REQUEST_CATEGORY_RULES`.

**P: ¿Cómo cambio el texto de las auto-respuestas?**
R: Edita `lib/services/inbox/FollowUpGenerator.ts` para personalizar los mensajes.

**P: ¿Puedo desactivar la auto-respuesta para un request específico?**
R: Sí, desde `/admin/requests`, usa el toggle "Activar respuesta automática por el mismo canal".

---

## 🐛 Troubleshooting

**Problema:** No se genera auto-respuesta
- ✅ Verifica que el request tenga `autoReplyEnabled=true` en `normalizedContent.rules`
- ✅ Verifica que haya `missingFields` en las reglas
- ✅ Verifica que haya un `categoryRuleId` válido

**Problema:** No se identifica al cliente
- ✅ Verifica que el cliente esté registrado con el email/teléfono correcto
- ✅ Verifica que el cliente tenga `role='client_enterprise'`
- ✅ Verifica que el cliente esté `active=true`

**Problema:** El mensaje sugerido no aparece
- ✅ Verifica que el request tenga estado `INCOMPLETE_INFORMATION`
- ✅ Verifica que haya `missingFields` en `normalizedContent.rules`

