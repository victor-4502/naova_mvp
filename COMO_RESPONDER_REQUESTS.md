# 📝 Cómo Responder a Requests desde la Plataforma

## ✅ Nuevas Funcionalidades

Se agregó la capacidad de **ver y responder mensajes** desde la plataforma de administración.

---

## 🎯 Funcionalidades Disponibles

### 1. **Lista de Requests** (`/admin/requests`)

- Ver todos los requests entrantes
- Filtrar por canal (WhatsApp, Email, Plataforma, etc.)
- **Nuevo:** Click en el contenido o botón "Ver detalles →" para ver la conversación completa

### 2. **Página de Detalle del Request** (`/admin/requests/[requestId]`)

**Nueva página completa** con:

- ✅ Ver el request original completo
- ✅ Ver TODOS los mensajes (entrantes y salientes) en formato conversación
- ✅ **Enviar respuestas** directamente desde la plataforma
- ✅ Ver información del cliente
- ✅ Ver estado y categoría del request

---

## 🚀 Cómo Usar

### Paso 1: Ir a la Lista de Requests

1. Ve a: `http://localhost:3000/admin/requests`
2. Busca el request que quieres ver/responder

### Paso 2: Abrir el Detalle

Tienes dos opciones:

**Opción A:** Click en el contenido del request (el texto del mensaje original)

**Opción B:** Click en el botón "Ver detalles →" en la esquina superior derecha del card

### Paso 3: Ver la Conversación

En la página de detalle verás:

- **Request Info:** Información completa del request
- **Conversación:** Todos los mensajes ordenados cronológicamente
  - Mensajes del cliente (entrantes) aparecen a la izquierda
  - Mensajes tuyos (salientes) aparecen a la derecha
- **Enviar Respuesta:** Formulario para escribir y enviar mensajes

### Paso 4: Responder

1. Escribe tu mensaje en el campo de texto
2. Click en "Enviar respuesta"
3. El mensaje se guardará en la base de datos
4. **Nota:** Actualmente solo se registra en el sistema. Para enviarlo realmente por WhatsApp/Email, se requiere integración con proveedores externos.

---

## 🔍 Diagnosticar Problemas

Si un request **no generó mensaje automático**, puedes diagnosticar por qué:

### Usando el Script de Diagnóstico

```bash
npm run diagnosticar:request [requestId]
```

Si no proporcionas `requestId`, se analizará el request más reciente.

**Ejemplo:**

```bash
# Diagnosticar el request más reciente
npm run diagnosticar:request

# Diagnosticar un request específico
npm run diagnosticar:request clx1234567890
```

### Qué Muestra el Diagnóstico

El script te mostrará:

- ✅ Información completa del request
- ✅ Todos los mensajes asociados
- ✅ Análisis de `normalizedContent`
- ✅ Estado de las reglas (categoría, campos faltantes, etc.)
- ✅ **Razón específica** por la que NO se generó mensaje automático
- ✅ Sugerencias para resolver el problema

### Posibles Razones

1. **Auto-reply deshabilitado:** `autoReplyEnabled = false`
2. **Sin categoría:** No se identificó qué tipo de requerimiento es
3. **Request completo:** No hay campos faltantes
4. **Error en el proceso:** Revisa los logs del servidor

---

## 📊 Estructura de Mensajes

Los mensajes se almacenan en la tabla `Message` con:

- **direction:** `inbound` (del cliente) o `outbound` (tu respuesta)
- **source:** `whatsapp`, `email`, `web`, etc.
- **content:** El texto del mensaje
- **processed:** `false` si está pendiente de envío real
- **from/to:** Información de contacto (si está disponible)

---

## 🔧 API Endpoints

### Obtener Request con Mensajes

```http
GET /api/admin/requests/[requestId]
```

**Respuesta:**

```json
{
  "request": {
    "id": "...",
    "source": "whatsapp",
    "status": "incomplete_information",
    "messages": [
      {
        "id": "...",
        "direction": "inbound",
        "content": "...",
        "createdAt": "..."
      }
    ]
  }
}
```

### Enviar Mensaje

```http
POST /api/admin/requests/[requestId]/messages
Content-Type: application/json

{
  "content": "Tu mensaje aquí"
}
```

**Respuesta:**

```json
{
  "success": true,
  "message": {
    "id": "...",
    "direction": "outbound",
    "content": "...",
    "processed": false,
    "createdAt": "..."
  }
}
```

---

## ⚠️ Notas Importantes

1. **Envío Real:** Los mensajes se registran en la base de datos pero **NO se envían automáticamente** por WhatsApp/Email aún. Esto requiere integración con proveedores externos.

2. **Mensajes Pendientes:** Los mensajes outbound tienen `processed: false` hasta que se integren con los proveedores.

3. **Auto-reply:** El sistema sigue generando mensajes automáticos cuando detecta información faltante, pero estos también quedan como "pendientes de envío".

4. **Permisos:** Solo usuarios con rol `admin`, `ADMIN`, `admin_naova` o `operator_naova` pueden acceder a estas funcionalidades.

---

## 🐛 Solución de Problemas

### No puedo ver la página de detalle

- Verifica que estés logueado como admin
- Verifica que el `requestId` sea correcto
- Revisa la consola del navegador para errores

### No puedo enviar mensajes

- Verifica que tengas permisos de admin
- Verifica que el request exista
- Revisa los logs del servidor para errores de base de datos

### El mensaje no aparece después de enviarlo

- Recarga la página
- Verifica que el mensaje se creó en la base de datos:
  ```sql
  SELECT * FROM "Message" 
  WHERE "requestId" = 'tu-request-id' 
  ORDER BY "createdAt" DESC;
  ```

---

## 📝 Próximos Pasos

Para habilitar el **envío real** de mensajes:

1. Integrar con proveedor de WhatsApp (ej: Twilio, WhatsApp Business API)
2. Integrar con proveedor de Email (ej: SendGrid, Resend)
3. Crear workers que procesen mensajes con `processed = false`
4. Actualizar el estado a `processed = true` después de enviar

---

## ✅ Checklist

- [x] Página de detalle de request creada
- [x] Endpoint API para obtener request con mensajes
- [x] Endpoint API para enviar mensajes
- [x] Link desde lista a página de detalle
- [x] Script de diagnóstico para problemas
- [ ] Integración con proveedores de WhatsApp/Email (pendiente)

---

**¿Listo para responder requests desde la plataforma?** 🎉

