// Constants for Naova Procurement OS

export const REQUEST_SOURCES = {
  WHATSAPP: 'whatsapp',
  EMAIL: 'email',
  WEB: 'web',
  CHAT: 'chat',
  FILE: 'file',
  API: 'api',
} as const

export const REQUEST_STATUSES = {
  NEW_REQUEST: 'new_request',
  INCOMPLETE_INFORMATION: 'incomplete_information',
  READY_FOR_SUPPLIER_MATCHING: 'ready_for_supplier_matching',
  SUPPLIER_MATCHING: 'supplier_matching',
  RFQ_SENT: 'rfq_sent',
  QUOTES_RECEIVED: 'quotes_received',
  SELECTING_QUOTE: 'selecting_quote',
  QUOTE_SELECTED: 'quote_selected',
  PO_CREATED: 'po_created',
  IN_PROGRESS: 'in_progress',
  DELIVERED: 'delivered',
  CLOSED: 'closed',
  CANCELLED: 'cancelled',
} as const

export const PIPELINE_STAGES = {
  NEW_REQUEST: 'new_request',
  NEEDS_INFO: 'needs_info',
  FINDING_SUPPLIERS: 'finding_suppliers',
  QUOTES_IN_PROGRESS: 'quotes_in_progress',
  SELECTING_QUOTE: 'selecting_quote',
  PURCHASE_IN_PROGRESS: 'purchase_in_progress',
  DELIVERED: 'delivered',
  CLOSED: 'closed',
} as const

export const URGENCY_LEVELS = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent',
} as const

export const PO_STATUSES = {
  APPROVED_BY_CLIENT: 'approved_by_client',
  PURCHASE_ORDER_CREATED: 'purchase_order_created',
  PAYMENT_PENDING: 'payment_pending',
  PAYMENT_RECEIVED: 'payment_received',
  SUPPLIER_CONFIRMED: 'supplier_confirmed',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
  CLOSED: 'closed',
  CANCELLED: 'cancelled',
} as const

export const QUOTE_STATUSES = {
  PENDING: 'pending',
  SUBMITTED: 'submitted',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
} as const

export const RFQ_STATUSES = {
  DRAFT: 'draft',
  SENT: 'sent',
  IN_PROGRESS: 'in_progress',
  CLOSED: 'closed',
  CANCELLED: 'cancelled',
} as const

// Unit normalization mapping
export const UNIT_NORMALIZATION: Record<string, string> = {
  // Weight
  'kg': 'kg',
  'kilogramos': 'kg',
  'kilogram': 'kg',
  'kilos': 'kg',
  'g': 'g',
  'gramos': 'g',
  'gram': 'g',
  'lb': 'lb',
  'libras': 'lb',
  'pounds': 'lb',
  
  // Volume
  'l': 'l',
  'litros': 'l',
  'liters': 'l',
  'ml': 'ml',
  'mililitros': 'ml',
  'milliliters': 'ml',
  'gal': 'gal',
  'galones': 'gal',
  'gallons': 'gal',
  
  // Length
  'm': 'm',
  'metros': 'm',
  'meters': 'm',
  'cm': 'cm',
  'centimetros': 'cm',
  'centimeters': 'cm',
  'mm': 'mm',
  'milimetros': 'mm',
  'millimeters': 'mm',
  'ft': 'ft',
  'pies': 'ft',
  'feet': 'ft',
  'in': 'in',
  'pulgadas': 'in',
  'inches': 'in',
  
  // Count
  'pcs': 'pcs',
  'piezas': 'pcs',
  'pieces': 'pcs',
  'unidades': 'pcs',
  'units': 'pcs',
  'un': 'pcs',
  'ud': 'pcs',
  
  // Area
  'm2': 'm2',
  'metros cuadrados': 'm2',
  'square meters': 'm2',
  'm²': 'm2',
  
  // Time
  'horas': 'hours',
  'hours': 'hours',
  'dias': 'days',
  'days': 'days',
  'semanas': 'weeks',
  'weeks': 'weeks',
}

// Category mappings
export const CATEGORY_MAPPINGS: Record<string, string[]> = {
  'materiales': ['materia prima', 'raw materials', 'materials'],
  'herramientas': [
    'tools', 'equipos', 'equipment',
    'tornillo', 'tornillos', 'tuerca', 'tuercas', 'arandela', 'arandelas',
    'perno', 'pernos', 'herramienta', 'herramientas',
    'máquina', 'maquina', 'máquinas', 'maquinas',
    'sellado', 'empaque', 'empaquetado', 'empaquetadora',
    'bolsas', 'selladora', 'sellador'
  ],
  'seguridad': ['safety', 'epi', 'ppe', 'equipos de seguridad'],
  'consumibles': ['consumables', 'supplies', 'insumos'],
  'refacciones': ['spare parts', 'repuestos', 'parts'],
  'servicios': [
    'services', 'servicios',
    'mantenimiento', 'servicio de mantenimiento',
    'reparar', 'reparación', 'revisión', 'instalación',
    'servicio técnico', 'técnico'
  ],
}

