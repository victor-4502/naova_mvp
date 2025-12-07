-- Script para verificar y crear tablas en Supabase
-- Ejecuta esto en Supabase SQL Editor

-- 1. Verificar qué tablas existen
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 2. Verificar si existe la tabla User (con diferentes nombres posibles)
SELECT 
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name IN ('User', 'user', '"User"')
ORDER BY table_name, ordinal_position;

-- 3. Verificar el enum UserRole
SELECT 
    t.typname AS enum_name,
    e.enumlabel AS enum_value
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
WHERE t.typname = 'UserRole'
ORDER BY e.enumsortorder;

-- 4. Si las tablas no existen, ejecuta primero:
--    prisma/complete_safe_migration.sql

-- 5. Si el enum UserRole no tiene los valores correctos, ejecuta:
--    prisma/fix_userrole_enum.sql

-- 6. Después de crear las tablas, ejecuta:
--    prisma/create_admin_ready.sql

