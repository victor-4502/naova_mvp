# ✅ Paso 3: Esperar Verificación y Configurar Webhook

## 📋 Lo que Acabas de Hacer

✅ Agregaste los DNS records en GoDaddy para `naova.com.mx`

---

## ⏱️ Paso 3.1: Esperar Verificación (5-30 minutos)

### Verificar en Resend

1. **Ve a:** https://resend.com/domains
2. **Haz clic en** `naova.com.mx`
3. **Verás el estado de cada registro:**
   - 🟡 **Pending** = Aún no verificado (normal, espera)
   - 🟢 **Verified** = Verificado correctamente ✅
   - 🔴 **Failed** = Error (revisa el valor del registro)

### ¿Cuánto tiempo esperar?

- **Normalmente:** 5-30 minutos
- **Máximo:** Hasta 24 horas (raro)

**Mientras esperas, puedes revisar cada 10-15 minutos.**

---

## ✅ Paso 3.2: Verificar que Todos los Registros Estén Verificados

En Resend, verifica que estos registros estén en ✅ **Verified**:

- ✅ DKIM (TXT - `resend._domainkey`)
- ✅ SPF (TXT - `send`)
- ✅ MX para recepción (`inbound-smtp.us-east-1.amazonaws.com`)
- ✅ DMARC (TXT - `_dmarc`) - opcional

**Una vez que TODOS estén verificados, continúa al siguiente paso.**

---

## 🔗 Paso 3.3: Configurar el Webhook

Cuando todos los registros estén verificados, necesitas configurar el webhook para que Resend envíe los emails recibidos a Naova.

### Opción A: Usar Webhook Existente (Si ya tienes uno)

Si ya tienes un webhook configurado, puedes usarlo. Resend enviará emails de **todos** los dominios verificados al mismo webhook.

### Opción B: Crear Nuevo Webhook

1. **Ve a:** https://resend.com/webhooks
2. **Haz clic en** "Add Webhook" o "Create Webhook"
3. **Configura:**
   - **Name/Name:** `Naova Email Receiver` (o cualquier nombre)
   - **URL:** `https://www.naova.com.mx/api/inbox/webhook/email`
   - **Events/Eventos:** Marca ✅ `email.received` (es el importante)
   - **Description** (opcional): "Recibe emails entrantes para Naova"
4. **Haz clic en** "Add" o "Create"

**✅ Checklist:**
- [ ] Webhook creado
- [ ] URL correcta: `https://www.naova.com.mx/api/inbox/webhook/email`
- [ ] Evento `email.received` seleccionado

---

## 🧪 Paso 3.4: Probar

Ahora que todo está configurado, prueba enviando un email:

1. **Envía un email a:** `test@naova.com.mx`
   - Puedes enviarlo desde tu email personal
   - O desde cualquier otro email

2. **Verifica en Resend:**
   - Ve a: https://resend.com/domains → `naova.com.mx`
   - Busca la sección de actividad o logs
   - Deberías ver que el email llegó

3. **Verifica en Vercel:**
   - Ve a los logs de Vercel
   - Busca: `[Email Webhook] Received payload`
   - Deberías ver logs del email recibido

4. **Verifica en Naova:**
   - Ve a: `/admin/requests`
   - Deberías ver un nuevo request creado con el email

---

## ✅ Checklist Final

- [ ] Todos los DNS records verificados en Resend (estado: ✅ Verified)
- [ ] Webhook configurado en Resend
- [ ] URL del webhook: `https://www.naova.com.mx/api/inbox/webhook/email`
- [ ] Evento `email.received` seleccionado
- [ ] Email de prueba enviado a `test@naova.com.mx`
- [ ] Request apareció en `/admin/requests`

---

## 🆘 Si Algo No Funciona

### El dominio no se verifica

1. **Verifica los DNS records en GoDaddy:**
   - Asegúrate de que los valores estén exactamente como Resend los dio
   - Verifica que no haya espacios extras

2. **Verifica propagación DNS:**
   - Usa: https://mxtoolbox.com/SuperTool.aspx
   - Busca el MX record: `inbound-smtp.us-east-1.amazonaws.com`
   - Si no aparece, espera más tiempo

3. **Contacta soporte de Resend si después de 2 horas no se verifica**

### El webhook no recibe emails

1. **Verifica la URL del webhook:**
   - Debe ser exactamente: `https://www.naova.com.mx/api/inbox/webhook/email`
   - No debe tener espacios

2. **Verifica que el evento `email.received` esté seleccionado**

3. **Revisa los logs de Vercel** para ver si hay errores

4. **Prueba el endpoint manualmente** (puedes usar el script de prueba)

---

## 🎉 ¡Listo!

Una vez que todo funcione, podrás:
- ✅ Recibir emails en `test@naova.com.mx`
- ✅ Que se conviertan automáticamente en requests
- ✅ Verlos en el admin panel de Naova

**¡Cualquier duda, avísame!**

