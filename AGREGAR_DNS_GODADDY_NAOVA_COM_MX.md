# 🔧 Agregar DNS Records en GoDaddy para naova.com.mx

## 📋 Paso 2: Agregar DNS Records en GoDaddy

Ahora que ya agregaste `naova.com.mx` en Resend, necesitas agregar los DNS records que Resend te proporcionó.

---

## 🎯 Paso a Paso en GoDaddy

### 1. Ir a GoDaddy DNS

1. Ve a: https://dcc.godaddy.com
2. Inicia sesión
3. Busca el dominio **`naova.com.mx`**
4. Haz clic en el botón **"DNS"** o **"Manage DNS"** o **"Administrar DNS"**

---

### 2. Agregar los Registros

Resend te debe haber dado estos registros. Agrega cada uno:

---

#### 📝 Registro 1: DKIM (TXT)

**En GoDaddy:**
1. Haz clic en **"Add"** o **"Agregar"**
2. **Tipo:** Selecciona **"TXT"**
3. **Nombre:** `resend._domainkey`
4. **Valor:** (Copia el valor que Resend te dio - será algo largo como `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQD...`)
5. **TTL:** Deja por defecto o selecciona "1 hora"
6. Haz clic en **"Save"** o **"Guardar"**

**⚠️ IMPORTANTE:** El valor del DKIM es único y largo. Cópialo completo desde Resend.

---

#### 📝 Registro 2: SPF (TXT)

**En GoDaddy:**
1. Haz clic en **"Add"** o **"Agregar"**
2. **Tipo:** Selecciona **"TXT"**
3. **Nombre:** `send`
4. **Valor:** `v=spf1 include:amazonses.com ~all`
5. **TTL:** Deja por defecto o selecciona "1 hora"
6. Haz clic en **"Save"** o **"Guardar"**

---

#### 📝 Registro 3: MX (Recepción de Emails)

**En GoDaddy:**
1. Haz clic en **"Add"** o **"Agregar"**
2. **Tipo:** Selecciona **"MX"**
3. **Nombre:** `@` (o déjalo vacío si no hay campo de nombre)
4. **Valor/Puntero:** `inbound-smtp.us-east-1.amazonaws.com`
5. **Prioridad:** `10`
6. **TTL:** Deja por defecto o selecciona "1 hora"
7. Haz clic en **"Save"** o **"Guardar"**

---

#### 📝 Registro 4: DMARC (Opcional pero recomendado)

**En GoDaddy:**
1. Haz clic en **"Add"** o **"Agregar"**
2. **Tipo:** Selecciona **"TXT"**
3. **Nombre:** `_dmarc`
4. **Valor:** `v=DMARC1; p=none;`
5. **TTL:** Deja por defecto o selecciona "1 hora"
6. Haz clic en **"Save"** o **"Guardar"**

---

## ✅ Después de Agregar los Registros

### Verificación en GoDaddy

Deberías ver estos registros en tu lista DNS:

1. ✅ **TXT** - `resend._domainkey` - (valor largo de Resend)
2. ✅ **TXT** - `send` - `v=spf1 include:amazonses.com ~all`
3. ✅ **MX** - `@` - `inbound-smtp.us-east-1.amazonaws.com` (Prioridad: 10)
4. ✅ **TXT** - `_dmarc` - `v=DMARC1; p=none;`

---

### Verificación en Resend

1. Ve a: https://resend.com/domains
2. Selecciona `naova.com.mx`
3. Verás el estado de cada registro:
   - 🟡 **Pending** = Aún no verificado (espera 5-30 minutos)
   - 🟢 **Verified** = Verificado correctamente
   - 🔴 **Failed** = Error (revisa el valor del registro)

---

## ⏱️ Tiempo de Propagación

- **Normalmente:** 5-30 minutos
- **Máximo:** Hasta 24 horas (raro)

**Mientras esperas:**
- Puedes verificar el progreso en Resend
- Los registros aparecerán como "Pending" hasta que se verifiquen

---

## 🔍 Verificar Propagación (Opcional)

Si quieres verificar que los registros están propagándose:

### Verificar MX Record:
1. Ve a: https://mxtoolbox.com/SuperTool.aspx
2. Ingresa: `naova.com.mx`
3. Selecciona: **"MX Lookup"**
4. Haz clic en **"MX Lookup"**
5. Debería aparecer: `inbound-smtp.us-east-1.amazonaws.com` con prioridad 10

**Nota:** Puede tomar unos minutos en aparecer en mxtoolbox.

---

## ✅ Checklist Final

- [ ] Agregado registro DKIM (TXT - `resend._domainkey`)
- [ ] Agregado registro SPF (TXT - `send`)
- [ ] Agregado registro MX (`inbound-smtp.us-east-1.amazonaws.com`)
- [ ] Agregado registro DMARC (TXT - `_dmarc`) - opcional
- [ ] Todos los registros guardados en GoDaddy
- [ ] Esperando verificación en Resend (5-30 minutos)

---

## 🆘 Problemas Comunes

### "El registro ya existe"
- Si ya tienes un registro MX, puedes tener solo uno para recepción
- Si ya tienes un registro `send` TXT, edítalo en lugar de crear uno nuevo
- Puedes tener múltiples registros `_dmarc`, pero es mejor tener solo uno

### "No se verifica en Resend"
- Espera más tiempo (hasta 30 minutos)
- Verifica que los valores estén exactamente como Resend los proporcionó
- Verifica que no haya espacios extra al principio o final del valor

### "El DKIM es muy largo"
- Es normal, el DKIM es un registro largo
- Asegúrate de copiarlo completo desde Resend
- No le agregues saltos de línea

---

## 📝 Siguiente Paso

Una vez que todos los registros estén verificados en Resend:

1. Configurar el webhook en Resend (Paso 3)
2. Probar enviando un email a `test@naova.com.mx`

---

**¿Tienes dudas? Revisa los valores que Resend te dio y compáralos con lo que agregaste en GoDaddy.**

