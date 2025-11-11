# 📋 Cómo debe verse tu archivo `.env`

## ✅ Estructura Completa

Tu archivo `.env` debe verse así (reemplaza `TU_CONTRASEÑA_AQUI` con tu contraseña real):

```env
# ============================================
# BASE DE DATOS - SUPABASE
# ============================================
# Transaction Pooler (para la aplicación - RECOMENDADO)
DATABASE_URL="postgresql://postgres.aptijeklzfxcxemnqpil:TU_CONTRASEÑA_AQUI@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct Connection (solo para migraciones de Prisma - OPCIONAL)
DIRECT_URL="postgresql://postgres:TU_CONTRASEÑA_AQUI@db.aptijeklzfxcxemnqpil.supabase.co:5432/postgres"

# ============================================
# SEGURIDAD - JWT
# ============================================
JWT_SECRET="naova-super-secret-jwt-key-2024"

# ============================================
# EMAIL - SMTP (Opcional, puedes dejarlo vacío)
# ============================================
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASS=""
SMTP_FROM="Naova <noreply@naova.com>"

# ============================================
# CONTACTO Y VENTAS
# ============================================
SALES_EMAIL="ventas@naova.com"
NEXT_PUBLIC_WHATSAPP="+523316083075"

# ============================================
# URL DE LA APLICACIÓN
# ============================================
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## ⚠️ IMPORTANTE: Reemplazar Contraseña

**En las líneas de `DATABASE_URL` y `DIRECT_URL`, reemplaza `TU_CONTRASEÑA_AQUI` con tu contraseña real de Supabase.**

### Ejemplo Real:

Si tu contraseña es `MiPassword123`, las líneas quedarían así:

```env
DATABASE_URL="postgresql://postgres.aptijeklzfxcxemnqpil:MiPassword123@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"

DIRECT_URL="postgresql://postgres:MiPassword123@db.aptijeklzfxcxemnqpil.supabase.co:5432/postgres"
```

## 📝 Estado Actual de tu .env

Según lo que veo, tu `.env` actual tiene:
- ✅ `DATABASE_URL` configurada (pero con `[YOUR-PASSWORD]` que debes reemplazar)
- ✅ `DIRECT_URL` configurada (pero con `[YOUR-PASSWORD]` que debes reemplazar)
- ✅ `JWT_SECRET` configurado
- ✅ Variables de SMTP (pueden estar vacías)
- ✅ Variables de contacto configuradas
- ✅ `NEXT_PUBLIC_APP_URL` configurada

## 🔧 Lo que necesitas hacer

**Solo reemplaza `[YOUR-PASSWORD]` con tu contraseña real en ambas líneas:**

1. Abre el archivo `.env`
2. Busca `[YOUR-PASSWORD]` (aparece 2 veces)
3. Reemplázalo con tu contraseña real de Supabase
4. Guarda el archivo

## 🧪 Verificar

Después de actualizar, prueba:

```bash
node scripts/test-connection-simple.js
```

Si funciona, verás:
```
✅ ¡Conexión exitosa!
📊 Usuarios en BD: X
```

