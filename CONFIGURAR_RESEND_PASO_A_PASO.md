# 🚀 Guía Paso a Paso: Configurar Resend para Naova

## 📋 Pre-requisitos

- ✅ Tienes el dominio: `naova.com.mx`
- ✅ Tienes acceso a tu proveedor de DNS (GoDaddy, Cloudflare, etc.)
- ✅ Tienes 20-30 minutos

---

## 🎯 Paso 1: Crear Cuenta en Resend

### 1.1. Ve a Resend
```
https://resend.com
```

### 1.2. Crear Cuenta
1. Haz clic en **"Get Started"** o **"Sign Up"** (botón grande)
2. Ingresa tu email (puede ser tu email personal)
3. Elige una contraseña
4. Haz clic en **"Create Account"**

### 1.3. Verificar Email
1. Revisa tu bandeja de entrada
2. Haz clic en el enlace de verificación que Resend te envió
3. Serás redirigido al dashboard de Resend

**✅ Checklist:**
- [ ] Cuenta creada en Resend
- [ ] Email verificado
- [ ] Puedes ver el dashboard de Resend

---

## 🏷️ Paso 2: Agregar tu Dominio

### 2.1. Ir a la Sección de Dominios
1. En el dashboard de Resend, busca en el menú lateral
2. Haz clic en **"Domains"** (o **"Dominios"**)
3. Verás una lista de dominios (estará vacía al principio)

### 2.2. Agregar Nuevo Dominio
1. Haz clic en el botón **"Add Domain"** o **"Agregar Dominio"**
2. En el campo que aparece, ingresa: `naova.com.mx`
   - ⚠️ **IMPORTANTE**: Solo escribe el dominio, sin `http://` ni `www`
   - ✅ Correcto: `naova.com.mx`
   - ❌ Incorrecto: `www.naova.com.mx` o `https://naova.com.mx`

3. Haz clic en **"Add"** o **"Agregar"**

### 2.3. Resend Te Mostrará los Registros DNS
Después de agregar el dominio, Resend te mostrará una página con varios registros DNS que necesitas agregar a tu proveedor de dominio.

**Verás algo como:**
```
Tipo: TXT
Nombre: @
Valor: resend-verification=xxxxxxxxxxxxx

Tipo: MX
Nombre: @
Valor: feedback-smtp.resend.com (Prioridad: 10)

Tipo: TXT
Nombre: _resend
Valor: resend-domain=xxxxxxxxxxxxx
```

**⚠️ IMPORTANTE:** NO cierres esta página todavía. Necesitarás copiar estos valores.

**✅ Checklist:**
- [ ] Dominio agregado en Resend
- [ ] Puedes ver los registros DNS que necesitas agregar
- [ ] Tienes los valores copiados o la página abierta

---

## 🔧 Paso 3: Configurar DNS en tu Proveedor

Este paso depende de dónde tengas registrado tu dominio. Te doy ejemplos para los más comunes:

### 3.1. Identificar tu Proveedor de DNS

¿Dónde compraste/compraste `naova.com.mx`?
- **GoDaddy** → Ve a la sección 3.2
- **Cloudflare** → Ve a la sección 3.3
- **Namecheap** → Ve a la sección 3.4
- **Otro** → Busca la sección de "DNS" o "Zona DNS"

### 3.2. Configurar DNS en GoDaddy

1. **Iniciar sesión en GoDaddy**
   - Ve a: https://www.godaddy.com
   - Inicia sesión con tu cuenta

2. **Ir a la administración de DNS**
   - En el dashboard, busca "Mis Productos" o "My Products"
   - Encuentra tu dominio `naova.com.mx`
   - Haz clic en **"DNS"** o **"Administrar DNS"**

3. **Agregar Registros TXT de Verificación**
   - En la sección "Registros", busca "TXT" o "Agregar registro"
   - Haz clic en **"Agregar"** o **"Add Record"**
   - **Tipo**: Selecciona "TXT"
   - **Nombre/Host**: `@` (o déjalo vacío, según tu proveedor)
   - **Valor**: Copia el valor que Resend te dio para el TXT de verificación
   - **TTL**: Déjalo como está (normalmente 3600)
   - Haz clic en **"Guardar"** o **"Save"**

4. **Agregar Registro MX**
   - Haz clic en **"Agregar"** nuevamente
   - **Tipo**: Selecciona "MX"
   - **Nombre/Host**: `@` (o déjalo vacío)
   - **Valor**: `feedback-smtp.resend.com`
   - **Prioridad**: `10`
   - **TTL**: Déjalo como está
   - Haz clic en **"Guardar"**

5. **Agregar Registro TXT _resend**
   - Haz clic en **"Agregar"** nuevamente
   - **Tipo**: Selecciona "TXT"
   - **Nombre/Host**: `_resend`
   - **Valor**: Copia el valor que Resend te dio para `_resend`
   - Haz clic en **"Guardar"**

