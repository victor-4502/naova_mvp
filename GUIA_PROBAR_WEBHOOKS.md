# 🧪 Guía Completa: Probar Webhooks de WhatsApp y Email

## 📋 Resumen

Esta guía te ayudará a probar los webhooks de **WhatsApp** y **Email** para verificar que:
1. ✅ Los mensajes llegan correctamente a la base de datos (tabla `Request`)
2. ✅ La inteligencia crea mensajes automáticos con los datos faltantes
3. ✅ Los requests aparecen en `/admin/requests` con su mensaje sugerido

---

## 🚀 Pasos Rápidos

### Paso 1: Asegurar que el Servidor esté Corriendo

```bash
npm run dev
```

Espera a ver:
```
✓ Ready in X seconds
○ Local: http://localhost:3000
```

### Paso 2: Verificar que hay Clientes Registrados

Para que los webhooks funcionen, necesitas tener clientes registrados:

**Opción A: Verificar en Supabase**
```sql
-- Ver clientes con email
SELECT id, name, email, role, active 
FROM "User" 
WHERE role = 'client_enterprise' AND active = true;

-- Ver clientes con teléfono
SELECT id, name, phone, email, role, active 
FROM "User" 
WHERE role = 'client_enterprise' AND phone IS NOT NULL AND active = true;
```

**Opción B: Crear desde la interfaz**
1. Ve a `http://localhost:3000/login`
2. Inicia sesión como admin: `admin@naova.com` / `AdminNaova2024!`
3. Ve a `/admin/clients`
4. Crea un cliente con:
   - **Email** (para probar email webhook)
   - **Teléfono** (para probar WhatsApp webhook)

---

## 📧 Prueba 1: Webhook de Email

### Ejecutar Script de Prueba

En una **nueva terminal** (deja el servidor corriendo en la otra):

```bash
npm run tsx scripts/probar-webhook-email.ts
```

### Qué Deberías Ver

**En la Terminal:**
```
🧪 Probando webhook de email...

✅ Cliente encontrado: Nombre Cliente (cliente@empresa.com)

📧 Payload de email simulado:
{
  "from": {
    "email": "cliente@empresa.com",
    "name": "Nombre Cliente"
  },
  "to": ["compras@naova.com"],
  "subject": "Solicitud de cotización - Tornillos",
  "text": "Necesito tornillos para mi proyecto",
  ...
}

🌐 Enviando a: http://localhost:3000/api/inbox/webhook/email

✅ Webhook procesado exitosamente:
{
  "success": true,
  "requestId": "clxxx..."
}

📋 Request creado:
   ID: clxxx...
   Source: email
   Status: incomplete_information
   Cliente: Nombre Cliente
   Contenido: Solicitud de cotización - Tornillos...

💬 Mensaje de auto-respuesta generado:
   ID: msxxx...
   Source: email
   Direction: outbound
   Processed: false
   Contenido: Hola! Recibimos tu solicitud...

📊 Reglas aplicadas:
   Categoría: materiales_genericos
   Completitud: 0.4
   Campos presentes: categoria
   Campos faltantes: cantidad, unidad, especificaciones
   Auto-respuesta: Activada
```

**Si ves errores:**
- ❌ "No se encontró ningún cliente registrado" → Crea un cliente primero
- ❌ "Error al conectar con el servidor" → Verifica que `npm run dev` esté corriendo
- ❌ "Error en webhook" → Revisa la consola del servidor para más detalles

### Verificar en la Interfaz Web

1. **Ve a `/admin/requests`** (asegúrate de estar logueado como admin)
2. **Deberías ver:**
   - ✅ Un nuevo request con badge "Email"
   - ✅ Estado: `incomplete_information`
   - ✅ Sección "Mensaje sugerido para pedir información faltante" con el texto generado
   - ✅ Toggle "Activar respuesta automática por el mismo canal" (activado por defecto)

### Verificar en la Base de Datos

**Ver el Request creado:**
```sql
SELECT 
  id,
  source,
  status,
  "pipelineStage",
  category,
  "normalizedContent"->'rules'->>'categoryRuleId' as categoria,
  "normalizedContent"->'rules'->>'completeness' as completitud,
  "normalizedContent"->'rules'->>'autoReplyEnabled' as auto_respuesta,
  "normalizedContent"->'rules'->>'missingFields' as campos_faltantes,
  "createdAt"
FROM "Request"
WHERE source = 'email'
ORDER BY "createdAt" DESC
LIMIT 1;
```

