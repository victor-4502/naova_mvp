# 🧪 Siguiente Paso: Probar Requerimientos

## ✅ Estado Actual

- ✅ Error 500 solucionado
- ✅ Tabla Request existe con todas las columnas
- ✅ Servidor corriendo en `http://localhost:3000`
- ✅ Página `/admin/requests` carga correctamente

---

## 🎯 Pruebas a Realizar

### Prueba 1: Email (Simulado)

**Ejecuta en la terminal:**
```bash
npx tsx scripts/probar-webhook-email.ts
```

**Qué deberías ver:**
- ✅ Cliente encontrado
- ✅ Webhook procesado exitosamente
- ✅ Request creado
- ✅ Mensaje de auto-respuesta generado (si está incompleto)

**Verificar:**
- Ve a `http://localhost:3000/admin/requests`
- Deberías ver un request con source "Email"
- Deberías ver el "Mensaje sugerido para pedir información faltante"

---

### Prueba 2: WhatsApp (Simulado)

**Ejecuta en la terminal:**
```bash
npx tsx scripts/probar-webhook-whatsapp.ts
```

**Qué deberías ver:**
- ✅ Cliente encontrado
- ✅ Webhook procesado exitosamente
- ✅ Request creado
- ✅ Mensaje de auto-respuesta generado (si está incompleto)

**Verificar:**
- Ve a `http://localhost:3000/admin/requests`
- Deberías ver un request con source "WhatsApp"
- Deberías ver el "Mensaje sugerido para pedir información faltante"

---

### Prueba 3: Plataforma Web (Real)

**Pasos:**
1. Ve a `http://localhost:3000/login`
2. Inicia sesión como cliente (ej: `juan@abc.com`)
3. Ve a `http://localhost:3000/app/requests`
4. Escribe un requerimiento incompleto: `Necesito tornillos`
5. Haz clic en "Enviar a Naova"

**Verificar:**
- Ve a `http://localhost:3000/admin/requests`
- Deberías ver un request con source "Plataforma" o "web"
- Deberías ver el "Mensaje sugerido para pedir información faltante"

---

## 🔍 Verificar Auto-Respuestas

### En `/admin/requests`:

Para cada request incompleto deberías ver:
- ✅ Estado: `INCOMPLETE_INFORMATION`
- ✅ "Mensaje sugerido para pedir información faltante" con el texto generado
- ✅ Toggle "Activar respuesta automática por el mismo canal" (activado por defecto)

### En la Base de Datos:

Ejecuta esto en Supabase SQL Editor:

```sql
-- Ver mensajes de auto-respuesta generados
SELECT 
  r.id,
  r.source,
  r.status,
  r."rawContent",
  m.content as mensaje_auto_respuesta,
  m.processed
FROM "Request" r
LEFT JOIN "Message" m ON m."requestId" = r.id AND m.direction = 'outbound'
WHERE r.status = 'INCOMPLETE_INFORMATION'
ORDER BY r."createdAt" DESC
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
- [ ] Requests incompletos tienen mensaje en tabla `Message` con `direction='outbound'`
- [ ] El toggle de auto-respuesta funciona

---

## 🎉 ¡Listo!

Si todos los checks pasan, el sistema está funcionando correctamente:

- ✅ Recibe requerimientos por los 3 canales
- ✅ Identifica clientes automáticamente
- ✅ Analiza requerimientos con reglas
- ✅ Genera auto-respuestas cuando falta información
- ✅ Muestra todo en `/admin/requests`

Los mensajes de auto-respuesta están guardados en la tabla `Message` y listos para ser enviados cuando integres con proveedores externos (SendGrid, Twilio, etc.).

---

## 📝 Próximos Pasos (Opcional)

1. **Personalizar reglas:** Edita `lib/rules/requestSchemas.ts` para agregar más categorías
2. **Personalizar mensajes:** Edita `lib/services/inbox/FollowUpGenerator.ts` para cambiar el texto de las auto-respuestas
3. **Integrar con proveedores:** Configura SendGrid/Twilio para enviar mensajes reales

