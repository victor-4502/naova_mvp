'use client'

import { motion } from 'framer-motion'
import { Users, Target, Award, Sparkles } from 'lucide-react'

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

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="relative bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-10 shadow-soft"
          >
            <div className="absolute -top-4 -right-4 w-14 h-14 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center shadow-medium">
              <Award className="h-6 w-6 text-secondary" />
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-soft space-y-6">
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  Equipo especializado
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  Construimos Naova junto a especialistas en compras, logística y tecnología para ofrecerte una solución hecha a la medida de los retos industriales.
                </p>
              </div>

              <div className="space-y-4 text-gray-700">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">Compras estratégicas</h5>
                    <p className="text-sm leading-relaxed">
                      Experiencia directa gestionando licitaciones, proveedores y acuerdos marco.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                    <Target className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">Operaciones y logística</h5>
                    <p className="text-sm leading-relaxed">
                      Coordinamos cada entrega para asegurar tiempos y condiciones acordadas.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">Tecnología aplicada</h5>
                    <p className="text-sm leading-relaxed">
                      Automatizamos seguimiento, reportes y análisis para darte visibilidad en tiempo real.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default About

