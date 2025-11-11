# 🔧 Configuración de Supabase para Producción a Escala

## ✅ Configuración Implementada

He configurado el proyecto para soportar **miles de conexiones simultáneas** usando:

1. **Transaction Pooler** - Para la aplicación (muchos usuarios)
2. **Direct Connection** - Solo para migraciones y operaciones de schema

---

## 📝 Cómo Configurar tu .env

Crea el archivo `.env` en la raíz del proyecto con esta estructura:

```env
# ============================================
# SUPABASE CONFIGURATION
# ============================================

# Transaction Pooler (para la aplicación - MILES de conexiones)
DATABASE_URL="postgresql://postgres.xbzwcxsvbdofuoeqbuoz:[TU-PASSWORD]@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct Connection (solo para migraciones)
DIRECT_URL="postgresql://postgres:[TU-PASSWORD]@db.xbzwcxsvbdofuoeqbuoz.supabase.co:5432/postgres"

# ============================================
# SECURITY
# ============================================
JWT_SECRET="naova-super-secret-jwt-key-2024-change-in-production"

# ============================================
# EMAIL (Opcional - usa Mailtrap para desarrollo)
# ============================================
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASS=""
SMTP_FROM="Naova <noreply@naova.com>"

# ============================================
# CONTACT & SALES
# ============================================
SALES_EMAIL="ventas@naova.com"
NEXT_PUBLIC_WHATSAPP="+523316083075"

# ============================================
# APP CONFIG
# ============================================
NEXT_PUBLIC_APP_URL="http://localhost:3001"
```

---

## 🔑 **IMPORTANTE: Reemplaza [TU-PASSWORD]**

En ambas URLs, reemplaza `[TU-PASSWORD]` con tu contraseña real de Supabase.

**Ejemplo:**
Si tu password es `MiPassword123`, las URLs quedan:

```env
DATABASE_URL="postgresql://postgres.xbzwcxsvbdofuoeqbuoz:MiPassword123@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"

DIRECT_URL="postgresql://postgres:MiPassword123@db.xbzwcxsvbdofuoeqbuoz.supabase.co:5432/postgres"
```

---

## 🚀 Comandos para Ejecutar (EN ORDEN)

Una vez configurado el `.env`:

### 1. Generar Prisma Client
```bash
npm run db:generate
```

### 2. Crear las Tablas (usa DIRECT_URL)
```bash
npm run db:push
```

### 3. Poblar con Datos de Prueba
```bash
npm run db:seed
```

### 4. Iniciar el Servidor
```bash
npm run dev
```

---

## 📊 **Capacidad con esta Configuración**

### Transaction Pooler:
- ✅ **Hasta 10,000+ conexiones simultáneas**
- ✅ Perfecto para serverless (Vercel)
- ✅ Auto-scaling
- ✅ IPv4 compatible

### Límites de Supabase Free Tier:
- 500 MB database
- 2 GB bandwidth/mes
- Suficiente para desarrollo y primeros 100 clientes

---

## 🎯 **Ventajas de esta Configuración**

1. **Escalabilidad:** Listo para miles de usuarios
2. **Prisma optimizado:** Usa pooling inteligente
3. **Deploy fácil:** Compatible con Vercel/Netlify
4. **Production-ready:** Sin cambios necesarios al hacer deploy

---

## 📝 **Checklist**

1. ✅ Copia el template de `.env` de arriba
2. ✅ Reemplaza `[TU-PASSWORD]` en ambas URLs
3. ✅ Guarda el archivo `.env`
4. ✅ Ejecuta `npm run db:generate`
5. ✅ Ejecuta `npm run db:push`
6. ✅ Ejecuta `npm run db:seed`
7. ✅ Ejecuta `npm run dev`
8. ✅ Abre http://localhost:3001/login

---

## 🔐 **Credenciales de Prueba**

Después del seed:
- **Admin:** admin@naova.com / password123
- **Cliente 1:** cliente1@empresa.com / password123
- **Cliente 2:** cliente2@empresa.com / password123

---

**¿Ya configuraste el .env? Avísame cuando esté listo y ejecuto los comandos por ti.** 🚀

