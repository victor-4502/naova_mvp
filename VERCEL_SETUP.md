# 🚀 Configurar Vercel - Paso a Paso

## ✅ PASO 1 COMPLETADO ✅
- ✅ Código subido a GitHub: https://github.com/victor-4502/naova_mvp

---

## 📋 PASO 2: Conectar con Vercel

### 2.1 Crear Cuenta en Vercel

1. Ve a: **https://vercel.com**
2. Haz clic en **"Sign Up"**
3. Elige **"Continue with GitHub"** (recomendado)
4. Autoriza Vercel a acceder a tus repositorios de GitHub

### 2.2 Importar Proyecto

1. En el dashboard de Vercel, haz clic en **"Add New Project"** o **"New Project"**
2. Busca el repositorio **`naova_mvp`**
3. Haz clic en **"Import"**

### 2.3 Configuración Automática

Vercel detectará automáticamente:
- ✅ **Framework Preset:** Next.js
- ✅ **Root Directory:** `./`
- ✅ **Build Command:** `npm run build`
- ✅ **Output Directory:** `.next`
- ✅ **Install Command:** `npm install`

**⚠️ NO hagas clic en "Deploy" todavía** - primero necesitamos configurar las variables de entorno.

---

## 📋 PASO 3: Configurar Variables de Entorno

### 3.1 Agregar Variables

En la página de configuración del proyecto, busca la sección **"Environment Variables"** y agrega estas variables:

#### 🔴 OBLIGATORIAS (Agregar estas primero):

**1. DATABASE_URL**
```
postgresql://postgres.aptijeklzfxcxemnqpil:TU_CONTRASEÑA@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true
```
- Reemplaza `TU_CONTRASEÑA` con tu contraseña real de Supabase
- Marca: ✅ Production, ✅ Preview, ✅ Development

**2. DIRECT_URL**
```
postgresql://postgres:TU_CONTRASEÑA@db.aptijeklzfxcxemnqpil.supabase.co:5432/postgres
```
- Reemplaza `TU_CONTRASEÑA` con tu contraseña real de Supabase
- Marca: ✅ Production, ✅ Preview, ✅ Development

**3. JWT_SECRET**
```
naova-super-secret-jwt-key-2024
```
- Marca: ✅ Production, ✅ Preview, ✅ Development

**4. NEXT_PUBLIC_APP_URL**
```
https://naova-mvp.vercel.app
```
- Esta URL se actualizará después del primer deploy
- Por ahora usa esta temporal
- Marca: ✅ Production, ✅ Preview, ✅ Development

#### 🟡 OPCIONALES (Puedes agregarlas después):

**5. SALES_EMAIL**
```
ventas@naova.com
```

**6. NEXT_PUBLIC_WHATSAPP**
```
+523316083075
```

**7. SMTP_HOST** (si vas a usar emails)
```
smtp.gmail.com
```

**8. SMTP_PORT**
```
587
```

### 3.2 Verificar Variables

Asegúrate de que todas las variables obligatorias estén agregadas antes de hacer deploy.

---

## 📋 PASO 4: Hacer Deploy

### 4.1 Deploy Inicial

1. Después de agregar todas las variables de entorno
2. Haz clic en **"Deploy"**
3. Espera 2-5 minutos mientras Vercel:
   - Instala dependencias
   - Genera Prisma Client
   - Construye la aplicación
   - Despliega

### 4.2 Ver Progreso

- Verás el build en tiempo real
- Al terminar, verás **"Ready"** ✅
- Vercel te dará una URL como: `https://naova-mvp-abc123.vercel.app`

---

## 📋 PASO 5: Actualizar NEXT_PUBLIC_APP_URL

### 5.1 Obtener URL Real

Después del deploy, copia la URL que te dio Vercel (algo como `https://naova-mvp-xyz.vercel.app`)

### 5.2 Actualizar Variable

1. Ve a Vercel → Tu Proyecto → **Settings** → **Environment Variables**
2. Busca `NEXT_PUBLIC_APP_URL`
3. Haz clic en el lápiz (editar)
4. Actualiza con tu URL real de Vercel
5. Haz clic en **"Save"**

### 5.3 Re-deploy

1. Ve a **Deployments**
2. Selecciona el último deployment
3. Haz clic en los **"..."** (tres puntos)
4. Selecciona **"Redeploy"**
5. Confirma

---

## 📋 PASO 6: Verificar que Funciona

### 6.1 Probar la Aplicación

1. Abre la URL de Vercel en tu navegador
2. Deberías ver la landing page de Naova

### 6.2 Probar Login

1. Ve a `/login` (ejemplo: `https://tu-app.vercel.app/login`)
2. Prueba con:
   - **Admin:** `admin@naova.com` / `password123`
   - **Cliente:** `juan@abc.com` / `password123`

### 6.3 Verificar Funcionalidades

- ✅ Login funciona
- ✅ Dashboard carga
- ✅ Puedes crear usuarios
- ✅ Puedes crear requerimientos

---

## 🎉 ¡Listo!

Tu aplicación estará en internet y accesible desde cualquier lugar.

**URL de tu app:** `https://tu-proyecto.vercel.app`

---

## 🔗 URLs Importantes

- **GitHub:** https://github.com/victor-4502/naova_mvp
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Dashboard:** https://supabase.com/dashboard

---

## 🆘 Si hay Problemas

### Error en Build
- Revisa los logs en Vercel → Deployments → [Deployment] → Logs
- Verifica que todas las variables de entorno estén configuradas

### Error de Conexión a BD
- Verifica que `DATABASE_URL` tenga la contraseña correcta
- Verifica que el proyecto de Supabase esté activo

### Error de Prisma
- Ya está configurado en `package.json` con `postinstall`
- Vercel lo ejecutará automáticamente

