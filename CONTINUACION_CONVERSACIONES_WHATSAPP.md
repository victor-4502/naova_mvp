# 💬 Continuación de Conversaciones en WhatsApp

## 📋 Problema

Cuando un cliente responde a un mensaje de Naova por WhatsApp, el sistema estaba creando un **nuevo request** en lugar de agregar el mensaje al request existente, lo que fragmentaba la conversación.

## ✅ Solución Implementada

Ahora el sistema detecta automáticamente si un mensaje entrante es una **continuación de una conversación existente** y lo agrega al request correcto.

### Criterios para Asociar un Mensaje a un Request Existente

Un mensaje se agrega a un request existente si:

1. **Mismo número de teléfono**: El mensaje viene del mismo número que ya tiene mensajes en el request
2. **Mismo canal**: Ambos son de WhatsApp
3. **Request activo**: El request no está cerrado, o fue cerrado recientemente (últimos 7 días)
4. **Actividad reciente**: El request tiene mensajes o actualizaciones en los últimos 7 días

### Cómo Funciona

```
1. Cliente envía mensaje → Se crea Request #1
2. Naova responde desde la plataforma → Mensaje agregado a Request #1
3. Cliente responde → ✅ Sistema detecta Request #1 activo
   → Mensaje agregado a Request #1 (no se crea Request #2)
```

### Lógica de Búsqueda

El sistema busca requests activos en este orden:

1. **Por cliente** (si el cliente está identificado):
   - Busca requests del mismo cliente
   - Que tengan mensajes del mismo número de teléfono
   - Que estén activos (no cerrados o cerrados recientemente)

2. **Por número de teléfono** (si no hay cliente identificado):
   - Busca cualquier request con mensajes del mismo número
   - Que estén activos

### Ventana de Tiempo

- **7 días**: Un request se considera "activo" si tiene actividad en los últimos 7 días
- **Requests cerrados recientemente**: Si un request fue cerrado hace menos de 7 días, todavía puede recibir mensajes nuevos

## 🔧 Implementación Técnica

### Archivos Modificados

1. **`lib/services/inbox/WhatsAppProcessor.ts`**
   - Nuevo método: `findActiveRequest()` - Busca requests activos
   - Modificado: `processWebhook()` - Verifica requests existentes antes de crear uno nuevo

2. **`lib/services/inbox/InboxService.ts`**
   - Nuevo método: `addMessageToRequest()` - Agrega mensajes a requests existentes

### Flujo de Procesamiento

```typescript
// 1. Llega mensaje de WhatsApp
WhatsAppProcessor.processWebhook(payload)

// 2. Buscar request activo
const activeRequest = await findActiveRequest(phoneNumber, clientId)

// 3. Si existe, agregar mensaje
if (activeRequest) {
  await InboxService.addMessageToRequest(activeRequest.id, messageData)
} else {
  // 4. Si no existe, crear nuevo request
  await InboxService.createRequest(messageData)
}
```

## 📝 Ejemplo de Uso

### Escenario 1: Conversación Continua ✅

```
Lunes 10:00 AM
Cliente: "Necesito servicio de mantenimiento"
→ Se crea Request #123

Lunes 2:00 PM
Naova: "¿En qué fecha lo necesitas?"
→ Mensaje agregado a Request #123

Lunes 4:00 PM
Cliente: "Para el viernes"
→ ✅ Mensaje agregado a Request #123 (NO se crea Request #124)
```

### Escenario 2: Nuevo Request (después de 7 días) ✅

```
Lunes 10:00 AM
Cliente: "Necesito servicio de mantenimiento"
→ Se crea Request #123
→ Request se cierra el Martes

Lunes siguiente (8 días después)
Cliente: "Necesito otro servicio"
→ ✅ Se crea Request #124 (Request #123 ya no está activo)
```

## 🎯 Beneficios

1. **Conversaciones unificadas**: Todos los mensajes de una conversación están en el mismo request
2. **Mejor seguimiento**: El historial completo está en un solo lugar
3. **Menos confusión**: No se crean requests duplicados
4. **Mejor experiencia**: Los operadores ven la conversación completa

## 🔄 Configuración

La ventana de tiempo (7 días) se puede ajustar modificando esta línea en `WhatsAppProcessor.ts`:

```typescript
const sevenDaysAgo = new Date()
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7) // Cambiar 7 por el número de días deseado
```

## 🐛 Troubleshooting

### El mensaje no se agrega al request existente

1. Verifica que el número de teléfono sea exactamente el mismo
2. Verifica que el request no esté cerrado hace más de 7 días
3. Revisa los logs para ver si se encontró un request activo:
   ```
   [WhatsAppProcessor] Request activo encontrado: <request-id>
   ```

### Se están creando requests duplicados

1. Verifica que la búsqueda de requests activos esté funcionando
2. Revisa los logs de `findActiveRequest()`
3. Asegúrate de que los números de teléfono estén normalizados correctamente

## 📊 Logs

El sistema registra cuando:
- Se encuentra un request activo: `[WhatsAppProcessor] Request activo encontrado: <id>`
- Se crea un nuevo request: `[WhatsAppProcessor] Creando nuevo request para: <phone>`
- Se agrega mensaje a request existente: `[WhatsAppProcessor] Mensaje agregado a request existente: <id>`

