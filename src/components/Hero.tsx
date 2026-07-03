'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { HiArrowRight, HiChevronLeft, HiChevronRight } from 'react-icons/hi2'

const slides = [
  {
    id: 1,
    title: 'Where Craft',
    accent: 'Meets Style',
    description: 'Experience the art of traditional barbering elevated with modern precision. Every cut, shave, and style is a statement of excellence.',
    cta: 'Book Appointment',
    ctaLink: '/booking',
    secondaryCta: 'Our Services',
    secondaryLink: '/#services',
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=1920&q=85',
    badge: 'Premium Cuts & Styles',
  },
  {
    id: 2,
    title: 'Master the',
    accent: 'Perfect Fade',
    description: 'Our barbers specialize in precision fades, beard sculpting, and hot towel shaves that redefine your look.',
    cta: 'See Services',
    ctaLink: '/#services',
    secondaryCta: 'Book Now',
    secondaryLink: '/booking',
    image: 'https://images.unsplash.com/photo-1596728325488-58c87691e9af?w=1920&q=85',
    badge: 'Expert Fades & Shaves',
  },
  {
    id: 3,
    title: 'Premium',
    accent: 'Grooming Experience',
    description: 'Step into a world of timeless craftsmanship. Hot towels, straight razors, and the finest grooming products.',
    cta: 'Book Your Visit',
    ctaLink: '/booking',
    secondaryCta: 'Contact Us',
    secondaryLink: '/#contact',
    image: 'https://images.unsplash.com/photo-1567894340315-735d7c361db7?w=1920&q=85',
    badge: 'Since 2010',
  },
]

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 400 : -400,
    opacity: 0,
    scale: 0.98,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 400 : -400,
    opacity: 0,
    scale: 0.98,
  }),
}

const stagger = {
  animate: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
}

export default function Hero() {
  const [[current, direction], setSlide] = useState([0, 0])
  const [isPaused, setIsPaused] = useState(false)

  const goTo = useCallback((i: number) => {
    setSlide([i, i > current ? 1 : -1])
  }, [current])

  const next = useCallback(() => {
    setSlide([(current + 1) % slides.length, 1])
  }, [current])

  const prev = useCallback(() => {
    setSlide([(current - 1 + slides.length) % slides.length, -1])
  }, [current])

  useEffect(() => {
    if (isPaused) return
    const t = setInterval(next, 6000)
    return () => clearInterval(t)
  }, [isPaused, next])

  const s = slides[current]

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-charcoal"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={s.id}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img src={s.image} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/85 to-charcoal/60" />
        </motion.div>
      </AnimatePresence>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid-white opacity-20" />

      {/* Glow orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gold/8 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-gold/8 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 w-full">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={s.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="max-w-3xl"
          >
            <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-6">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/25 bg-gold/10 text-gold text-xs font-medium tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                {s.badge}
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-bold leading-[1.05] text-white">
                {s.title}
                <br />
                <span className="text-gradient">{s.accent}</span>
              </motion.h1>

              <motion.p variants={fadeUp} className="text-lg sm:text-xl text-white/50 max-w-xl leading-relaxed">
                {s.description}
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-4 pt-2">
                <Link href={s.ctaLink}
                  className="group px-8 py-4 bg-gold text-charcoal font-semibold rounded-full hover:bg-gold-light transition-all duration-300 flex items-center gap-2 shadow-lg shadow-gold/20">
                  {s.cta}
                  <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href={s.secondaryLink}
                  className="px-8 py-4 border border-white/15 text-white/80 font-medium rounded-full hover:bg-white/5 hover:text-white transition-all duration-300">
                  {s.secondaryCta}
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows */}
      <button onClick={prev} className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full border border-white/10 text-white/40 hover:text-white hover:border-gold/30 hover:bg-gold/10 transition-all z-10 hidden sm:block">
        <HiChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={next} className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full border border-white/10 text-white/40 hover:text-white hover:border-gold/30 hover:bg-gold/10 transition-all z-10 hidden sm:block">
        <HiChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
        {slides.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            className={'h-1.5 rounded-full transition-all duration-500 ' + (i === current ? 'w-8 bg-gold' : 'w-1.5 bg-white/25 hover:bg-white/50')}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
        className="absolute bottom-8 right-8 hidden sm:flex flex-col items-center gap-2 z-10">
        <span className="text-[10px] text-white/15 tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-gold/30 to-transparent" />
      </motion.div>
    </section>
  )
}