**Ver el Mensaje de Auto-Respuesta:**
```sql
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
  AND r.source = 'email'
ORDER BY m."createdAt" DESC
LIMIT 1;
```

---

## 📱 Prueba 2: Webhook de WhatsApp

### Ejecutar Script de Prueba

En la misma terminal donde probaste email:

```bash
npm run tsx scripts/probar-webhook-whatsapp.ts
```

### Qué Deberías Ver

**En la Terminal:**
```
🧪 Probando webhook de WhatsApp...

✅ Cliente encontrado: Nombre Cliente (+52 33 1234 5678)

📱 Payload de WhatsApp simulado:
{
  "from": "523312345678",
  "to": "523316083075",
  "message": {
    "id": "test-whatsapp-1234567890",
    "type": "text",
    "text": {
      "body": "Necesito servicio de mantenimiento"
    }
  },
  ...
}

🌐 Enviando a: http://localhost:3000/api/inbox/webhook/whatsapp

✅ Webhook procesado exitosamente:
{
  "success": true,
  "requestId": "clxxx..."
}

📋 Request creado:
   ID: clxxx...
   Source: whatsapp
   Status: incomplete_information
   Cliente: Nombre Cliente
   Contenido: Necesito servicio de mantenimiento

💬 Mensaje de auto-respuesta generado:
   ID: msxxx...
   Source: whatsapp
   Direction: outbound
   Processed: false
   Contenido: Hola! Recibimos tu solicitud de servicio...

📊 Reglas aplicadas:
   Categoría: servicios
   Completitud: 0.3
   Campos presentes: categoria
   Campos faltantes: tipo_servicio, frecuencia, presupuesto, fecha_inicio
   Auto-respuesta: Activada
```

### Verificar en la Interfaz Web

1. **Ve a `/admin/requests`**
2. **Deberías ver:**
   - ✅ Un nuevo request con badge "WhatsApp" (verde)
   - ✅ Estado: `incomplete_information`
   - ✅ Mensaje sugerido generado automáticamente

### Verificar en la Base de Datos

```sql
-- Ver request de WhatsApp
SELECT 
  id,
  source,
  status,
  "rawContent",
  "normalizedContent"->'rules' as reglas
FROM "Request"
WHERE source = 'whatsapp'
ORDER BY "createdAt" DESC
LIMIT 1;

-- Ver mensaje de auto-respuesta de WhatsApp
SELECT 
  m.id,
  m.source,
  m.direction,
  m.content,
  r.id as request_id
FROM "Message" m
LEFT JOIN "Request" r ON m."requestId" = r.id
WHERE m.direction = 'outbound'
  AND r.source = 'whatsapp'
ORDER BY m."createdAt" DESC
LIMIT 1;
```

---

## 🔍 Verificar la Inteligencia del Sistema

### ¿Cómo Verificar que la Inteligencia Funciona?

1. **Análisis de Contenido:**
   - El sistema extrae productos mencionados
   - Identifica categorías automáticamente
   - Detecta campos faltantes según las reglas

2. **Generación de Mensaje:**
   - Si el request está incompleto, genera un mensaje personalizado
   - El mensaje pide específicamente los campos faltantes
   - El mensaje está en español y es amigable

3. **Reglas Aplicadas:**
   - Cada categoría tiene reglas específicas
   - El sistema calcula un "score de completitud" (0-1)
   - Si completitud < 0.8, se marca como incompleto

### Ejemplos de Requerimientos para Probar

**Incompleto (debería generar auto-respuesta):**
```
Necesito tornillos
```

**Más Completo (puede que no genere auto-respuesta):**
```
Necesito 100 tornillos de acero inoxidable, cabeza plana, tamaño M8x20mm, para proyecto urgente, presupuesto $5,000
```

**Servicio Incompleto:**
```
Quiero servicio de mantenimiento
```

**Servicio Completo:**
```
Necesito servicio de mantenimiento preventivo para máquina CNC, frecuencia mensual, presupuesto requerido, inicio en 2 semanas
```

---

## 🎯 Checklist de Verificación

### Para Email:
- [ ] El script se ejecuta sin errores
- [ ] Se crea un request en la BD con `source='email'`
- [ ] El request tiene estado `incomplete_information`
- [ ] Se genera un mensaje en tabla `Message` con `direction='outbound'`
- [ ] El mensaje tiene el contenido de auto-respuesta
- [ ] Aparece en `/admin/requests` con badge "Email"
- [ ] Se muestra el "Mensaje sugerido para pedir información faltante"
- [ ] El toggle de auto-respuesta está activado

