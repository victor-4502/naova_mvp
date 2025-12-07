# Credenciales de Usuarios Naova

## Usuarios Administrativos

### Administrador
- **Email:** `admin@naova.com`
- **Contraseña:** `AdminNaova2024!`
- **Rol:** Administrador
- **Acceso:** Panel de administración completo

### Operador
- **Email:** `operador@naova.com`
- **Contraseña:** `OperadorNaova2024!`
- **Rol:** Operador
- **Acceso:** Panel de administración (permisos limitados)

---

## Gestión de Contraseñas

### Ver y Resetear Contraseñas desde el Panel de Admin

1. **Acceder al Panel de Administración:**
   - Ve a `/admin/users`
   - Inicia sesión como administrador o operador

2. **Editar Usuario:**
   - Haz clic en el botón "Editar" junto al usuario que deseas modificar
   - Se abrirá el modal de edición

3. **Resetear Contraseña:**
   - En el modal de edición, busca la sección "Contraseña"
   - Haz clic en "Resetear Contraseña"
   - Tienes dos opciones:
     - **Generar automáticamente:** Deja el campo vacío y haz clic en "Generar" o "Actualizar Contraseña"
     - **Establecer manualmente:** Escribe la nueva contraseña en el campo

4. **Ver la Nueva Contraseña:**
   - Después de resetear, la nueva contraseña se mostrará en un recuadro verde
   - **⚠️ IMPORTANTE:** Guarda esta contraseña inmediatamente, ya que no se volverá a mostrar
   - Puedes copiarla al portapapeles haciendo clic en "Copiar"

### Características de la Contraseña Generada

- **Longitud:** 12 caracteres
- **Caracteres incluidos:**
  - Letras minúsculas (a-z)
  - Letras mayúsculas (A-Z)
  - Números (0-9)
  - Caracteres especiales (!@#$%^&*)

### Notas Importantes

- Las contraseñas se almacenan hasheadas en la base de datos (nunca en texto plano)
- Solo los administradores y operadores pueden resetear contraseñas
- Todas las acciones de reseteo se registran en el log de auditoría
- La contraseña generada se muestra una sola vez por seguridad

---

## Seguridad

- **Nunca compartas las contraseñas por email o mensajes no seguros**
- **Recomienda a los usuarios cambiar su contraseña después del primer inicio de sesión**
- **Las contraseñas deben tener al menos 6 caracteres si se establecen manualmente**

