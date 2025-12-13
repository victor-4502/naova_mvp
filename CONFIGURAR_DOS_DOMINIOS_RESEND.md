# 📧 Configurar Dos Dominios en Resend (naova.mx y naova.com.mx)

## 🎯 Objetivo

Configurar ambos dominios para recibir emails:
- `test@naova.mx` (ya configurado)
- `test@naova.com.mx` (nuevo)

---

## 📋 Pasos

### Paso 1: Agregar Segundo Dominio en Resend

1. Ve a: https://resend.com/domains
2. Haz clic en **"Add Domain"** o **"Add New Domain"**
3. Ingresa: `naova.com.mx`
4. Haz clic en **"Add Domain"**

---

### Paso 2: Verificar DNS Records para naova.com.mx

Resend te mostrará los DNS records que necesitas agregar en GoDaddy.

**Registros necesarios (similar a naova.mx):**

#### DKIM (Autenticación)
- **Tipo:** TXT
- **Nombre:** `resend._domainkey`
- **Valor:** (lo proporciona Resend, será diferente al de naova.mx)
- **TTL:** 1 hora

#### SPF (Autenticación)
- **Tipo:** TXT
- **Nombre:** `send`
- **Valor:** `v=spf1 include:amazonses.com ~all`
- **TTL:** 1 hora

#### MX (Recepción)
- **Tipo:** MX
- **Nombre:** `@` (raíz del dominio)
- **Valor:** `inbound-smtp.us-east-1.amazonaws.com`
- **Prioridad:** 10
- **TTL:** 1 hora

#### DMARC (Opcional pero recomendado)
- **Tipo:** TXT
- **Nombre:** `_dmarc`
- **Valor:** `v=DMARC1; p=none;`
- **TTL:** 1 hora

---

### Paso 3: Agregar DNS Records en GoDaddy

1. Ve a: https://dcc.godaddy.com
2. Selecciona tu dominio `naova.com.mx`
3. Ve a **"DNS"** o **"Administrar DNS"**
4. Agrega los registros que Resend te proporcionó (son los mismos tipos que arriba)

**IMPORTANTE:** Los valores del DKIM serán **diferentes** para cada dominio.

---

### Paso 4: Esperar Verificación

1. En Resend, el dominio aparecerá como **"Pending"**
2. Espera 5-30 minutos para la propagación DNS
3. Resend verificará automáticamente los registros
4. Cuando todos estén correctos, cambiará a **"Verified"**

**Para verificar:**
- Ve a: https://resend.com/domains
- Revisa el estado de `naova.com.mx`
- Debe mostrar todos los registros como ✅

---

### Paso 5: Configurar Webhook (Opcional)

Si quieres que ambos dominios usen el mismo webhook:

1. Ve a: https://resend.com/webhooks
2. Si ya tienes un webhook configurado para `naova.mx`, puedes usar el mismo
3. El webhook recibe emails de **todos** los dominios verificados

**O crear webhooks separados:**

Si prefieres tener webhooks diferentes para cada dominio:

1. Crea un nuevo webhook
2. URL: `https://www.naova.com.mx/api/inbox/webhook/email`
3. Eventos: Selecciona `email.received`
4. Asigna el webhook al dominio `naova.com.mx`

---

## ✅ Verificación

### Probar ambos dominios:

1. **test@naova.mx:**
   - Envía un email de prueba a `test@naova.mx`
   - Verifica que llegue en Resend
   - Verifica que se cree el request en Naova

2. **test@naova.com.mx:**
   - Envía un email de prueba a `test@naova.com.mx`
   - Verifica que llegue en Resend
   - Verifica que se cree el request en Naova

---

## 🔧 Configuración Actual del Sistema

El sistema ya está preparado para recibir emails de **cualquier dominio** porque:

1. El webhook `/api/inbox/webhook/email` no valida el dominio específico
2. Procesa todos los emails que Resend envía
3. Identifica al cliente por el email del remitente, no por el dominio receptor

---

## 📝 Notas Importantes

- ✅ Puedes tener **múltiples dominios** verificados en Resend
- ✅ Un solo webhook puede recibir emails de **todos** los dominios
- ✅ Los DNS records son **independientes** por dominio
- ⚠️ El DKIM TXT de cada dominio será **diferente**

---

## 🆘 Troubleshooting

### El dominio no se verifica

1. Verifica que todos los DNS records estén correctos
2. Usa herramientas como mxtoolbox.com para verificar propagación
3. Asegúrate de que no haya registros duplicados
4. Espera más tiempo (puede tomar hasta 24 horas)

### Los emails no llegan

1. Verifica que el webhook esté configurado
2. Verifica que el dominio esté "Verified" en Resend
3. Revisa los logs de Resend para ver si hay errores
4. Revisa los logs de Vercel para ver si el webhook se está recibiendo

---

## 📋 Checklist

- [ ] Agregado dominio `naova.com.mx` en Resend
- [ ] Agregados todos los DNS records en GoDaddy
- [ ] Esperado verificación (estado "Verified")
- [ ] Probado envío a `test@naova.com.mx`
- [ ] Verificado que se crea request en Naova
- [ ] Probado envío a `test@naova.mx` (confirmar que sigue funcionando)

