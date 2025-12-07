# 🔍 ¿Cómo Sabe el Sistema si un Mensaje es Nuevo o Viejo?

## 📋 Resumen Simple

Cuando llega un mensaje de WhatsApp, el sistema hace lo siguiente:

1. **Busca requests activos** del mismo número de teléfono
2. **Si encuentra uno activo** → Agrega el mensaje a ese request (Viejo)
3. **Si NO encuentra uno activo** → Crea un nuevo request (Nuevo)

---

## 🎯 Criterios para Determinar si es "Viejo" (Continuación)

Un mensaje se agrega a un request **existente** si cumple TODAS estas condiciones:

### 1. Mismo Número de Teléfono ✅
- El mensaje viene del mismo número que ya tiene mensajes en el request
- Ejemplo: `5213312283639` es el mismo que `5213312283639`

### 2. Mismo Canal (WhatsApp) ✅
- Ambos mensajes son de WhatsApp
- No mezcla WhatsApp con Email o Web

### 3. Request Activo ✅
El request debe estar en uno de estos estados:
- **No cerrado**: El request sigue abierto (new_request, needs_info, finding_suppliers, etc.)
- **Cerrado recientemente**: Fue cerrado hace menos de 7 días

### 4. Actividad Reciente ✅
El request debe tener actividad en los últimos 7 días:
- Último mensaje hace menos de 7 días
- O fue actualizado hace menos de 7 días

---

## 📊 Ejemplos Prácticos

### Ejemplo 1: Mensaje Nuevo (Se Crea Request Nuevo)

```
Situación:
- Cliente envía: "Necesito tornillos" (Lunes)
- Request #123 se crea y se cierra el Martes
- Cliente envía: "Necesito tuercas" (Lunes siguiente - 8 días después)

Resultado:
✅ Se crea Request #124 (NUEVO)
   - Request #123 está cerrado hace más de 7 días
   - No hay actividad reciente
```

### Ejemplo 2: Mensaje Viejo (Se Agrega al Request Existente)

```
Situación:
- Cliente envía: "Necesito tornillos" (Lunes 10:00 AM)
- Request #123 se crea
- Naova responde: "¿Qué tipo?" (Lunes 2:00 PM)
- Cliente responde: "De acero inoxidable" (Lunes 4:00 PM)

Resultado:
✅ Mensaje agregado a Request #123 (VIEJO)
   - Mismo número de teléfono
   - Request #123 no está cerrado
   - Hay actividad reciente (mensaje hace 2 horas)
```

### Ejemplo 3: Mensaje Viejo Después de Respuesta de Naova

```
Situación:
- Cliente envía: "Hola, necesito ayuda" (Lunes)
- Request #123 se crea
- Naova responde desde la plataforma: "¿En qué puedo ayudarte?" (Martes)
- Cliente responde: "Necesito cotización" (Miércoles)

Resultado:
✅ Mensaje agregado a Request #123 (VIEJO)
   - Mismo número de teléfono
   - Request #123 sigue activo
   - Actividad reciente (Naova respondió ayer)
```

---

## 🔧 Cómo Funciona el Código

### Paso 1: Llega el Mensaje

```typescript
// WhatsApp webhook recibe mensaje
WhatsAppProcessor.processWebhook(payload)
```

### Paso 2: Buscar Request Activo

```typescript
// Busca request activo del mismo número
const activeRequest = await findActiveRequest(
  phoneNumber,  // Ejemplo: "5213312283639"
  clientId      // Opcional: ID del cliente si está identificado
)
```

### Paso 3: Decisión

```typescript
if (activeRequest) {
  // ✅ VIEJO: Agregar mensaje al request existente
  await addMessageToRequest(activeRequest.id, messageData)
} else {
  // ✅ NUEVO: Crear nuevo request
  await createRequest(messageData)
}
```

---

## 🔍 Lógica de Búsqueda Detallada

### Qué Busca el Sistema:

1. **Requests de WhatsApp** del mismo número
2. **Que tengan mensajes** con el número del remitente
3. **Que NO estén cerrados** O **cerrados hace menos de 7 días**
4. **Con actividad reciente** (mensajes o actualizaciones en últimos 7 días)

### Código de Búsqueda:

