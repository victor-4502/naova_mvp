# ✅ Verificar Deploy en Vercel

## 🎉 ¡Deploy Creado!

Ahora necesitamos verificar que todo funcione correctamente.

---

## 📋 PASO 1: Obtener URL de Vercel

### 1.1 En el Dashboard de Vercel

1. Ve a tu proyecto en Vercel
2. Deberías ver el último deployment
3. Si está **"Ready"** ✅, haz clic en él
4. Verás una URL como: `https://naova-mvp-abc123.vercel.app`

**Copia esta URL** - la necesitamos para el siguiente paso.

---

## 📋 PASO 2: Actualizar NEXT_PUBLIC_APP_URL

### 2.1 Actualizar Variable

1. Ve a: Tu Proyecto → **Settings** → **Environment Variables**
2. Busca `NEXT_PUBLIC_APP_URL`
3. Haz clic en el lápiz (editar) o en los tres puntos → **Edit**
4. Reemplaza el valor con tu URL real de Vercel
   - Ejemplo: `https://naova-mvp-abc123.vercel.app`
5. Haz clic en **"Save"**

### 2.2 Re-deploy

1. Ve a **Deployments**
2. Selecciona el último deployment
3. Haz clic en los **"..."** (tres puntos)
4. Selecciona **"Redeploy"**
5. Confirma

---

## 📋 PASO 3: Verificar que Funciona

### 3.1 Probar la Landing Page

1. Abre la URL de Vercel en tu navegador
2. Deberías ver la landing page de Naova
3. Verifica que se vea correctamente

### 3.2 Probar Login

1. Ve a `/login` (ejemplo: `https://tu-app.vercel.app/login`)
2. Prueba con:
   - **Admin:** `admin@naova.com` / `password123`
   - **Cliente:** `juan@abc.com` / `password123`

### 3.3 Verificar Funcionalidades

- ✅ Login funciona
- ✅ Dashboard carga
- ✅ Puedes crear usuarios (como admin)
- ✅ Puedes crear requerimientos (como cliente)

---

## 🆘 Si hay Problemas

### Error en la Página

1. Ve a Vercel → Deployments → [Último deployment] → **Logs**
2. Revisa los errores
3. Verifica que todas las variables de entorno estén correctas

### Error de Login

1. Verifica que `DATABASE_URL` tenga la contraseña correcta
2. Verifica que el proyecto de Supabase esté activo
3. Revisa los logs en Vercel

### Error 500 o Internal Server Error

1. Revisa los logs en Vercel
2. Verifica que Prisma Client se haya generado correctamente
3. Verifica las variables de entorno

---

## ✅ Checklist Final

- [ ] Deploy completado y "Ready"
- [ ] URL de Vercel obtenida
- [ ] `NEXT_PUBLIC_APP_URL` actualizada
- [ ] Re-deploy realizado
- [ ] Landing page funciona
- [ ] Login funciona
- [ ] Dashboard carga correctamente

---

## 🎉 ¡Listo!

Tu aplicación está en internet y accesible desde cualquier lugar.

**URL:** `https://tu-proyecto.vercel.app`

