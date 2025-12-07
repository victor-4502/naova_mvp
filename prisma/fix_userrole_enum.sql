-- Script para corregir el enum UserRole
-- Ejecuta esto PRIMERO si el enum UserRole tiene valores incorrectos

-- Paso 1: Eliminar el enum antiguo (esto eliminará las tablas que lo usan)
-- ⚠️ CUIDADO: Esto borrará datos si hay tablas que usan este enum

-- Opción A: Si NO tienes datos importantes, elimina todo y recrea
DROP TYPE IF EXISTS "UserRole" CASCADE;

-- Opción B: Si tienes datos, primero actualiza los valores existentes
-- (ejecuta esto antes de eliminar el enum)
-- UPDATE "User" SET role = 'client_enterprise' WHERE role = 'CLIENT';
-- UPDATE "User" SET role = 'admin_naova' WHERE role = 'ADMIN';

-- Paso 2: Crear el enum con los valores correctos
CREATE TYPE "UserRole" AS ENUM ('admin_naova', 'operator_naova', 'client_enterprise', 'supplier');

-- Paso 3: Ahora ejecuta el safe_migration.sql para crear las tablas

