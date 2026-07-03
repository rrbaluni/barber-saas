'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { testimonials } from '@/lib/data'
import { HiStar, HiChevronLeft, HiChevronRight } from 'react-icons/hi2'

export default function Testimonials() {
  const [current, setCurrent] = useState(0)
  useEffect(() => { const t = setInterval(() => setCurrent((p) => (p + 1) % testimonials.length), 5000); return () => clearInterval(t) }, [])
  const prev = () => setCurrent((p) => (p - 1 + testimonials.length) % testimonials.length)
  const next = () => setCurrent((p) => (p + 1) % testimonials.length)
  const t = testimonials[current]

  return (
    <section id="testimonials" className="relative py-24 sm:py-32 bg-charcoal overflow-hidden">
      <div className="absolute inset-0 bg-grid-white opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-charcoal to-charcoal/95" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="text-gold font-semibold text-sm tracking-[0.2em] uppercase">Testimonials</span>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-white mt-4">What Our Clients Say</h2>
        </motion.div>
        <div className="relative mt-12">
          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
              <div className="flex justify-center gap-1 mb-6">{Array.from({ length: 5 }).map((_, i) => (<HiStar key={i} className={'w-5 h-5 ' + (i < t.rating ? 'text-gold' : 'text-white/10')} />))}</div>
              <p className="text-xl sm:text-2xl text-white/80 font-heading leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-8"><p className="text-white font-semibold">{t.name}</p><p className="text-gold text-sm mt-1">{t.service}</p></div>
            </motion.div>
          </AnimatePresence>
          <div className="flex items-center justify-center gap-4 mt-10">
            <button onClick={prev} className="p-2 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-gold/30 hover:bg-gold/5 transition-all"><HiChevronLeft className="w-5 h-5" /></button>
            <div className="flex gap-2">{testimonials.map((_, i) => (<button key={i} onClick={() => setCurrent(i)} className={'w-2 h-2 rounded-full transition-all duration-300 ' + (i === current ? 'bg-gold w-6' : 'bg-white/20 hover:bg-white/40')} />))}</div>
            <button onClick={next} className="p-2 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-gold/30 hover:bg-gold/5 transition-all"><HiChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
      </div>
    </section>
  )
}
