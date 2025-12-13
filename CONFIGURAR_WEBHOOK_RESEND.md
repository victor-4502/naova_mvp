# ✅ Paso 5: Configurar Webhook en Resend

## 🎉 ¡Dominio Verificado!

Ahora que el dominio está verificado, necesitas configurar el webhook para que Resend envíe los emails recibidos a tu endpoint.

---

## 🔗 Paso 5.1: Ir a la Sección de Webhooks

1. **En el dashboard de Resend**, busca en el menú lateral
2. Haz clic en **"Webhooks"**
   - Si no lo ves directamente, puede estar en:
     - **"Settings"** → **"Webhooks"**
     - **"API"** → **"Webhooks"**
     - O busca **"Inbound Email"** o **"Inbound Parse"**

---

## ➕ Paso 5.2: Agregar Nuevo Webhook

1. Haz clic en **"Add Webhook"** o **"Create Webhook"**
2. O busca un botón **"Add"** o **"Agregar"**

---

## ⚙️ Paso 5.3: Configurar el Webhook

### Configuración:

1. **Nombre/Descripción** (opcional):
   - Puedes poner: `Naova Inbound Email`
   - O: `Recibir Emails Naova`
   - O déjalo en blanco

2. **URL del Webhook**:
   ```
   https://www.naova.com.mx/api/inbox/webhook/email
   ```
   - ⚠️ **IMPORTANTE**: Usa `https://` (no `http://`)
   - ⚠️ **IMPORTANTE**: Usa `www.naova.com.mx` (o sin www según tu dominio)

3. **Eventos a Escuchar**:
   - Busca y selecciona: **"email.received"**
   - O: **"inbound.email"**
   - O: **"Inbound Email"**
   - Puedes seleccionar todos si quieres, pero solo necesitas el de inbound

4. **Haz clic en "Save"** o **"Guardar"**

---

## ✅ Paso 5.4: Verificar que el Webhook Está Activo

Después de crear el webhook:

- Deberías ver tu webhook en la lista
- Estado debería ser **"Active"** o **"Activo"**
- Debería mostrar la URL que configuraste

**✅ Checklist:**
- [ ] Webhook creado en Resend
- [ ] URL configurada: `https://www.naova.com.mx/api/inbox/webhook/email`
- [ ] Evento "email.received" o "inbound.email" seleccionado
- [ ] Webhook está activo

---

## 🧪 Paso 6: Probar que Funciona

### 6.1. Enviar Email de Prueba

1. **Desde cualquier email** (tu Gmail personal, etc.)
2. **Envía un email a**: 
   - `test@naova.com.mx` 
   - O `compras@naova.com.mx`
   - O cualquier dirección en tu dominio (ej: `prueba@naova.com.mx`)
3. **Asunto**: "Prueba de email"
4. **Contenido**: "Este es un email de prueba para Naova"

**⚠️ IMPORTANTE**: Envía a `@naova.com.mx`, NO a `solucionesnaova@gmail.com`

### 6.2. Verificar en Resend

1. Ve al dashboard de Resend
2. Busca la sección de **"Logs"** o **"Activity"**
3. Deberías ver que Resend recibió el email
4. También deberías ver que se intentó enviar el webhook a tu URL

### 6.3. Verificar en Vercel (Logs)

1. Ve a tu proyecto en Vercel: https://vercel.com
2. Selecciona el proyecto `naova`
3. Ve a la pestaña **"Logs"**
4. Busca logs relacionados con `/api/inbox/webhook/email`
5. Deberías ver algo como:
   ```
   POST /api/inbox/webhook/email 200
   ```
   O:
   ```
   Error en webhook Email: [mensaje de error]
   ```

### 6.4. Verificar en Naova

1. Ve a: https://www.naova.com.mx/admin/requests
2. Inicia sesión como admin
3. Deberías ver un **nuevo request** creado desde el email que enviaste

**✅ Checklist:**
- [ ] Email enviado a `@naova.com.mx`
- [ ] Resend muestra que recibió el email
- [ ] Logs en Vercel muestran el webhook recibido
- [ ] Request aparece en `/admin/requests`

---

## ⚠️ Si el Webhook No Funciona

### Problema 1: Email llega pero no aparece como request

**Causa posible**: El formato del webhook de Resend puede ser diferente al que esperamos.

**Solución:**
1. Ve a los logs de Vercel
2. Busca errores relacionados con `/api/inbox/webhook/email`
3. Copia el error completo
4. Compártelo conmigo y adapto el código

### Problema 2: Webhook no se envía

**Causa posible**: URL incorrecta o evento no seleccionado.

**Solución:**
1. Verifica que la URL es correcta: `https://www.naova.com.mx/api/inbox/webhook/email`
2. Verifica que seleccionaste el evento "email.received" o "inbound.email"
3. Verifica que el webhook está activo

### Problema 3: Error 500 en el webhook

**Causa posible**: Formato del payload diferente o error en el código.

**Solución:**
1. Ve a los logs de Vercel
2. Busca el error específico
3. Compártelo conmigo y lo soluciono

---

## 📋 Checklist Completo

### Antes de Probar:

- [x] Dominio verificado en Resend ✅
- [ ] Webhook configurado con la URL correcta
- [ ] Evento "email.received" o "inbound.email" seleccionado
- [ ] Webhook está activo

### Después de Probar:

- [ ] Email enviado a `@naova.com.mx`
- [ ] Resend muestra que recibió el email
- [ ] Logs en Vercel muestran el webhook recibido
- [ ] Request aparece en `/admin/requests`

---

## 🎯 Resumen de Pasos

1. ✅ Dominio verificado (YA ESTÁ)
2. ⏳ Configurar webhook ← **ESTÁS AQUÍ**
3. ⏳ Probar enviando email
4. ⏳ Verificar que funciona

---

## 💡 Nota Importante

**El formato del webhook de Resend puede ser diferente** al que esperamos en el código. Si después de configurar el webhook y probar no funciona:

1. **No te preocupes**, es normal
2. **Comparte los logs de Vercel** conmigo
3. **Adapto el código** para el formato específico de Resend

Es parte del proceso normal de integración. 😊

---

¡Vamos! Configura el webhook y probemos que funciona.

