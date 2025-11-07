# 🚀 Guía Completa: Deploy a Vercel - Paso a Paso

## ✅ Paso 1: Inicializar Git y Subir a GitHub

### 1.1 Inicializar Git

```bash
git init
git add .
git commit -m "Initial commit - Naova MVP ready for deployment"
```

### 1.2 Crear Repositorio en GitHub

1. Ve a: https://github.com/new
2. Nombre del repositorio: `naova2.0` (o el que prefieras)
3. **NO** marques "Initialize with README" (ya tienes archivos)
4. Haz clic en **"Create repository"**

### 1.3 Conectar y Subir Código

GitHub te dará comandos, pero aquí están:

```bash
git remote add origin https://github.com/TU-USUARIO/naova2.0.git
git branch -M main
git push -u origin main
```

**Nota:** Reemplaza `TU-USUARIO` con tu usuario de GitHub.

---

## ✅ Paso 2: Conectar con Vercel

### 2.1 Crear Cuenta en Vercel

1. Ve a: https://vercel.com
2. Haz clic en **"Sign Up"**
3. Elige **"Continue with GitHub"** (recomendado)
4. Autoriza Vercel a acceder a tus repositorios

### 2.2 Importar Proyecto

1. En el dashboard de Vercel, haz clic en **"Add New Project"**
2. Selecciona el repositorio `naova2.0`
3. Haz clic en **"Import"**

### 2.3 Configurar Proyecto

Vercel detectará automáticamente:
- **Framework Preset:** Next.js ✅
- **Root Directory:** `./` ✅
- **Build Command:** `npm run build` ✅
- **Output Directory:** `.next` ✅

**NO hagas clic en Deploy todavía** - primero necesitamos configurar las variables de entorno.

---

## ✅ Paso 3: Configurar Variables de Entorno en Vercel

### 3.1 Agregar Variables

En la página de configuración del proyecto, ve a la sección **"Environment Variables"** y agrega:

#### Variables Requeridas:

```env
DATABASE_URL=postgresql://postgres.aptijeklzfxcxemnqpil:TU_CONTRASEÑA@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true

DIRECT_URL=postgresql://postgres:TU_CONTRASEÑA@db.aptijeklzfxcxemnqpil.supabase.co:5432/postgres

JWT_SECRET=naova-super-secret-jwt-key-2024

NEXT_PUBLIC_APP_URL=https://tu-proyecto.vercel.app
```

**⚠️ IMPORTANTE:**
- Reemplaza `TU_CONTRASEÑA` con tu contraseña real de Supabase
- `NEXT_PUBLIC_APP_URL` se actualizará después del primer deploy (Vercel te dará la URL)

#### Variables Opcionales:

```env
SALES_EMAIL=ventas@naova.com
NEXT_PUBLIC_WHATSAPP=+525512345678
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=Naova <noreply@naova.com>
```

### 3.2 Configurar para Todos los Entornos

Asegúrate de que las variables estén marcadas para:
- ✅ **Production**
- ✅ **Preview** (opcional)
- ✅ **Development** (opcional)

---

## ✅ Paso 4: Deploy

### 4.1 Hacer Deploy

1. Después de agregar las variables de entorno
2. Haz clic en **"Deploy"**
3. Espera 2-5 minutos mientras Vercel construye y despliega

### 4.2 Verificar Deploy

- Verás el progreso en tiempo real
- Al terminar, verás **"Ready"** con una URL
- Ejemplo: `https://naova2-0.vercel.app`

---

## ✅ Paso 5: Actualizar NEXT_PUBLIC_APP_URL

### 5.1 Obtener URL de Vercel

Después del primer deploy, Vercel te dará una URL como:
```
https://naova2-0-abc123.vercel.app
```

### 5.2 Actualizar Variable

1. Ve a Vercel → Tu Proyecto → **Settings** → **Environment Variables**
2. Busca `NEXT_PUBLIC_APP_URL`
3. Actualiza el valor con tu URL real de Vercel
4. Haz clic en **"Save"**
5. Ve a **Deployments** → Selecciona el último deployment → **"Redeploy"**

---

## ✅ Paso 6: Verificar que Funciona

### 6.1 Probar la Aplicación

1. Abre la URL de Vercel en tu navegador
2. Deberías ver la landing page de Naova

### 6.2 Probar Login

1. Ve a `/login`
2. Prueba con:
   - **Admin:** `admin@naova.com` / `password123`
   - **Cliente:** `juan@abc.com` / `password123`

### 6.3 Verificar Funcionalidades

- ✅ Login funciona
- ✅ Dashboard carga
- ✅ Puedes crear usuarios
- ✅ Puedes crear requerimientos

---

## 🆘 Troubleshooting

### Error: "Build failed"

**Solución:**
- Revisa los logs en Vercel
- Verifica que todas las variables de entorno estén configuradas
- Asegúrate de que `DATABASE_URL` tenga la contraseña correcta

### Error: "Database connection failed"

**Solución:**
- Verifica que `DATABASE_URL` esté correcta en Vercel
- Verifica que el proyecto de Supabase esté activo
- Verifica que la contraseña sea correcta (sin espacios)

### Error: "Prisma Client not generated"

**Solución:**
- Ya está configurado en `package.json` con `postinstall`
- Vercel lo ejecutará automáticamente

---

## ✅ Checklist Final

- [ ] Código subido a GitHub
- [ ] Proyecto conectado en Vercel
- [ ] Variables de entorno configuradas
- [ ] Deploy exitoso
- [ ] `NEXT_PUBLIC_APP_URL` actualizada
- [ ] Login funcionando
- [ ] Aplicación accesible en internet

---

## 🎉 ¡Listo!

Tu aplicación estará en internet y accesible desde cualquier lugar.

**URL de tu app:** `https://tu-proyecto.vercel.app`

