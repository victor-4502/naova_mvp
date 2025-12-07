import { redirect } from 'next/navigation'

export default function AdminPage() {
  // Redirigir automáticamente a /admin/dashboard
  redirect('/admin/dashboard')
}

