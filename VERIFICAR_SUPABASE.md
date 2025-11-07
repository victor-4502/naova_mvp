# 🔍 Verificar Conexión a Supabase

## Estado Actual

- ✅ Variables de entorno configuradas
- ❌ No se puede conectar al servidor
- ⚠️  El proyecto puede estar aún activándose

## Pasos para Verificar

### 1. Verificar URL Actualizada en Supabase

1. Ve a: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a **Settings** → **Database**
4. En la sección **Connection string**, copia la **URI** (no la Session mode)

### 2. Verificar que el Proyecto Esté Completamente Activo

- El proyecto puede tardar **1-2 minutos** en activarse completamente
- Verifica que el estado diga **"Active"** (no "Resuming" o "Paused")

### 3. Actualizar el archivo `.env`

Reemplaza la `DATABASE_URL` con la URL actualizada que copiaste:

```env
DATABASE_URL="postgresql://postgres:[TU-PASSWORD]@[HOST]:[PUERTO]/postgres"
DIRECT_URL="postgresql://postgres:[TU-PASSWORD]@[HOST-DIRECTO]:5432/postgres"
```

### 4. Probar Conexión

Ejecuta:
```bash
node scripts/test-direct-connection.js
```

## URLs Comunes de Supabase

### Connection Pooling (Recomendado para producción)
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Direct Connection (Para migraciones)
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

## Si Sigue Sin Funcionar

1. **Espera 2-3 minutos** después de reactivar el proyecto
2. **Verifica la contraseña** - algunos caracteres especiales necesitan URL-encoding
3. **Prueba desde el dashboard de Supabase** - ve a SQL Editor y ejecuta una query simple
4. **Verifica la región** - asegúrate de que la URL use la región correcta

## Comando Rápido

Una vez que tengas la URL actualizada, ejecuta:

```bash
node scripts/test-direct-connection.js
```

