-- Script para verificar usuarios en Supabase
-- Ejecuta esto en Supabase SQL Editor

-- 1. Verificar que el usuario existe
SELECT 
    id, 
    name, 
    email, 
    role, 
    active,
    "passwordHash",
    "createdAt"
FROM "User" 
WHERE email = 'admin@naova.com';

-- 2. Verificar todos los usuarios admin
SELECT 
    id, 
    name, 
    email, 
    role, 
    active
FROM "User" 
WHERE role = 'admin_naova';

-- 3. Verificar todos los usuarios
SELECT 
    id, 
    name, 
    email, 
    role, 
    active,
    "createdAt"
FROM "User" 
ORDER BY "createdAt" DESC;

-- 4. Si el usuario no existe o está inactivo, ejecuta esto para crearlo/activarlo:
-- (Solo ejecuta si el usuario no existe o está inactivo)

-- Opción A: Si el usuario existe pero está inactivo
UPDATE "User" 
SET active = true 
WHERE email = 'admin@naova.com';

-- Opción B: Si el usuario no existe, crearlo
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
    '$2a$10$dWkUEYuwK1OLV0IJXrlZg.cS8eAKlLJD2Y7eHG//tQPZDyqKKnsE2',  -- Hash de: AdminNaova2024!
    'admin_naova',
    'Naova',
    true,
    NOW(),
    NOW()
)
ON CONFLICT ("email") DO UPDATE SET
    active = true,
    "passwordHash" = '$2a$10$dWkUEYuwK1OLV0IJXrlZg.cS8eAKlLJD2Y7eHG//tQPZDyqKKnsE2',
    "updatedAt" = NOW();

-- 5. Verificar el hash de la contraseña (debe coincidir con el hash almacenado)
-- El hash almacenado debe ser: $2a$10$dWkUEYuwK1OLV0IJXrlZg.cS8eAKlLJD2Y7eHG//tQPZDyqKKnsE2
-- Para la contraseña: AdminNaova2024!

