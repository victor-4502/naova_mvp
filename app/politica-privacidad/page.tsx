import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PoliticaPrivacidadPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container-max py-16 mt-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Política de Privacidad
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Última actualización:</strong> {new Date().toLocaleDateString('es-MX', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Introducción
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Naova (&ldquo;nosotros&rdquo;, &ldquo;nuestro&rdquo; o &ldquo;la empresa&rdquo;) se compromete a proteger la privacidad 
                de nuestros usuarios. Esta Política de Privacidad describe cómo recopilamos, usamos, 
                almacenamos y protegemos su información personal cuando utiliza nuestros servicios.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Información que Recopilamos
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Recopilamos información que usted nos proporciona directamente, incluyendo:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Información de contacto (nombre, correo electrónico, número de teléfono)</li>
                <li>Información de la empresa (nombre, dirección, datos fiscales)</li>
                <li>Información de requerimientos y solicitudes de compra</li>
                <li>Información de comunicación (mensajes, correos electrónicos, conversaciones)</li>
                <li>Datos de facturación y pago</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                También recopilamos información automáticamente cuando utiliza nuestros servicios:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Datos de uso de la plataforma</li>
                <li>Direcciones IP y datos de dispositivo</li>
                <li>Cookies y tecnologías similares</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Uso de la Información
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Utilizamos la información recopilada para:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Proporcionar, mantener y mejorar nuestros servicios</li>
                <li>Procesar y gestionar sus requerimientos de compra</li>
                <li>Comunicarnos con usted sobre sus solicitudes y el estado de sus pedidos</li>
                <li>Enviar notificaciones y actualizaciones importantes</li>
                <li>Personalizar su experiencia en la plataforma</li>
                <li>Cumplir con obligaciones legales y regulatorias</li>
                <li>Prevenir fraudes y mejorar la seguridad</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Compartir Información
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                No vendemos su información personal. Podemos compartir su información únicamente en 
                las siguientes circunstancias:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>
                  <strong>Proveedores de servicios:</strong> Con terceros que nos ayudan a operar 
                  nuestra plataforma (hosting, procesamiento de pagos, análisis)
                </li>
                <li>
                  <strong>Proveedores:</strong> Para facilitar el proceso de compra y cotización, 
                  compartimos información relevante de requerimientos con proveedores potenciales
                </li>
                <li>
                  <strong>Requisitos legales:</strong> Cuando sea requerido por ley o para proteger 
                  nuestros derechos legales
                </li>
                <li>
                  <strong>Con su consentimiento:</strong> En cualquier otra situación con su 
                  autorización explícita
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Seguridad de los Datos
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger 
                su información personal contra acceso no autorizado, alteración, divulgación o 
                destrucción. Sin embargo, ningún método de transmisión por Internet o almacenamiento 
                electrónico es 100% seguro.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Sus Derechos
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Usted tiene derecho a:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Acceder a su información personal</li>
                <li>Rectificar información incorrecta o incompleta</li>
                <li>Solicitar la eliminación de sus datos personales</li>
                <li>Oponerse al procesamiento de sus datos</li>
                <li>Solicitar la portabilidad de sus datos</li>
                <li>Retirar su consentimiento en cualquier momento</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Para ejercer estos derechos, puede contactarnos en:{' '}
                <a href="mailto:privacidad@naova.com" className="text-primary hover:underline">
                  privacidad@naova.com
                </a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Cookies y Tecnologías Similares
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Utilizamos cookies y tecnologías similares para mejorar su experiencia, analizar el 
                uso de la plataforma y personalizar el contenido. Puede configurar su navegador para 
                rechazar cookies, aunque esto puede afectar algunas funcionalidades del servicio.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Retención de Datos
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Conservamos su información personal durante el tiempo necesario para cumplir con los 
                propósitos descritos en esta política, a menos que la ley requiera o permita un 
                período de retención más largo.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Cambios a esta Política
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Podemos actualizar esta Política de Privacidad ocasionalmente. Le notificaremos 
                sobre cambios significativos publicando la nueva política en esta página y 
                actualizando la fecha de &ldquo;Última actualización&rdquo;. Le recomendamos revisar esta 
                política periódicamente.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Contacto
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Si tiene preguntas o inquietudes sobre esta Política de Privacidad o sobre cómo 
                manejamos su información personal, puede contactarnos:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>Naova</strong>
                </p>
                <p className="text-gray-700 mb-2">
                  Email:{' '}
                  <a href="mailto:privacidad@naova.com" className="text-primary hover:underline">
                    privacidad@naova.com
                  </a>
                </p>
                <p className="text-gray-700">
                  Teléfono:{' '}
                  <a href="tel:+523316083075" className="text-primary hover:underline">
                    +52 33 1608 3075
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

