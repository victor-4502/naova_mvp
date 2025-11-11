# 📥 Importar Proyecto en Vercel

## ✅ PASO 1: Importar Proyecto

### 1.1 En el Dashboard de Vercel

1. Deberías estar en: https://vercel.com/dashboard
2. Haz clic en **"Add New Project"** o **"New Project"**
3. Verás una lista de tus repositorios de GitHub

### 1.2 Seleccionar Repositorio

1. Busca **`naova_mvp`** en la lista
2. Haz clic en **"Import"** al lado del repositorio

### 1.3 Configuración del Proyecto

Vercel detectará automáticamente:
- ✅ **Framework Preset:** Next.js
- ✅ **Root Directory:** `./`
- ✅ **Build Command:** `npm run build`
- ✅ **Output Directory:** `.next`
- ✅ **Install Command:** `npm install`

**NO cambies nada** - la configuración automática es correcta.

**⚠️ IMPORTANTE: NO hagas clic en "Deploy" todavía**

---

## ✅ PASO 2: Configurar Variables de Entorno

### 2.1 Antes de Deploy

En la misma página de configuración, busca la sección **"Environment Variables"** (puede estar abajo o en una pestaña).

### 2.2 Agregar Variables

Haz clic en **"Add"** o **"Add Variable"** y agrega estas variables **UNA POR UNA**:

#### Variable 1: DATABASE_URL

- **Key:** `DATABASE_URL`
- **Value:** 
  ```
  postgresql://postgres.aptijeklzfxcxemnqpil:TU_CONTRASEÑA@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true
  ```
  *(Reemplaza `TU_CONTRASEÑA` con tu contraseña real de Supabase)*
- **Environment:** Marca las 3:
  - ✅ Production
  - ✅ Preview
  - ✅ Development
- Haz clic en **"Add"** o **"Save"**

#### Variable 2: DIRECT_URL

- **Key:** `DIRECT_URL`
- **Value:**
  ```
  postgresql://postgres:TU_CONTRASEÑA@db.aptijeklzfxcxemnqpil.supabase.co:5432/postgres
  ```
  *(Reemplaza `TU_CONTRASEÑA` con tu contraseña real de Supabase)*
- **Environment:** Marca las 3:
  - ✅ Production
  - ✅ Preview
  - ✅ Development
- Haz clic en **"Add"** o **"Save"**

#### Variable 3: JWT_SECRET

- **Key:** `JWT_SECRET`
- **Value:**
  ```
  naova-super-secret-jwt-key-2024
  ```
- **Environment:** Marca las 3:
  - ✅ Production
  - ✅ Preview
  - ✅ Development
- Haz clic en **"Add"** o **"Save"**

#### Variable 4: NEXT_PUBLIC_APP_URL

- **Key:** `NEXT_PUBLIC_APP_URL`
- **Value:**
  ```
  https://naova-mvp.vercel.app
  ```
  *(Esta URL se actualizará después del primer deploy)*
- **Environment:** Marca las 3:
  - ✅ Production
  - ✅ Preview
  - ✅ Development
- Haz clic en **"Add"** o **"Save"**

### 2.3 Verificar Variables

Deberías ver 4 variables agregadas:
- ✅ DATABASE_URL
- ✅ DIRECT_URL
- ✅ JWT_SECRET
- ✅ NEXT_PUBLIC_APP_URL

---

## ✅ PASO 3: Hacer Deploy

### 3.1 Deploy

1. Después de agregar todas las variables
2. Haz clic en **"Deploy"** (botón grande al final de la página)
3. Espera 2-5 minutos

### 3.2 Ver Progreso

- Verás el build en tiempo real
- Verás mensajes como:
  - "Installing dependencies..."
  - "Running build command..."
  - "Generating static pages..."
- Al terminar, verás **"Ready"** ✅

### 3.3 Obtener URL

Vercel te dará una URL como:
```
https://naova-mvp-abc123xyz.vercel.app
```

**Copia esta URL** - la necesitarás para el siguiente paso.

---

## ✅ PASO 4: Actualizar NEXT_PUBLIC_APP_URL

### 4.1 Actualizar Variable

1. Ve a: Vercel Dashboard → Tu Proyecto → **Settings** → **Environment Variables**
2. Busca `NEXT_PUBLIC_APP_URL`
3. Haz clic en el lápiz (editar) o en los tres puntos → **Edit**
4. Actualiza el valor con tu URL real de Vercel (la que copiaste)
5. Haz clic en **"Save"**

### 4.2 Re-deploy

1. Ve a **Deployments**
2. Selecciona el último deployment
3. Haz clic en los **"..."** (tres puntos)
4. Selecciona **"Redeploy"**
5. Confirma

---

## ✅ PASO 5: Verificar

### 5.1 Probar la App

1. Abre la URL de Vercel en tu navegador
2. Deberías ver la landing page de Naova

### 5.2 Probar Login

1. Ve a `/login` (ejemplo: `https://tu-app.vercel.app/login`)
2. Prueba con:
   - **Admin:** `admin@naova.com` / `password123`
   - **Cliente:** `juan@abc.com` / `password123`

---

## 🎉 ¡Listo!

Tu aplicación está en internet.

**URL:** `https://tu-proyecto.vercel.app`

