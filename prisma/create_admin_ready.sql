-- Script para crear usuarios admin y operador
-- Ejecuta esto en Supabase SQL Editor

-- Crear usuario Administrador
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
ON CONFLICT ("email") DO NOTHING;

-- Crear usuario Operador
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
    '$2a$10$npOw6brxfWn28wHq75r7VuypuQjqBxRYcET2NqNsMPHhLccYWJkkm',  -- Hash de: OperadorNaova2024!
    'operator_naova',
    'Naova',
    true,
    NOW(),
    NOW()
)
ON CONFLICT ("email") DO NOTHING;

-- Verificar que se crearon
SELECT id, name, email, role, active FROM "User" WHERE email IN ('admin@naova.com', 'operador@naova.com');

