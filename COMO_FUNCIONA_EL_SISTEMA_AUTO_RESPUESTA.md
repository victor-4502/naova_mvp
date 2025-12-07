# 🧠 Cómo Funciona el Sistema de Auto-Respuesta

## 📋 Resumen

**NO usa IA externa.** Todo funciona con **reglas predefinidas** en código. Aquí te explico paso a paso cómo funciona.

---

## 🔄 Flujo Completo del Sistema

### 1️⃣ **Clasificación por Keywords** (NO IA)

**Archivo:** `lib/utils/constants.ts` - `CATEGORY_MAPPINGS`

```typescript
'servicios': [
  'services', 'servicios',
  'mantenimiento',      // ← Busca estas palabras en el mensaje
  'reparar', 'revisión', 'instalación',
  'servicio técnico'
]
```

**Cómo funciona:**
- Busca si el mensaje contiene alguna de estas palabras
- Si encuentra "mantenimiento" → categoría = "servicios"
- Si encuentra "tornillos" → categoría = "herramientas"

---

### 2️⃣ **Reglas por Categoría** (NO IA)

**Archivo:** `lib/rules/requestSchemas.ts` - `REQUEST_CATEGORY_RULES`

Cada categoría tiene campos requeridos definidos en código:

```typescript
{
  id: 'servicios',
  name: 'Servicios / Mantenimiento',
  fields: [
    {
      id: 'equipmentType',
      label: 'Equipo o sistema a atender',
      required: true,  // ← Este campo es obligatorio
      examples: ['Compresor de aire', 'Montacargas']
    },
    {
      id: 'serviceScope',
      label: 'Alcance del servicio',
      required: true,  // ← Este también es obligatorio
    },
    {
      id: 'deliveryLocation',
      label: 'Ubicación del servicio',
      required: true,  // ← Y este también
    },
    // ...
  ]
}
```

**Esto es código puro, no IA.**

---

### 3️⃣ **Detección de Campos Presentes** (Heurísticas Simples)

**Archivo:** `lib/services/inbox/RequestRuleEngine.ts`

El sistema detecta qué campos están presentes usando reglas simples:

```typescript
// ¿Hay cantidad?
const hasQuantity = extracted.quantities.length > 0 || 
                   (firstItem && firstItem.quantity > 0)

if (hasQuantity) presentFields.push('quantity')

// ¿Hay unidad?
const hasUnit = extracted.units.length > 0 || 
               (firstItem && firstItem.unit)

if (hasUnit) presentFields.push('unit')
```

**NOTA:** Esto es muy básico. Solo detecta `quantity` y `unit`. Para campos como `equipmentType`, `serviceScope`, etc., actualmente asume que **faltan** porque no hay parser para ellos.

---

### 4️⃣ **Cálculo de Campos Faltantes** (Lógica Simple)

```typescript
// Obtener campos requeridos de la regla
const requiredFieldIds = categoryRule.fields
  .filter(f => f.required)  // Solo los obligatorios
  .map(f => f.id)

// Comparar: requeridos vs presentes
const missingFields = requiredFieldIds.filter(
  fieldId => !presentFields.includes(fieldId)
)
```

**Ejemplo:**
- Categoría: "servicios"
- Campos requeridos: `['equipmentType', 'serviceScope', 'deliveryLocation']`
- Campos presentes: `[]` (ninguno)
- **Campos faltantes:** `['equipmentType', 'serviceScope', 'deliveryLocation']`

---

### 5️⃣ **Generación del Mensaje** (Plantilla Predefinida)

**Archivo:** `lib/services/inbox/FollowUpGenerator.ts`

El mensaje se genera usando una **plantilla fija**:

```typescript
const intro = `¡Gracias por tu mensaje! Detecté que quieres hacer un 
requerimiento relacionado con **${categoryRule.name}**. Para poder 
cotizarlo bien con proveedores, me falta lo siguiente:`

const bulletLines = missingFieldRules.map((field) => {
  return `- **${field.label}**: ${field.description}. 
          Ejemplos: ${field.examples.join(', ')}.`
})

const outro = 'Con esa información ya puedo estructurar bien el requerimiento...'

return [intro, '', ...bulletLines, '', outro].join('\n')
```

