# 📧 Aclaración: Enviar vs Recibir Emails

## 🔍 La Confusión

Tienes dos cosas diferentes configuradas:

### 1. ✅ Para ENVIAR Emails (SMTP) - Ya Configurado
- **Email**: `solucionesnaova@gmail.com`
- **Uso**: Para responder a clientes desde la plataforma
- **Estado**: ✅ Ya funciona

### 2. ⏳ Para RECIBIR Emails (Webhook) - En Proceso
- **Dominio**: `naova.com.mx`
- **Direcciones**: Cualquier dirección en tu dominio (ej: `compras@naova.com.mx`, `test@naova.com.mx`)
- **Uso**: Para recibir emails de clientes y crear requests automáticamente
- **Estado**: ⏳ Necesita estar configurado con Resend

---

## ❓ ¿Por Qué No Usar `solucionesnaova@gmail.com`?

### Problema con Gmail:

1. **Gmail NO puede recibir emails y convertirlos en webhooks automáticamente**
   - Gmail solo guarda los emails en tu bandeja de entrada
   - No tiene la funcionalidad de reenviar automáticamente como webhook HTTP POST

2. **Resend/SendGrid SÍ pueden**
   - Reciben emails dirigidos a tu dominio
   - Los convierten automáticamente en webhooks
   - Los envían a tu endpoint como HTTP POST

---

## ✅ Cómo Funciona

### Para ENVIAR (Ya Funciona):
```
Plataforma Naova → SMTP (solucionesnaova@gmail.com) → Cliente recibe email
```

### Para RECIBIR (Necesita Resend):
```
Cliente envía email → compras@naova.com.mx → Resend lo recibe 
→ Resend envía webhook → Tu endpoint → Crea request en Naova
```

---

## 🎯 Direcciones Correctas para RECIBIR

### ✅ Usa direcciones en tu dominio:
- `compras@naova.com.mx`
- `test@naova.com.mx`
- `prueba@naova.com.mx`
- `soporte@naova.com.mx`
- Cualquier dirección que termine en `@naova.com.mx`

### ❌ NO uses:
- `solucionesnaova@gmail.com` (no funcionará con Resend)
- Cualquier dirección de Gmail

---

## ⚠️ Verificaciones Necesarias

Antes de que funcione, necesitas:

### 1. ✅ Dominio Verificado en Resend
- Ve a: https://resend.com/domains
- Verifica que `naova.com.mx` está en estado **"Verified"**

### 2. ✅ Webhook Configurado
- Ve a "Webhooks" en Resend
- Verifica que hay un webhook con la URL: `https://www.naova.com.mx/api/inbox/webhook/email`
- Estado: **"Active"**

### 3. ✅ DNS Configurados Correctamente
- Verifica que agregaste el registro MX para recepción:
  - Tipo: MX
  - Nombre: `@`
  - Valor: `inbound-smtp.us-east-1.amazonaws.com`
  - Prioridad: 10

---

## 🔍 Verificar por Qué No Funcionó

### Paso 1: Verificar Estado del Dominio

1. Ve a: https://resend.com/domains
2. Busca `naova.com.mx`
3. ¿Qué estado tiene?
   - 🔴 **"Pending"** → Aún no está verificado, espera más tiempo
   - 🟡 **"Verifying"** → Está verificando, espera
   - 🟢 **"Verified"** → Está listo ✅

### Paso 2: Verificar Webhook

1. Ve a "Webhooks" en Resend
2. ¿Hay un webhook configurado?
   - ❌ **No hay webhook** → Necesitas configurarlo primero
   - ✅ **Hay webhook** → Verifica que está activo

### Paso 3: Verificar Logs de Vercel

1. Ve a: https://vercel.com
2. Selecciona tu proyecto `naova`
3. Ve a la pestaña **"Logs"**
4. Busca líneas con `/api/inbox/webhook/email`
5. ¿Aparece algo?
   - ✅ **Sí aparece** → El webhook llegó, revisa si hay errores
   - ❌ **No aparece** → El webhook no llegó (dominio no verificado o webhook no configurado)

### Paso 4: Verificar DNS

1. Ve a: https://mxtoolbox.com/SuperTool.aspx
2. Ingresa: `naova.com.mx`
3. Busca el registro MX para recepción:
   - Debería aparecer: `inbound-smtp.us-east-1.amazonaws.com`
4. ¿Aparece?
   - ✅ **Sí** → DNS está bien
   - ❌ **No** → DNS no está configurado correctamente

---

## 🚀 Pasos para que Funcione

### Si el Dominio NO Está Verificado:

1. **Espera más tiempo** (puede tardar hasta 2 horas)
2. **Verifica los DNS** están correctos
3. **Verifica** que agregaste todos los registros

### Si el Dominio YA Está Verificado:

1. **Configura el webhook**:
   - Ve a "Webhooks" en Resend
   - Agrega webhook con URL: `https://www.naova.com.mx/api/inbox/webhook/email`
   - Evento: "email.received"

2. **Prueba de nuevo**:
   - Envía email a: `test@naova.com.mx` o `compras@naova.com.mx`
   - Verifica en logs de Vercel
   - Verifica en `/admin/requests`

---

## 📋 Resumen

| Qué | Email/Dominio | Estado |
|-----|---------------|--------|
| **ENVIAR** | `solucionesnaova@gmail.com` (SMTP) | ✅ Funciona |
| **RECIBIR** | Cualquier `@naova.com.mx` (Resend) | ⏳ Necesita dominio verificado + webhook |

---

## ✅ Checklist Antes de Probar

- [ ] Dominio `naova.com.mx` está verificado en Resend
- [ ] Webhook configurado en Resend
- [ ] DNS MX configurado correctamente
- [ ] Enviando email a `@naova.com.mx` (no a Gmail)

---

## 💡 Próximos Pasos

1. **Verifica el estado del dominio en Resend**
2. **Si está verificado**, configura el webhook
3. **Si no está verificado**, espera más tiempo y verifica DNS
4. **Prueba enviando a** `test@naova.com.mx` (no a Gmail)

---

Avísame:
- ¿El dominio está verificado en Resend?
- ¿Ya configuraste el webhook?
- ¿Qué email exacto enviaste? (a qué dirección)

Con esa información te ayudo a encontrar el problema exacto.

