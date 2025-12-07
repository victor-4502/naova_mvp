# 🔐 Variables de Entorno para Vercel

Esta guía lista todas las variables de entorno que debes configurar en Vercel para que la aplicación funcione correctamente en producción.

## 📋 Cómo Configurar en Vercel

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona **Settings** → **Environment Variables**
3. Agrega cada variable una por una
4. Asegúrate de seleccionar los **entornos** correctos (Production, Preview, Development)

---

## 🔑 Variables Requeridas

### 1. Base de Datos

```env
DATABASE_URL=postgresql://user:password@host:port/database?schema=public
```

**Importante:** Usa la URL de conexión de tu base de datos en producción (probablemente desde Supabase o PostgreSQL).

---

### 2. Autenticación

```env
JWT_SECRET=tu-secreto-jwt-super-seguro-cambiar-en-produccion
```

**Genera un secreto seguro:**
```bash
# Puedes usar openssl para generar un secreto aleatorio
openssl rand -base64 32
```

---

### 3. WhatsApp Business API (Meta)

```env
WHATSAPP_PHONE_NUMBER_ID=924879940701959
WHATSAPP_ACCESS_TOKEN=tu_access_token_de_meta_aqui
WHATSAPP_VERIFY_TOKEN=tu_token_de_verificacion_secreto
```

**Notas:**
- `WHATSAPP_ACCESS_TOKEN`: Para producción, crea un **System User Token** permanente en Meta
- `WHATSAPP_VERIFY_TOKEN`: Debe coincidir con el que configures en el webhook de Meta
- ⚠️ **NUNCA** uses tokens temporales en producción (expiran rápido)

---

### 4. SMTP (Correo Electrónico)

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-contraseña-de-aplicacion
SMTP_FROM=Naova <noreply@naova.com>
```

**Notas:**
- Si usas Gmail, necesitas una "Contraseña de aplicación" (no tu contraseña normal)
- Para producción, considera usar SendGrid, AWS SES, o un servicio profesional

---

### 5. URLs de la Aplicación

```env
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
```

**O si tienes dominio personalizado:**
```env
NEXT_PUBLIC_APP_URL=https://naova.com
```

---

### 6. Contacto y Ventas

```env
SALES_EMAIL=ventas@naova.com
NEXT_PUBLIC_WHATSAPP=+523316083075
```

---

## 🎯 Variables Opcionales

### Analytics

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Supabase Storage (si lo usas)

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
```

### AWS S3 (si lo usas para archivos)

```env
AWS_S3_BUCKET=tu-bucket-name
AWS_ACCESS_KEY_ID=tu-access-key
AWS_SECRET_ACCESS_KEY=tu-secret-key
AWS_REGION=us-east-1
```

---

## ✅ Checklist de Configuración

Después de agregar las variables, verifica:

- [ ] **DATABASE_URL** está configurada y es accesible desde Vercel
- [ ] **JWT_SECRET** es un valor seguro y único
- [ ] **WHATSAPP_ACCESS_TOKEN** es un System User Token permanente (no temporal)
- [ ] **WHATSAPP_VERIFY_TOKEN** coincide con el configurado en Meta
- [ ] **SMTP** está configurado y funcionando
- [ ] **NEXT_PUBLIC_APP_URL** apunta a tu dominio de producción
- [ ] Todas las variables están marcadas para **Production**

---

## 🔄 Después de Configurar

1. **Redeploy la aplicación** en Vercel:
   - Ve a **Deployments**
   - Haz clic en los 3 puntos (⋯) del último deployment
   - Selecciona **Redeploy**

2. **Verifica los logs** después del redeploy para asegurarte de que no hay errores

3. **Prueba las funcionalidades críticas:**
   - Login
   - Crear request
   - Enviar mensaje por WhatsApp
   - Recibir webhooks

---

## 🐛 Troubleshooting

### "Environment variable not found"
- Verifica que el nombre de la variable sea exacto (case-sensitive)
- Verifica que esté marcada para el entorno correcto (Production/Preview/Development)
- Redeploy después de agregar nuevas variables

### "Database connection failed"
- Verifica que `DATABASE_URL` sea correcta
- Verifica que la base de datos permita conexiones desde las IPs de Vercel
- Si usas Supabase, asegúrate de usar la conexión con pooler

### "WHATSAPP_ACCESS_TOKEN expired"
- Los tokens temporales expiran. Crea un System User Token permanente
- Ve a Meta Business Manager → System Users → Create Token

### Webhook no funciona
- Verifica que `NEXT_PUBLIC_APP_URL` sea correcta
- Verifica que `WHATSAPP_VERIFY_TOKEN` coincida con Meta
- Verifica que el webhook en Meta apunte a: `https://tu-dominio.com/api/inbox/webhook/whatsapp`

---

## 📚 Recursos

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Meta System User Tokens](https://developers.facebook.com/docs/marketing-api/system-users)
- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres)

---

**Última actualización:** $(Get-Date -Format "yyyy-MM-dd")

