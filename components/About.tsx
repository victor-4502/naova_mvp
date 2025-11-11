'use client'

import { motion } from 'framer-motion'
import { Users, Target, Award } from 'lucide-react'

const About = () => {
  const values = [
    {
      icon: Target,
      title: 'Enfoque en resultados',
      description:
        'Cada decisión que tomamos está orientada a generar valor medible para nuestros clientes.',
    },
    {
      icon: Users,
      title: 'Partnership estratégico',
      description:
        'No somos solo un proveedor, somos tu socio en la transformación digital de compras.',
    },
    {
      icon: Award,
      title: 'Excelencia operativa',
      description:
        'Comprometidos con la calidad y la mejora continua en todos nuestros procesos.',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  }

  return (
    <section className="section-padding bg-gradient-to-br from-purple-100 to-purple-200">
      <div className="container-max">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* Content */}
          <div>
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
            >
              Naova: Tu socio estratégico en compras industriales
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-xl text-gray-800 mb-8 leading-relaxed"
            >
              En Naova, creemos que las compras industriales pueden ser más eficientes,
              transparentes y rentables. Nuestra misión es simplificar la complejidad
              y maximizar el valor en cada proceso de compra.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mb-8 px-6 py-8 bg-white/60 border border-primary/10 rounded-3xl shadow-soft text-center"
            >
              <span className="text-2xl md:text-3xl font-bold text-primary leading-snug">
                No cambiamos tu proceso; lo hacemos más fácil y eficiente.
              </span>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-800 mb-8 leading-relaxed"
            >
              Con años de experiencia en el sector industrial, entendemos los desafíos
              únicos que enfrentan las empresas. Por eso, hemos desarrollado una solución
              que se adapta a tu forma de trabajar, no al revés.
            </motion.p>

            <motion.div variants={containerVariants} className="space-y-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gray-800 leading-relaxed">{value.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Team photo placeholder */}
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-8">
              <div className="bg-white rounded-2xl p-8 shadow-soft">
                <div className="text-center mb-6">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    Nuestro Equipo
                  </h4>
                  <p className="text-gray-800">Expertos en compras industriales y tecnología</p>
                </div>

                {/* Team grid placeholder */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center"
                    >
                      <Users className="h-8 w-8 text-gray-400" />
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-gray-200 text-left">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Construimos Naova junto a especialistas en compras, logística y tecnología para ofrecerte una solución hecha a la medida de los retos industriales.
                  </p>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center">
              <Award className="h-8 w-8 text-secondary" />
            </div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <Target className="h-6 w-6 text-primary" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default About

