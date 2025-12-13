# 🔧 Solucionar "Invalid Configuration" en Vercel

## ❌ Problema

Todos los dominios en Vercel muestran **"Invalid Configuration"**:
- `naova.mx`
- `www.naova.mx`
- `naova.com.mx`
- `www.naova.com.mx`

---

## 🔍 Causas Comunes

### 1. DNS Records No Apuntan a Vercel

Vercel necesita que los registros DNS apunten a sus servidores. Si están configurados para otro servicio (como Resend), Vercel no puede verificar la configuración.

### 2. Conflicto Entre Servicios

Si tienes:
- **MX records** apuntando a Resend (para recibir emails)
- **CNAME/A records** que deberían apuntar a Vercel (para el sitio web)

Puede haber conflictos si no están bien configurados.

---

## ✅ Solución: Configuración Separada

### Opción 1: Usar Solo `www.naova.com.mx` en Vercel (Recomendado)

**Configuración en Vercel:**
- Solo agrega: `www.naova.com.mx` a tu proyecto
- Vercel te dará un CNAME para configurar

**Configuración en GoDaddy:**
- **CNAME** `www` → (valor que Vercel te dio, algo como `cname.vercel-dns.com`)
- **A record** `@` → Puede apuntar a Vercel O a otro servicio
- **MX record** `@` → `inbound-smtp.us-east-1.amazonaws.com` (para Resend)

**Ventajas:**
- Sitio web funciona en `www.naova.com.mx`
- Emails funcionan en `@naova.com.mx` (cualquier dirección)
- Sin conflictos

---

### Opción 2: Configurar DNS Correctamente para Ambos

**Para que funcione el sitio web Y los emails:**

#### En GoDaddy:

1. **Para el sitio web (Vercel):**
   - **CNAME** `www` → `cname.vercel-dns.com` (o el que Vercel te dio)
   - **A record** `@` → IP de Vercel (si Vercel lo requiere)

2. **Para los emails (Resend):**
   - **MX record** `@` → `inbound-smtp.us-east-1.amazonaws.com` (Prioridad: 10)
   - **TXT** `send` → `v=spf1 include:amazonses.com ~all`
   - **TXT** `resend._domainkey` → (valor de Resend)
   - **TXT** `_dmarc` → `v=DMARC1; p=none;`

**IMPORTANTE:** Puedes tener AMBOS (CNAME/A para Vercel Y MX para Resend) sin problemas.

---

## 🔧 Pasos para Solucionar en Vercel

### Paso 1: Verificar qué Dominio Quieres en Vercel

Decide:
- ¿Quieres que el sitio funcione en `www.naova.com.mx`? (recomendado)
- ¿O también en `naova.com.mx` sin www?

### Paso 2: Agregar Dominio Correctamente en Vercel

1. **Ve a Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Selecciona tu proyecto `naova`

2. **Ve a Settings → Domains**

3. **Agrega el dominio:**
   - Si quieres `www.naova.com.mx`:
     - Agrega: `www.naova.com.mx`
   - Si quieres ambos:
     - Agrega: `naova.com.mx`
     - Agrega: `www.naova.com.mx`

4. **Vercel te dará las instrucciones DNS:**
   - Te mostrará qué registros agregar
   - Generalmente un **CNAME** para `www`
   - O un **A record** para el dominio raíz

### Paso 3: Configurar DNS en GoDaddy Según Vercel

1. **Copia las instrucciones de Vercel**

2. **Agrega los registros en GoDaddy:**
   - Si Vercel dice agregar **CNAME** para `www`, agrégalo
   - Si Vercel dice agregar **A record** para `@`, agrégalo

3. **Mantén los registros de Resend:**
   - NO elimines los registros MX de Resend
   - Puedes tener ambos sin problemas

---

## ⚠️ Nota Importante

**Vercel y Resend pueden coexistir:**

- ✅ **Vercel** maneja el sitio web (HTTP/HTTPS)
- ✅ **Resend** maneja los emails (SMTP)
- ✅ Puedes tener registros DNS para ambos

**Tipos de registros que no conflictan:**
- **MX** (para emails) - solo Resend lo usa
- **CNAME/A** (para sitio web) - solo Vercel lo usa
- **TXT** (para verificación) - pueden existir múltiples

---

## 🔍 Verificar la Configuración Actual

### En GoDaddy, verifica que tienes:

**Para Vercel (sitio web):**
- [ ] CNAME `www` apuntando a Vercel
- [ ] O A record `@` apuntando a Vercel

**Para Resend (emails):**
- [ ] MX `@` → `inbound-smtp.us-east-1.amazonaws.com`
- [ ] TXT `send` → `v=spf1 include:amazonses.com ~all`
- [ ] TXT `resend._domainkey` → (valor de Resend)
- [ ] TXT `_dmarc` → `v=DMARC1; p=none;`

---

## 🆘 Si Sigue Dando "Invalid Configuration"

### 1. Verifica que los DNS estén propagados

Usa herramientas como:
- https://mxtoolbox.com/SuperTool.aspx
- Verifica que el CNAME o A record apunta a Vercel

### 2. En Vercel, haz clic en "Refresh"

A veces Vercel tarda en detectar los cambios DNS.

### 3. Verifica en Vercel qué espera exactamente

- Haz clic en "Learn more" en el mensaje de error
- Vercel te dirá exactamente qué registros DNS necesita
- Compara con lo que tienes en GoDaddy

### 4. Espera más tiempo

Los cambios DNS pueden tardar hasta 24 horas en propagarse completamente.

---

## 📋 Checklist

- [ ] Decidido qué dominio usar en Vercel (`www.naova.com.mx` recomendado)
- [ ] Agregado el dominio en Vercel → Settings → Domains
- [ ] Copiadas las instrucciones DNS de Vercel
- [ ] Agregados los registros DNS en GoDaddy según Vercel
- [ ] Mantenidos los registros MX de Resend (NO eliminarlos)
- [ ] Esperado 10-30 minutos para propagación
- [ ] Hacer clic en "Refresh" en Vercel
- [ ] Verificado que el estado cambió a "Valid Configuration"

---

## 💡 Recomendación

**Para simplificar, recomiendo:**

1. **En Vercel:** Solo usa `www.naova.com.mx`
2. **En GoDaddy:**
   - CNAME `www` → (valor de Vercel)
   - MX `@` → `inbound-smtp.us-east-1.amazonaws.com` (Resend)
   - TXT records de Resend

**Resultado:**
- ✅ Sitio web: `https://www.naova.com.mx`
- ✅ Emails: `test@naova.com.mx`, `compras@naova.com.mx`, etc.

---

**¿Necesitas ayuda configurando los registros específicos? Avísame y te guío paso a paso.**