6. **Esperar Propagación**
   - Los cambios DNS pueden tardar desde 5 minutos hasta 24 horas
   - Normalmente toma 10-30 minutos

### 3.3. Configurar DNS en Cloudflare

1. **Iniciar sesión en Cloudflare**
   - Ve a: https://dash.cloudflare.com
   - Inicia sesión

2. **Seleccionar tu Dominio**
   - En el dashboard, haz clic en `naova.com.mx`

3. **Ir a DNS**
   - En el menú lateral, haz clic en **"DNS"**

4. **Agregar Registros**
   - Haz clic en **"Add record"** para cada registro que Resend te dio:
     - **TXT** para verificación (Nombre: `@`, Contenido: valor de Resend)
     - **MX** (Nombre: `@`, Servidor: `feedback-smtp.resend.com`, Prioridad: 10)
     - **TXT** para `_resend` (Nombre: `_resend`, Contenido: valor de Resend)

5. **Esperar Propagación**
   - Cloudflare normalmente propaga más rápido (5-15 minutos)

### 3.4. Configurar DNS en Namecheap

1. **Iniciar sesión en Namecheap**
   - Ve a: https://www.namecheap.com
   - Inicia sesión

2. **Ir a Domain List**
   - Haz clic en **"Domain List"** en el menú
   - Encuentra `naova.com.mx`
   - Haz clic en **"Manage"**

3. **Ir a Advanced DNS**
   - En la pestaña **"Advanced DNS"**
   - Ve a la sección de registros

4. **Agregar Registros**
   - Haz clic en **"Add New Record"** para cada registro
   - Agrega los registros TXT y MX como te indicó Resend

5. **Esperar Propagación**

### 3.5. Otros Proveedores

Si tu proveedor no está en la lista:
1. Busca la sección de **"DNS"**, **"Zona DNS"**, o **"DNS Records"**
2. Agrega los registros que Resend te indicó
3. Guarda los cambios
4. Espera la propagación

**✅ Checklist:**
- [ ] Agregué todos los registros DNS en mi proveedor
- [ ] Guardé los cambios
- [ ] Estoy esperando la propagación (10-30 minutos normalmente)

---

## ✅ Paso 4: Verificar el Dominio en Resend

### 4.1. Volver a Resend
1. Ve a: https://resend.com/domains
2. O desde el dashboard, haz clic en **"Domains"**

### 4.2. Verificar Estado
1. Verás tu dominio `naova.com.mx` en la lista
2. El estado puede ser:
   - 🔴 **"Pending"** o **"Pendiente"** → Esperando verificación
   - 🟡 **"Verifying"** o **"Verificando"** → Resend está verificando
   - 🟢 **"Verified"** o **"Verificado"** → ✅ ¡Listo!

### 4.3. Esperar Verificación
- **Normalmente toma**: 10-30 minutos
- **Puede tomar hasta**: 24 horas (raro)
- Resend verificará automáticamente cuando los DNS estén propagados

### 4.4. Si Tarda Mucho
Si después de 1 hora sigue en "Pending":
1. **Verifica que agregaste todos los registros correctamente**
2. **Usa una herramienta de verificación DNS**:
   - Ve a: https://mxtoolbox.com/SuperTool.aspx
   - Ingresa `naova.com.mx`
   - Verifica que los registros TXT y MX aparezcan

3. **Si los registros no aparecen**: Revisa que los guardaste correctamente en tu proveedor

**✅ Checklist:**
- [ ] Dominio verificado en Resend (estado: Verified)
- [ ] Veo un check verde o "Verified" junto al dominio

---

## 🔗 Paso 5: Configurar Webhook para Recibir Emails

### 5.1. Ir a la Sección de Webhooks
1. En el dashboard de Resend, busca en el menú lateral
2. Haz clic en **"Webhooks"** (o **"Webhooks"**)
   - Si no lo ves, puede estar en **"Settings"** → **"Webhooks"**

### 5.2. Agregar Nuevo Webhook
1. Haz clic en **"Add Webhook"** o **"Create Webhook"**

### 5.3. Configurar el Webhook
1. **Nombre/Descripción** (opcional):
   - Puedes poner: `Naova Inbound Email` o `Recibir Emails`

2. **URL del Webhook**:
   ```
   https://www.naova.com.mx/api/inbox/webhook/email
   ```
   - ⚠️ **IMPORTANTE**: Usa `https://` (no `http://`)
   - ⚠️ **IMPORTANTE**: Usa `www.naova.com.mx` (con www)

3. **Eventos a Escuchar**:
   - Busca y selecciona: **"email.received"** o **"inbound.email"**
   - O busca algo como "Inbound Email" o "Email Received"
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
1. Desde cualquier email (tu Gmail personal, etc.)
2. Envía un email a: `test@naova.com.mx` o `compras@naova.com.mx`
   - Puedes usar cualquier dirección en tu dominio
   - Ejemplos: `prueba@naova.com.mx`, `hola@naova.com.mx`, etc.
