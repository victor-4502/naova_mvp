import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

// Tipos para exportación
export interface ExportData {
  [key: string]: any
}

export interface ExportOptions {
  filename: string
  sheetName?: string
  format: 'excel' | 'csv'
}

export interface PDFExportOptions {
  title: string
  data: ExportData[]
  columns: Array<{
    key: string
    label: string
    width?: number
  }>
  filename: string
}

// Función para exportar a Excel
export function exportToExcel(data: ExportData[], options: ExportOptions) {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    
    XLSX.utils.book_append_sheet(
      workbook, 
      worksheet, 
      options.sheetName || 'Datos'
    )

    // Ajustar ancho de columnas
    const colWidths = Object.keys(data[0] || {}).map(key => ({
      wch: Math.max(key.length, 15)
    }))
    worksheet['!cols'] = colWidths

    const excelBuffer = XLSX.write(workbook, { 
      bookType: 'xlsx', 
      type: 'array' 
    })
    
    const blob = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    
    saveAs(blob, `${options.filename}.xlsx`)
  } catch (error) {
    console.error('Error exporting to Excel:', error)
    throw new Error('Error al exportar a Excel')
  }
}

// Función para exportar a CSV
export function exportToCSV(data: ExportData[], options: ExportOptions) {
  try {
    if (data.length === 0) {
      throw new Error('No hay datos para exportar')
    }

    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header]
          // Escapar comillas y envolver en comillas si contiene comas
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value
        }).join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, `${options.filename}.csv`)
  } catch (error) {
    console.error('Error exporting to CSV:', error)
    throw new Error('Error al exportar a CSV')
  }
}

// Función para generar PDF simple (usando canvas)
export function exportToPDF(options: PDFExportOptions) {
  try {
    // Crear un canvas para generar el PDF
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      throw new Error('No se pudo crear el contexto del canvas')
    }

    // Configurar el canvas
    canvas.width = 800
    canvas.height = 600
    
    // Configurar el contexto
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Título
    ctx.fillStyle = '#000000'
    ctx.font = 'bold 24px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(options.title, canvas.width / 2, 40)
    
    // Fecha de generación
    ctx.font = '12px Arial'
    ctx.fillText(
      `Generado el: ${new Date().toLocaleDateString()}`, 
      canvas.width / 2, 
      70
    )
    
    // Tabla de datos
    const startY = 100
    const rowHeight = 30
    const colWidth = canvas.width / options.columns.length
    
    // Encabezados
    ctx.fillStyle = '#f3f4f6'
    ctx.fillRect(0, startY, canvas.width, rowHeight)
    
    ctx.fillStyle = '#000000'
    ctx.font = 'bold 14px Arial'
    ctx.textAlign = 'left'
    
    options.columns.forEach((col, index) => {
      const x = index * colWidth + 10
      ctx.fillText(col.label, x, startY + 20)
    })
    
    // Datos
    ctx.font = '12px Arial'
    options.data.slice(0, 15).forEach((row, rowIndex) => { // Limitar a 15 filas para el PDF
      const y = startY + (rowIndex + 1) * rowHeight
      
      // Alternar colores de fila
      if (rowIndex % 2 === 0) {
        ctx.fillStyle = '#f9fafb'
        ctx.fillRect(0, y, canvas.width, rowHeight)
      }
      
      ctx.fillStyle = '#000000'
      options.columns.forEach((col, colIndex) => {
        const x = colIndex * colWidth + 10
        const value = String(row[col.key] || '')
        ctx.fillText(value, x, y + 20)
      })
    })
    
    // Convertir canvas a blob y descargar
    canvas.toBlob((blob) => {
      if (blob) {
        saveAs(blob, `${options.filename}.pdf`)
      }
    }, 'application/pdf')
    
  } catch (error) {
    console.error('Error exporting to PDF:', error)
    throw new Error('Error al exportar a PDF')
  }
}

