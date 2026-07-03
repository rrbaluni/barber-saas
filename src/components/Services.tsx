'use client'

import { motion } from 'framer-motion'
import { services } from '@/lib/data'
import { HiOutlineScissors, HiOutlineBeaker, HiOutlineSparkles, HiOutlineStar, HiOutlineHeart, HiOutlinePaintBrush } from 'react-icons/hi2'
import Link from 'next/link'

const iconMap: Record<string, React.ReactNode> = {
  cut: <HiOutlineScissors className="w-7 h-7" />,
  beard: <HiOutlineBeaker className="w-7 h-7" />,
  razor: <HiOutlineSparkles className="w-7 h-7" />,
  combo: <HiOutlineStar className="w-7 h-7" />,
  kid: <HiOutlineHeart className="w-7 h-7" />,
  color: <HiOutlinePaintBrush className="w-7 h-7" />,
}

export default function Services() {
  return (
    <section id="services" className="relative py-32 bg-cream dark:bg-charcoal">
      <div className="absolute inset-0 bg-grid" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold-dark dark:text-gold font-semibold text-sm tracking-[0.2em] uppercase">
            Premium Services
          </span>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-charcoal dark:text-white mt-4">
            Craft Your Look
          </h2>
          <p className="text-charcoal/60 dark:text-white/60 max-w-2xl mx-auto mt-4 text-lg">
            From classic cuts to modern styles, each service is delivered with precision and care.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-white dark:bg-charcoal-light rounded-2xl p-8 hover:shadow-xl hover:shadow-gold/5 transition-all duration-500 border border-gold/10 hover:border-gold/30"
            >
              <div className="w-14 h-14 rounded-xl bg-gold/10 dark:bg-gold/10 flex items-center justify-center text-gold mb-6 group-hover:scale-110 transition-transform duration-300">
                {iconMap[service.icon]}
              </div>

              <h3 className="text-xl font-heading font-bold text-charcoal dark:text-white mb-2">
                {service.name}
              </h3>
              <p className="text-charcoal/60 dark:text-white/60 text-sm mb-6 leading-relaxed">
                {service.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gold/10">
                <div>
                  <span className="text-2xl font-bold text-gold-dark dark:text-gold">
                    ${service.price}
                  </span>
                  <span className="text-charcoal/40 dark:text-white/40 text-sm ml-1">
                    / {service.duration}min
                  </span>
                </div>
                <Link
                  href={`/booking?service=${service.id}`}
                  className="text-sm font-semibold text-charcoal dark:text-white hover:text-gold dark:hover:text-gold transition-colors"
                >
                  Book →
                </Link>
              </div>

              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-gold/5 to-transparent rounded-bl-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
