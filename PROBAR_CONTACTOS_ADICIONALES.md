# 🧪 Probar Webhooks desde Contactos Adicionales

## 📋 Resumen

Los scripts ahora están configurados para simular mensajes que llegan desde **contactos adicionales** del cliente (no desde el email/teléfono principal). Esto verifica que el sistema identifica correctamente al cliente desde cualquier contacto registrado.

---

## ✅ Qué Verifica

1. ✅ El sistema busca en contactos adicionales cuando no encuentra en el principal
2. ✅ Identifica correctamente al cliente desde un contacto adicional
3. ✅ Asocia el request al cliente correcto
4. ✅ Genera auto-respuestas inteligentes según los datos faltantes

---

## 🚀 Pasos para Probar

### Paso 1: Asegurar que hay Clientes con Contactos Adicionales

**Opción A: Desde la Interfaz Admin**

1. Ve a `http://localhost:3000/login`
2. Inicia sesión como admin: `admin@naova.com` / `AdminNaova2024!`
3. Ve a `/admin/clients`
4. Selecciona un cliente o crea uno nuevo
5. En la sección "Contactos del Cliente":
   - Agrega un **email adicional** (ej: `compras@empresa.com`)
   - Agrega un **teléfono adicional** (ej: `+52 33 1234 5678`)

**Opción B: Desde Supabase (SQL)**

```sql
-- Primero crear o encontrar un cliente
INSERT INTO "User" (id, name, email, "passwordHash", role, active, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'Cliente Test',
  'cliente-principal@empresa.com',
  '$2a$10$ejemplo...', -- Hash de password123
  'client_enterprise',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING
RETURNING id;

-- Luego agregar contactos adicionales (reemplaza USER_ID con el ID del cliente)
INSERT INTO "ClientContact" (id, "userId", type, value, label, "isPrimary", verified, "createdAt", "updatedAt")
VALUES
  (gen_random_uuid()::text, 'USER_ID', 'email', 'compras@empresa.com', 'Compras', false, false, NOW(), NOW()),
  (gen_random_uuid()::text, 'USER_ID', 'phone', '+52 33 1234 5678', 'WhatsApp', false, false, NOW(), NOW());
```

---

### Paso 2: Iniciar el Servidor

```bash
npm run dev
```

Espera a ver: `✓ Ready in X seconds`

---

### Paso 3: Probar Webhook de WhatsApp

En una **nueva terminal**:

```bash
npm run tsx scripts/probar-webhook-whatsapp.ts
```

**Qué deberías ver:**

```
🧪 Probando webhook de WhatsApp desde un CONTACTO ADICIONAL del cliente...

✅ Cliente encontrado: Cliente Test
   Email principal: cliente-principal@empresa.com
   Teléfono principal: No tiene
   📱 Usando contacto adicional: +52 33 1234 5678 (WhatsApp)

📱 Payload de WhatsApp simulado:
{
  "from": "523312345678",
  ...
}

✅ Webhook procesado exitosamente

📋 Request creado:
   Source: whatsapp
   Status: incomplete_information
   Cliente: Cliente Test  ← ✅ Identificado correctamente desde contacto adicional

💬 Mensaje de auto-respuesta generado:
   Contenido: Hola! Recibimos tu solicitud...
```

**Verificaciones importantes:**
- ✅ El mensaje usa el **contacto adicional**, no el teléfono principal
- ✅ El cliente se identifica correctamente
- ✅ El request se asocia al cliente correcto

---

### Paso 4: Probar Webhook de Email

En la misma terminal:

```bash
npm run tsx scripts/probar-webhook-email.ts
```

**Qué deberías ver:**

```
🧪 Probando webhook de email desde un CONTACTO ADICIONAL del cliente...

✅ Cliente encontrado: Cliente Test
   Email principal: cliente-principal@empresa.com
   📧 Usando contacto adicional: compras@empresa.com (Compras)

📧 Payload de email simulado:
{
  "from": {
    "email": "compras@empresa.com",
    ...
  }
}

✅ Webhook procesado exitosamente

📋 Request creado:
   Source: email
   Status: incomplete_information
   Cliente: Cliente Test  ← ✅ Identificado correctamente desde contacto adicional

💬 Mensaje de auto-respuesta generado:
   Contenido: Hola! Recibimos tu solicitud...
```

