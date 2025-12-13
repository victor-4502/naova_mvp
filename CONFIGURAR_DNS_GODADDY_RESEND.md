# 🔧 Configurar DNS en GoDaddy para Resend

## 📋 Registros DNS que Resend Te Dio

Resend te dio estos registros que necesitas agregar en GoDaddy:

### 1. DKIM (Para Verificación)
- **Tipo**: TXT
- **Nombre**: `resend._domainkey`
- **Contenido**: `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDfUcAe+lymGX2jTnxjiHlAJLrcIjFp5eH16tz6sPHZ6nHT5o54RAjr6VRgOiiTROXpab/mnBCUkdvFHNB9dI/keQN2pssg06o/UqJho37pVHueOyPPSXq1NUvpkaeR1579BQqmOighHXv/R++0G/If1FaqjuH04cmJ/qy724vcCQIDAQAB`

### 2. SPF - MX para Envío
- **Tipo**: MX
- **Nombre**: `send`
- **Contenido**: `feedback-smtp.us-east-1.amazonses.com`
- **Prioridad**: `10`
- **TTL**: `60`

### 3. SPF - TXT para Envío
- **Tipo**: TXT
- **Nombre**: `send`
- **Contenido**: `v=spf1 include:amazonses.com ~all`
- **TTL**: `60`

### 4. DMARC (Opcional)
- **Tipo**: TXT
- **Nombre**: `_dmarc`
- **Contenido**: `v=DMARC1; p=none;`
- **TTL**: `Auto`

### 5. MX para Recepción (MUY IMPORTANTE)
- **Tipo**: MX
- **Nombre**: `@`
- **Contenido**: `inbound-smtp.us-east-1.amazonaws.com`
- **Prioridad**: `10`
- **TTL**: `60`

---

## 🚀 Pasos para Agregar en GoDaddy

### Paso 1: Ir a la Administración de DNS

1. **Inicia sesión en GoDaddy**
   - Ve a: https://www.godaddy.com
   - Haz clic en **"Iniciar Sesión"** (arriba a la derecha)

2. **Ir a Mis Productos**
   - En el dashboard, haz clic en **"Mis Productos"** o **"My Products"**
   - Busca tu dominio `naova.com.mx`
   - Haz clic en el botón **"DNS"** o **"Administrar DNS"** (tres puntos → DNS)

3. **Ver la Lista de Registros**
   - Verás una tabla con todos tus registros DNS actuales
   - Busca la sección donde dice **"Registros"** o **"Records"**

---

### Paso 2: Agregar el Registro DKIM (TXT)

1. **Haz clic en "Agregar"** o **"Add Record"**

2. **Configura el registro TXT para DKIM:**
   - **Tipo**: Selecciona **"TXT"**
   - **Nombre**: Escribe `resend._domainkey`
   - **Valor**: Pega este valor completo:
     ```
     p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDfUcAe+lymGX2jTnxjiHlAJLrcIjFp5eH16tz6sPHZ6nHT5o54RAjr6VRgOiiTROXpab/mnBCUkdvFHNB9dI/keQN2pssg06o/UqJho37pVHueOyPPSXq1NUvpkaeR1579BQqmOighHXv/R++0G/If1FaqjuH04cmJ/qy724vcCQIDAQAB
     ```
   - **TTL**: Déjalo como está (normalmente `600 segundos` o `1 hora`)

3. **Haz clic en "Guardar"** o **"Save"**

**✅ Checklist:**
- [ ] Registro TXT `resend._domainkey` agregado

---

### Paso 3: Agregar Registro MX para Envío (SPF)

1. **Haz clic en "Agregar"** nuevamente

2. **Configura el registro MX para envío:**
   - **Tipo**: Selecciona **"MX"**
   - **Nombre**: Escribe `send`
   - **Valor/Host**: Escribe `feedback-smtp.us-east-1.amazonses.com`
   - **Prioridad**: Escribe `10`
   - **TTL**: Déjalo como está o cambia a `60` (1 minuto)

3. **Haz clic en "Guardar"**

**✅ Checklist:**
- [ ] Registro MX para `send` agregado

---

### Paso 4: Agregar Registro TXT para SPF

1. **Haz clic en "Agregar"** nuevamente

2. **Configura el registro TXT para SPF:**
   - **Tipo**: Selecciona **"TXT"**
   - **Nombre**: Escribe `send`
   - **Valor**: Escribe `v=spf1 include:amazonses.com ~all`
   - **TTL**: Déjalo como está o cambia a `60`

3. **Haz clic en "Guardar"**

**✅ Checklist:**
- [ ] Registro TXT para `send` agregado

---

### Paso 5: Agregar Registro DMARC (Opcional pero Recomendado)

1. **Haz clic en "Agregar"** nuevamente

2. **Configura el registro TXT para DMARC:**
   - **Tipo**: Selecciona **"TXT"**
   - **Nombre**: Escribe `_dmarc`
   - **Valor**: Escribe `v=DMARC1; p=none;`
   - **TTL**: Déjalo como está

3. **Haz clic en "Guardar"**

**✅ Checklist:**
- [ ] Registro TXT `_dmarc` agregado (opcional)

---

### Paso 6: Agregar Registro MX para RECEPCIÓN (MUY IMPORTANTE)

Este es el más importante para recibir emails.

1. **Haz clic en "Agregar"** nuevamente

