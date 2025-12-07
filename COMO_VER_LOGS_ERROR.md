# 🔍 Cómo Ver los Logs del Error 500

## ⚠️ El Error Persiste

Si sigues viendo el error 500, **necesitas ver los logs del servidor** para diagnosticar el problema.

## 📋 Pasos para Ver los Logs

### 1. Abre la Terminal del Servidor

**NO** uses la consola del navegador (F12). Necesitas la **terminal donde corre `npm run dev`**.

### 2. Busca los Logs

Cuando intentas enviar un mensaje, deberías ver en la terminal algo como:

```
[Create Message] Request source: email
[Create Message] Creating message with: { ... }
```

Si hay un error, verás:

```
Error al crear mensaje: ...
Error completo: { message: '...', stack: '...' }
Error de Prisma: { code: '...', meta: {...} }
```

### 3. Copia los Logs Completos

**Copia TODO** lo que aparece en la terminal cuando ocurre el error, especialmente:
- `[Create Message] Request source: ...`
- `Error completo: ...`
- `Error de Prisma: ...`

## 🔧 Posibles Problemas

### Problema 1: Columna Faltante en la Base de Datos

Si ves un error como:
```
The column X does not exist in the current database
```

**Solución:** Ejecuta las migraciones SQL que se proporcionaron anteriormente.

### Problema 2: Tipo de Enum Incorrecto

Si ves un error como:
```
Invalid value for enum MessageSource
```

**Solución:** El código ya maneja esto, pero si persiste, verifica que el `request.source` sea válido.

### Problema 3: Constraint Violation

Si ves un error como:
```
Null constraint violation
```

**Solución:** Verifica que todos los campos requeridos estén presentes.

## 📝 Qué Hacer Ahora

1. **Abre la terminal del servidor** (donde corre `npm run dev`)
2. **Intenta enviar el mensaje de nuevo**
3. **Copia TODO lo que aparece en la terminal**
4. **Compártelo** para diagnosticar el problema

## 🚨 Importante

- Los logs del **navegador** (F12) solo muestran el error HTTP
- Los logs del **servidor** (terminal) muestran el error real de Prisma/Node.js
- **Necesitas los logs del servidor** para diagnosticar

