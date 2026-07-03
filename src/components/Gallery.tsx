'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gallery } from '@/lib/data'
import { HiXMark } from 'react-icons/hi2'

const categories = ['all', 'haircuts', 'beards', 'shaves', 'interior'] as const

export default function Gallery() {
  const [active, setActive] = useState<'all' | 'haircuts' | 'beards' | 'shaves' | 'interior'>('all')
  const [selected, setSelected] = useState<string | null>(null)
  const filtered = active === 'all' ? gallery : gallery.filter((img) => img.category === active)

  return (
    <section id="gallery" className="relative py-24 sm:py-32 bg-cream dark:bg-charcoal">
      <div className="absolute inset-0 bg-grid" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} className="text-center mb-12">
          <span className="text-gold-dark dark:text-gold font-semibold text-sm tracking-[0.2em] uppercase">Our Work</span>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-charcoal dark:text-white mt-4">Gallery</h2>
          <p className="text-charcoal/50 dark:text-white/50 max-w-xl mx-auto mt-4 text-lg">A showcase of our finest cuts, shaves, and styles.</p>
        </motion.div>
        <div className="flex justify-center gap-2 mb-10 flex-wrap">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActive(cat)}
              className={'px-5 py-2 rounded-full text-sm font-medium capitalize transition-all duration-300 ' + (active === cat ? 'bg-charcoal dark:bg-gold text-white dark:text-charcoal shadow-lg' : 'bg-white dark:bg-charcoal-light text-charcoal/50 dark:text-white/50 border border-gold/10 hover:border-gold/30')}>{cat}</button>
          ))}
        </div>
        <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((img) => (
              <motion.div key={img.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => setSelected(img.id)} className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-xl">
                <img src={img.src} alt={img.alt} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <p className="absolute bottom-4 left-4 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-2 group-hover:translate-y-0">{img.alt}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
      <AnimatePresence>
        {selected !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)}
            className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={(e) => e.stopPropagation()} className="relative max-w-3xl w-full">
              <button onClick={() => setSelected(null)} className="absolute -top-12 right-0 text-white/60 hover:text-white transition-colors"><HiXMark className="w-8 h-8" /></button>
              <img src={gallery.find((img) => img.id === selected)?.src} alt={gallery.find((img) => img.id === selected)?.alt} className="w-full h-auto rounded-xl shadow-2xl" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