**Verificaciones importantes:**
- ✅ El email usa el **contacto adicional**, no el email principal
- ✅ El cliente se identifica correctamente
- ✅ El request se asocia al cliente correcto

---

## 🔍 Verificar en la Interfaz Web

### En `/admin/requests`:

1. Deberías ver los requests creados:
   - ✅ Uno con badge "WhatsApp"
   - ✅ Uno con badge "Email"
   - ✅ Ambos con el cliente correctamente identificado

2. Para cada request:
   - ✅ Estado: `incomplete_information`
   - ✅ "Mensaje sugerido para pedir información faltante" visible
   - ✅ Toggle de auto-respuesta activado

---

## 🔍 Verificar en la Base de Datos

```sql
-- Ver requests creados con su cliente
SELECT 
  r.id,
  r.source,
  r.status,
  r."clientId",
  u.name as cliente,
  u.email as email_principal,
  r."rawContent"
FROM "Request" r
LEFT JOIN "User" u ON r."clientId" = u.id
ORDER BY r."createdAt" DESC
LIMIT 5;

-- Ver qué contacto se usó para identificar al cliente
SELECT 
  cc.type,
  cc.value as contacto_usado,
  cc.label,
  u.name as cliente,
  u.email as email_principal
FROM "ClientContact" cc
JOIN "User" u ON cc."userId" = u.id
WHERE u.id IN (
  SELECT DISTINCT "clientId" FROM "Request" 
  WHERE "createdAt" > NOW() - INTERVAL '1 hour'
)
ORDER BY cc."createdAt" DESC;
```

---

## ✅ Checklist de Verificación

### WhatsApp desde Contacto Adicional:
- [ ] El script encuentra un cliente con contacto adicional de teléfono
- [ ] El mensaje simulado usa el contacto adicional, no el principal
- [ ] El cliente se identifica correctamente desde el contacto adicional
- [ ] El request se crea y se asocia al cliente correcto
- [ ] Se genera mensaje de auto-respuesta
- [ ] Aparece en `/admin/requests` con cliente correcto

### Email desde Contacto Adicional:
- [ ] El script encuentra un cliente con contacto adicional de email
- [ ] El email simulado usa el contacto adicional, no el principal
- [ ] El cliente se identifica correctamente desde el contacto adicional
- [ ] El request se crea y se asocia al cliente correcto
- [ ] Se genera mensaje de auto-respuesta
- [ ] Aparece en `/admin/requests` con cliente correcto

---

## 🐛 Troubleshooting

### "No se encontró ningún cliente con contactos adicionales"

**Solución:**
1. Ve a `/admin/clients`
2. Selecciona un cliente
3. Agrega contactos adicionales:
   - Email adicional (para probar email)
   - Teléfono adicional (para probar WhatsApp)

O ejecuta el SQL de ejemplo arriba para crear uno de prueba.

### El cliente no se identifica correctamente

**Verificar:**
1. El contacto adicional está correctamente guardado en `ClientContact`
2. El tipo es correcto (`email` o `phone`)
3. El valor coincide exactamente (puede haber diferencias de formato)

**SQL para verificar:**
```sql
-- Ver contactos de un cliente
SELECT 
  cc.id,
  cc.type,
  cc.value,
  cc.label,
  u.name as cliente,
  u.email as email_principal
FROM "ClientContact" cc
JOIN "User" u ON cc."userId" = u.id
WHERE u.role = 'client_enterprise'
ORDER BY u.name, cc.type, cc.value;
```

---

## 📊 Diferencia con Contactos Principales

| Aspecto | Contacto Principal | Contacto Adicional |
|---------|-------------------|-------------------|
| **Para Login** | ✅ Sí (email principal) | ❌ No |
| **Para Identificar Requests** | ✅ Sí | ✅ Sí |
| **Búsqueda del Sistema** | Primero busca aquí | Luego busca aquí si no encuentra |
| **Ejemplo** | `User.email` | `ClientContact.value` donde `type='email'` |

---

## 🎉 ¡Listo!

Si completaste todas las verificaciones, el sistema está funcionando correctamente:
- ✅ Identifica clientes desde contactos adicionales
- ✅ Asocia requests correctamente
- ✅ Genera auto-respuestas inteligentes

**Próximo paso:** Puedes probar con diferentes tipos de requerimientos (completos e incompletos) para ver cómo cambia el mensaje sugerido.

