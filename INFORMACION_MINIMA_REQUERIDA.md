# 📋 Información Mínima Requerida para Request Completo

## 🎯 Regla General

Un request se marca como **COMPLETO** cuando:
- ✅ Tiene todos los campos **requeridos** (`required: true`)
- ❌ NO se marca como completo si falta algún campo requerido

---

## 🔧 CATEGORÍA: Herramientas / Tornillería

**Palabras clave:** tornillo, tornillos, tuerca, arandela, perno, herramienta

### ✅ Campos REQUERIDOS (Mínimo indispensable):

1. **Cantidad** (`quantity`)
   - ¿Cuántas piezas se necesitan en total?
   - Ejemplos: "50", "100", "250"
   - ✅ DEBE estar presente

2. **Unidad** (`unit`)
   - Unidad de la cantidad (piezas, cajas, juegos, etc.)
   - Ejemplos: "piezas", "pzas", "caja", "juego"
   - ✅ DEBE estar presente

### ❌ Campos OPCIONALES (NO bloquean completitud):

- **Marca** (`brand`) - Opcional
- **Modelo / Norma** (`model`) - Opcional
- **Fecha límite deseada** (`deliveryDate`) - Opcional
- **Lugar de entrega** (`deliveryLocation`) - Opcional

### 📝 Ejemplo de Request COMPLETO:

```
"Necesito 100 piezas de tornillos hexagonales"
```

✅ Tiene: `quantity` (100) y `unit` (piezas) → **COMPLETO**

---

## 🛠️ CATEGORÍA: Servicios / Mantenimiento

**Palabras clave:** mantenimiento, servicio, reparar, revisión, instalación, servicio técnico

### ✅ Campos REQUERIDOS (Mínimo indispensable):

1. **Equipo o sistema a atender** (`equipmentType`)
   - Qué equipo, línea o sistema requiere el servicio
   - Ejemplos: "Compresor de aire", "Montacargas", "Línea de empaque"
   - ✅ DEBE estar presente

2. **Alcance del servicio** (`serviceScope`)
   - Qué esperas que haga el proveedor
   - Ejemplos: "Mantenimiento preventivo completo", "Revisión y diagnóstico", "Reparación"
   - ✅ DEBE estar presente

3. **Ubicación del servicio** (`deliveryLocation`)
   - Dónde se encuentra el equipo o dónde se realizará el trabajo
   - Ejemplos: "Planta Monterrey", "Sucursal Guadalajara"
   - ✅ DEBE estar presente

### ❌ Campos OPCIONALES (NO bloquean completitud):

- **Fecha límite / ventana de servicio** (`deliveryDate`) - Opcional
- **Cantidad de equipos** (`quantity`) - Opcional

### 📝 Ejemplo de Request COMPLETO:

```
"Necesito mantenimiento preventivo para compresor de aire en Planta Monterrey"
```

✅ Tiene: `equipmentType` (compresor de aire), `serviceScope` (mantenimiento preventivo), `deliveryLocation` (Planta Monterrey) → **COMPLETO**

---

## 📊 Resumen por Categoría

| Categoría | Campos Requeridos | Ejemplo Mínimo |
|-----------|-------------------|----------------|
| **Herramientas / Tornillería** | `quantity` + `unit` | "100 piezas de tornillos" |
| **Servicios / Mantenimiento** | `equipmentType` + `serviceScope` + `deliveryLocation` | "Mantenimiento para compresor en Planta Monterrey" |

---

## 🔍 Cómo Funciona la Detección

El sistema usa estas heurísticas para detectar campos:

### Para `quantity` (Cantidad):
- ✅ Detecta números: "100", "50", "250"
- ✅ En formato: "100 piezas", "50 unidades"

### Para `unit` (Unidad):
- ✅ Detecta palabras: "piezas", "pzas", "cajas", "juegos", "unidades"

### Para `equipmentType`:
- ✅ Detecta nombres de equipos mencionados

### Para `serviceScope`:
- ✅ Detecta palabras clave: "mantenimiento", "reparación", "revisión", "instalación"

### Para `deliveryLocation`:
- ✅ Detecta nombres de lugares/ubicaciones

---

## ⚠️ Nota Importante

- Si falta **CUALQUIER** campo requerido → Request queda como **INCOMPLETO**
- Solo cuando **TODOS** los campos requeridos están presentes → Request pasa a **COMPLETO**
- Los campos opcionales **NO** bloquean la completitud

---

## 🧪 Pruebas Recomendadas

### Para Herramientas:
- ✅ "100 piezas" → Completo (tiene quantity + unit)
- ❌ "necesito tornillos" → Incompleto (falta quantity y unit)
- ❌ "100 tornillos" → Incompleto (falta unit explícito, aunque puede inferirse)

### Para Servicios:
- ✅ "Mantenimiento de compresor en Planta Monterrey" → Completo
- ❌ "Necesito mantenimiento" → Incompleto (faltan equipmentType y deliveryLocation)
- ❌ "Mantenimiento de compresor" → Incompleto (falta deliveryLocation)

