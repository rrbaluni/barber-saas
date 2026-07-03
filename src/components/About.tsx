'use client'

import { motion } from 'framer-motion'
import { barbers } from '@/lib/data'
import { HiStar } from 'react-icons/hi2'

export default function About() {
  return (
    <section id="about" className="relative py-32 bg-white dark:bg-black overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gold/[0.02] to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold-dark dark:text-gold font-semibold text-sm tracking-[0.2em] uppercase">
            Our Team
          </span>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-charcoal dark:text-white mt-4">
            Masters of the Craft
          </h2>
          <p className="text-charcoal/60 dark:text-white/60 max-w-2xl mx-auto mt-4 text-lg">
            Meet the talented barbers who bring years of experience and passion to every chair.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {barbers.map((barber, index) => (
            <motion.div
              key={barber.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group"
            >
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-5">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <img
                  src={barber.image}
                  alt={barber.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 right-3 z-20 flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-sm font-semibold text-charcoal">
                  <HiStar className="w-4 h-4 text-gold" />
                  {barber.rating}
                </div>
                <div className="absolute bottom-0 left-0 right-0 z-20 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-white/80 text-sm">{barber.bio}</p>
                </div>
              </div>
              <h3 className="text-xl font-heading font-bold text-charcoal dark:text-white">
                {barber.name}
              </h3>
              <p className="text-gold-dark dark:text-gold text-sm font-medium">{barber.title}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold/10 border border-gold/20">
            <span className="w-2 h-2 rounded-full bg-gold" />
            <span className="text-charcoal/80 dark:text-white/80 text-sm">
              We use only premium American Crew and Malin+Goetz products
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
