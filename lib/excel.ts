import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export interface ExcelProduct {
  'Nombre del Producto': string
  'Descripción': string
  'Categoría': string
  'Cantidad': number
  'Unidad': string
  'Especificaciones': string
  'Presupuesto (opcional)': number
}

export function generateExcelTemplate() {
  // Datos de ejemplo para la plantilla
  const templateData: ExcelProduct[] = [
    {
      'Nombre del Producto': 'Tornillos M6x20',
      'Descripción': 'Tornillos de acero inoxidable',
      'Categoría': 'Herramientas',
      'Cantidad': 100,
      'Unidad': 'pcs',
      'Especificaciones': 'Acero inoxidable 316, cabeza hexagonal',
      'Presupuesto (opcional)': 500
    },
    {
      'Nombre del Producto': 'Tuercas M6',
      'Descripción': 'Tuercas de acero inoxidable',
      'Categoría': 'Herramientas',
      'Cantidad': 100,
      'Unidad': 'pcs',
      'Especificaciones': 'Acero inoxidable 316, hexagonal',
      'Presupuesto (opcional)': 300
    },
    {
      'Nombre del Producto': 'Arandelas planas M6',
      'Descripción': 'Arandelas de acero inoxidable',
      'Categoría': 'Herramientas',
      'Cantidad': 200,
      'Unidad': 'pcs',
      'Especificaciones': 'Acero inoxidable 316, 0.5mm espesor',
      'Presupuesto (opcional)': 100
    }
  ]

  // Crear hoja de trabajo
  const ws = XLSX.utils.json_to_sheet(templateData)
  
  // Ajustar ancho de columnas
  const colWidths = [
    { wch: 25 }, // Nombre del Producto
    { wch: 30 }, // Descripción
    { wch: 15 }, // Categoría
    { wch: 10 }, // Cantidad
    { wch: 10 }, // Unidad
    { wch: 40 }, // Especificaciones
    { wch: 15 }  // Presupuesto
  ]
  ws['!cols'] = colWidths

  // Crear libro de trabajo
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Requerimientos')

  // Agregar hoja de instrucciones
  const instructionsData = [
    ['INSTRUCCIONES PARA COMPLETAR LA PLANTILLA'],
    [''],
    ['1. Complete la información de cada producto en las filas correspondientes'],
    ['2. Los campos marcados con * son obligatorios'],
    ['3. Categorías disponibles: Herramientas, Materiales, Equipos, Insumos, Otros'],
    ['4. Unidades disponibles: pcs, kg, m, m2, l, unidad'],
    ['5. El presupuesto es opcional pero recomendado'],
    ['6. Elimine las filas de ejemplo antes de enviar'],
    ['7. Guarde el archivo como .xlsx antes de subirlo'],
    [''],
    ['FORMATO DE ARCHIVO:'],
    ['- Nombre del archivo: requerimientos_YYYYMMDD.xlsx'],
    ['- Formato: Excel (.xlsx)'],
    ['- Tamaño máximo: 10MB'],
    ['- Máximo de productos: 1000']
  ]

  const instructionsWs = XLSX.utils.aoa_to_sheet(instructionsData)
  instructionsWs['!cols'] = [{ wch: 60 }]
  XLSX.utils.book_append_sheet(wb, instructionsWs, 'Instrucciones')

  // Generar archivo
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const data = new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  })
  
  const fileName = `plantilla_requerimientos_${new Date().toISOString().split('T')[0]}.xlsx`
  saveAs(data, fileName)
}

export function parseExcelFile(file: File): Promise<ExcelProduct[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as ExcelProduct[]
        
        // Validar que tenga las columnas correctas
        const requiredColumns = [
          'Nombre del Producto',
          'Descripción', 
          'Categoría',
          'Cantidad',
          'Unidad',
          'Especificaciones',
          'Presupuesto (opcional)'
        ]
        
        if (jsonData.length === 0) {
          reject(new Error('El archivo está vacío'))
          return
        }
        
        const firstRow = jsonData[0]
        const hasRequiredColumns = requiredColumns.every(col => col in firstRow)
        
        if (!hasRequiredColumns) {
          reject(new Error('El archivo no tiene el formato correcto. Descargue la plantilla oficial.'))
          return
        }
        
        // Filtrar filas vacías y validar datos
        const validData = jsonData.filter(row => 
          row['Nombre del Producto'] && 
          row['Nombre del Producto'].toString().trim() !== ''
        ).map(row => ({
          ...row,
          'Cantidad': parseInt(row['Cantidad']?.toString()) || 1,
          'Presupuesto (opcional)': parseFloat(row['Presupuesto (opcional)']?.toString()) || 0
        }))
        
        if (validData.length === 0) {
          reject(new Error('No se encontraron productos válidos en el archivo'))
          return
        }
        
        resolve(validData)
      } catch (error) {
        reject(new Error('Error al procesar el archivo Excel'))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'))
    }
    
    reader.readAsArrayBuffer(file)
  })
}
