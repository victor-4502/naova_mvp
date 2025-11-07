import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Naova - Simplifica tus compras de indirectos',
  description: 'Naova es tu socio estratégico en compras industriales. Sin curva de aprendizaje, sin costo inicial, con resultados medibles.',
  keywords: 'compras industriales, SaaS, indirectos, licitaciones, proveedores',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
