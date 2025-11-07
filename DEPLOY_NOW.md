# 🚀 Desplegar Ahora (Sin Datos)

## ✅ Perfecto! Puedes desplegar ahora y migrar datos después

Tu aplicación está lista para desplegarse **incluso sin datos**. El sistema creará automáticamente los usuarios base necesarios.

---

## 📋 Pasos Rápidos (10 minutos)

### 1. Crear Base de Datos (2 minutos)

**Opción A: Supabase (Recomendado)**
1. Ve a [supabase.com](https://supabase.com)
2. Crea cuenta gratuita
3. "New Project"
4. Nombre: `naova-production`
5. Contraseña: **Guárdala bien!**
6. Región: Elige la más cercana
7. Click "Create new project"
8. Espera 2 minutos a que se cree
9. Ve a **Settings** → **Database**
10. Copia la **Connection String** (URI)
   - Formato: `postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres`

**Opción B: Neon.tech**
1. Ve a [neon.tech](https://neon.tech)
2. Crea cuenta
3. "New Project"
4. Copia la **Connection String**

---

### 2. Configurar Vercel (3 minutos)

1. **Conectar repositorio**
   - Ve a [vercel.com](https://vercel.com)
   - Login con GitHub
   - "Add New Project"
   - Selecciona tu repositorio `naova2.0`
   - Click "Import"

2. **Configurar proyecto**
   - Framework: Next.js (detectado automáticamente)
   - Root Directory: `./`
   - Build Command: `npm run build` (automático)
   - Output Directory: `.next` (automático)
   - **NO hagas click en Deploy todavía**

3. **Agregar variables de entorno**
   - Click en "Environment Variables"
   - Agrega estas variables:

   ```env
   # Base de Datos (pega la URL que copiaste)
   DATABASE_URL=postgresql://postgres:TU_PASSWORD@db.xxx.supabase.co:5432/postgres
   DIRECT_URL=postgresql://postgres:TU_PASSWORD@db.xxx.supabase.co:5432/postgres
   
   # JWT Secret (genera uno seguro)
   JWT_SECRET=tu-secret-super-seguro-minimo-32-caracteres-aqui
   
   # App URL (se actualizará después)
   NEXT_PUBLIC_APP_URL=https://tu-app.vercel.app
   
   # Contacto (opcional)
   SALES_EMAIL=ventas@naova.com
   NEXT_PUBLIC_WHATSAPP=+525512345678
   ```

4. **Generar JWT_SECRET seguro:**
   ```bash
   # En tu terminal local
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Copia el resultado y pégalo en `JWT_SECRET`

5. **Click "Deploy"**
   - Espera 2-5 minutos
   - Vercel construirá y desplegará tu app

---

### 3. Inicializar Base de Datos (2 minutos)

Después del primer deploy, necesitas crear las tablas y usuarios base:

**Opción A: Desde tu máquina local (Recomendado)**

```bash
# 1. Conectar a la base de datos de producción
# Copia DATABASE_URL de Vercel a un archivo .env.local temporal
echo "DATABASE_URL=tu-url-de-produccion" > .env.local

# 2. Ejecutar migraciones
npx prisma migrate deploy

# 3. Crear usuarios base
npm run db:seed
```

**Opción B: Desde Vercel CLI**

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Descargar variables de entorno
vercel env pull .env.production

# 4. Ejecutar migraciones
npx prisma migrate deploy

# 5. Crear usuarios base
npm run db:seed
```

---

### 4. Actualizar URL (1 minuto)

1. Ve a Vercel → Tu Proyecto → Settings → Environment Variables
2. Actualiza `NEXT_PUBLIC_APP_URL` con tu URL real:
   ```
   NEXT_PUBLIC_APP_URL=https://tu-proyecto.vercel.app
   ```
3. Ve a Deployments → Re-deploy (último deployment)

---

## ✅ Verificar que Funciona

1. **Abre tu URL de Vercel**
   - Ejemplo: `https://naova2-0.vercel.app`

2. **Prueba el login**
   - Email: `admin@naova.com`
   - Password: `password123`

3. **Verifica que puedas:**
   - [ ] Hacer login como admin
   - [ ] Ver el dashboard
   - [ ] Crear un nuevo usuario cliente
   - [ ] Hacer login como cliente

---

## 📊 Migrar Datos Después

Cuando tengas datos para migrar:

### Migrar Usuarios Adicionales

Si tienes más usuarios en `server-users.json`:

```bash
node scripts/migrate-users.js
```

### Migrar Tenders/Requirements

Si tienes datos en `localStorage` o archivos JSON:

1. Exporta los datos a JSON
2. Crea un script de migración personalizado
3. Ejecuta el script contra la base de datos de producción

**Ejemplo de script de migración:**

```typescript
// scripts/migrate-tenders.ts
import { PrismaClient } from '@prisma/client'
import { appStore } from '@/lib/store'

const prisma = new PrismaClient()

async function migrateTenders() {
  const tenders = appStore.getTenders()
  
  for (const tender of tenders) {
    // Migrar a Prisma
    // ... código de migración
  }
}
```

---

## 🔄 Actualizaciones Futuras

- **Cada push a `main`** → Deploy automático
- **Cada PR** → Preview deployment
- **Sin downtime** → Vercel hace zero-downtime deployments

---

## 🆘 Problemas Comunes

### Error: "Prisma Client not generated"
**Solución:** Ya está configurado en `package.json` con `postinstall`

### Error: "Database connection failed"
**Solución:**
- Verifica que `DATABASE_URL` esté correcta
- En Supabase, ve a Settings → Database → Connection Pooling
- Usa la connection string con `?pgbouncer=true` si es necesario

### Error: "Table does not exist"
**Solución:** Ejecuta `npx prisma migrate deploy`

### No puedo hacer login
**Solución:** Ejecuta `npm run db:seed` para crear usuarios base

---

## 📝 Checklist Final

- [ ] Base de datos PostgreSQL creada
- [ ] `DATABASE_URL` configurada en Vercel
- [ ] `JWT_SECRET` generado y configurado
- [ ] Deployment exitoso
- [ ] Migraciones ejecutadas (`prisma migrate deploy`)
- [ ] Usuarios base creados (`npm run db:seed`)
- [ ] Login funcionando
- [ ] `NEXT_PUBLIC_APP_URL` actualizada

---

## 🎉 ¡Listo!

Tu aplicación está en internet y funcionando. Puedes empezar a usarla y migrar datos cuando los tengas.

**URL de tu app:** `https://tu-proyecto.vercel.app`

---

## 💡 Tips

1. **Cambiar contraseñas por defecto** después del primer login
2. **Configurar dominio personalizado** en Vercel → Settings → Domains
3. **Habilitar Analytics** en Vercel para ver estadísticas
4. **Revisar logs** en Vercel → Deployments → [Deployment] → Logs

---

¿Necesitas ayuda? Revisa `DEPLOYMENT.md` para la guía completa.

