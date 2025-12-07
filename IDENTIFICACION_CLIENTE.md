# 🔍 Identificación del Cliente en Naova 2.0

## 📋 Resumen

En Naova, **cada requerimiento se asocia automáticamente a un cliente** para que todo su historial quede registrado correctamente. El sistema identifica al cliente de diferentes formas según el canal por el que envía el requerimiento.

---

## 🎯 ¿Dónde se Identifica al Cliente?

La identificación del cliente ocurre en **3 puntos diferentes** según el canal:

### 1. **Plataforma Web** (`/app/requirements`)
- **Cuándo:** Cuando el cliente está logueado
- **Cómo:** Se usa el token JWT de la sesión
- **Dónde:** `app/api/requirements/route.ts` y `app/api/inbox/ingest/route.ts`

### 2. **Email** (`/api/inbox/webhook/email`)
- **Cuándo:** Cuando llega un email al webhook
- **Cómo:** Se busca al cliente por su dirección de email
- **Dónde:** `lib/services/inbox/EmailProcessor.ts`

### 3. **WhatsApp** (`/api/inbox/webhook/whatsapp`)
- **Cuándo:** Cuando llega un mensaje de WhatsApp
- **Cómo:** Se busca al cliente por su número de teléfono
- **Dónde:** `lib/services/inbox/WhatsAppProcessor.ts`

---

## 🔐 Método 1: Plataforma Web (Autenticado)

### Flujo Completo:

```
1. Cliente inicia sesión → Se genera token JWT
2. Cliente crea requerimiento → Token se envía en cookie
3. API extrae token → getCurrentUser() obtiene userId
4. Requerimiento se crea con clientId = userId
```

### Código Relevante:

**`app/api/inbox/ingest/route.ts`** (Línea 10-28):
```typescript
export async function POST(request: NextRequest) {
  // 1. Verificar autenticación
  const user = await getCurrentUser()  // ← Extrae userId del token JWT
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  // 2. Crear request con clientId del usuario autenticado
  const newRequest = await InboxService.createRequest({
    source,
    clientId: user.userId,  // ← Se asocia al cliente autenticado
    content,
    attachments,
    metadata,
  })
}
```

**`app/api/requirements/route.ts`** (Línea 17-30):
```typescript
export async function GET(request: NextRequest) {
  // Extraer userId del header (seteado por middleware)
  const userId = request.headers.get('x-user-id')
  
  // Filtrar requerimientos por cliente
  const where = userRole === 'admin' 
    ? {}  // Admin ve todos
    : { clientId: userId }  // Cliente solo ve los suyos
}
```

### Ventajas:
- ✅ **Automático**: No requiere identificación manual
- ✅ **Seguro**: Solo el cliente autenticado puede crear requerimientos
- ✅ **Inmediato**: Se asocia al instante

### Requisitos:
- Cliente debe estar logueado
- Token JWT válido en cookies

---

## 📧 Método 2: Email (Webhook)

### Flujo Completo:

```
1. Cliente envía email → compras@naova.com
2. Servicio de email (SendGrid, Mailgun, etc.) → Webhook a /api/inbox/webhook/email
3. EmailProcessor.identifyClient() → Busca cliente por email
4. Si encuentra cliente → Crea request con clientId
5. Si NO encuentra → Log warning, no crea request
```

### Código Relevante:

**`app/api/inbox/webhook/email/route.ts`** (Línea 13-23):
```typescript
export async function POST(request: NextRequest) {
  const body = await request.json()
  
  // 1. Identificar cliente desde el email
  const clientId = await EmailProcessor.identifyClient(body.from.email)
  
  if (!clientId) {
    // Cliente no encontrado
    console.warn(`Cliente no encontrado para email: ${body.from.email}`)
    return NextResponse.json({ received: true }, { status: 200 })
  }
  
  // 2. Procesar email y crear request
  const newRequest = await EmailProcessor.processEmail(body, clientId)
}
```

**`lib/services/inbox/EmailProcessor.ts`** (Línea 82-91):
```typescript
static async identifyClient(email: string): Promise<string | null> {
  // Buscar usuario por email y rol de cliente
  const user = await prisma.user.findUnique({
    where: {
      email,  // ← Busca por email
      role: 'client_enterprise',  // ← Solo clientes
    },
  })
  
  return user?.id || null
}
```

### Ventajas:
- ✅ **Conveniente**: Cliente solo envía email, no necesita login
- ✅ **Automático**: Sistema identifica automáticamente
- ✅ **Multi-dispositivo**: Funciona desde cualquier cliente de email

### Requisitos:
- Cliente debe tener email registrado en la base de datos
- Email debe coincidir exactamente con el email del usuario

### ⚠️ Casos Especiales:

