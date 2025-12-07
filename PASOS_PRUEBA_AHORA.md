# 🚀 Pasos para Ejecutar las Pruebas AHORA

## Paso 1: Iniciar el Servidor

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npm run dev
```

**Espera a ver este mensaje:**
```
✓ Ready in X seconds
○ Local: http://localhost:3000
```

**✅ Cuando veas eso, el servidor está listo.**

---

## Paso 2: Abrir el Navegador

Abre tu navegador y ve a:
```
http://localhost:3000
```

Deberías ver la página de Naova.

---

## Paso 3: Ejecutar Pruebas

### Prueba 1: Email (Simulado)

En una **nueva terminal** (deja el servidor corriendo), ejecuta:

```bash
npm run tsx scripts/probar-webhook-email.ts
```

**Deberías ver:**
- ✅ Cliente encontrado
- ✅ Webhook procesado exitosamente
- ✅ Request creado
- ✅ Mensaje de auto-respuesta generado

---

### Prueba 2: WhatsApp (Simulado)

En la misma terminal, ejecuta:

```bash
npm run tsx scripts/probar-webhook-whatsapp.ts
```

**Deberías ver:**
- ✅ Cliente encontrado
- ✅ Webhook procesado exitosamente
- ✅ Request creado
- ✅ Mensaje de auto-respuesta generado

---

### Prueba 3: Plataforma Web (Real)

1. Ve a `http://localhost:3000/login`
2. Inicia sesión como cliente (ej: `juan@abc.com`)
3. Ve a `http://localhost:3000/app/requests`
4. Escribe: `Necesito tornillos`
5. Haz clic en "Enviar a Naova"

---

## Paso 4: Verificar Resultados

### En el Panel de Admin:

1. Ve a `http://localhost:3000/admin/requests`
2. Inicia sesión como admin (si no estás logueado)
3. Deberías ver:
   - ✅ Request con source "Email"
   - ✅ Request con source "WhatsApp"
   - ✅ Request con source "Plataforma" (si lo creaste)
   - ✅ Cada uno con su "Mensaje sugerido para pedir información faltante"

---

## 🐛 Si algo no funciona

### "No se encontró ningún cliente registrado"

**Solución:**
1. Ve a `http://localhost:3000/admin/users`
2. Crea un cliente con:
   - Email (para probar email)
   - Teléfono (para probar WhatsApp)
   - Role: `client_enterprise`
   - Active: `true`

### "Error al procesar webhook"

**Solución:**
1. Verifica que el servidor esté corriendo (`npm run dev`)
2. Verifica que veas `Ready` en la consola
3. Espera unos segundos y vuelve a intentar

### El servidor no inicia

**Solución:**
1. Verifica que tengas Node.js instalado: `node --version`
2. Instala dependencias: `npm install`
3. Verifica que `DATABASE_URL` esté en `.env`

---

## ✅ Checklist Final

Después de ejecutar las pruebas:

- [ ] Servidor corriendo en `http://localhost:3000`
- [ ] Request de Email aparece en `/admin/requests`
- [ ] Request de WhatsApp aparece en `/admin/requests`
- [ ] Request de Plataforma aparece en `/admin/requests` (si lo creaste)
- [ ] Cada request muestra el source correcto
- [ ] Requests incompletos muestran "Mensaje sugerido"
- [ ] El toggle de auto-respuesta está visible

---

## 🎉 ¡Listo!

Si todos los checks pasan, el sistema está funcionando correctamente.