2. **Configura el registro MX para recepción:**
   - **Tipo**: Selecciona **"MX"**
   - **Nombre**: Escribe `@` (solo el símbolo @)
     - ⚠️ **NOTA**: En algunos interfaces de GoDaddy, puedes dejar el campo vacío en lugar de `@`
   - **Valor/Host**: Escribe `inbound-smtp.us-east-1.amazonaws.com`
   - **Prioridad**: Escribe `10`
   - **TTL**: Déjalo como está o cambia a `60`

3. **Haz clic en "Guardar"**

**✅ Checklist:**
- [ ] Registro MX para `@` agregado (para recepción)

---

## 📊 Resumen de Registros a Agregar

Cuando termines, deberías tener estos nuevos registros en GoDaddy:

| Tipo | Nombre | Valor/Host | Prioridad | TTL |
|------|--------|------------|-----------|-----|
| TXT | `resend._domainkey` | `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDfUcAe+lymGX2jTnxjiHlAJLrcIjFp5eH16tz6sPHZ6nHT5o54RAjr6VRgOiiTROXpab/mnBCUkdvFHNB9dI/keQN2pssg06o/UqJho37pVHueOyPPSXq1NUvpkaeR1579BQqmOighHXv/R++0G/If1FaqjuH04cmJ/qy724vcCQIDAQAB` | - | 600 |
| MX | `send` | `feedback-smtp.us-east-1.amazonses.com` | 10 | 60 |
| TXT | `send` | `v=spf1 include:amazonses.com ~all` | - | 60 |
| TXT | `_dmarc` | `v=DMARC1; p=none;` | - | Auto |
| MX | `@` | `inbound-smtp.us-east-1.amazonaws.com` | 10 | 60 |

---

## ⚠️ Notas Importantes

### Sobre el Nombre "@"

En GoDaddy, el símbolo `@` significa "el dominio raíz". 

- **Si ves un campo "Nombre" o "Host"**: 
  - Puedes escribir `@`
  - O dejar el campo **vacío** (depende de la interfaz)
  
- **Si el campo está vacío por defecto**: 
  - Déjalo vacío, ya significa el dominio raíz

### Sobre los Registros MX Existentes

Si ya tienes registros MX para `@` (para recibir emails en otros servicios), **NO los elimines**.

Puedes tener **múltiples registros MX** con diferentes prioridades. El que tenga la prioridad más baja (número más pequeño) será el primero en intentar recibir emails.

**Ejemplo:**
- MX con prioridad 5 → Se intenta primero
- MX con prioridad 10 → Se intenta después

Para Resend, la prioridad 10 está bien. Si tienes otro MX con prioridad más baja, ese será el principal, pero Resend también recibirá emails.

---

## ✅ Verificar que los Registros Están Correctos

Después de agregar todos los registros:

1. **Espera 5-10 minutos** para que se propaguen
2. **Verifica en GoDaddy**:
   - Vuelve a la lista de registros DNS
   - Deberías ver todos los nuevos registros listados

3. **Verifica con una herramienta externa**:
   - Ve a: https://mxtoolbox.com/SuperTool.aspx
   - Ingresa `naova.com.mx`
   - Busca los registros:
     - TXT para `resend._domainkey`
     - MX para `inbound-smtp.us-east-1.amazonaws.com`
   - Si aparecen, están configurados correctamente

---

## 🔄 Volver a Resend

Después de agregar todos los registros:

1. **Espera 10-30 minutos** (tiempo de propagación DNS)

2. **Vuelve a Resend**:
   - Ve a: https://resend.com/domains
   - O desde el dashboard, haz clic en "Domains"

3. **Verifica el estado**:
   - Busca tu dominio `naova.com.mx`
   - El estado debería cambiar de "Pending" a "Verified" (puede tomar hasta 30 minutos)

4. **Si después de 1 hora sigue en "Pending"**:
   - Revisa que agregaste todos los registros correctamente
   - Verifica los valores (copia y pega exactamente)
   - Usa https://mxtoolbox.com para verificar que los DNS están propagados

---

## ❓ Problemas Comunes

### Problema: No encuentro dónde agregar registros en GoDaddy

**Solución:**
1. Ve a "Mis Productos"
2. Busca tu dominio `naova.com.mx`
3. Haz clic en los tres puntos (...) o el botón "DNS"
4. Deberías ver la lista de registros

### Problema: El campo "Nombre" no acepta "@"

**Solución:**
- Déjalo vacío (en GoDaddy, vacío = dominio raíz)
- O escribe solo el dominio sin el @

### Problema: Ya tengo un registro MX para "@"

**Solución:**
- **NO lo elimines**
- Agrega el nuevo registro MX de Resend también
- Puedes tener múltiples registros MX con diferentes prioridades

### Problema: No sé qué poner en "Prioridad"

**Solución:**
- Para el MX de recepción: `10`
- Para el MX de envío (send): `10`

---

## ✅ Checklist Final

Antes de considerar que terminaste:

- [ ] Agregué el registro TXT `resend._domainkey`
- [ ] Agregué el registro MX para `send`
- [ ] Agregué el registro TXT para `send`
- [ ] Agregué el registro TXT `_dmarc` (opcional)
- [ ] Agregué el registro MX para `@` (recepción) ← **MUY IMPORTANTE**
- [ ] Esperé 10-30 minutos
- [ ] Verifiqué en Resend que el dominio está verificado

---

## 🎉 Siguiente Paso

Una vez que Resend muestre que el dominio está verificado:

1. Ve al **Paso 5** de la guía principal: Configurar el Webhook
2. URL del webhook: `https://www.naova.com.mx/api/inbox/webhook/email`

---

¡Vamos paso a paso! Si te quedas en algún paso, avísame y te ayudo específicamente.

