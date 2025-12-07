# 🧪 Guía Completa para Probar el Sistema

## 🎯 Objetivo

Probar que el sistema:
1. ✅ Recibe requerimientos por WhatsApp, Email y Plataforma
2. ✅ Identifica al cliente automáticamente
3. ✅ Analiza el requerimiento con reglas
4. ✅ Genera auto-respuestas cuando falta información
5. ✅ Muestra todo en `/admin/requests`

---

## 📋 Requisitos Previos

1. **Servidor corriendo:**
   ```bash
   npm run dev
   ```

2. **Cliente registrado:**
   - Debe tener `role='client_enterprise'`
   - Debe tener `active=true`
   - Debe tener email (para probar email)
   - Debe tener teléfono (para probar WhatsApp)

3. **Base de datos conectada:**
   - Verifica que `DATABASE_URL` esté en `.env`

---

## 🧪 Prueba 1: WhatsApp (Simulado)

### Paso 1: Verificar que hay un cliente con teléfono

```sql
-- En Supabase, verifica que hay un cliente con teléfono
SELECT id, name, email, phone, role, active 
FROM "User" 
WHERE role = 'client_enterprise' AND active = true AND phone IS NOT NULL
LIMIT 1;
```

Si no hay, crea uno desde `/admin/users` o en Supabase.

### Paso 2: Ejecutar el script de prueba

```bash
npm run tsx scripts/probar-webhook-whatsapp.ts
```

### Paso 3: Verificar resultados

1. **En la consola:** Deberías ver:
   - ✅ Cliente encontrado
   - ✅ Webhook procesado exitosamente
   - ✅ Request creado
   - ✅ Mensaje de auto-respuesta generado (si está incompleto)

2. **En `/admin/requests`:**
   - Deberías ver el nuevo requerimiento
   - Source: `WhatsApp`
   - Estado: `INCOMPLETE_INFORMATION` (si falta información)
   - Mensaje sugerido visible

3. **En la base de datos:**
   ```sql
   -- Ver el request creado
   SELECT id, source, status, "rawContent", "normalizedContent"->'rules' as rules
   FROM "Request"
   ORDER BY "createdAt" DESC
   LIMIT 1;

   -- Ver el mensaje de auto-respuesta
   SELECT id, source, direction, content, processed
   FROM "Message"
   WHERE direction = 'outbound'
   ORDER BY "createdAt" DESC
   LIMIT 1;
   ```

---

## 🧪 Prueba 2: Email (Simulado)

### Paso 1: Verificar que hay un cliente con email

```sql
-- En Supabase, verifica que hay un cliente con email
SELECT id, name, email, role, active 
FROM "User" 
WHERE role = 'client_enterprise' AND active = true
LIMIT 1;
```

### Paso 2: Ejecutar el script de prueba

```bash
npm run tsx scripts/probar-webhook-email.ts
```

### Paso 3: Verificar resultados

Igual que en WhatsApp:
1. ✅ Consola muestra éxito
2. ✅ Request aparece en `/admin/requests`
3. ✅ Mensaje de auto-respuesta generado (si está incompleto)

---

## 🧪 Prueba 3: Plataforma Web

### Paso 1: Iniciar sesión como cliente

1. Ve a `http://localhost:3000/login`
2. Inicia sesión con un cliente (ej: `juan@abc.com`)
3. Ve a `/app/requests`

### Paso 2: Crear un requerimiento incompleto

Escribe algo como:
```
Necesito tornillos
```

O para servicios:
```
Quiero servicio de mantenimiento
```

### Paso 3: Enviar

Haz clic en "Enviar a Naova"

### Paso 4: Verificar resultados

1. **En `/app/requests`:**
   - Deberías ver tu requerimiento en la lista
   - Source: `Plataforma`

2. **En `/admin/requests`:**
   - Deberías ver el requerimiento
   - Source: `web`
   - Estado: `INCOMPLETE_INFORMATION` (si falta información)
   - Mensaje sugerido visible

3. **En la base de datos:**
   ```sql
   SELECT id, source, status, "rawContent"
   FROM "Request"
   WHERE source = 'web'
   ORDER BY "createdAt" DESC
   LIMIT 1;
   ```

---

## 🔍 Verificar Auto-Respuesta

### En `/admin/requests`:

1. Busca un requerimiento con estado `INCOMPLETE_INFORMATION`
2. Deberías ver:
   - **"Mensaje sugerido para pedir información faltante"** con el texto generado
   - **Toggle "Activar respuesta automática por el mismo canal"** (debería estar activado)

### En la base de datos:

