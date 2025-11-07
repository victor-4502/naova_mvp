# 🔐 Configurar Contraseña en .env

## ✅ URL Correcta (Transaction Pooler)

Supabase te dio esta URL:
```
postgresql://postgres.aptijeklzfxcxemnqpil:[YOUR-PASSWORD]@aws-1-us-east-2.pooler.supabase.com:6543/postgres
```

## 📝 Pasos para Configurar

### 1. Obtener tu Contraseña de Supabase

**Opción A: Si ya la conoces**
- Usa la contraseña que configuraste cuando creaste el proyecto

**Opción B: Si no la recuerdas o necesitas una nueva**
1. Ve a: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a **Settings** → **Database**
4. Haz clic en **"Reset database password"**
5. Copia la nueva contraseña que te muestre

### 2. Actualizar el archivo `.env`

1. Abre el archivo `.env` en la raíz del proyecto
2. Busca esta línea:
   ```env
   DATABASE_URL="postgresql://postgres.aptijeklzfxcxemnqpil:[YOUR-PASSWORD]@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
   ```

3. **Reemplaza `[YOUR-PASSWORD]`** con tu contraseña real

   **Ejemplo:**
   Si tu contraseña es `MiPassword123`, quedaría así:
   ```env
   DATABASE_URL="postgresql://postgres.aptijeklzfxcxemnqpil:MiPassword123@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
   ```

### 3. Verificar

Después de actualizar, prueba la conexión:

```bash
node scripts/test-connection-simple.js
```

## ⚠️ Importante

- **NO necesitas conexión directa** - Solo usa el Transaction pooler
- **DIRECT_URL es opcional** - Solo se usa para migraciones de Prisma
- **El pooler es mejor para producción** - Maneja miles de conexiones

## ✅ Ventajas del Transaction Pooler

- ✅ Perfecto para Vercel (serverless)
- ✅ Maneja miles de conexiones simultáneas
- ✅ Auto-scaling
- ✅ IPv4 compatible

## 🧪 Probar Conexión

Una vez que hayas reemplazado `[YOUR-PASSWORD]`:

```bash
node scripts/test-connection-simple.js
```

Si funciona, verás:
```
✅ ¡Conexión exitosa!
📊 Usuarios en BD: X
```

