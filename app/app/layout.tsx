import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Note: Authentication is handled by middleware
  // This layout is only accessible to authenticated clients
  
  // Verificar si el usuario es admin y redirigir
  const user = await getCurrentUser()
  if (user && (user.role === 'admin_naova' || user.role === 'operator_naova')) {
    redirect('/admin/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      {children}
    </div>
  )
}

