# 🚀 Deploy a Vercel - Paso a Paso

## ✅ PASO 1: Crear Repositorio en GitHub

### 1.1 Ve a GitHub

1. Abre: https://github.com/new
2. O ve a: https://github.com → Click en el **"+"** → **"New repository"**

### 1.2 Configurar Repositorio

- **Repository name:** `naova2.0` (o el nombre que prefieras)
- **Description:** (opcional) "Naova SaaS - Sistema de compras industriales"
- **Visibility:** 
  - ✅ **Private** (recomendado si no quieres que sea público)
  - O **Public** (si quieres que sea público)
- **NO marques** "Add a README file" (ya tienes archivos)
- **NO marques** "Add .gitignore" (ya tienes uno)
- **NO marques** "Choose a license"

### 1.3 Crear Repositorio

Haz clic en **"Create repository"**

### 1.4 GitHub te mostrará comandos

GitHub te mostrará algo como:

```bash
git remote add origin https://github.com/TU-USUARIO/naova2.0.git
git branch -M main
git push -u origin main
```

**Copia esos comandos** y ejecútalos en tu terminal.

---

## ✅ PASO 2: Subir Código a GitHub

### 2.1 Ejecutar Comandos

En tu terminal (en la carpeta del proyecto), ejecuta:

```bash
git remote add origin https://github.com/TU-USUARIO/naova2.0.git
```

**⚠️ IMPORTANTE:** Reemplaza `TU-USUARIO` con tu usuario real de GitHub.

Luego:

```bash
git branch -M main
git push -u origin main
```

### 2.2 Verificar

Ve a tu repositorio en GitHub y verifica que todos los archivos estén ahí.

---

## ✅ PASO 3: Conectar con Vercel

### 3.1 Crear Cuenta en Vercel

1. Ve a: https://vercel.com
2. Haz clic en **"Sign Up"**
3. Elige **"Continue with GitHub"** (recomendado)
4. Autoriza Vercel a acceder a tus repositorios

### 3.2 Importar Proyecto

1. En el dashboard de Vercel, haz clic en **"Add New Project"**
2. Busca y selecciona el repositorio `naova2.0`
3. Haz clic en **"Import"**

### 3.3 Configuración Automática

Vercel detectará automáticamente:
- ✅ Framework: Next.js
- ✅ Root Directory: `./`
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `.next`

**NO hagas clic en Deploy todavía** ⚠️

---

## ✅ PASO 4: Configurar Variables de Entorno

### 4.1 Agregar Variables

En la página de configuración, busca la sección **"Environment Variables"** y agrega estas variables:

#### 🔴 OBLIGATORIAS:

**1. DATABASE_URL**
```
postgresql://postgres.aptijeklzfxcxemnqpil:TU_CONTRASEÑA@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true
```
*(Reemplaza TU_CONTRASEÑA con tu contraseña real de Supabase)*

**2. DIRECT_URL**
```
postgresql://postgres:TU_CONTRASEÑA@db.aptijeklzfxcxemnqpil.supabase.co:5432/postgres
```
*(Reemplaza TU_CONTRASEÑA con tu contraseña real de Supabase)*

**3. JWT_SECRET**
```
naova-super-secret-jwt-key-2024
```

**4. NEXT_PUBLIC_APP_URL**
```
https://tu-proyecto.vercel.app
```
*(Se actualizará después del primer deploy - por ahora usa esta URL temporal)*

#### 🟡 OPCIONALES:

**5. SALES_EMAIL**
```
ventas@naova.com
```

**6. NEXT_PUBLIC_WHATSAPP**
```
+523316083075
```

### 4.2 Marcar para Todos los Entornos

Para cada variable, marca:
- ✅ **Production**
- ✅ **Preview** (opcional)
- ✅ **Development** (opcional)

---

## ✅ PASO 5: Hacer Deploy

### 5.1 Deploy Inicial

1. Después de agregar todas las variables
2. Haz clic en **"Deploy"**
3. Espera 2-5 minutos

### 5.2 Ver Progreso

- Verás el build en tiempo real
- Al terminar, verás **"Ready"** ✅
- Vercel te dará una URL como: `https://naova2-0-abc123.vercel.app`

---

## ✅ PASO 6: Actualizar NEXT_PUBLIC_APP_URL

### 6.1 Obtener URL Real

Después del deploy, copia la URL que te dio Vercel.

### 6.2 Actualizar Variable

1. Ve a Vercel → Tu Proyecto → **Settings** → **Environment Variables**
2. Busca `NEXT_PUBLIC_APP_URL`
3. Edita y pega tu URL real de Vercel
4. Haz clic en **"Save"**

### 6.3 Re-deploy

1. Ve a **Deployments**
2. Selecciona el último deployment
3. Haz clic en los **"..."** → **"Redeploy"**

---

## ✅ PASO 7: Verificar que Funciona

### 7.1 Probar la App

1. Abre la URL de Vercel en tu navegador
2. Deberías ver la landing page de Naova

### 7.2 Probar Login

1. Ve a `/login`
2. Prueba con:
   - **Admin:** `admin@naova.com` / `password123`
   - **Cliente:** `juan@abc.com` / `password123`

### 7.3 Verificar Funcionalidades

- ✅ Login funciona
- ✅ Dashboard carga
- ✅ Puedes crear usuarios
- ✅ Puedes crear requerimientos

---

## 🎉 ¡Listo!

Tu aplicación está en internet y accesible desde cualquier lugar.

**URL:** `https://tu-proyecto.vercel.app`

---

## 📝 Resumen de URLs Importantes

- **GitHub:** https://github.com/TU-USUARIO/naova2.0
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Tu App:** https://tu-proyecto.vercel.app

