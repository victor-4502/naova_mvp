'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, Search, Layers } from 'lucide-react'

const problems = [
  {
    icon: Layers,
    title: 'Gestión compleja',
    description:
      'La mayoría de las empresas no tienen tiempo ni recursos para licitar cada compra.',
    bg: 'bg-blue-50',
    color: 'text-blue-500',
  },
  {
    icon: Search,
    title: 'Poca trazabilidad',
    description:
      'Es difícil monitorear proveedores y detectar oportunidades de mejora.',
    bg: 'bg-purple-50',
    color: 'text-purple-500',
  },
  {
    icon: AlertTriangle,
    title: 'Soluciones caras',
    description:
      'Las herramientas actuales son costosas y diseñadas para grandes corporativos.',
    bg: 'bg-orange-50',
    color: 'text-orange-500',
  },
]

const ProblemSection = () => {
  return (
    <section className="section-padding bg-gradient-to-br from-white to-purple-50">
      <div className="container-max text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Por qué las compras indirectas son un reto
          </h2>
          <p className="text-xl text-gray-800 leading-relaxed">
            Las compras indirectas representan hasta el 80 % de los pedidos, pero su gestión sigue siendo manual y poco eficiente.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="p-8 rounded-2xl bg-white shadow-soft hover:shadow-medium transition-all duration-300"
            >
              <div
                className={`w-16 h-16 ${problem.bg} rounded-2xl flex items-center justify-center mx-auto mb-6`}
              >
                <problem.icon className={`h-8 w-8 ${problem.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {problem.title}
              </h3>
              <p className="text-gray-800 leading-relaxed">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProblemSection

