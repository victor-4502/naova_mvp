# 🚀 Guía de Implementación - Archivos Restantes

Este documento contiene el código completo para los archivos que faltan. Copia y pega cada sección en el archivo correspondiente.

---

## 📁 Componentes Compartidos

### `components/Sidebar.tsx`

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  FileText,
  Gavel,
  BarChart3,
  Users,
  Building2,
  Settings,
  LogOut,
} from 'lucide-react'

interface SidebarProps {
  userRole: 'admin' | 'client'
}

export default function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname()

  const clientMenuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/app/dashboard' },
    { name: 'Requerimientos', icon: FileText, href: '/app/requirements' },
    { name: 'Licitaciones', icon: Gavel, href: '/app/tenders' },
    { name: 'Reportes', icon: BarChart3, href: '/app/reports' },
  ]

  const adminMenuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { name: 'Clientes', icon: Users, href: '/admin/clients' },
    { name: 'Proveedores', icon: Building2, href: '/admin/providers' },
    { name: 'Licitaciones', icon: Gavel, href: '/admin/tenders' },
  ]

  const menuItems = userRole === 'admin' ? adminMenuItems : clientMenuItems

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-6">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Naova</h1>
        <p className="text-sm text-gray-600 mt-1">
          {userRole === 'admin' ? 'Admin Panel' : 'Cliente'}
        </p>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-purple-50'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="mt-auto pt-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  )
}
```

### `components/DashboardCard.tsx`

```tsx
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface DashboardCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  color?: string
  trend?: {
    value: number
    isPositive: boolean
  }
}

export default function DashboardCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'primary',
  trend,
}: DashboardCardProps) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    purple: 'bg-purple-100 text-purple-600',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white p-6 rounded-xl shadow-soft hover:shadow-medium transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
          {trend && (
            <div className={`text-sm font-medium mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses] || colorClasses.primary}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  )
}
```

---

## 📊 Dashboard de Cliente

### `app/app/layout.tsx`

```tsx
import Sidebar from '@/components/Sidebar'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user || user.role !== 'client') {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen bg-purple-50">
      <Sidebar userRole="client" />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
```

### `app/app/dashboard/page.tsx`

Ver archivo completo en el siguiente bloque...

---

## 🔧 Hooks Útiles

### `lib/hooks/useAuth.ts`

```typescript
'use client'

import { useState, useEffect } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'client'
  company?: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUser(data.user)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  return { user, loading }
}
```

---

## 📋 Archivos Adicionales Pendientes

Los siguientes archivos necesitan ser implementados siguiendo los patrones establecidos:

### Dashboard Cliente
1. `app/app/dashboard/page.tsx` - Dashboard con 5 reportes
2. `app/app/requirements/page.tsx` - Lista de requerimientos
3. `app/app/tenders/page.tsx` - Licitaciones activas
4. `app/app/reports/page.tsx` - Exportar reportes

### Dashboard Admin
1. `app/admin/layout.tsx` - Layout con Sidebar admin
2. `app/admin/dashboard/page.tsx` - Vista global
3. `app/admin/clients/page.tsx` - Gestión de clientes
4. `app/admin/providers/page.tsx` - Gestión de proveedores
5. `app/admin/tenders/page.tsx` - Gestión de licitaciones

### Componentes
1. `components/RequirementForm.tsx` - Modal para crear requerimientos
2. `components/Charts/LineChart.tsx` - Gráfico de línea (Recharts)
3. `components/Charts/BarChart.tsx` - Gráfico de barras (Recharts)
4. `components/Charts/PieChart.tsx` - Gráfico circular (Recharts)

### Tests
1. `__tests__/Login.test.tsx`
2. `__tests__/DashboardClient.test.tsx`
3. `__tests__/AdminCreateClient.test.tsx`

---

## 🎯 Prioridad de Implementación

1. **ALTA - Dashboard Cliente** (`app/app/dashboard/page.tsx`)
   - Implementar los 5 reportes clave
   - Fetch de `/api/reports/client/[clientId]`
   - Mostrar gráficos con Recharts

2. **ALTA - Dashboard Admin** (`app/admin/dashboard/page.tsx`)
   - Vista global de métricas
   - Fetch de `/api/admin/reports/global`

3. **MEDIA - CRUD Interfaces**
   - Requirements, Tenders para cliente
   - Clients, Providers para admin

4. **BAJA - Tests**
   - Tests básicos de sanity check

---

## 💡 Plantillas Rápidas

### Página de Lista (Requirements/Tenders)

```tsx
'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'

export default function ListPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/endpoint')
      .then(res => res.json())
      .then(data => {
        setItems(data.items || [])
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Cargando...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Título</h1>
        <button className="btn-primary">
          <Plus className="h-5 w-5 mr-2" />
          Nuevo
        </button>
      </div>

      <div className="grid gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-xl shadow-soft">
            {/* Item content */}
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## 📞 Próximos Pasos

1. Implementa `app/app/dashboard/page.tsx` con los 5 reportes
2. Crea los componentes de gráficos con Recharts
3. Implementa las páginas de lista (requirements, tenders)
4. Agrega el dashboard admin
5. Tests básicos

**Nota:** Todos los endpoints API ya están implementados y funcionando. Solo falta el frontend para consumirlos.

