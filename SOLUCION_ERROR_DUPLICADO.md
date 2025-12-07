# 🔧 Solución: Error de Clave Duplicada

## ❌ Error

```
ERROR: 23505: duplicate key value violates unique constraint "User_pkey"
DETAIL: Key (id)=(admin-001) already exists.
```

## ✅ Solución

El error indica que **ya existe un usuario** con ese ID. Esto significa que:

1. **Algunas tablas ya fueron creadas** anteriormente
2. **O el SQL tiene INSERTs** que están causando conflictos

## 🎯 Opciones

### Opción 1: Verificar qué tablas ya existen

En Supabase Dashboard → Table Editor, verifica qué tablas ya están creadas.

### Opción 2: Ejecutar solo las partes que faltan

Si algunas tablas ya existen, puedes:

1. **Ejecutar solo los ENUMs que faltan:**
   - Ve a SQL Editor
   - Ejecuta solo las líneas `CREATE TYPE` que no existen

2. **Ejecutar solo las tablas que faltan:**
   - Ejecuta solo los `CREATE TABLE` que no existen
   - Si una tabla ya existe, omite esa parte del SQL

### Opción 3: Limpiar y empezar de nuevo (CUIDADO - borra datos)

Si quieres empezar desde cero:

```sql
-- ⚠️ CUIDADO: Esto borrará TODOS los datos
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```

Luego ejecuta el SQL completo nuevamente.

### Opción 4: Modificar el SQL para evitar duplicados

Puedes modificar el SQL para que use `IF NOT EXISTS` o `ON CONFLICT DO NOTHING`.

## 🔍 Verificar Estado Actual

Ejecuta esto en Supabase SQL Editor para ver qué tablas existen:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Y para ver qué ENUMs existen:

```sql
SELECT typname 
FROM pg_type 
WHERE typtype = 'e' 
ORDER BY typname;
```

## ✅ Recomendación

1. **Verifica qué tablas ya existen** usando el query de arriba
2. **Ejecuta solo las partes del SQL que faltan**
3. **O usa `DROP TABLE` para las tablas existentes** y ejecuta el SQL completo

¿Qué prefieres hacer?

