# ⚡ Deployment Rápido - Naova

## 🎯 Resumen

Tu aplicación Next.js se despliega completamente en **Vercel** (no necesitas Render separado). Next.js incluye tanto frontend como backend (API routes).

## 📝 Pasos Rápidos

### 1. Base de Datos (5 minutos)

**Opción A: Supabase (Recomendado)**
1. Ve a [supabase.com](https://supabase.com) → Crear cuenta
2. Nuevo proyecto → Copia `DATABASE_URL`
3. Listo ✅

**Opción B: Neon.tech**
1. Ve a [neon.tech](https://neon.tech) → Crear cuenta
2. Nuevo proyecto → Copia `DATABASE_URL`
3. Listo ✅

### 2. Vercel (5 minutos)

1. **Conectar repositorio**
   - Ve a [vercel.com](https://vercel.com)
   - "Add New Project"
   - Conecta tu repo de GitHub

2. **Variables de entorno**
   - Settings → Environment Variables
   - Agrega:
     ```
     DATABASE_URL=tu-url-de-postgresql
     DIRECT_URL=tu-url-de-postgresql
     JWT_SECRET=genera-uno-seguro-32-caracteres
     NEXT_PUBLIC_APP_URL=https://tu-app.vercel.app
     ```

3. **Deploy**
   - Vercel detecta automáticamente Next.js
   - Click "Deploy"
   - Espera 2-5 minutos

### 3. Migraciones (2 minutos)

Después del primer deploy:

```bash
# Opción A: Vercel CLI
npm i -g vercel
vercel login
vercel env pull .env.production
npx prisma migrate deploy

# Opción B: Desde tu máquina local
# Conecta a la base de datos de producción y ejecuta:
npx prisma migrate deploy
```

### 4. Migrar Usuarios (Opcional)

Si tienes usuarios en `server-users.json`:

```bash
node scripts/migrate-users.js
```

## ✅ Checklist

- [ ] Base de datos PostgreSQL creada
- [ ] `DATABASE_URL` configurada en Vercel
- [ ] `JWT_SECRET` generado y configurado
- [ ] Deployment exitoso en Vercel
- [ ] Migraciones ejecutadas
- [ ] Aplicación funcionando

## 🔗 URLs Importantes

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Neon Dashboard**: https://console.neon.tech

## 💡 Notas

- **No necesitas Render**: Next.js ya incluye el backend
- **Gratis**: Vercel y Supabase/Neon tienen planes gratuitos generosos
- **Auto-deploy**: Cada push a `main` despliega automáticamente
- **Preview**: Cada PR crea un deployment de preview

## 🆘 Problemas Comunes

**Error de conexión a BD:**
- Verifica que `DATABASE_URL` esté correcta
- Verifica el firewall de tu base de datos

**Error de Prisma:**
- Verifica que `prisma generate` se ejecute en el build
- Ya está configurado en `package.json`

**Error de JWT:**
- Asegúrate de tener `JWT_SECRET` configurado
- Debe ser mínimo 32 caracteres

---

**¿Listo?** Sigue la guía completa en `DEPLOYMENT.md` para más detalles.

