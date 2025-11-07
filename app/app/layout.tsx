import { redirect } from 'next/navigation'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Note: Authentication is handled by middleware
  // This layout is only accessible to authenticated clients

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      {children}
    </div>
  )
}

