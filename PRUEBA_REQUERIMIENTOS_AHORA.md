# 🧪 Prueba de Requerimientos - Guía Rápida

## ✅ Pasos para Probar las 3 Opciones

---

## 📧 Prueba 1: Email (Simulado)

### En la terminal, ejecuta:

```bash
npx tsx scripts/probar-webhook-email.ts
```

**Qué deberías ver:**
- ✅ Cliente encontrado: [nombre] ([email])
- ✅ Webhook procesado exitosamente
- ✅ Request creado
- ✅ Mensaje de auto-respuesta generado

**Si ves error "No se encontró ningún cliente":**
- Ve a `http://localhost:3000/admin/users`
- Crea un cliente con email y `role='client_enterprise'`

---

## 📱 Prueba 2: WhatsApp (Simulado)

### En la terminal, ejecuta:

```bash
npx tsx scripts/probar-webhook-whatsapp.ts
```

**Qué deberías ver:**
- ✅ Cliente encontrado: [nombre] ([teléfono])
- ✅ Webhook procesado exitosamente
- ✅ Request creado
- ✅ Mensaje de auto-respuesta generado

**Si ves error "No se encontró ningún cliente":**
- Ve a `http://localhost:3000/admin/users`
- Crea un cliente con teléfono y `role='client_enterprise'`

---

## 💻 Prueba 3: Plataforma Web (Real)

### Paso a paso:

1. **Abre el navegador:**
   ```
   http://localhost:3000/login
   ```

2. **Inicia sesión como cliente:**
   - Si no tienes un cliente, créalo desde `/admin/users`
   - O usa uno existente

3. **Ve a requerimientos:**
   ```
   http://localhost:3000/app/requests
   ```

4. **Crea un requerimiento incompleto:**
   - Escribe: `Necesito tornillos`
   - Haz clic en "Enviar a Naova"

5. **Verifica:**
   - Deberías ver tu requerimiento en la lista
   - Source: "Plataforma"

---

## 🔍 Verificar Resultados en Admin

### Ve a:

```
http://localhost:3000/admin/requests
```

**Inicia sesión como admin:**
- Email: `admin@naova.com`
- Contraseña: `AdminNaova2024!`

### Qué deberías ver:

1. **Requests creados:**
   - Request con source "Email" (de la prueba 1)
   - Request con source "WhatsApp" (de la prueba 2)
   - Request con source "Plataforma" (de la prueba 3)

2. **Para cada request incompleto:**
   - Estado: `INCOMPLETE_INFORMATION`
   - "Mensaje sugerido para pedir información faltante" visible
   - Toggle "Activar respuesta automática" visible

---

## 🐛 Si Algo No Funciona

### Error: "No se encontró ningún cliente"

**Solución:**
1. Ve a `http://localhost:3000/admin/users`
2. Haz clic en "Crear Usuario"
3. Completa:
   - Nombre
   - Email (para probar email)
   - Teléfono (para probar WhatsApp)
   - Rol: `client_enterprise`
   - Activo: ✅
   - Contraseña
4. Guarda

### Error: "Error al procesar webhook"

**Solución:**
1. Verifica que el servidor esté corriendo (`npm run dev`)
2. Verifica que veas "Ready" en la terminal
3. Verifica que `DATABASE_URL` esté en `.env`

### No aparecen los requests en `/admin/requests`

**Solución:**
1. Verifica que estés logueado como admin
2. Recarga la página (F5)
3. Verifica en la base de datos:
   ```sql
   SELECT id, source, status, "rawContent" 
   FROM "Request" 
   ORDER BY "createdAt" DESC 
   LIMIT 10;
   ```

---

## ✅ Checklist Final

Después de ejecutar las 3 pruebas:

- [ ] Request de Email aparece en `/admin/requests`
- [ ] Request de WhatsApp aparece en `/admin/requests`
- [ ] Request de Plataforma aparece en `/admin/requests`
- [ ] Cada request muestra el source correcto
- [ ] Requests incompletos muestran "Mensaje sugerido"
- [ ] El toggle de auto-respuesta está visible

---

## 🎉 ¡Listo!

Si todos los checks pasan, el sistema está funcionando correctamente.

Los mensajes de auto-respuesta están guardados en la tabla `Message` y listos para ser enviados cuando integres con proveedores externos.