// Función para exportar reporte de compras del cliente
export function exportClientReport(data: any, format: 'excel' | 'csv' | 'pdf') {
  const filename = `reporte_compras_${new Date().toISOString().split('T')[0]}`
  
  if (format === 'excel') {
    const excelData = [
      // Resumen
      { Métrica: 'Total Compras', Valor: data.resumen.totalCompras },
      { Métrica: 'Monto Total', Valor: `$${data.resumen.montoTotal.toLocaleString()}` },
      { Métrica: 'Ahorro Total', Valor: `$${data.resumen.ahorroTotal.toLocaleString()}` },
      { Métrica: 'Licitaciones Activas', Valor: data.resumen.licitacionesActivas },
      { Métrica: 'Proveedores Frecuentes', Valor: data.resumen.proveedoresFrecuentes },
      { Métrica: '', Valor: '' }, // Línea en blanco
      
      // Compras por mes
      { Mes: 'Mes', Cantidad: 'Cantidad', Monto: 'Monto', Ahorro: 'Ahorro' },
      ...data.comprasPorMes.map((item: any) => ({
        Mes: item.mes,
        Cantidad: item.cantidad,
        Monto: `$${item.monto.toLocaleString()}`,
        Ahorro: `$${item.ahorro.toLocaleString()}`
      })),
      { Mes: '', Cantidad: '', Monto: '', Ahorro: '' }, // Línea en blanco
      
      // Productos más comprados
      { Producto: 'Producto', Cantidad: 'Cantidad', Monto: 'Monto', Frecuencia: 'Frecuencia' },
      ...data.comprasPorProducto.map((item: any) => ({
        Producto: item.producto,
        Cantidad: item.cantidad,
        Monto: `$${item.monto.toLocaleString()}`,
        Frecuencia: item.frecuencia
      }))
    ]
    
    exportToExcel(excelData, { filename, format: 'excel' })
  } else if (format === 'csv') {
    const csvData = [
      // Resumen
      { Métrica: 'Total Compras', Valor: data.resumen.totalCompras },
      { Métrica: 'Monto Total', Valor: `$${data.resumen.montoTotal.toLocaleString()}` },
      { Métrica: 'Ahorro Total', Valor: `$${data.resumen.ahorroTotal.toLocaleString()}` },
      { Métrica: 'Licitaciones Activas', Valor: data.resumen.licitacionesActivas },
      { Métrica: 'Proveedores Frecuentes', Valor: data.resumen.proveedoresFrecuentes }
    ]
    
    exportToCSV(csvData, { filename, format: 'csv' })
  } else if (format === 'pdf') {
    const pdfData = [
      { Métrica: 'Total Compras', Valor: data.resumen.totalCompras },
      { Métrica: 'Monto Total', Valor: `$${data.resumen.montoTotal.toLocaleString()}` },
      { Métrica: 'Ahorro Total', Valor: `$${data.resumen.ahorroTotal.toLocaleString()}` },
      { Métrica: 'Licitaciones Activas', Valor: data.resumen.licitacionesActivas },
      { Métrica: 'Proveedores Frecuentes', Valor: data.resumen.proveedoresFrecuentes }
    ]
    
    exportToPDF({
      title: 'Reporte de Compras del Cliente',
      data: pdfData,
      columns: [
        { key: 'Métrica', label: 'Métrica' },
        { key: 'Valor', label: 'Valor' }
      ],
      filename
    })
  }
}

