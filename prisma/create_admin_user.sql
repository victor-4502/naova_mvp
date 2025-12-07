-- Script para crear usuario admin (ejecutar después de crear las tablas)
-- Este script verifica si el usuario ya existe antes de crearlo

-- Primero necesitas generar el hash de la contraseña 'AdminNaova2024!'
-- Puedes usar Node.js para generar el hash:
-- node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('AdminNaova2024!', 10).then(h => console.log(h));"

-- O ejecutar el seed cuando funcione la conexión:
-- npm run prisma:seed

-- Si quieres crear el usuario manualmente, primero genera el hash y luego ejecuta:

-- INSERT INTO "User" (id, name, email, "passwordHash", role, company, active, "createdAt", "updatedAt")
-- VALUES (
--   'clx' || substr(md5(random()::text || clock_timestamp()::text)::text, 1, 20),
--   'Administrador Naova',
--   'admin@naova.com',
--   '[AQUI_VA_EL_HASH_GENERADO]',  -- Reemplaza con el hash generado
--   'admin_naova',
--   'Naova',
--   true,
--   NOW(),
--   NOW()
-- )
-- ON CONFLICT (id) DO NOTHING;

-- INSERT INTO "User" (id, name, email, "passwordHash", role, company, active, "createdAt", "updatedAt")
-- VALUES (
--   'clx' || substr(md5(random()::text || clock_timestamp()::text)::text, 1, 20),
--   'Operador Naova',
--   'operador@naova.com',
--   '[AQUI_VA_EL_HASH_GENERADO]',  -- Reemplaza con el hash generado
--   'operator_naova',
--   'Naova',
--   true,
--   NOW(),
--   NOW()
-- )
-- ON CONFLICT (id) DO NOTHING;

