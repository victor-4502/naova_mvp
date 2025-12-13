# 📧 Guía Completa: Configuración de Email en Naova

## 🎯 ¿Para qué sirve?

La configuración de email permite:

1. **Recibir emails de clientes** → Se crean requests automáticamente en la plataforma
2. **Responder a clientes por email** → Desde la plataforma admin, los emails se envían realmente

## 📋 Configuración en 2 Partes

### Parte 1: SMTP (Para ENVIAR emails)
### Parte 2: Webhook (Para RECIBIR emails)

---

## 🔧 Parte 1: Configuración SMTP (Enviar Emails)

### ¿Qué es SMTP?

SMTP es el protocolo que se usa para **enviar emails**. Necesitas un servidor de email que te permita enviar correos.

### Variables de Entorno

Agrega estas líneas a tu archivo `.env` o `.env.local`:

```env
# Configuración SMTP para ENVIAR emails
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-contraseña-de-aplicacion
SMTP_FROM="Naova" <noreply@naova.com>
```

### Explicación de cada variable:

#### 1. `SMTP_HOST`
- **¿Qué es?**: La dirección del servidor de email que usarás
- **Ejemplos**:
  - Gmail: `smtp.gmail.com`
  - Outlook: `smtp-mail.outlook.com`
  - SendGrid: `smtp.sendgrid.net`
  - Resend: `smtp.resend.com`

#### 2. `SMTP_PORT`
- **¿Qué es?**: El puerto de conexión (generalmente 587 para TLS o 465 para SSL)
- **Valores comunes**: `587` (recomendado) o `465`

#### 3. `SMTP_USER`
- **¿Qué es?**: Tu dirección de email completa
- **Ejemplo**: `naova@gmail.com` o `compras@naova.com`

#### 4. `SMTP_PASS`
- **¿Qué es?**: Tu contraseña de email **O** contraseña de aplicación
- ⚠️ **IMPORTANTE**: Para Gmail, necesitas usar una **"Contraseña de aplicación"**, no tu contraseña normal

#### 5. `SMTP_FROM`
- **¿Qué es?**: El nombre y email que aparecerá como remitente
- **Ejemplo**: `"Naova" <noreply@naova.com>`
- Esto es lo que verá el cliente cuando reciba tu email

---

## 📨 Parte 2: Configuración Webhook (Recibir Emails)

### ¿Qué es un Webhook?

Un webhook es una URL donde los proveedores de email **enviarán los emails que recibas**. Cuando alguien te envía un email, el proveedor lo detecta y lo envía automáticamente a tu aplicación.

### URL del Webhook

```
POST https://tu-dominio.com/api/inbox/webhook/email
```

**Ejemplo real:**
```
POST https://www.naova.com.mx/api/inbox/webhook/email
```

### ¿Qué Proveedor Usar?

Necesitas un servicio que:
1. Reciba emails en una dirección (ej: `compras@naova.com`)
2. Pueda enviar webhooks cuando lleguen emails

**Opciones populares:**

#### Opción 1: SendGrid (Recomendado)
- ✅ Fácil de configurar
- ✅ Confiable
- ✅ Plan gratuito disponible (100 emails/día)

#### Opción 2: Resend
- ✅ Moderno y rápido
- ✅ Plan gratuito (3,000 emails/mes)
- ✅ Buen para startups

#### Opción 3: AWS SES
- ✅ Muy económico
- ✅ Escalable
- ⚠️ Más complejo de configurar

#### Opción 4: Mailgun
- ✅ Buen para desarrollo
- ✅ Plan gratuito limitado

---

## 🔧 Configuración Paso a Paso

### Paso 1: Configurar SMTP (Para Enviar)

#### Si usas Gmail:

1. **Habilita la verificación en 2 pasos**:
   - Ve a tu cuenta de Google
   - Seguridad → Verificación en 2 pasos → Activar

2. **Genera una contraseña de aplicación**:
   - Ve a: https://myaccount.google.com/apppasswords
   - Selecciona "Correo" y "Otro (nombre personalizado)"
   - Escribe "Naova" y genera
   - Copia la contraseña de 16 caracteres (sin espacios)

3. **Agrega a `.env`**:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=tu-email@gmail.com
   SMTP_PASS=abcd-efgh-ijkl-mnop  # La contraseña de aplicación que generaste
   SMTP_FROM="Naova" <tu-email@gmail.com>
   ```

#### Si usas otro proveedor:

Cada proveedor tiene sus propias credenciales. Busca en su documentación:
- **SendGrid**: Usa API Key, no SMTP directamente
- **Resend**: Tiene su propio servicio
- **Outlook**: Similar a Gmail

### Paso 2: Configurar Webhook (Para Recibir)

#### Ejemplo con SendGrid:

1. **Crear cuenta en SendGrid**
   - Ve a: https://sendgrid.com
   - Crea cuenta gratuita

2. **Configurar dominio**
   - En SendGrid, ve a "Settings" → "Sender Authentication"
   - Verifica tu dominio (ej: `naova.com`)

3. **Configurar Inbound Parse Webhook**
   - Ve a "Settings" → "Inbound Parse"
   - Haz clic en "Add Host & URL"
   - **Destination URL**: `https://www.naova.com.mx/api/inbox/webhook/email`
   - **Subdomain**: `compras` (opcional, para usar `compras@naova.com`)
   - Guarda

4. **Configurar DNS**
   - SendGrid te dará registros DNS para agregar
   - Agrégalos en tu proveedor de dominio (GoDaddy, Cloudflare, etc.)

#### Ejemplo con Resend:

1. **Crear cuenta en Resend**
   - Ve a: https://resend.com

2. **Configurar dominio**
   - Agrega tu dominio
   - Configura los registros DNS que te proporcionan

3. **Configurar webhook**
   - Ve a "Webhooks"
   - Agrega nueva webhook
   - URL: `https://www.naova.com.mx/api/inbox/webhook/email`
   - Eventos: Selecciona "email.received"

---

## 📋 Formato del Webhook

Cuando un email llega, el proveedor enviará un POST a tu webhook con este formato:

```json
{
  "from": {
    "email": "cliente@example.com",
    "name": "Juan Pérez"
  },
  "to": ["compras@naova.com"],
  "subject": "Solicitud de cotización",
  "text": "Hola, necesito cotización para...",
  "html": "<p>Hola, necesito cotización para...</p>",
  "messageId": "unique-id-123",
  "timestamp": "2024-12-07T12:00:00Z",
  "attachments": [
    {
      "filename": "documento.pdf",
      "mimeType": "application/pdf",
      "size": 12345,
      "url": "https://..."
    }
  ]
}
```

---

## ✅ Checklist de Configuración

### Para ENVIAR emails (SMTP):
- [ ] Tienes una cuenta de email (Gmail, Outlook, etc.)
- [ ] Si es Gmail, habilitaste verificación en 2 pasos
- [ ] Generaste contraseña de aplicación (si es Gmail)
- [ ] Agregaste todas las variables SMTP a `.env`
- [ ] Probaste enviar un email de prueba

### Para RECIBIR emails (Webhook):
- [ ] Elegiste un proveedor (SendGrid, Resend, etc.)
- [ ] Creaste cuenta y verificaste dominio
- [ ] Configuraste el webhook con tu URL
- [ ] Configuraste los registros DNS necesarios
- [ ] Probaste recibir un email de prueba

---

## 🧪 Cómo Probar

### Probar ENVÍO de emails:

1. Ve a la plataforma admin
2. Abre un request que vino por email
3. Responde desde la plataforma
4. Verifica que el cliente recibió el email

### Probar RECEPCIÓN de emails:

1. Envía un email a tu dirección configurada (ej: `compras@naova.com`)
2. Ve a `/admin/requests` en la plataforma
3. Verifica que apareció un nuevo request

---

## 🔒 Seguridad

### Variables Sensibles

Las credenciales SMTP son **sensibles**. Asegúrate de:

1. ✅ **Nunca** las subas a GitHub
2. ✅ Agrégalas a `.env.local` (está en `.gitignore`)
3. ✅ En Vercel, agrégala en "Settings" → "Environment Variables"

### En Vercel (Producción):

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega cada variable:
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_USER`
   - `SMTP_PASS`
   - `SMTP_FROM`
4. Selecciona "Production" y "Preview"
5. Guarda y redespliega

---

## 🆘 Troubleshooting

### No se envían emails:

1. **Verifica las credenciales SMTP**:
   ```bash
   # Revisa que las variables estén en .env
   cat .env | grep SMTP
   ```

2. **Prueba las credenciales**:
   - Si es Gmail, verifica que usas contraseña de aplicación
   - Si es otro proveedor, verifica que las credenciales sean correctas

3. **Revisa los logs**:
   - En desarrollo: Mira la consola del servidor
   - En producción: Revisa los logs de Vercel

### No se reciben emails:

1. **Verifica que el webhook esté configurado**:
   - Revisa en tu proveedor (SendGrid, Resend) que la URL sea correcta

2. **Verifica los logs del webhook**:
   - En tu proveedor, revisa los logs de webhook
   - Busca errores 4xx o 5xx

3. **Prueba manualmente**:
   ```bash
   # Envía un POST de prueba al webhook
   curl -X POST https://tu-dominio.com/api/inbox/webhook/email \
     -H "Content-Type: application/json" \
     -d '{
       "from": {"email": "test@example.com"},
       "to": ["compras@naova.com"],
       "subject": "Test",
       "text": "Mensaje de prueba"
     }'
   ```

---

## 📝 Resumen Simple

### Para ENVIAR emails:
1. Configura SMTP en `.env`
2. Usa las credenciales de tu proveedor de email

### Para RECIBIR emails:
1. Configura un servicio (SendGrid, Resend, etc.)
2. Configura el webhook para que apunte a tu URL
3. Los emails que lleguen se crearán como requests automáticamente

---

## 💡 Recomendación

**Para empezar rápido:**

1. **SMTP**: Usa Gmail con contraseña de aplicación (fácil y rápido)
2. **Webhook**: Usa Resend (plan gratuito generoso, fácil de configurar)

Una vez que todo funcione, puedes migrar a servicios más robustos si lo necesitas.

