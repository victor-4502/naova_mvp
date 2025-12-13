# 🔍 Diagnóstico: Email No Aparece

## ❌ Problema

Enviaste un email pero no aparece en `/admin/requests`.

---

## 🔍 Verificaciones Paso a Paso

### 1. ¿A qué dirección enviaste el email?

**⚠️ MUY IMPORTANTE:**
- ✅ **Correcto:** `test@naova.com.mx` o `compras@naova.com.mx`
- ❌ **Incorrecto:** `solucionesnaova@gmail.com` o cualquier Gmail

**¿A qué dirección enviaste?**

---

### 2. ¿Resend recibió el email?

**Verifica en Resend:**

1. Ve a: https://resend.com
2. Inicia sesión
3. Ve a **"Domains"** → Haz clic en `naova.com.mx`
4. Busca la sección de **"Activity"**, **"Logs"**, o **"Inbound Emails"**
5. ¿Ves el email que enviaste?

**Resultados posibles:**
- ✅ **Sí aparece:** Resend lo recibió, el problema está en el webhook → Continúa al paso 3
- ❌ **No aparece:** Resend no lo recibió, el problema está en DNS → Ve al paso 2.1

---

### 2.1. Si Resend NO recibió el email

**Problema:** Los DNS no están configurados correctamente o no se propagaron.

**Verificaciones:**

1. **¿El dominio está verificado en Resend?**
   - Ve a: https://resend.com/domains
   - ¿`naova.com.mx` está en estado **"Verified"** ✅?
   - Si está en **"Pending"**, espera más tiempo (hasta 30 minutos)

2. **Verifica el MX record en GoDaddy:**
   - Ve a: https://dcc.godaddy.com
   - Busca `naova.com.mx` → DNS
   - ¿Existe un registro **MX** con:
     - Nombre: `@`
     - Valor: `inbound-smtp.us-east-1.amazonaws.com`
     - Prioridad: `10`

3. **Verifica propagación DNS:**
   - Ve a: https://mxtoolbox.com/SuperTool.aspx
   - Ingresa: `naova.com.mx`
   - Selecciona: **"MX Lookup"**
   - ¿Aparece `inbound-smtp.us-east-1.amazonaws.com`?

**Si el MX no aparece:**
- Espera más tiempo (hasta 24 horas)
- Verifica que el registro esté correcto en GoDaddy

---

### 3. ¿El webhook está configurado?

**Verifica en Resend:**

1. Ve a: https://resend.com/webhooks
2. ¿Existe un webhook configurado?
3. ¿La URL es: `https://www.naova.com.mx/api/inbox/webhook/email`?
4. ¿El evento `email.received` está seleccionado?
5. ¿El webhook está activo?

**Si NO hay webhook:**
- Crea uno siguiendo: `CONFIGURAR_WEBHOOK_RESEND.md`

**Si SÍ hay webhook:**
- Continúa al paso 4

---

### 4. ¿El webhook está recibiendo los emails?

**Verifica en Vercel Logs:**

1. Ve a: https://vercel.com
2. Selecciona tu proyecto `naova`
3. Ve a la pestaña **"Logs"**
4. Busca logs relacionados con `/api/inbox/webhook/email`
5. Filtra por: `POST /api/inbox/webhook/email`

**¿Qué deberías ver?**

**Si el webhook está funcionando:**
```
POST /api/inbox/webhook/email 200
[Email Webhook] Received payload: {...}
[Email Webhook] Normalized payload: {...}
```

**Si hay errores:**
```
POST /api/inbox/webhook/email 500
Error en webhook Email: [mensaje de error]
```

**Si NO hay logs:**
- El webhook no se está enviando desde Resend
- Verifica que el webhook esté activo
- Verifica que el evento `email.received` esté seleccionado

---

### 5. ¿Hay errores en los logs?

**Si ves errores en Vercel:**

1. **Copia el error completo**
2. **Comparte el error conmigo** y lo soluciono

**Errores comunes:**
- `TypeError: Cannot read properties...` → Problema con el formato del payload
- `Error de Prisma...` → Problema con la base de datos
- `Cliente no encontrado...` → Normal, el request se crea sin cliente

---

## 📋 Checklist de Diagnóstico

Responde estas preguntas:

- [ ] ¿A qué dirección enviaste el email? (debe ser `@naova.com.mx`)
- [ ] ¿El dominio está verificado en Resend? (estado: Verified)
- [ ] ¿Resend muestra el email en Activity/Logs?
- [ ] ¿El webhook está configurado en Resend?
- [ ] ¿La URL del webhook es correcta?
- [ ] ¿El evento `email.received` está seleccionado?
- [ ] ¿Hay logs en Vercel del webhook?
- [ ] ¿Hay errores en los logs de Vercel?

---

## 🆘 Soluciones Rápidas

### Si Resend NO recibió el email:

1. **Verifica que enviaste a `@naova.com.mx`** (no a Gmail)
2. **Espera más tiempo** (hasta 30 minutos para verificación DNS)
3. **Verifica el MX record** en GoDaddy
4. **Verifica propagación DNS** en mxtoolbox.com

### Si Resend SÍ recibió pero no aparece en Naova:

1. **Verifica que el webhook esté configurado**
2. **Revisa los logs de Vercel** para ver errores
3. **Comparte los logs conmigo** y lo soluciono

---

## 📤 Comparte Esta Información

Para diagnosticar mejor, comparte:

1. **¿A qué dirección enviaste el email?**
2. **¿El dominio está verificado en Resend?** (Sí/No)
3. **¿Resend muestra el email en Activity?** (Sí/No)
4. **¿Hay webhook configurado?** (Sí/No)
5. **¿Qué logs ves en Vercel?** (Copia los logs del POST al webhook)

Con esta información podré ayudarte a solucionarlo rápidamente.

