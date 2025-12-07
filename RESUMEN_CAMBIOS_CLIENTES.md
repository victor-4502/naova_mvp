# 📋 Resumen de Cambios - Sistema de Clientes Mejorado

## ✅ Cambios Implementados

### 1. **Requests sin Cliente Asignado**
- ✅ Los requests ahora pueden crearse **sin cliente asignado** (`clientId` es nullable)
- ✅ Si no se identifica al cliente en Email/WhatsApp, se crea el request igual pero sin `clientId`
- ✅ El admin puede asignar manualmente estos requests a clientes después

### 2. **Múltiples Contactos por Cliente**
- ✅ Nuevo modelo `ClientContact` para emails y teléfonos adicionales
- ✅ Cada cliente puede tener múltiples emails y teléfonos
- ✅ Se puede marcar un contacto como "principal" (`isPrimary`)
- ✅ Se puede agregar etiquetas a los contactos ("Personal", "Trabajo", "WhatsApp", etc.)

### 3. **Identificación Mejorada**
- ✅ `EmailProcessor` ahora busca en:
  - Email principal del usuario
  - Contactos adicionales de tipo "email"
- ✅ `WhatsAppProcessor` ahora busca en:
  - Teléfono principal del usuario
  - Contactos adicionales de tipo "phone"
  - Normaliza números (quita espacios, +, etc.)

### 4. **API de Creación de Clientes Mejorada**
- ✅ Acepta `additionalEmails[]` y `additionalPhones[]`
- ✅ Crea automáticamente los contactos adicionales
- ✅ Genera usuario y contraseña automáticamente
- ✅ Retorna las credenciales para compartir con el cliente

### 5. **Seed con Usuario Admin**
- ✅ Crea usuario admin por defecto: `admin@naova.com` / `AdminNaova2024!`
- ✅ Crea usuario operador por defecto: `operador@naova.com` / `OperadorNaova2024!`
- ✅ Verifica si ya existen antes de crear (idempotente)

---

## 🗄️ Cambios en Base de Datos

### Nuevo Modelo: `ClientContact`
```prisma
model ClientContact {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(...)
  type        String   // "email" | "phone"
  value       String   // Email o número
  label       String?  // "Personal", "Trabajo", etc.
  isPrimary   Boolean  @default(false)
  verified    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@unique([userId, type, value])
  @@index([userId])
  @@index([type, value])
}
```

### Cambios en `Request`
- `clientId` ahora es **nullable** (`String?`)
- `client` relación ahora es **opcional** (`User?`)
- `onDelete: SetNull` en lugar de `Cascade`

### Cambios en `User`
- Nueva relación: `clientContacts ClientContact[]`

---

## 📝 Cómo Usar

### 1. Ejecutar Migración
```bash
# Generar Prisma Client con los nuevos modelos
npm run prisma:generate

# Crear migración
npm run prisma:migrate

# O aplicar directamente (desarrollo)
npm run prisma:push
```

### 2. Ejecutar Seed (Crear Admin)
```bash
npm run prisma:seed
```

### 3. Crear Cliente con Múltiples Contactos
```typescript
POST /api/admin/create-client
{
  "name": "Empresa ABC",
  "email": "contacto@empresa.com",
  "company": "Empresa ABC S.A.",
  "phone": "521234567890",
  "plan": "trial",
  "additionalEmails": [
    {
      "email": "compras@empresa.com",
      "label": "Compras",
      "isPrimary": false
    },
    {
      "email": "gerente@empresa.com",
      "label": "Gerente",
      "isPrimary": true
    }
  ],
  "additionalPhones": [
    {
      "phone": "521234567891",
      "label": "WhatsApp Principal",
      "isPrimary": true
    },
    {
      "phone": "521234567892",
      "label": "Teléfono Oficina",
      "isPrimary": false
    }
  ]
}
```

### 4. Ver Requests sin Cliente
Los requests sin cliente asignado aparecerán en el Pipeline con `clientId: null`. El admin puede:
- Verlos en una columna especial "Sin Asignar"
- Asignarlos manualmente a un cliente
- O crear un nuevo cliente desde el request

---

## 🔍 Flujo de Identificación Mejorado

### Email:
1. Busca en `User.email` (email principal)
2. Si no encuentra, busca en `ClientContact` donde `type = 'email'` y `value = email`
3. Si encuentra, asocia el request al cliente
4. Si NO encuentra, crea request con `clientId = null`

### WhatsApp:
1. Normaliza el número (quita espacios, +, etc.)
2. Busca en `User.phone` (teléfono principal) - búsqueda parcial
3. Si no encuentra, busca en `ClientContact` donde `type = 'phone'` y `value` contiene el número
4. Si encuentra, asocia el request al cliente
5. Si NO encuentra, crea request con `clientId = null`

---

## 🎯 Próximos Pasos Recomendados

1. **UI para Gestionar Contactos:**
   - Agregar/editar/eliminar contactos desde el panel admin
   - Ver contactos del cliente en su perfil

2. **Asignación Manual de Requests:**
   - Interfaz para asignar requests sin cliente a clientes existentes
   - O crear nuevo cliente desde un request sin asignar

3. **Respuestas Genéricas:**
   - Implementar envío de respuesta genérica cuando no se identifica cliente
   - Template de respuesta: "Hemos recibido tu solicitud. Te contactaremos pronto."

4. **Verificación de Contactos:**
   - Sistema para verificar emails (enviar código)
   - Sistema para verificar teléfonos (enviar SMS/WhatsApp)

---

## 📚 Archivos Modificados

- `prisma/schema-pos.prisma` - Nuevo modelo ClientContact, Request nullable
- `prisma/schema.prisma` - Copiado desde schema-pos.prisma
- `lib/services/inbox/InboxService.ts` - clientId opcional
- `lib/services/inbox/EmailProcessor.ts` - Búsqueda mejorada, clientId opcional
- `lib/services/inbox/WhatsAppProcessor.ts` - Búsqueda mejorada, clientId opcional
- `app/api/inbox/webhook/email/route.ts` - Crea request sin cliente si no encuentra
- `app/api/inbox/webhook/whatsapp/route.ts` - Crea request sin cliente si no encuentra
- `app/api/admin/create-client/route.ts` - Acepta múltiples contactos
- `prisma/seed.ts` - Crea usuarios admin y operador
- `package.json` - Agregado script `prisma:seed`

---

## ✅ Testing

Para probar los cambios:

1. **Crear cliente con múltiples contactos:**
   ```bash
   curl -X POST http://localhost:3000/api/admin/create-client \
     -H "Content-Type: application/json" \
     -H "Cookie: naova_token=..." \
     -d '{
       "name": "Test Client",
       "email": "test@test.com",
       "additionalEmails": [{"email": "otro@test.com"}],
       "additionalPhones": [{"phone": "521234567890"}]
     }'
   ```

2. **Enviar email desde contacto adicional:**
   - El sistema debería identificar al cliente correctamente

3. **Enviar email desde email no registrado:**
   - El sistema debería crear request sin cliente
   - Aparecerá en Pipeline sin asignar

---

**Fecha de implementación:** $(date)

