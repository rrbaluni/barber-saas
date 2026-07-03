'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { testimonials } from '@/lib/data'
import { HiStar, HiChevronLeft, HiChevronRight } from 'react-icons/hi2'

export default function Testimonials() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)
  const next = () => setCurrent((c) => (c + 1) % testimonials.length)

  return (
    <section id="testimonials" className="relative py-32 bg-black overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, #C8A96E 1px, transparent 0)`,
        backgroundSize: '30px 30px',
      }} />

      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-64 h-64 bg-gold/5 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 -translate-y-1/2 right-0 w-64 h-64 bg-gold/5 rounded-full blur-[100px]" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold font-semibold text-sm tracking-[0.2em] uppercase">
            Testimonials
          </span>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-white mt-4">
            What Our Clients Say
          </h2>
        </motion.div>

        <div className="relative min-h-[280px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                  <HiStar key={i} className="w-6 h-6 text-gold" />
                ))}
              </div>
              <p className="text-xl sm:text-2xl text-white/80 leading-relaxed font-light italic max-w-3xl mx-auto mb-8">
                &ldquo;{testimonials[current].text}&rdquo;
              </p>
              <div>
                <p className="text-gold font-semibold text-lg">
                  {testimonials[current].name}
                </p>
                <p className="text-white/40 text-sm">
                  {testimonials[current].service}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={prev}
            className="p-3 rounded-full border border-white/20 text-white/60 hover:text-gold hover:border-gold/50 transition-all duration-300"
          >
            <HiChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === current
                    ? 'bg-gold w-6'
                    : 'bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="p-3 rounded-full border border-white/20 text-white/60 hover:text-gold hover:border-gold/50 transition-all duration-300"
          >
            <HiChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
