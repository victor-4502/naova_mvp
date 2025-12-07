-- Script para crear usuario admin
-- Ejecuta esto en Supabase SQL Editor

-- Primero necesitamos generar el hash de la contraseña
-- La contraseña es: AdminNaova2024!
-- Ejecuta esto en Node.js para generar el hash:
-- node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('AdminNaova2024!', 10).then(h => console.log(h));"

-- Luego reemplaza [HASH_AQUI] con el hash generado y ejecuta:

INSERT INTO "User" (
    "id",
    "name",
    "email",
    "passwordHash",
    "role",
    "company",
    "active",
    "createdAt",
    "updatedAt"
) VALUES (
    'clx' || substr(md5(random()::text || clock_timestamp()::text)::text, 1, 20),
    'Administrador Naova',
    'admin@naova.com',
    '[HASH_AQUI]',  -- Reemplaza con el hash generado
    'admin_naova',
    'Naova',
    true,
    NOW(),
    NOW()
)
ON CONFLICT ("id") DO NOTHING
ON CONFLICT ("email") DO NOTHING;

-- También crear usuario operador:
INSERT INTO "User" (
    "id",
    "name",
    "email",
    "passwordHash",
    "role",
    "company",
    "active",
    "createdAt",
    "updatedAt"
) VALUES (
    'clx' || substr(md5(random()::text || clock_timestamp()::text)::text, 1, 20),
    'Operador Naova',
    'operador@naova.com',
    '[HASH_AQUI]',  -- Reemplaza con el hash generado (mismo hash o genera uno nuevo)
    'operator_naova',
    'Naova',
    true,
    NOW(),
    NOW()
)
ON CONFLICT ("id") DO NOTHING
ON CONFLICT ("email") DO NOTHING;

