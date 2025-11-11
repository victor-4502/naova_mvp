# 🚀 Guía de Deployment - Naova SaaS

Esta guía te ayudará a desplegar tu aplicación Naova en producción usando **Vercel** (frontend + backend) y una base de datos PostgreSQL gratuita.

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Configuración de Base de Datos](#configuración-de-base-de-datos)
3. [Configuración de Vercel](#configuración-de-vercel)
4. [Variables de Entorno](#variables-de-entorno)
5. [Migración de Datos](#migración-de-datos)
6. [Deployment](#deployment)
7. [Verificación Post-Deployment](#verificación-post-deployment)

---

## ✅ Requisitos Previos

- [ ] Cuenta en [Vercel](https://vercel.com) (gratis)
- [ ] Cuenta en [Supabase](https://supabase.com) o [Neon](https://neon.tech) (gratis)
- [ ] Git instalado y repositorio en GitHub/GitLab/Bitbucket
- [ ] Node.js 18+ instalado localmente

---

## 🗄️ Configuración de Base de Datos

### Opción 1: Supabase (Recomendado) ⭐

1. **Crear cuenta en Supabase**
   - Ve a [supabase.com](https://supabase.com)
   - Crea una cuenta gratuita
   - Crea un nuevo proyecto

2. **Obtener la URL de conexión**
   - En tu proyecto, ve a **Settings** → **Database**
   - Copia la **Connection String** (URI)
   - Formato: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

3. **Configurar Prisma**
   - La URL ya está configurada en `prisma/schema.prisma`
   - Solo necesitas la variable `DATABASE_URL`

### Opción 2: Neon.tech (Alternativa)

1. **Crear cuenta en Neon**
   - Ve a [neon.tech](https://neon.tech)
   - Crea una cuenta gratuita
   - Crea un nuevo proyecto

2. **Obtener la URL de conexión**
   - En el dashboard, copia la **Connection String**
   - Formato: `postgresql://[user]:[password]@[host]/[database]?sslmode=require`

### Opción 3: Railway (Alternativa)

1. **Crear cuenta en Railway**
   - Ve a [railway.app](https://railway.app)
   - Crea una cuenta gratuita
   - Crea un nuevo proyecto PostgreSQL

2. **Obtener la URL de conexión**
   - En el proyecto, ve a **Variables**
   - Copia `DATABASE_URL`

---

## ⚙️ Configuración de Vercel

### Paso 1: Preparar el Repositorio

```bash
# Asegúrate de que todos los cambios estén commiteados
git add .
git commit -m "Preparar para deployment"
git push origin main
```

### Paso 2: Conectar con Vercel

1. **Importar proyecto**
   - Ve a [vercel.com](https://vercel.com)
   - Click en **Add New Project**
   - Conecta tu repositorio de GitHub/GitLab/Bitbucket
   - Selecciona el repositorio `naova2.0`

2. **Configuración del proyecto**
   - **Framework Preset**: Next.js (detectado automáticamente)
   - **Root Directory**: `./` (raíz del proyecto)
   - **Build Command**: `npm run build` (automático)
   - **Output Directory**: `.next` (automático)
   - **Install Command**: `npm install` (automático)

### Paso 3: Variables de Entorno

En la configuración del proyecto en Vercel, ve a **Settings** → **Environment Variables** y agrega:

#### Variables Requeridas:

```env
# Base de Datos
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
DIRECT_URL=postgresql://user:password@host:5432/database?sslmode=require

# JWT Secret (genera uno seguro)
JWT_SECRET=tu-secret-super-seguro-aqui-minimo-32-caracteres

# App URL (se actualizará después del primer deploy)
NEXT_PUBLIC_APP_URL=https://tu-app.vercel.app

# SMTP (opcional, para emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password
SMTP_FROM=Naova <noreply@naova.com>

# Contacto
SALES_EMAIL=ventas@naova.com
NEXT_PUBLIC_WHATSAPP=+523316083075
```

#### Generar JWT_SECRET seguro:

```bash
# En tu terminal local
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🔄 Migración de Datos

### Paso 1: Ejecutar Migraciones de Prisma

**Localmente (antes del deploy):**

```bash
# Generar cliente de Prisma
npm run db:generate

# Crear migraciones
npx prisma migrate dev --name init

# O si prefieres push directo (solo desarrollo)
npx prisma db push
```

**En Vercel (después del deploy):**

Vercel ejecutará automáticamente `prisma generate` durante el build, pero necesitas ejecutar las migraciones manualmente.

**Opción A: Usar Vercel CLI**

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Ejecutar migraciones en producción
vercel env pull .env.production
npx prisma migrate deploy
```

**Opción B: Script de migración automática**

Crea un script que se ejecute en el build:

```json
// En package.json, agrega:
"postinstall": "prisma generate && prisma migrate deploy"
```

### Paso 2: Migrar Usuarios Existentes

Si tienes usuarios en `server-users.json`, necesitas migrarlos a la base de datos:

```bash
# Crear script de migración
node scripts/migrate-users.js
```

---

## 🚀 Deployment

### Deployment Automático

1. **Push a la rama principal**
   ```bash
   git push origin main
   ```

2. **Vercel detectará el push automáticamente**
   - Irá a tu proyecto en Vercel
   - Verás el deployment en progreso
   - Espera a que termine (2-5 minutos)

3. **Verificar el deployment**
   - Vercel te dará una URL: `https://tu-app.vercel.app`
   - Abre la URL en tu navegador
   - Verifica que la aplicación cargue correctamente

### Deployment Manual

Si prefieres hacerlo manualmente:

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

## ✅ Verificación Post-Deployment

### 1. Verificar Base de Datos

```bash
# Conectar a la base de datos y verificar tablas
npx prisma studio
# O usar el cliente de tu proveedor (Supabase Studio, etc.)
```

### 2. Verificar Variables de Entorno

- Ve a Vercel → Tu Proyecto → Settings → Environment Variables
- Verifica que todas las variables estén configuradas
- **IMPORTANTE**: Actualiza `NEXT_PUBLIC_APP_URL` con tu URL de Vercel

### 3. Probar Funcionalidades

- [ ] Login de admin
- [ ] Crear nuevo usuario cliente
- [ ] Login de cliente
- [ ] Crear requerimiento
- [ ] Agregar cotización
- [ ] Ver reportes

### 4. Verificar Logs

- Ve a Vercel → Tu Proyecto → Deployments → [Último deployment] → Logs
- Revisa que no haya errores

---

## 🔧 Troubleshooting

### Error: "Prisma Client not generated"

**Solución:**
```bash
# Agrega a package.json
"postinstall": "prisma generate"
```

### Error: "Database connection failed"

**Solución:**
- Verifica que `DATABASE_URL` esté correctamente configurada
- Verifica que la base de datos permita conexiones externas
- En Supabase, verifica el firewall

### Error: "JWT_SECRET is not defined"

**Solución:**
- Asegúrate de agregar `JWT_SECRET` en las variables de entorno de Vercel
- Reinicia el deployment después de agregar variables

### Error: "Module not found"

**Solución:**
- Verifica que `node_modules` esté en `.gitignore`
- Vercel instalará las dependencias automáticamente

---

## 📊 Monitoreo

### Vercel Analytics (Opcional)

1. Ve a tu proyecto en Vercel
2. Settings → Analytics
3. Habilita Vercel Analytics (gratis)

### Logs en Tiempo Real

```bash
# Ver logs en tiempo real
vercel logs
```

---

## 🔄 Actualizaciones Futuras

Cada vez que hagas `git push` a la rama principal, Vercel:
1. Detectará el cambio automáticamente
2. Creará un nuevo deployment
3. Ejecutará el build
4. Desplegará la nueva versión

**Nota**: Los deployments de Vercel son instantáneos y sin downtime.

---

## 💡 Tips Adicionales

1. **Dominio Personalizado**
   - Ve a Settings → Domains
   - Agrega tu dominio personalizado
   - Configura los DNS según las instrucciones

2. **Preview Deployments**
   - Cada PR crea un deployment de preview
   - Útil para testing antes de producción

3. **Environment Variables por Entorno**
   - Puedes tener diferentes variables para Production, Preview y Development
   - Configúralas en Settings → Environment Variables

---

## 🆘 Soporte

Si tienes problemas:
1. Revisa los logs en Vercel
2. Verifica las variables de entorno
3. Revisa la documentación de [Vercel](https://vercel.com/docs)
4. Revisa la documentación de [Prisma](https://www.prisma.io/docs)

---

## ✅ Checklist Final

- [ ] Base de datos PostgreSQL configurada
- [ ] Variables de entorno configuradas en Vercel
- [ ] Migraciones de Prisma ejecutadas
- [ ] Deployment exitoso
- [ ] Aplicación accesible en la URL de Vercel
- [ ] Login funcionando
- [ ] Datos persistiendo correctamente
- [ ] Reportes funcionando

¡Listo! Tu aplicación debería estar funcionando en producción. 🎉