3. El asunto puede ser: "Prueba de email"
4. El contenido puede ser: "Este es un email de prueba"

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
3. Deberías ver un nuevo request creado desde el email que enviaste

**✅ Checklist:**
- [ ] Email enviado a `@naova.com.mx`
- [ ] Resend muestra que recibió el email
- [ ] Logs en Vercel muestran el webhook recibido
- [ ] Request aparece en `/admin/requests`

---

## ⚠️ Solución de Problemas

### Problema 1: Dominio no se verifica después de 1 hora

**Solución:**
1. Verifica que agregaste **todos** los registros DNS:
   - TXT de verificación
   - MX
   - TXT _resend

2. Verifica que los valores están correctos (copia y pega exactamente)

3. Usa una herramienta de verificación:
   ```
   https://mxtoolbox.com/SuperTool.aspx
   ```
   - Ingresa `naova.com.mx`
   - Busca los registros TXT y MX
   - Si no aparecen, los DNS no se propagaron todavía

4. Contacta a tu proveedor de DNS si sigue sin funcionar

---

### Problema 2: Webhook no recibe emails

**Solución:**
1. **Verifica la URL del webhook**:
   - Debe ser: `https://www.naova.com.mx/api/inbox/webhook/email`
   - Con `https://` (no http)
   - Con `www.` (o sin, según cómo esté configurado tu dominio)

2. **Verifica los logs en Vercel**:
   - Ve a Vercel → Proyecto → Logs
   - Busca errores relacionados con el webhook
   - Si ves errores 500, puede haber un problema en el código

3. **Prueba el endpoint manualmente**:
   ```bash
   curl -X POST https://www.naova.com.mx/api/inbox/webhook/email \
     -H "Content-Type: application/json" \
     -d '{
       "from": {"email": "test@example.com"},
       "to": ["test@naova.com.mx"],
       "subject": "Test",
       "text": "Test email"
     }'
   ```

4. **Verifica que Resend está enviando el webhook**:
   - En Resend, ve a "Logs" o "Activity"
   - Busca intentos de webhook
   - Si hay errores, Resend te mostrará el motivo

---

### Problema 3: Email llega pero no aparece como request

**Solución:**
1. **Verifica los logs de Vercel**:
   - Busca errores cuando llegó el webhook
   - Puede haber un error en el procesamiento

2. **Verifica el formato del webhook**:
   - Resend puede enviar el formato de forma diferente
   - Revisa los logs para ver el formato exacto
   - Puede que necesitemos adaptar el código

3. **Si hay errores, comparte los logs**:
   - Copia los logs de Vercel
   - Compártelos y adapto el código si es necesario

---

### Problema 4: No encuentro la sección de Webhooks en Resend

**Solución:**
1. Resend puede tener diferentes interfaces según la versión
2. Busca en:
   - **Settings** → **Webhooks**
   - **API** → **Webhooks**
   - Menú lateral → **Webhooks**
3. Si no lo encuentras, busca "Inbound Email" o "Inbound Parse"
4. Puede que Resend lo llame diferente en tu versión

---

## 📞 Si Necesitas Ayuda

Si encuentras algún problema:

1. **Comparte los logs de Vercel**:
   - Ve a Vercel → Proyecto → Logs
   - Copia los errores relacionados con el webhook

2. **Comparte una captura de pantalla**:
   - Del dashboard de Resend
   - De la configuración de DNS

3. **Describe qué paso falló**:
   - ¿En qué paso estás?
   - ¿Qué error ves?

Con esa información puedo ayudarte específicamente.

---

## ✅ Checklist Final

Antes de considerar que está completo:

- [ ] Cuenta creada en Resend
- [ ] Dominio `naova.com.mx` agregado
- [ ] Registros DNS agregados en mi proveedor
- [ ] Dominio verificado en Resend (estado: Verified)
- [ ] Webhook configurado con la URL correcta
- [ ] Email de prueba enviado
- [ ] Request aparece en `/admin/requests`

---

## 🎉 ¡Listo!

Una vez que completes todos los pasos:

1. ✅ Los emails enviados a `@naova.com.mx` llegarán a Resend
2. ✅ Resend los enviará como webhook a tu endpoint
3. ✅ Tu endpoint creará requests automáticamente
4. ✅ Podrás verlos en `/admin/requests`
5. ✅ Podrás responder desde la plataforma

---

## 📝 Próximos Pasos Opcionales

1. **Configurar direcciones específicas**:
   - `compras@naova.com.mx` para compras
   - `soporte@naova.com.mx` para soporte
   - Todas llegarán al mismo webhook

2. **Configurar respuestas automáticas** (si quieres)

3. **Monitorear logs** periódicamente

---

## 🔗 Enlaces Útiles

- **Resend Dashboard**: https://resend.com/domains
- **Resend Docs**: https://resend.com/docs
- **Verificar DNS**: https://mxtoolbox.com/SuperTool.aspx
- **Naova Admin**: https://www.naova.com.mx/admin/requests

---

¡Vamos paso a paso! Si te quedas en algún paso, avísame y te ayudo.