**Si el email NO está registrado:**
- El sistema registra un warning en logs
- NO crea el request
- El email se recibe pero no se procesa
- **Solución:** Admin debe registrar el email del cliente primero

**Si hay múltiples usuarios con el mismo email:**
- Prisma `findUnique` solo devuelve uno (porque email es `@unique`)
- No debería pasar, pero si pasa, se usa el primero encontrado

---

## 📱 Método 3: WhatsApp (Webhook)

### Flujo Completo:

```
1. Cliente envía WhatsApp → Número de Naova
2. WhatsApp Business API → Webhook a /api/inbox/webhook/whatsapp
3. WhatsAppProcessor.identifyClient() → Busca cliente por número de teléfono
4. Si encuentra cliente → Crea request con clientId
5. Si NO encuentra → Log warning, no crea request
```

### Código Relevante:

**`app/api/inbox/webhook/whatsapp/route.ts`** (Línea 13-23):
```typescript
export async function POST(request: NextRequest) {
  const body = await request.json()
  
  // 1. Identificar cliente desde número de WhatsApp
  const clientId = await WhatsAppProcessor.identifyClient(body.from)
  
  if (!clientId) {
    // Cliente no encontrado
    console.warn(`Cliente no encontrado para WhatsApp: ${body.from}`)
    return NextResponse.json({ received: true }, { status: 200 })
  }
  
  // 2. Procesar mensaje y crear request
  const newRequest = await WhatsAppProcessor.processWebhook(body, clientId)
}
```

**`lib/services/inbox/WhatsAppProcessor.ts`** (Línea 92-102):
```typescript
static async identifyClient(whatsappNumber: string): Promise<string | null> {
  // Buscar usuario por número de teléfono y rol de cliente
  const user = await prisma.user.findFirst({
    where: {
      phone: whatsappNumber,  // ← Busca por número de teléfono
      role: 'client_enterprise',  // ← Solo clientes
    },
  })
  
  return user?.id || null
}
```

### Ventajas:
- ✅ **Muy conveniente**: Cliente solo envía WhatsApp
- ✅ **Popular**: WhatsApp es muy usado en Latinoamérica
- ✅ **Rápido**: Respuesta inmediata

### Requisitos:
- Cliente debe tener número de teléfono registrado en la base de datos
- Número debe coincidir exactamente con el número de WhatsApp

### ⚠️ Casos Especiales:

**Formato del número:**
- WhatsApp puede enviar números en formato: `521234567890` (con código de país)
- La base de datos puede tener: `+52 1234567890` o `1234567890`
- **Solución:** Normalizar números antes de buscar (quitar espacios, +, etc.)

**Si el número NO está registrado:**
- El sistema registra un warning en logs
- NO crea el request
- El mensaje se recibe pero no se procesa
- **Solución:** Admin debe registrar el número del cliente primero

---

## 🗄️ Estructura en Base de Datos

### Modelo User (Prisma Schema):

```prisma
model User {
  id           String   @id @default(cuid())
  name         String
  email        String   @unique  // ← Usado para identificar en Email
  passwordHash String
  role         UserRole @default(client_enterprise)
  company      String?
  phone        String?  // ← Usado para identificar en WhatsApp
  active       Boolean  @default(true)
  
  // Relations
  requests         Request[]  // ← Todos los requests del cliente
  purchaseOrders   PurchaseOrder[]
  // ...
}
```

### Modelo Request (Prisma Schema):

```prisma
model Request {
  id                String         @id @default(cuid())
  source            RequestSource  // email, whatsapp, web, etc.
  sourceId          String?        // ID del mensaje original
  clientId          String         // ← ID del cliente (FK a User)
  client            User           @relation(fields: [clientId], references: [id])
  
  status            RequestStatus
  pipelineStage     PipelineStage
  rawContent        String
  // ...
  
  @@index([clientId])  // ← Índice para búsquedas rápidas
}
```

---

## 🔄 Flujo Completo de Asociación

### Ejemplo: Cliente envía requerimiento por Email

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Cliente envía email: "Necesito 100 tornillos M8"       │
│    Desde: cliente@empresa.com                              │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Webhook recibe email en /api/inbox/webhook/email         │
│    Payload: { from: { email: "cliente@empresa.com" } }     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. EmailProcessor.identifyClient("cliente@empresa.com")     │
│    → Busca en DB: User donde email = "cliente@empresa.com" │
│    → Encuentra: User { id: "abc123", email: "..." }        │
│    → Retorna: "abc123"                                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. EmailProcessor.processEmail(payload, "abc123")           │
│    → Extrae contenido del email                             │
│    → Crea Request con clientId = "abc123"                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Request creado en DB:                                    │
│    {                                                         │
│      id: "req_xyz",                                          │
│      clientId: "abc123",  ← Asociado al cliente            │
│      source: "email",                                        │
│      rawContent: "Necesito 100 tornillos M8",               │
│      status: "new_request"                                    │
│    }                                                         │
└─────────────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Request aparece en:                                      │
│    - Pipeline Kanban del cliente "abc123"                   │
│    - Dashboard del cliente                                   │
│    - Historial de compras del cliente                       │
│    - Reportes del cliente                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Verificación de Asociación Correcta

