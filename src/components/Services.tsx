'use client'

import { motion } from 'framer-motion'
import { services } from '@/lib/data'
import Link from 'next/link'
import { HiArrowRight, HiScissors, HiBeaker, HiSparkles, HiUser, HiOutlineHeart, HiSwatch } from 'react-icons/hi2'

const iconMap: Record<string, React.ReactNode> = {
  scissors: <HiScissors className="w-6 h-6" />,
  beaker: <HiBeaker className="w-6 h-6" />,
  sparkles: <HiSparkles className="w-6 h-6" />,
  user: <HiUser className="w-6 h-6" />,
  heart: <HiOutlineHeart className="w-6 h-6" />,
  swatch: <HiSwatch className="w-6 h-6" />,
}

export default function Services() {
  return (
    <section id="services" className="relative py-24 sm:py-32 bg-cream dark:bg-charcoal">
      <div className="absolute inset-0 bg-grid" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} className="text-center mb-16">
          <span className="text-gold-dark dark:text-gold font-semibold text-sm tracking-[0.2em] uppercase">Our Services</span>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-charcoal dark:text-white mt-4">Craft Your Look</h2>
          <p className="text-charcoal/50 dark:text-white/50 max-w-xl mx-auto mt-4 text-lg">From classic cuts to modern styles, each service is delivered with precision and care.</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div key={service.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ delay: i * 0.08, duration: 0.5 }}
              className="group relative bg-white dark:bg-charcoal-light rounded-2xl p-6 border border-gold/10 hover:border-gold/30 transition-all duration-500 hover:shadow-xl hover:shadow-gold/5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/10 to-gold/5 flex items-center justify-center text-gold mb-4 group-hover:scale-110 transition-transform duration-500">
                {iconMap[service.icon] || <HiScissors className="w-6 h-6" />}
              </div>
              <h3 className="text-xl font-heading font-bold text-charcoal dark:text-white mb-2">{service.name}</h3>
              <p className="text-sm text-charcoal/50 dark:text-white/50 leading-relaxed">{service.description}</p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gold/5">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gold">${service.price}</span>
                  <span className="text-xs text-charcoal/40 dark:text-white/40">{service.duration} min</span>
                </div>
                <Link href={'/booking?service=' + service.id} className="text-sm text-charcoal/40 dark:text-white/40 group-hover:text-gold transition-colors flex items-center gap-1">
                  Book <HiArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