```typescript
// Busca requests que:
const activeRequests = await prisma.request.findMany({
  where: {
    source: 'whatsapp',                    // ✅ Mismo canal
    messages: {
      some: {
        from: phoneNumber,                 // ✅ Mismo número
        createdAt: { gte: sevenDaysAgo }  // ✅ Actividad reciente
      }
    },
    OR: [
      { pipelineStage: { not: 'closed' } }, // ✅ No cerrado
      { 
        pipelineStage: 'closed',
        updatedAt: { gte: sevenDaysAgo }    // ✅ Cerrado recientemente
      }
    ]
  }
})
```

---

## ⏰ Ventana de Tiempo: 7 Días

El sistema considera un request "activo" si tiene actividad en los **últimos 7 días**.

### ¿Por qué 7 días?

- **Conversaciones cortas**: Si respondes el mismo día o al día siguiente, claramente es continuación
- **Conversaciones con pausas**: Si el cliente tarda 2-3 días en responder, sigue siendo la misma conversación
- **Nuevas solicitudes**: Si pasan más de 7 días, probablemente es una nueva necesidad/request

### ¿Se puede Cambiar?

Sí, puedes ajustar los 7 días modificando esta línea en el código:

```typescript
// En lib/services/inbox/WhatsAppProcessor.ts
const sevenDaysAgo = new Date()
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7) // Cambiar 7 por otro número
```

---

## 📝 Logs para Ver Qué Pasa

El sistema registra en los logs:

### Si Encuentra Request Activo (Viejo):
```
[WhatsAppProcessor] Request activo encontrado: cmiw1ornm0000aeob9nli93e2
[WhatsAppProcessor] Mensaje agregado a request existente: cmiw1ornm0000aeob9nli93e2
```

### Si NO Encuentra (Nuevo):
```
[WhatsAppProcessor] Creando nuevo request para: 5213312283639
```

---

## 🎯 Casos Especiales

### Caso 1: Cliente con Múltiples Requests Activos

Si un cliente tiene varios requests activos, el sistema elige el **más reciente**:

```
Request #123 (creado hace 5 días) - Activo
Request #124 (creado hace 2 días) - Activo
Cliente envía nuevo mensaje

Resultado:
✅ Se agrega a Request #124 (el más reciente)
```

### Caso 2: Request Cerrado Recientemente

Si un request fue cerrado hace menos de 7 días, todavía puede recibir mensajes:

```
Request #123 - Cerrado hace 3 días
Cliente envía mensaje

Resultado:
✅ Se agrega a Request #123 (fue cerrado recientemente)
```

### Caso 3: Request Cerrado Hace Mucho Tiempo

Si un request fue cerrado hace más de 7 días, se crea uno nuevo:

```
Request #123 - Cerrado hace 10 días
Cliente envía mensaje

Resultado:
✅ Se crea Request #124 (el anterior está muy viejo)
```

---

## ✅ Resumen Visual

```
┌─────────────────────────────────────────┐
│  Llega Mensaje de WhatsApp              │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Buscar Request Activo del Mismo Número │
└──────────────┬──────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
       ▼                ▼
  ¿ENCONTRÓ?        ¿NO ENCONTRÓ?
       │                │
       │                │
       ▼                ▼
┌──────────────┐  ┌──────────────┐
│   VIEJO      │  │    NUEVO     │
│              │  │              │
│ Agregar      │  │ Crear        │
│ mensaje al   │  │ nuevo        │
│ request      │  │ request      │
│ existente    │  │              │
└──────────────┘  └──────────────┘
```

---

## 🧪 Cómo Probar

1. **Envía un mensaje** desde WhatsApp
   - Se crea Request #1

2. **Responde desde la plataforma**
   - Mensaje agregado a Request #1

3. **Responde de nuevo desde WhatsApp**
   - ✅ Se agrega a Request #1 (no se crea Request #2)

4. **Espera 8 días y envía otro mensaje**
   - ✅ Se crea Request #2 (el anterior ya no está activo)

---

## 🆘 Si Algo No Funciona

### El mensaje se crea como nuevo cuando debería ser viejo:

1. Verifica que el número de teléfono sea exactamente el mismo
2. Verifica que el request anterior no esté cerrado hace más de 7 días
3. Revisa los logs para ver si encontró un request activo

### El mensaje se agrega al request viejo cuando debería ser nuevo:

1. Verifica que hayan pasado más de 7 días
2. Verifica que el request anterior esté cerrado
3. Ajusta la ventana de tiempo si es necesario

