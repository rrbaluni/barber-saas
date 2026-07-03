'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gallery } from '@/lib/data'

const categories = ['all', 'haircuts', 'beards', 'shaves', 'interior']

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('all')

  const filtered = activeCategory === 'all'
    ? gallery
    : gallery.filter((img) => img.category === activeCategory)

  return (
    <section id="gallery" className="relative py-32 bg-cream dark:bg-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-gold-dark dark:text-gold font-semibold text-sm tracking-[0.2em] uppercase">
            Our Work
          </span>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-charcoal dark:text-white mt-4">
            Gallery
          </h2>
          <p className="text-charcoal/60 dark:text-white/60 max-w-2xl mx-auto mt-4 text-lg">
            A showcase of our finest cuts, shaves, and styles.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-charcoal dark:bg-gold text-white dark:text-charcoal'
                  : 'bg-white dark:bg-charcoal-light text-charcoal/60 dark:text-white/60 hover:text-charcoal dark:hover:text-white border border-gold/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((img) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
                className={`group relative rounded-xl overflow-hidden cursor-pointer ${
                  img.id === '1' || img.id === '8' ? 'row-span-2' : ''
                }`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover aspect-square group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-400">
                  <p className="text-white font-medium text-sm">{img.alt}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
