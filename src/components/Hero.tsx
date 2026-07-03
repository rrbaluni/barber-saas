'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { HiArrowRight } from 'react-icons/hi2'

const stagger = {
  animate: {
    transition: { staggerChildren: 0.12 }
  }
}

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 }
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-charcoal">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal/95 to-charcoal" />
        <div className="absolute inset-0 bg-grid-white opacity-40" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      </div>
      <motion.div initial="initial" animate="animate" variants={stagger} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full">
        <div className="max-w-3xl">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/20 bg-gold/5 text-gold text-xs font-medium tracking-wider uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />Premium Barber Experience
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-bold leading-[1.05] text-white">
            Where Craft<br /><span className="text-gradient">Meets Style</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg sm:text-xl text-white/50 max-w-xl mt-6 leading-relaxed">
            Experience the art of traditional barbering elevated with modern precision. Every cut, shave, and style is a statement of excellence.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mt-8">
            <Link href="/booking" className="group px-8 py-4 bg-gold text-charcoal font-semibold rounded-full hover:bg-gold-light transition-all duration-300 flex items-center gap-2 shadow-lg shadow-gold/20">
              Book Appointment <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/#services" className="px-8 py-4 border border-white/15 text-white/80 font-medium rounded-full hover:bg-white/5 hover:text-white transition-all duration-300">
              Our Services
            </Link>
          </motion.div>
          <motion.div variants={fadeUp} className="flex items-center gap-8 mt-12 pt-8 border-t border-white/5">
            <div><p className="text-3xl font-heading font-bold text-gold">15+</p><p className="text-xs text-white/40 mt-1 tracking-wider uppercase">Years Experience</p></div>
            <div className="w-px h-10 bg-white/10" />
            <div><p className="text-3xl font-heading font-bold text-gold">500+</p><p className="text-xs text-white/40 mt-1 tracking-wider uppercase">Happy Clients</p></div>
            <div className="w-px h-10 bg-white/10" />
            <div><p className="text-3xl font-heading font-bold text-gold">4.9</p><p className="text-xs text-white/40 mt-1 tracking-wider uppercase">Client Rating</p></div>
          </motion.div>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs text-white/20 tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-gold/40 to-transparent" />
      </motion.div>
    </section>
  )
}
