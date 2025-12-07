// Reglas de categorías y campos mínimos para tipos de requerimiento

export type FieldId =
  | 'quantity'
  | 'unit'
  | 'deliveryDate'
  | 'deliveryLocation'
  | 'brand'
  | 'model'
  | 'serviceScope'
  | 'equipmentType'

export interface RequestFieldRule {
  id: FieldId
  label: string
  description: string
  required: boolean
  examples: string[]
}

export interface RequestCategoryRule {
  // Debe coincidir (o mapearse fácilmente) con la categoría de ClassificationService
  id: string
  name: string
  description: string
  // Palabras clave adicionales para detección / documentación
  keywords: string[]
  fields: RequestFieldRule[]
}

// Reglas iniciales - se pueden editar con el tiempo
export const REQUEST_CATEGORY_RULES: RequestCategoryRule[] = [
  {
    id: 'herramientas', // hoy clasificador ya usa 'herramientas'
    name: 'Herramientas / Tornillería',
    description:
      'Compras de tornillería, herramientas y componentes mecánicos simples (tornillos, tuercas, arandelas, etc.).',
    keywords: ['tornillo', 'tornillos', 'tuerca', 'arandela', 'perno', 'herramienta'],
    fields: [
      {
        id: 'quantity',
        label: 'Cantidad',
        description: '¿Cuántas piezas se necesitan en total?',
        required: true,
        examples: ['50', '100', '250'],
      },
      {
        id: 'unit',
        label: 'Unidad',
        description: 'Unidad de la cantidad (piezas, cajas, juegos, etc.).',
        required: true,
        examples: ['piezas', 'pzas', 'caja', 'juego'],
      },
      {
        id: 'brand',
        label: 'Marca (opcional)',
        description: 'Marca preferida, si es importante.',
        required: false,
        examples: ['Truper', 'Urrea', 'Otra marca equivalente'],
      },
      {
        id: 'model',
        label: 'Modelo / Norma (opcional)',
        description:
          'Modelo exacto, norma (DIN, ANSI, etc.) o cualquier referencia técnica si la tienes.',
        required: false,
        examples: ['DIN 933 M8x20', 'ANSI B18.2.1'],
      },
      {
        id: 'deliveryDate',
        label: 'Fecha límite deseada (opcional)',
        description: 'Cuándo necesitas el material para operar sin problema.',
        required: false,
        examples: ['antes del 15 de junio', 'esta semana', 'lo más pronto posible'],
      },
      {
        id: 'deliveryLocation',
        label: 'Lugar de entrega (opcional)',
        description: 'Planta o dirección donde se entregará el material.',
        required: false,
        examples: ['Planta Monterrey', 'CDMX', 'Nave 3 Parque Industrial X'],
      },
    ],
  },
  {
    id: 'servicios',
    name: 'Servicios / Mantenimiento',
    description:
      'Servicios de mantenimiento, reparación, instalación o trabajos especializados en sitio.',
    keywords: [
      'mantenimiento',
      'servicio',
      'reparar',
      'revisión',
      'instalación',
      'servicio técnico',
    ],
    fields: [
      {
        id: 'equipmentType',
        label: 'Equipo o sistema a atender',
        description: 'Qué equipo, línea o sistema requiere el servicio.',
        required: true,
        examples: ['Compresor de aire', 'Montacargas', 'Línea de empaque'],
      },
      {
        id: 'serviceScope',
        label: 'Alcance del servicio',
        description:
          'Qué esperas que haga el proveedor (mantenimiento preventivo, correctivo, inspección, etc.).',
        required: true,
        examples: ['Mantenimiento preventivo completo', 'Revisión y diagnóstico', 'Reparación'],
      },
      {
        id: 'deliveryLocation',
        label: 'Ubicación del servicio',
        description: 'Dónde se encuentra el equipo o dónde se realizará el trabajo.',
        required: true,
        examples: ['Planta Monterrey', 'Sucursal Guadalajara'],
      },
      {
        id: 'deliveryDate',
        label: 'Fecha límite / ventana de servicio',
        description: 'Cuándo necesitas que se haga el trabajo o ventana disponible.',
        required: false,
        examples: ['esta semana', 'antes del 30 de mayo', 'fin de semana'],
      },
      {
        id: 'quantity',
        label: 'Cantidad de equipos (opcional)',
        description: 'Número de equipos o puntos a atender.',
        required: false,
        examples: ['1 equipo', '3 montacargas', 'toda la línea 2'],
      },
    ],
  },
]

export function findCategoryRule(category: string | null | undefined): RequestCategoryRule | null {
  if (!category) return null
  const rule = REQUEST_CATEGORY_RULES.find((r) => r.id === category)
  return rule || null
}


