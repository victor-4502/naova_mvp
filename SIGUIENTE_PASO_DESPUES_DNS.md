# ✅ Siguiente Paso: Después de Configurar DNS

## 🎯 Estado Actual

✅ DNS configurados en GoDaddy  
⏳ Esperando verificación en Resend  
⏳ Webhook pendiente de configurar

---

## ⏱️ Paso 4: Esperar Verificación del Dominio

### ¿Cuánto Tarda?

- **Normalmente**: 10-30 minutos
- **Puede tardar hasta**: 1-2 horas (raro)
- **Máximo**: 24 horas (muy raro)

### Cómo Verificar

1. **Ve a Resend**:
   - https://resend.com/domains
   - O desde el dashboard, haz clic en **"Domains"**

2. **Busca tu dominio** `naova.com.mx`

3. **Revisa el estado**:
   - 🔴 **"Pending"** o **"Pendiente"** → Aún verificando
   - 🟡 **"Verifying"** o **"Verificando"** → Resend está verificando
   - 🟢 **"Verified"** o **"Verificado"** → ✅ ¡Listo!

### Si Tarda Más de 1 Hora

1. **Verifica que agregaste todos los registros**:
   - ¿Agregaste los 5 registros?
   - ¿Los valores están correctos? (copia y pega exactamente)

2. **Verifica propagación DNS**:
   - Ve a: https://mxtoolbox.com/SuperTool.aspx
   - Ingresa: `naova.com.mx`
   - Busca los registros:
     - TXT para `resend._domainkey`
     - MX para `inbound-smtp.us-east-1.amazonaws.com`
   - Si **NO aparecen**, los DNS aún no se propagaron

3. **Espera un poco más** (puede tomar hasta 2 horas)

---

## ✅ Paso 5: Configurar el Webhook (Cuando el Dominio Esté Verificado)

### 5.1. Ir a la Sección de Webhooks

1. En el dashboard de Resend, busca en el menú lateral
2. Haz clic en **"Webhooks"**
   - Si no lo ves, puede estar en **"Settings"** → **"Webhooks"**
   - O busca **"Inbound Email"** o **"Inbound Parse"**

### 5.2. Agregar Nuevo Webhook

1. Haz clic en **"Add Webhook"** o **"Create Webhook"**
2. O busca un botón **"Add"** o **"Agregar"**

### 5.3. Configurar el Webhook

**URL del Webhook:**
```
https://www.naova.com.mx/api/inbox/webhook/email
```

**⚠️ IMPORTANTE:**
- Usa `https://` (no `http://`)
- Usa `www.naova.com.mx` (con www, o sin www según tu dominio)

**Configuración:**
1. **Nombre/Descripción** (opcional):
   - Puedes poner: `Naova Inbound Email`
   - O: `Recibir Emails`

2. **URL del Webhook**:
   - Pega: `https://www.naova.com.mx/api/inbox/webhook/email`

3. **Eventos a Escuchar**:
   - Busca y selecciona: **"email.received"**
   - O: **"inbound.email"**
   - O: **"Inbound Email"**
   - Puedes seleccionar todos si quieres, pero solo necesitas el de inbound

4. **Haz clic en "Save"** o **"Guardar"**

### 5.4. Verificar que el Webhook Está Activo

- Deberías ver tu webhook en la lista
- Estado debería ser **"Active"** o **"Activo"**

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

### 6.2. Verificar en Resend

1. Ve al dashboard de Resend
2. Busca la sección de **"Logs"** o **"Activity"**
3. Deberías ver que Resend recibió el email

### 6.3. Verificar en Vercel (Logs)

1. Ve a tu proyecto en Vercel: https://vercel.com
2. Selecciona el proyecto `naova`
3. Ve a la pestaña **"Logs"**
4. Busca logs relacionados con `/api/inbox/webhook/email`
5. Deberías ver algo como:
   ```
   POST /api/inbox/webhook/email 200
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

### Problema: Email llega pero no aparece como request

**Posibles causas:**

1. **Formato del webhook diferente**:
   - Resend puede enviar el formato de forma diferente
   - Necesitamos adaptar el código

2. **Error en el procesamiento**:
   - Revisa los logs de Vercel
   - Busca errores relacionados con el webhook

**Qué hacer:**

1. **Ve a los logs de Vercel**:
   - Vercel → Proyecto → Logs
   - Busca líneas que digan `Error en webhook Email:`

2. **Copia el error completo**

3. **Compártelo conmigo** y adapto el código

**No te preocupes**, es normal que necesitemos ajustar el formato del webhook. Es parte del proceso. 😊

---

## 📋 Checklist Completo

### Antes de Probar:

- [ ] Dominio verificado en Resend (estado: Verified)
- [ ] Webhook configurado con la URL correcta
- [ ] Evento "email.received" seleccionado
- [ ] Webhook está activo

### Después de Probar:

- [ ] Email enviado a `@naova.com.mx`
- [ ] Resend muestra que recibió el email
- [ ] Logs en Vercel muestran el webhook recibido
- [ ] Request aparece en `/admin/requests`

---

## 🎯 Resumen de Próximos Pasos

1. **Espera** la verificación del dominio en Resend (10-30 min)
2. **Verifica** que el dominio está "Verified"
3. **Configura** el webhook con la URL: `https://www.naova.com.mx/api/inbox/webhook/email`
4. **Prueba** enviando un email de prueba
5. **Verifica** que aparece como request en `/admin/requests`

---

## 💡 Consejo

Mientras esperas la verificación del dominio:
- Puedes revisar los logs de Vercel para asegurarte de que no hay errores
- Puedes probar enviar un email desde la plataforma (esto ya funciona con SMTP)

---

¡Avísame cuando el dominio esté verificado y configuramos el webhook juntos!

