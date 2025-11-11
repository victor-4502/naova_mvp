'use client'

import { motion } from 'framer-motion'
import { Target, Eye, Sparkles } from 'lucide-react'

const cards = [
  {
    icon: Target,
    title: 'Misión',
    description:
      'Empoderar a las empresas para que gestionen sus compras indirectas con procesos simples, transparencia total y soporte experto en cada paso.',
  },
  {
    icon: Eye,
    title: 'Visión',
    description:
      'Ser la plataforma de referencia en Latinoamérica para compras industriales eficientes, conectando clientes y proveedores de manera ágil y confiable.',
  },
  {
    icon: Sparkles,
    title: 'Valores',
    description:
      'Transparencia, cercanía con el cliente, agilidad operativa y mejora continua. Creemos en relaciones a largo plazo construidas sobre confianza.',
  },
]

const MissionVision = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nuestra misión, visión y valores
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Trabajamos junto a tus equipos para garantizar procesos de compra eficientes, humanos y sostenibles.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 shadow-soft hover:shadow-medium transition-all duration-300 text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-white text-primary flex items-center justify-center mb-6 shadow-inner">
                <card.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{card.title}</h3>
              <p className="text-gray-700 leading-relaxed">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MissionVision

