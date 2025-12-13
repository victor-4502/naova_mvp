# 🔧 Solución: Usar el Dominio Correcto (naova.mx)

## 🔍 Problema Identificado

En Resend está verificado **`naova.mx`** (sin "com"), pero estábamos configurando todo para **`naova.com.mx`**.

---

## ✅ Solución: Usar `naova.mx`

### Paso 1: Verificar que `naova.mx` está Verificado en Resend

1. Ve a: https://resend.com
2. Inicia sesión
3. Ve a **"Domains"**
4. Verifica que **`naova.mx`** está en estado **"Verified"** ✅

---

### Paso 2: Verificar MX Record para `naova.mx` en GoDaddy

**⚠️ IMPORTANTE**: Necesitas verificar el MX record para **`naova.mx`** (no `naova.com.mx`).

1. Ve a: https://www.godaddy.com
2. Inicia sesión
3. Ve a **"My Products"** o **"Mis Productos"**
4. Busca **`naova.mx`** (no `naova.com.mx`)
5. Haz clic en **"DNS"** o **"Manage DNS"**
6. Busca un registro MX:
   - **Tipo**: MX
   - **Nombre**: `@` (o vacío)
   - **Valor**: `inbound-smtp.us-east-1.amazonaws.com`
   - **Prioridad**: 10

**¿Existe este registro para `naova.mx`?**

- ✅ **Sí**: Continúa al Paso 3
- ❌ **No**: Necesitas agregarlo (ver abajo)

**Si NO existe, agrégala:**
1. Haz clic en **"Add"** o **"Agregar registro"**
2. Selecciona tipo **MX**
3. **Nombre/Host**: `@` (o déjalo vacío)
4. **Valor/Puntero**: `inbound-smtp.us-east-1.amazonaws.com`
5. **Prioridad**: `10`
6. Guarda

---

### Paso 3: Verificar Propagación del MX Record

**Verificar para `naova.mx`** (no `naova.com.mx`):

1. Ve a: https://mxtoolbox.com/SuperTool.aspx
2. Ingresa: **`naova.mx`** (sin "com")
3. Selecciona: **"MX Lookup"**
4. Haz clic en **"MX Lookup"**

**¿Qué deberías ver?**

```
Priority: 10
Host: inbound-smtp.us-east-1.amazonaws.com
```

**Si NO aparece:**
- Espera más tiempo (hasta 24 horas)
- Verifica que el registro esté correcto en GoDaddy

---

### Paso 4: Configurar Webhook en Resend para `naova.mx`

1. Ve a: https://resend.com
2. Inicia sesión
3. Ve a **"Webhooks"** en el menú lateral
4. Haz clic en **"Add Webhook"** o **"Create Webhook"**
5. Configura:
   - **Nombre**: `Naova Inbound Email`
   - **URL**: `https://www.naova.com.mx/api/inbox/webhook/email`
     - ⚠️ Nota: La URL puede seguir usando `www.naova.com.mx` si ese es tu dominio en Vercel
     - O cambia a `www.naova.mx` si prefieres
   - **Events**: Selecciona **"email.received"** o **"inbound.email"**
   - **Status**: Active
6. Guarda

---

### Paso 5: Enviar Email a la Dirección Correcta

**⚠️ IMPORTANTE**: Ahora debes enviar emails a **`@naova.mx`** (no `@naova.com.mx`).

**Direcciones válidas:**
- ✅ `test@naova.mx`
- ✅ `compras@naova.mx`
- ✅ `prueba@naova.mx`
- ✅ Cualquier dirección que termine en `@naova.mx`

**NO uses:**
- ❌ `test@naova.com.mx`
- ❌ `compras@naova.com.mx`

---

### Paso 6: Probar

1. **Envía un email** a: `test@naova.mx`
2. **Espera** 1-2 minutos
3. **Verifica** en Resend:
   - Ve a: Resend → Domains → `naova.mx`
   - Busca en **"Logs"** o **"Activity"**
   - ¿Aparece el email que enviaste?
4. **Verifica** en Vercel logs:
   - Ve a: Vercel → Proyecto → Logs
   - Busca: `[Email Webhook] Received payload:`
5. **Verifica** en Naova:
   - Ve a: `/admin/requests`
   - ¿Aparece el request del email?

---

## 📋 Checklist Completo

### Antes de Probar:
- [ ] `naova.mx` está verificado en Resend (estado: Verified)
- [ ] El MX record existe en GoDaddy para `naova.mx`
- [ ] El MX record está propagado (verificado en mxtoolbox.com)
- [ ] El webhook está configurado en Resend
- [ ] El webhook está activo
- [ ] El webhook tiene suscrito el evento "email.received"

### Al Probar:
- [ ] Envías el email a `@naova.mx` (NO `@naova.com.mx`)
- [ ] El email aparece en los logs de Resend
- [ ] El webhook aparece en los logs de Vercel
- [ ] El request aparece en `/admin/requests`

---

## ⚠️ Nota Sobre los Dominios

Tienes dos dominios:
- **`naova.mx`** → Verificado en Resend ✅
- **`naova.com.mx`** → Puede ser un redirect o subdominio

**Para recibir emails:**
- Usa **`@naova.mx`** (el que está en Resend)

**Para la URL del webhook:**
- Puedes usar `https://www.naova.com.mx/api/inbox/webhook/email` si tu app está en ese dominio
- O `https://www.naova.mx/api/inbox/webhook/email` si prefieres

---

## 🔍 Información que Necesito

Para confirmar todo está bien:

1. **¿El dominio `naova.mx` está "Verified" en Resend?**
2. **¿El MX record existe en GoDaddy para `naova.mx`?**
3. **¿El MX record está propagado?** (verificado en mxtoolbox.com)
4. **¿Ya configuraste el webhook en Resend?**

Con esta información puedo ayudarte a verificar que todo esté correcto.

---

## 🎯 Resumen

- ✅ Usa **`@naova.mx`** para recibir emails (no `@naova.com.mx`)
- ✅ Verifica que el MX record esté configurado para `naova.mx` en GoDaddy
- ✅ Configura el webhook en Resend apuntando a tu endpoint
- ✅ Envía emails de prueba a `test@naova.mx`

¡Prueba y me dices qué pasa!

