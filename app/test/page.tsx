export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">
          ¡Página de Prueba!
        </h1>
        <p className="text-gray-600 mb-8">
          Si ves esta página, la redirección está funcionando correctamente.
        </p>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Estado del Sistema:</h2>
          <ul className="text-left space-y-2">
            <li>✅ Next.js funcionando</li>
            <li>✅ Routing funcionando</li>
            <li>✅ Estilos aplicados</li>
            <li>✅ Redirección exitosa</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
