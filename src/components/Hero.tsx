'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { HiArrowRight } from 'react-icons/hi2'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-black">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black/95 to-charcoal" />

      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, #C8A96E 1px, transparent 0)`,
        backgroundSize: '40px 40px',
      }} />

      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-gold/5 blur-[120px]" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-gold/5 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/20 bg-gold/5 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span className="text-gold text-sm font-medium tracking-wider">PREMIUM BARBERSHOP</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-heading font-bold leading-[1.1] text-white mb-6"
            >
              Where
              <br />
              <span className="text-gradient">Craftsmanship</span>
              <br />
              Meets Style
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-lg text-white/60 max-w-lg mb-10 leading-relaxed"
            >
              Experience the art of traditional barbering elevated with modern precision.
              Every cut, shave, and style is a statement of excellence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/booking"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gold text-charcoal font-bold text-sm tracking-wider uppercase rounded-full hover:bg-gold-light transition-all duration-300 hover:shadow-lg hover:shadow-gold/25"
              >
                Book Appointment
                <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#services"
                className="inline-flex items-center px-8 py-4 border border-white/20 text-white font-semibold text-sm tracking-wider uppercase rounded-full hover:bg-white/10 transition-all duration-300"
              >
                Our Services
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="flex items-center gap-8 mt-12 pt-8 border-t border-white/10"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-black bg-gradient-to-br from-gold/30 to-gold/10 flex items-center justify-center text-xs font-bold text-gold"
                  >
                    {String(i).repeat(2)}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-gold font-bold text-lg">4.9 ★</p>
                <p className="text-white/40 text-sm">Trusted by 500+ clients</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 1, ease: 'easeOut' }}
            className="hidden lg:block relative"
          >
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 z-10" />
              <img
                src="https://images.unsplash.com/photo-1585747861115-0deabd89d523?w=800&h=1000&fit=crop"
                alt="Barber at work"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 ring-1 ring-gold/20 rounded-2xl z-20" />
              <div className="absolute bottom-6 left-6 right-6 z-20 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
                <p className="text-white font-semibold">Marco Silva</p>
                <p className="text-white/60 text-sm">Master Barber · 15 yrs experience</p>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-2xl bg-gold/10 border border-gold/20 backdrop-blur-xl flex items-center justify-center">
              <div className="text-center">
                <p className="text-gold text-3xl font-heading font-bold">15+</p>
                <p className="text-white/60 text-xs">Years</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-black to-transparent" />
    </section>
  )
}
