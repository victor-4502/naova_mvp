# 🚀 Guía de Despliegue - Naova MVP 3.0

## 📋 Pre-requisitos

- [x] Cuenta de Vercel
- [x] Proyecto de Supabase configurado
- [x] Variables de entorno configuradas
- [x] Build exitoso localmente

## 🔧 Configuración de Variables de Entorno

### 1. Crear archivo `.env.local` (para desarrollo)

```bash
# Database - Supabase
DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@db.[YOUR_PROJECT_REF].supabase.co:5432/postgres?schema=public"
DIRECT_URL="postgresql://postgres:[YOUR_PASSWORD]@db.[YOUR_PROJECT_REF].supabase.co:5432/postgres?schema=public"

# JWT Secret
JWT_SECRET="naova-super-secret-jwt-key-2024-change-in-production"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Supabase (opcional)
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR_PROJECT_REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR_ANON_KEY]"
SUPABASE_SERVICE_ROLE_KEY="[YOUR_SERVICE_ROLE_KEY]"
```

### 2. Configurar en Vercel

1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Agregar las siguientes variables:

```
DATABASE_URL = postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres?schema=public
DIRECT_URL = postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres?schema=public
JWT_SECRET = [GENERATE_STRONG_RANDOM_STRING]
NEXT_PUBLIC_APP_URL = https://your-app.vercel.app
```

## 🏗️ Pasos de Despliegue

### 1. Preparar el proyecto

```bash
# Instalar dependencias
npm install

# Verificar que todo esté funcionando
npm run setup

# Hacer build para verificar
npm run build
```

### 2. Configurar Supabase

```bash
# Generar cliente Prisma
npm run db:generate

# Crear tablas en Supabase
npm run db:push

# Poblar con datos de prueba
npm run db:seed
```

### 3. Desplegar en Vercel

#### Opción A: Desde GitHub (Recomendado)

1. Subir código a GitHub
2. Conectar repositorio en Vercel
3. Configurar variables de entorno
4. Deploy automático

#### Opción B: Desde CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login en Vercel
vercel login

# Desplegar
vercel

# Configurar variables de entorno
vercel env add DATABASE_URL
vercel env add DIRECT_URL
vercel env add JWT_SECRET
vercel env add NEXT_PUBLIC_APP_URL
```

### 4. Configurar Dominio (Opcional)

1. En Vercel Dashboard → Settings → Domains
2. Agregar dominio personalizado
3. Configurar DNS según instrucciones

## ✅ Verificación Post-Despliegue

### 1. Verificar URLs principales

- [ ] `https://your-app.vercel.app` - Landing page
- [ ] `https://your-app.vercel.app/login` - Login
- [ ] `https://your-app.vercel.app/admin/dashboard` - Admin (con login)
- [ ] `https://your-app.vercel.app/app/dashboard` - Cliente (con login)

### 2. Verificar funcionalidades

- [ ] Login de administrador
- [ ] Login de cliente
- [ ] Dashboard de reportes
- [ ] Gestión de usuarios (admin)
- [ ] Exportación de datos
- [ ] Notificaciones

### 3. Verificar APIs

```bash
# Probar APIs principales
curl https://your-app.vercel.app/api/reports/resumenGlobal
curl https://your-app.vercel.app/api/insights/predicciones
```

## 🔍 Troubleshooting

### Error: "Database connection failed"

**Causa:** Variables de entorno incorrectas
**Solución:**
1. Verificar DATABASE_URL y DIRECT_URL
2. Verificar que Supabase esté activo
3. Verificar que la contraseña no tenga caracteres especiales

### Error: "Build failed"

**Causa:** Dependencias o código con errores
**Solución:**
1. Ejecutar `npm run build` localmente
2. Revisar errores en la consola
3. Verificar que todas las importaciones sean correctas

### Error: "JWT verification failed"

**Causa:** JWT_SECRET no configurado o diferente
**Solución:**
1. Verificar que JWT_SECRET esté en variables de entorno
2. Usar el mismo JWT_SECRET en desarrollo y producción

### Error: "Prisma client not generated"

**Causa:** Cliente Prisma no generado
**Solución:**
1. Agregar `npm run db:generate` al build process
2. O ejecutar manualmente en Vercel

## 📊 Monitoreo

### 1. Vercel Analytics

- Habilitar en Vercel Dashboard
- Monitorear performance y errores

### 2. Supabase Dashboard

- Monitorear uso de base de datos
- Revisar logs de queries
- Verificar conexiones activas

### 3. Logs de Aplicación

```bash
# Ver logs en Vercel
vercel logs

# Ver logs específicos
vercel logs --follow
```

## 🔄 Actualizaciones

### 1. Deploy automático

- Push a main branch → Deploy automático
- Push a feature branch → Preview deployment

### 2. Deploy manual

```bash
# Deploy específico
vercel --prod

# Deploy con variables específicas
vercel --prod --env DATABASE_URL=...
```

## 🚨 Checklist Pre-Producción

- [ ] Variables de entorno configuradas
- [ ] Base de datos migrada y poblada
- [ ] Build exitoso sin errores
- [ ] Todas las rutas funcionando
- [ ] APIs respondiendo correctamente
- [ ] Autenticación funcionando
- [ ] Roles y permisos verificados
- [ ] Exportación de datos funcionando
- [ ] Notificaciones funcionando
- [ ] Dominio personalizado configurado (opcional)
- [ ] SSL/HTTPS funcionando
- [ ] Monitoreo configurado

## 📞 Soporte

Si encuentras problemas:

1. Revisar logs en Vercel Dashboard
2. Verificar variables de entorno
3. Probar localmente con `npm run dev`
4. Verificar conexión a Supabase
5. Revisar este documento

---

**¡Tu aplicación Naova MVP 3.0 está lista para producción! 🎉**