### Cómo verificar que un request está asociado al cliente correcto:

1. **En la Base de Datos:**
```sql
-- Ver requests de un cliente específico
SELECT r.*, u.email, u.name 
FROM "Request" r
JOIN "User" u ON r."clientId" = u.id
WHERE u.email = 'cliente@empresa.com';
```

2. **En la API:**
```typescript
// GET /api/requests
// Solo devuelve requests del cliente autenticado
const requests = await prisma.request.findMany({
  where: { clientId: user.userId }  // ← Filtrado automático
})
```

3. **En el Frontend:**
- Cliente solo ve sus propios requests en el dashboard
- Pipeline Kanban muestra solo requests del cliente
- Reportes muestran solo datos del cliente

---

## 🛠️ Configuración Necesaria

### Para que funcione la identificación:

1. **Email:**
   - Cliente debe tener `email` registrado en `User.email`
   - Email debe ser único (`@unique` en Prisma)
   - Webhook de email debe estar configurado

2. **WhatsApp:**
   - Cliente debe tener `phone` registrado en `User.phone`
   - Formato de número debe coincidir
   - Webhook de WhatsApp debe estar configurado

3. **Web:**
   - Cliente debe estar autenticado (tener token JWT)
   - Token debe estar en cookies (`naova_token`)

---

## 🚨 Problemas Comunes y Soluciones

### Problema 1: Email no se asocia a cliente

**Síntoma:**
- Cliente envía email pero no aparece en el sistema
- Logs muestran: "Cliente no encontrado para email: X"

**Solución:**
1. Verificar que el email está registrado en la base de datos:
```sql
SELECT * FROM "User" WHERE email = 'cliente@empresa.com';
```

2. Si no existe, crear el usuario:
```typescript
await prisma.user.create({
  data: {
    email: 'cliente@empresa.com',
    name: 'Nombre Cliente',
    role: 'client_enterprise',
    // ...
  }
})
```

3. Verificar que el email coincide exactamente (case-sensitive en algunos casos)

---

### Problema 2: WhatsApp no se asocia a cliente

**Síntoma:**
- Cliente envía WhatsApp pero no aparece en el sistema
- Logs muestran: "Cliente no encontrado para WhatsApp: X"

**Solución:**
1. Verificar formato del número:
   - WhatsApp puede enviar: `521234567890`
   - DB puede tener: `+52 1234567890`
   - Normalizar antes de buscar

2. Verificar que el número está registrado:
```sql
SELECT * FROM "User" WHERE phone LIKE '%1234567890%';
```

3. Actualizar número si es necesario:
```typescript
await prisma.user.update({
  where: { id: userId },
  data: { phone: '521234567890' }  // Formato de WhatsApp
})
```

---

### Problema 3: Request aparece en cliente incorrecto

**Síntoma:**
- Request se asocia a un cliente diferente

**Solución:**
1. Verificar logs para ver qué `clientId` se usó
2. Verificar que el email/número corresponde al cliente correcto
3. Si es necesario, actualizar el `clientId` del request:
```typescript
await prisma.request.update({
  where: { id: requestId },
  data: { clientId: correctClientId }
})
```

---

## 📊 Resumen de Identificación por Canal

| Canal | Método de Identificación | Campo Usado | Archivo |
|-------|-------------------------|-------------|---------|
| **Web** | Token JWT (sesión) | `user.userId` del token | `app/api/inbox/ingest/route.ts` |
| **Email** | Búsqueda por email | `User.email` | `lib/services/inbox/EmailProcessor.ts` |
| **WhatsApp** | Búsqueda por teléfono | `User.phone` | `lib/services/inbox/WhatsAppProcessor.ts` |

---

## 🎯 Mejores Prácticas

1. **Registrar información completa:**
   - Siempre registrar `email` y `phone` al crear usuarios
   - Normalizar formatos (teléfonos, emails)

2. **Validar antes de crear:**
   - Verificar que el cliente existe antes de procesar
   - Mostrar error claro si no se encuentra

3. **Logging:**
   - Registrar todos los intentos de identificación
   - Log warnings cuando no se encuentra cliente

4. **Fallback:**
   - Si no se identifica, crear request en estado "pending_assignment"
   - Admin puede asignar manualmente después

---

**¿Tienes alguna pregunta sobre cómo se identifica al cliente? ¿Quieres que implemente alguna mejora?**

