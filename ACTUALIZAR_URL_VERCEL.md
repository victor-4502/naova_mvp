# ✅ Actualizar NEXT_PUBLIC_APP_URL en Vercel

## 🎉 ¡Tu App Está en Internet!

**URL:** https://naova-mvp.vercel.app/

La landing page está funcionando correctamente. Ahora necesitamos actualizar la variable de entorno.

---

## 📋 PASO 1: Actualizar NEXT_PUBLIC_APP_URL

### 1.1 En Vercel Dashboard

1. Ve a: https://vercel.com/dashboard
2. Selecciona tu proyecto **`naova_mvp`**
3. Ve a **Settings** → **Environment Variables**

### 1.2 Editar Variable

1. Busca `NEXT_PUBLIC_APP_URL`
2. Haz clic en el lápiz (editar) o en los tres puntos → **Edit**
3. Cambia el valor a:
   ```
   https://naova-mvp.vercel.app
   ```
4. Asegúrate de que esté marcada para:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. Haz clic en **"Save"**

### 1.3 Re-deploy

1. Ve a **Deployments**
2. Selecciona el último deployment
3. Haz clic en los **"..."** (tres puntos)
4. Selecciona **"Redeploy"**
5. Confirma

---

## 📋 PASO 2: Verificar Funcionalidades

### 2.1 Probar Login

1. Ve a: https://naova-mvp.vercel.app/login
2. Prueba con:
   - **Admin:** `admin@naova.com` / `password123`
   - **Cliente:** `juan@abc.com` / `password123`

### 2.2 Verificar Dashboards

- **Admin Dashboard:** https://naova-mvp.vercel.app/admin/dashboard
- **Cliente Dashboard:** https://naova-mvp.vercel.app/app/dashboard

### 2.3 Probar Funcionalidades

- ✅ Crear usuarios (como admin)
- ✅ Crear requerimientos (como cliente)
- ✅ Ver reportes
- ✅ Gestionar licitaciones

---

## ✅ Estado Actual

- ✅ Landing page funcionando
- ✅ Deploy exitoso
- ⚠️ Necesita actualizar NEXT_PUBLIC_APP_URL
- ⚠️ Necesita re-deploy después de actualizar

---

## 🎉 ¡Casi Listo!

Una vez que actualices `NEXT_PUBLIC_APP_URL` y hagas re-deploy, tu aplicación estará completamente funcional.

