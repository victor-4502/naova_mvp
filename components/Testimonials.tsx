'use client'

import { motion } from 'framer-motion'

const faqs = [
  {
    question: '¿Cómo inicio un proceso con Naova?',
    answer:
      'Solo envíanos tu requerimiento por WhatsApp o correo y nuestro equipo te contactará para validar la información necesaria. Nos encargamos de coordinar el proceso de licitación de principio a fin.',
  },
  {
    question: '¿Cuánto tiempo tardan en entregarme cotizaciones?',
    answer:
      'Dependiendo de la complejidad del requerimiento, puedes recibir hasta dos cotizaciones comparativas en menos de 48 horas. Te mantenemos informado durante todo el proceso.',
  },
  {
    question: '¿Necesito capacitar a mi equipo para usar la plataforma?',
    answer:
      'No. Diseñamos Naova para adaptarse a tus flujos actuales. Nuestro equipo te guía en cada paso y nos encargamos de toda la operación con los proveedores.',
  },
  {
    question: '¿Qué tipo de compras indirectas atienden?',
    answer:
      'Trabajamos con compras de mantenimiento, seguridad industrial, logística, materiales de oficina y cualquier insumo indirecto que requiera tu operación.',
  },
  {
    question: '¿Cómo dan seguimiento a las órdenes?',
    answer:
      'Asignamos un responsable de cuenta que se mantiene en contacto con proveedores y contigo para asegurar fechas, entregas y condiciones acordadas.',
  },
]

const Testimonials = () => {
  return (
    <section id="faq" className="section-padding bg-gradient-to-br from-white to-purple-50">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Preguntas frecuentes
          </h2>
          <p className="text-xl text-gray-800 max-w-3xl mx-auto leading-relaxed">
            Respondemos las dudas más comunes para que conozcas cómo trabajamos y qué puedes esperar de Naova.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.question}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-soft hover:shadow-medium transition-shadow duration-300 p-6 text-left"
            >
              <h3 className="text-lg font-semibold text-primary mb-2">{faq.question}</h3>
              <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials

