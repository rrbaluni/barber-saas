'use client'

import { motion } from 'framer-motion'
import { barbers } from '@/lib/data'
import { HiStar } from 'react-icons/hi2'

export default function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32 bg-white dark:bg-charcoal-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} className="text-center mb-16">
          <span className="text-gold-dark dark:text-gold font-semibold text-sm tracking-[0.2em] uppercase">Our Team</span>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-charcoal dark:text-white mt-4">Masters of the Craft</h2>
          <p className="text-charcoal/50 dark:text-white/50 max-w-xl mx-auto mt-4 text-lg">Meet the talented barbers who bring years of experience and passion to every chair.</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {barbers.map((barber, i) => (
            <motion.div key={barber.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group relative overflow-hidden rounded-2xl bg-cream dark:bg-charcoal border border-gold/10">
              <div className="aspect-[4/5] overflow-hidden">
                <img src={barber.image} alt={barber.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-charcoal/80 text-white text-xs font-medium">
                <HiStar className="w-3 h-3 text-gold" />{barber.rating}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-heading font-bold text-charcoal dark:text-white">{barber.name}</h3>
                <p className="text-gold text-sm font-medium mt-0.5">{barber.title}</p>
                <p className="text-sm text-charcoal/50 dark:text-white/50 mt-2 leading-relaxed">{barber.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gold/5 border border-gold/10 text-sm text-charcoal/60 dark:text-white/60">
            <span className="w-2 h-2 rounded-full bg-gold" />We use only premium American Crew and Malin+Goetz products
          </div>
        </motion.div>
      </div>
    </section>
  )
}