**NO es IA generando texto libre.** Es una plantilla que rellena con los datos de las reglas.

---

## 📊 Ejemplo Completo

### Mensaje Entrante:
```
"Necesito servicio de mantenimiento"
```

### Paso 1: Clasificación
- Busca "mantenimiento" en el mensaje → ✅ Encontrado
- Categoría identificada: `"servicios"`

### Paso 2: Buscar Regla
- Busca regla con `id: 'servicios'` → ✅ Encontrada
- Campos requeridos: `equipmentType`, `serviceScope`, `deliveryLocation`

### Paso 3: Detectar Campos Presentes
- Busca quantity → ❌ No encontrado
- Busca unit → ❌ No encontrado
- Busca equipmentType → ❌ No hay parser para esto
- **Campos presentes:** `[]` (ninguno)

### Paso 4: Calcular Campos Faltantes
- Requeridos: `['equipmentType', 'serviceScope', 'deliveryLocation']`
- Presentes: `[]`
- **Faltantes:** `['equipmentType', 'serviceScope', 'deliveryLocation']`

### Paso 5: Generar Mensaje
Usa la plantilla con los datos de la regla:

```
¡Gracias por tu mensaje! Detecté que quieres hacer un requerimiento 
relacionado con **Servicios / Mantenimiento**. Para poder cotizarlo 
bien con proveedores, me falta lo siguiente:

- **Equipo o sistema a atender**: Qué equipo, línea o sistema requiere 
  el servicio. Ejemplos: Compresor de aire, Montacargas, Línea de empaque.

- **Alcance del servicio**: Qué esperas que haga el proveedor 
  (mantenimiento preventivo, correctivo, inspección, etc.). Ejemplos: 
  Mantenimiento preventivo completo, Revisión y diagnóstico, Reparación.

- **Ubicación del servicio**: Dónde se encuentra el equipo o dónde se 
  realizará el trabajo. Ejemplos: Planta Monterrey, Sucursal Guadalajara.

Con esa información ya puedo estructurar bien el requerimiento y moverlo 
con los proveedores adecuados.
```

---

## ⚠️ Limitaciones Actuales

1. **Solo detecta quantity/unit automáticamente**
   - Para otros campos (equipmentType, serviceScope, etc.) asume que faltan
   - No hay parser avanzado para detectarlos en el texto

2. **No usa IA para entender contexto**
   - Solo busca keywords simples
   - No entiende sinónimos ni variaciones

3. **Mensaje es plantilla fija**
   - No genera texto libre
   - Solo rellena una plantilla predefinida

---

## 🔮 Futuras Mejoras (Opcionales)

El código tiene comentarios que dicen:
```typescript
// (En el futuro se puede enriquecer con normalizedContent / IA externa)
```

Esto significa que **se puede agregar IA externa** en el futuro, pero **actualmente NO la usa**.

---

## 📝 Resumen

| Componente | ¿Usa IA? | ¿Cómo funciona? |
|-----------|---------|-----------------|
| Clasificación de categoría | ❌ NO | Busca keywords en el texto |
| Reglas de campos | ❌ NO | Definidas en código |
| Detección de campos presentes | ❌ NO | Heurísticas simples (quantity/unit) |
| Cálculo de campos faltantes | ❌ NO | Compara requeridos vs presentes |
| Generación de mensaje | ❌ NO | Plantilla predefinida |

**Todo funciona con reglas y lógica predefinida. NO hay IA externa.**

---

## 🎯 Por Qué Esto Es Importante

- ✅ **Rápido** - No depende de APIs externas
- ✅ **Predecible** - Siempre genera el mismo tipo de mensaje
- ✅ **Configurable** - Puedes editar las reglas en código
- ✅ **Sin costos** - No pagas por tokens de IA

**Pero** requiere que las reglas estén bien definidas para cada categoría.

