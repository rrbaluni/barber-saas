'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { HiBars3, HiXMark } from 'react-icons/hi2'
import { useTheme } from '@/components/ThemeProvider'
import { HiSun, HiMoon } from 'react-icons/hi2'

const navLinks = [
  { href: '/#services', label: 'Services' },
  { href: '/#about', label: 'Our Team' },
  { href: '/#gallery', label: 'Gallery' },
  { href: '/#testimonials', label: 'Reviews' },
  { href: '/#contact', label: 'Contact' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/80 dark:bg-charcoal/80 backdrop-blur-xl shadow-lg shadow-black/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-charcoal font-bold text-sm group-hover:scale-105 transition-transform">B</span>
            <span className="font-heading text-xl font-bold tracking-wider text-charcoal dark:text-white">BARBERIA</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className="text-sm font-medium text-charcoal/70 dark:text-white/70 hover:text-gold dark:hover:text-gold transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-gold after:transition-all hover:after:w-full">
                {link.label}
              </Link>
            ))}
            <button onClick={toggleTheme} className="p-2 rounded-full text-charcoal/60 dark:text-white/60 hover:text-gold dark:hover:text-gold hover:bg-gold/10 transition-all" aria-label="Toggle theme">
              {theme === 'dark' ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
            </button>
            <Link href="/booking"
              className="px-5 py-2.5 bg-charcoal dark:bg-gold text-white dark:text-charcoal text-sm font-semibold rounded-full hover:bg-gold dark:hover:bg-white transition-all hover:shadow-lg hover:shadow-gold/20">
              Book Now
            </Link>
          </nav>

          <div className="flex items-center gap-3 md:hidden">
            <button onClick={toggleTheme} className="p-2 rounded-full text-charcoal/60 dark:text-white/60 hover:text-gold transition-all">
              {theme === 'dark' ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
            </button>
            <button onClick={() => setMobileOpen(true)} className="p-2 rounded-full text-charcoal dark:text-white hover:text-gold transition-all">
              <HiBars3 className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-60 md:hidden" onClick={() => setMobileOpen(false)}>
            <motion.nav initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute top-0 right-0 bottom-0 w-72 bg-white dark:bg-charcoal-light p-6 shadow-2xl">
              <div className="flex justify-end mb-8">
                <button onClick={() => setMobileOpen(false)} className="p-2 text-charcoal dark:text-white hover:text-gold transition-colors">
                  <HiXMark className="w-6 h-6" />
                </button>
              </div>
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                    className="text-lg font-medium text-charcoal/80 dark:text-white/80 hover:text-gold transition-colors py-2 border-b border-gold/5">
                    {link.label}
                  </Link>
                ))}
                <Link href="/booking" onClick={() => setMobileOpen(false)}
                  className="mt-4 px-6 py-3 bg-charcoal dark:bg-gold text-white dark:text-charcoal font-semibold rounded-full text-center hover:bg-gold dark:hover:bg-white transition-all">
                  Book Now
                </Link>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
