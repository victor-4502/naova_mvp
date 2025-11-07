# 🧪 Query para Probar en Supabase SQL Editor

## Query Simple para Verificar Conexión

Ejecuta esta query en el SQL Editor de Supabase:

```sql
SELECT 1 as test;
```

Si funciona, verás el resultado `1`.

## Query para Verificar Tablas

Si la primera query funciona, prueba esta para ver si las tablas existen:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

Esto debería mostrar todas las tablas de tu base de datos.

## Query para Verificar Usuarios

Si quieres ver si hay usuarios:

```sql
SELECT id, email, name, role, active 
FROM "User" 
LIMIT 5;
```

## Si las Queries Funcionan

✅ **Si las queries funcionan en Supabase SQL Editor:**
- El proyecto está activo
- La base de datos funciona
- El problema es de conectividad desde tu máquina local

**Solución:** Puede ser un problema temporal de red o el pooler necesita unos minutos más para estar disponible.

## Si las Queries NO Funcionan

❌ **Si las queries NO funcionan:**
- El proyecto puede estar pausado
- Hay un problema con la base de datos
- Necesitas reactivar el proyecto

**Solución:** Ve a Settings → Database y verifica el estado del proyecto.