```sql
-- Ver requests incompletos con auto-respuestas
SELECT 
  r.id,
  r.source,
  r.status,
  r."rawContent",
  r."normalizedContent"->'rules'->>'completeness' as completitud,
  r."normalizedContent"->'rules'->>'missingFields' as campos_faltantes,
  m.id as mensaje_id,
  m.content as mensaje_auto_respuesta,
  m.processed
FROM "Request" r
LEFT JOIN "Message" m ON m."requestId" = r.id AND m.direction = 'outbound'
WHERE r.status = 'INCOMPLETE_INFORMATION'
ORDER BY r."createdAt" DESC
LIMIT 5;
```

---

## 📊 Verificar Análisis de Reglas

### Ver qué categoría se identificó:

```sql
SELECT 
  id,
  source,
  "rawContent",
  "normalizedContent"->'rules'->>'categoryRuleId' as categoria,
  "normalizedContent"->'rules'->>'presentFields' as campos_presentes,
  "normalizedContent"->'rules'->>'missingFields' as campos_faltantes,
  "normalizedContent"->'rules'->>'completeness' as completitud
FROM "Request"
ORDER BY "createdAt" DESC
LIMIT 3;
```

---

## 🎯 Ejemplos de Requerimientos para Probar

### Requerimiento Incompleto (debería generar auto-respuesta):

**WhatsApp/Email/Plataforma:**
```
Necesito tornillos
```

**Resultado esperado:**
- Categoría: `herramientas`
- Campos faltantes: `cantidad`, `especificaciones`, `ubicacion_entrega`
- Estado: `INCOMPLETE_INFORMATION`
- Auto-respuesta: ✅ Generada

---

### Requerimiento Más Completo:

**WhatsApp/Email/Plataforma:**
```
Necesito 100 tornillos de acero inoxidable, cabeza plana, tamaño M8x20mm, para entrega en Monterrey antes del 15 de junio
```

**Resultado esperado:**
- Categoría: `herramientas`
- Campos presentes: `cantidad`, `especificaciones`, `ubicacion_entrega`, `fecha_requerida`
- Estado: `READY_FOR_SUPPLIER_MATCHING` (o similar)
- Auto-respuesta: ❌ No generada (está completo)

---

### Requerimiento de Servicio (incompleto):

**WhatsApp/Email/Plataforma:**
```
Quiero servicio de mantenimiento
```

**Resultado esperado:**
- Categoría: `servicios`
- Campos faltantes: `tipo_servicio`, `frecuencia`, `presupuesto_estimado`
- Estado: `INCOMPLETE_INFORMATION`
- Auto-respuesta: ✅ Generada

---

## 🐛 Troubleshooting

### Problema: "No se encontró ningún cliente registrado"

**Solución:**
1. Crea un cliente desde `/admin/users`
2. O ejecuta en Supabase:
   ```sql
   INSERT INTO "User" (id, name, email, phone, "passwordHash", role, active, "createdAt", "updatedAt")
   VALUES (
     'cliente-test-' || gen_random_uuid()::text,
     'Cliente Test',
     'test@cliente.com',
     '+52 33 1234 5678',
     '$2a$10$ejemplo...', -- Hash de alguna contraseña
     'client_enterprise',
     true,
     NOW(),
     NOW()
   );
   ```

---

### Problema: "Error al procesar webhook"

**Solución:**
1. Verifica que el servidor esté corriendo (`npm run dev`)
2. Verifica que `DATABASE_URL` esté configurado
3. Revisa los logs en la consola del servidor

---

### Problema: No se genera auto-respuesta

**Verifica:**
1. Que el requerimiento esté incompleto (falten campos)
2. Que `autoReplyEnabled` esté en `true` (por defecto lo está)
3. Que haya un `categoryRuleId` identificado
4. Que haya `missingFields`

```sql
-- Verificar reglas del request
SELECT 
  id,
  "normalizedContent"->'rules'->>'autoReplyEnabled' as auto_respuesta,
  "normalizedContent"->'rules'->>'categoryRuleId' as categoria,
  "normalizedContent"->'rules'->>'missingFields' as faltantes
FROM "Request"
ORDER BY "createdAt" DESC
LIMIT 1;
```

---

## ✅ Checklist de Verificación

Después de probar las 3 opciones, verifica:

- [ ] Request creado por WhatsApp aparece en `/admin/requests`
- [ ] Request creado por Email aparece en `/admin/requests`
- [ ] Request creado por Plataforma aparece en `/admin/requests`
- [ ] Cada request muestra el source correcto (WhatsApp/Email/Plataforma)
- [ ] Requests incompletos tienen estado `INCOMPLETE_INFORMATION`
- [ ] Requests incompletos muestran "Mensaje sugerido"
- [ ] Requests incompletos tienen mensaje de auto-respuesta en tabla `Message`
- [ ] El toggle de auto-respuesta funciona en `/admin/requests`
- [ ] Los clientes ven sus requests en `/app/requests`

---

## 🎉 ¡Listo!

Si todos los checks pasan, el sistema está funcionando correctamente. Los mensajes de auto-respuesta están listos para ser enviados cuando integres con proveedores externos (SendGrid, Twilio, etc.).