### Para WhatsApp:
- [ ] El script se ejecuta sin errores
- [ ] Se crea un request en la BD con `source='whatsapp'`
- [ ] El request tiene estado `incomplete_information`
- [ ] Se genera un mensaje en tabla `Message` con `direction='outbound'`
- [ ] El mensaje tiene el contenido de auto-respuesta
- [ ] Aparece en `/admin/requests` con badge "WhatsApp"
- [ ] Se muestra el "Mensaje sugerido para pedir información faltante"
- [ ] El toggle de auto-respuesta está activado

---

## 🐛 Troubleshooting

### Problema: "No se encontró ningún cliente registrado"

**Solución:**
1. Ve a `/admin/clients` o ejecuta este SQL:
```sql
INSERT INTO "User" (id, name, email, "passwordHash", role, active, "createdAt", "updatedAt")
VALUES (
  'test-client-' || gen_random_uuid()::text,
  'Cliente Test',
  'test@cliente.com',
  '$2a$10$rJvQeJjPqXqXqXqXqXqXqeXqXqXqXqXqXqXqXqXqXqXqXqXqXqXq', -- password123
  'client_enterprise',
  true,
  NOW(),
  NOW()
);
```

### Problema: "Error al conectar con el servidor"

**Solución:**
1. Verifica que el servidor esté corriendo: `npm run dev`
2. Verifica que esté en el puerto correcto: `http://localhost:3000`
3. Verifica que no haya errores en la consola del servidor

### Problema: El request se crea pero no hay mensaje de auto-respuesta

**Posibles causas:**
1. El requerimiento está completo (completitud >= 0.8)
2. No se identificó una categoría
3. `autoReplyEnabled` está desactivado

**Verificar:**
```sql
SELECT 
  id,
  status,
  "normalizedContent"->'rules'->>'autoReplyEnabled' as auto_reply,
  "normalizedContent"->'rules'->>'categoryRuleId' as categoria,
  "normalizedContent"->'rules'->>'completeness' as completitud,
  "normalizedContent"->'rules'->>'missingFields' as faltantes
FROM "Request"
ORDER BY "createdAt" DESC
LIMIT 1;
```

### Problema: El mensaje sugerido no aparece en `/admin/requests`

**Solución:**
1. Verifica que el request tenga estado `incomplete_information`
2. Verifica que haya `missingFields` en las reglas
3. Recarga la página
4. Verifica que tengas permisos de admin

---

## 📊 Ver Todos los Requests Creados

```sql
-- Ver todos los requests recientes
SELECT 
  id,
  source,
  status,
  "pipelineStage",
  category,
  "rawContent",
  "normalizedContent"->'rules'->>'completeness' as completitud,
  "normalizedContent"->'rules'->>'missingFields' as faltantes,
  "createdAt"
FROM "Request"
ORDER BY "createdAt" DESC
LIMIT 10;

-- Ver todos los mensajes de auto-respuesta pendientes
SELECT 
  m.id,
  m.source,
  m.direction,
  LEFT(m.content, 100) as contenido_preview,
  m.processed,
  r.id as request_id,
  r.source as request_source,
  r.status as request_status
FROM "Message" m
LEFT JOIN "Request" r ON m."requestId" = r.id
WHERE m.direction = 'outbound'
ORDER BY m."createdAt" DESC
LIMIT 10;
```

---

## 🎉 ¡Listo!

Si completaste todos los pasos y verificaste todo el checklist, los webhooks están funcionando correctamente. Ahora puedes:

1. **Probar con diferentes tipos de requerimientos** (completos e incompletos)
2. **Ver cómo cambia el mensaje sugerido** según los campos faltantes
3. **Activar/desactivar auto-respuesta** desde `/admin/requests`
4. **Preparar para integración real** con proveedores de WhatsApp/Email

---

## 📚 Documentación Relacionada

- `COMO_PROBAR_AUTO_RESPUESTA.md` - Más detalles sobre auto-respuestas
- `ESTADO_INTEGRACION_WEBHOOKS.md` - Estado de integraciones
- `IDENTIFICACION_CLIENTE.md` - Cómo se identifica al cliente
- `PROCESO_COMPRA_NAOVA.md` - Proceso completo de compra

---

**¿Alguna pregunta? Revisa la documentación o los logs del servidor para más detalles.**

