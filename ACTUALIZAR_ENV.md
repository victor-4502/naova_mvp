# 🔧 Actualizar .env con Nueva URL de Supabase

## ✅ URL Actualizada

He actualizado tu `.env` con la nueva URL del Transaction pooler:

```
DATABASE_URL="postgresql://postgres.aptijeklzfxcxemnqpil:[YOUR-PASSWORD]@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.aptijeklzfxcxemnqpil.supabase.co:5432/postgres"
```

## ⚠️ IMPORTANTE: Reemplazar Contraseña

**Debes reemplazar `[YOUR-PASSWORD]` con tu contraseña real de Supabase.**

### Pasos:

1. **Abre el archivo `.env`** en la raíz del proyecto
2. **Busca** `[YOUR-PASSWORD]` en ambas líneas (DATABASE_URL y DIRECT_URL)
3. **Reemplaza** con tu contraseña real de Supabase
4. **Guarda** el archivo

### Ejemplo:

Si tu contraseña es `MiPassword123`, las líneas quedarían así:

```env
DATABASE_URL="postgresql://postgres.aptijeklzfxcxemnqpil:MiPassword123@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:MiPassword123@db.aptijeklzfxcxemnqpil.supabase.co:5432/postgres"
```

## 🧪 Probar Conexión

Una vez que hayas actualizado la contraseña, ejecuta:

```bash
node scripts/test-direct-connection.js
```

O para leer las tablas:

```bash
node scripts/read-supabase-tables.js
```

## ✅ Ventajas del Transaction Pooler

- ✅ **Mejor para producción** - Maneja miles de conexiones
- ✅ **Ideal para Vercel** - Perfecto para serverless
- ✅ **IPv4 compatible** - Funciona en cualquier red
- ✅ **Auto-scaling** - Se adapta automáticamente