// Función para exportar reporte global del admin
export function exportGlobalReport(data: any, format: 'excel' | 'csv' | 'pdf') {
  const filename = `reporte_global_${new Date().toISOString().split('T')[0]}`
  
  if (format === 'excel') {
    const excelData = [
      // KPIs
      { Métrica: 'Total Licitaciones', Valor: data.kpis.totalLicitaciones },
      { Métrica: 'Licitaciones Activas', Valor: data.kpis.licitacionesActivas },
      { Métrica: 'Licitaciones Cerradas', Valor: data.kpis.licitacionesCerradas },
      { Métrica: 'Clientes Activos', Valor: data.kpis.clientesActivos },
      { Métrica: 'Proveedores Activos', Valor: data.kpis.proveedoresActivos },
      { Métrica: 'Monto Total Transacciones', Valor: `$${data.kpis.montoTotalTransacciones.toLocaleString()}` },
      { Métrica: 'Ahorro Total Generado', Valor: `$${data.kpis.ahorroTotalGenerado.toLocaleString()}` },
      { Métrica: 'Ahorro Promedio', Valor: `${data.kpis.ahorroPromedio}%` },
      { Métrica: '', Valor: '' }, // Línea en blanco
      
      // Distribución por cliente
      { Cliente: 'Cliente', Licitaciones: 'Licitaciones', Monto: 'Monto', Ahorro: 'Ahorro' },
      ...data.distribucionPorCliente.map((item: any) => ({
        Cliente: item.cliente,
        Licitaciones: item.licitaciones,
        Monto: `$${item.monto.toLocaleString()}`,
        Ahorro: `$${item.ahorro.toLocaleString()}`
      })),
      { Cliente: '', Licitaciones: '', Monto: '', Ahorro: '' }, // Línea en blanco
      
      // Top proveedores
      { Proveedor: 'Proveedor', Licitaciones: 'Licitaciones', Monto: 'Monto', 'Tasa Éxito': 'Tasa Éxito' },
      ...data.topProveedores.map((item: any) => ({
        Proveedor: item.proveedor,
        Licitaciones: item.licitaciones,
        Monto: `$${item.monto.toLocaleString()}`,
        'Tasa Éxito': `${item.tasaExito}%`
      }))
    ]
    
    exportToExcel(excelData, { filename, format: 'excel' })
  } else if (format === 'csv') {
    const csvData = [
      { Métrica: 'Total Licitaciones', Valor: data.kpis.totalLicitaciones },
      { Métrica: 'Clientes Activos', Valor: data.kpis.clientesActivos },
      { Métrica: 'Proveedores Activos', Valor: data.kpis.proveedoresActivos },
      { Métrica: 'Monto Total Transacciones', Valor: `$${data.kpis.montoTotalTransacciones.toLocaleString()}` },
      { Métrica: 'Ahorro Total Generado', Valor: `$${data.kpis.ahorroTotalGenerado.toLocaleString()}` }
    ]
    
    exportToCSV(csvData, { filename, format: 'csv' })
  } else if (format === 'pdf') {
    const pdfData = [
      { Métrica: 'Total Licitaciones', Valor: data.kpis.totalLicitaciones },
      { Métrica: 'Clientes Activos', Valor: data.kpis.clientesActivos },
      { Métrica: 'Proveedores Activos', Valor: data.kpis.proveedoresActivos },
      { Métrica: 'Monto Total Transacciones', Valor: `$${data.kpis.montoTotalTransacciones.toLocaleString()}` },
      { Métrica: 'Ahorro Total Generado', Valor: `$${data.kpis.ahorroTotalGenerado.toLocaleString()}` }
    ]
    
    exportToPDF({
      title: 'Reporte Global de Administración',
      data: pdfData,
      columns: [
        { key: 'Métrica', label: 'Métrica' },
        { key: 'Valor', label: 'Valor' }
      ],
      filename
    })
  }
}

// Función para exportar datos de licitaciones
export function exportTendersData(tenders: any[], format: 'excel' | 'csv' | 'pdf') {
  const filename = `licitaciones_${new Date().toISOString().split('T')[0]}`
  
  const excelData = tenders.map(tender => ({
    'ID': tender.id,
    'Título': tender.title,
    'Estado': tender.status,
    'Cliente': tender.clientId,
    'Fecha Creación': new Date(tender.createdAt).toLocaleDateString(),
    'Fecha Vencimiento': new Date(tender.endAt).toLocaleDateString(),
    'Productos': tender.products?.length || 0,
    'Ofertas': tender.offers?.length || 0,
    'Mejor Oferta': tender.bestOffer ? `$${tender.bestOffer.totalAmount?.toLocaleString()}` : 'N/A'
  }))
  
  if (format === 'excel') {
    exportToExcel(excelData, { filename, format: 'excel' })
  } else if (format === 'csv') {
    exportToCSV(excelData, { filename, format: 'csv' })
  } else if (format === 'pdf') {
    exportToPDF({
      title: 'Reporte de Licitaciones',
      data: excelData,
      columns: [
        { key: 'ID', label: 'ID' },
        { key: 'Título', label: 'Título' },
        { key: 'Estado', label: 'Estado' },
        { key: 'Cliente', label: 'Cliente' },
        { key: 'Fecha Creación', label: 'Fecha Creación' },
        { key: 'Fecha Vencimiento', label: 'Fecha Vencimiento' },
        { key: 'Productos', label: 'Productos' },
        { key: 'Ofertas', label: 'Ofertas' },
        { key: 'Mejor Oferta', label: 'Mejor Oferta' }
      ],
      filename
    })
  }
}
