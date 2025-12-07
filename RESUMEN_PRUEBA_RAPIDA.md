# ⚡ Resumen Rápido: Cómo Probar el Sistema

## 🎯 Objetivo

Probar que el sistema recibe requerimientos por **WhatsApp**, **Email** y **Plataforma**, los analiza y genera auto-respuestas cuando falta información.

---

## ✅ Estado Actual

**TODO ESTÁ LISTO** ✅

- ✅ Webhooks implementados
- ✅ Auto-respuestas funcionando
- ✅ Análisis de reglas activo
- ✅ Scripts de prueba listos

---

## 🚀 Prueba Rápida (3 Opciones)

### 1️⃣ WhatsApp (Simulado)

```bash
npx tsx scripts/probar-webhook-whatsapp.ts
```

**Qué hace:**
- Busca un cliente con teléfono
- Simula un mensaje de WhatsApp: "Necesito tornillos"
- Crea el request en la base de datos
- Genera auto-respuesta automáticamente (si está incompleto)

**Verificar:**
- Ve a `/admin/requests` → Deberías ver el request con source "WhatsApp"
- Deberías ver el "Mensaje sugerido para pedir información faltante"

---

### 2️⃣ Email (Simulado)

```bash
npx tsx scripts/probar-webhook-email.ts
```

**Qué hace:**
- Busca un cliente con email
- Simula un email: "Necesito tornillos"
- Crea el request en la base de datos
- Genera auto-respuesta automáticamente (si está incompleto)

**Verificar:**
- Ve a `/admin/requests` → Deberías ver el request con source "Email"
- Deberías ver el "Mensaje sugerido para pedir información faltante"

---

### 3️⃣ Plataforma Web

1. Ve a `http://localhost:3000/login`
2. Inicia sesión como cliente
3. Ve a `/app/requests`
4. Escribe: `Necesito tornillos`
5. Haz clic en "Enviar a Naova"

**Verificar:**
- Ve a `/admin/requests` → Deberías ver el request con source "Plataforma"
- Deberías ver el "Mensaje sugerido para pedir información faltante"

---

## 📊 Verificar Auto-Respuesta

### En `/admin/requests`:

1. Busca un request con estado `INCOMPLETE_INFORMATION`
2. Deberías ver:
   - **"Mensaje sugerido para pedir información faltante"** con el texto
   - **Toggle "Activar respuesta automática"** (activado por defecto)

### En la Base de Datos:

```sql
-- Ver mensajes de auto-respuesta generados
SELECT 
  r.id,
  r.source,
  r.status,
  r."rawContent",
  m.content as mensaje_auto_respuesta
FROM "Request" r
LEFT JOIN "Message" m ON m."requestId" = r.id AND m.direction = 'outbound'
WHERE r.status = 'INCOMPLETE_INFORMATION'
ORDER BY r."createdAt" DESC
LIMIT 5;
```

---

## 🎯 Ejemplos de Requerimientos

### Incompleto (genera auto-respuesta):
```
Necesito tornillos
```
→ Falta: cantidad, especificaciones, ubicación

### Más Completo:
```
Necesito 100 tornillos de acero inoxidable, M8x20mm, para Monterrey antes del 15 de junio
```
→ Puede que no genere auto-respuesta (depende de las reglas)

### Servicio (incompleto):
```
Quiero servicio de mantenimiento
```
→ Falta: tipo, frecuencia, presupuesto

---

## ⚠️ Requisitos

1. **Servidor corriendo:**
   ```bash
   npm run dev
   ```

2. **Cliente registrado:**
   - Para WhatsApp: debe tener teléfono
   - Para Email: debe tener email
   - Debe tener `role='client_enterprise'` y `active=true`

3. **Base de datos conectada:**
   - Verifica `DATABASE_URL` en `.env`

---

## 🐛 Si algo no funciona

### "No se encontró ningún cliente"
→ Crea un cliente desde `/admin/users` o en Supabase

### "Error al procesar webhook"
→ Verifica que el servidor esté corriendo (`npm run dev`)

### No se genera auto-respuesta
→ Verifica que el requerimiento esté incompleto (falten campos)

---

## ✅ Checklist

Después de probar las 3 opciones:

- [ ] Request de WhatsApp aparece en `/admin/requests`
- [ ] Request de Email aparece en `/admin/requests`
- [ ] Request de Plataforma aparece en `/admin/requests`
- [ ] Cada request muestra el source correcto
- [ ] Requests incompletos muestran "Mensaje sugerido"
- [ ] Requests incompletos tienen mensaje en tabla `Message`

---

## 📚 Documentación Completa

Para más detalles, ver: `GUIA_PRUEBA_COMPLETA.md`

