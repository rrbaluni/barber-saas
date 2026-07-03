'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { HiOutlineScissors, HiOutlineSun, HiOutlineMoon, HiBars3, HiXMark } from 'react-icons/hi2'
import { useTheme } from './ThemeProvider'

const navLinks = [
  { href: '#services', label: 'Services' },
  { href: '#about', label: 'About' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#contact', label: 'Contact' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 dark:bg-black/90 backdrop-blur-xl shadow-lg shadow-black/5'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <HiOutlineScissors className="w-6 h-6 text-gold group-hover:rotate-45 transition-transform duration-300" />
            <span className="font-heading text-2xl font-bold tracking-wider text-charcoal dark:text-white">
              BARBER<span className="text-gold">ÍA</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium tracking-wide text-charcoal/70 dark:text-white/70 hover:text-gold dark:hover:text-gold transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-charcoal/60 dark:text-white/60 hover:text-gold dark:hover:text-gold hover:bg-gold/10 transition-all duration-300"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <HiOutlineMoon className="w-5 h-5" /> : <HiOutlineSun className="w-5 h-5" />}
            </button>
            <Link
              href="/booking"
              className="px-6 py-2.5 bg-charcoal dark:bg-gold text-white dark:text-charcoal font-semibold text-sm tracking-wider rounded-full hover:bg-gold dark:hover:bg-white transition-all duration-300 hover:shadow-lg hover:shadow-gold/25"
            >
              Book Now
            </Link>
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-charcoal/60 dark:text-white/60 hover:text-gold transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <HiOutlineMoon className="w-5 h-5" /> : <HiOutlineSun className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-full text-charcoal dark:text-white hover:text-gold transition-colors"
            >
              {mobileOpen ? <HiXMark className="w-6 h-6" /> : <HiBars3 className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 dark:bg-black/95 backdrop-blur-xl border-t border-gold/10"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-lg font-medium text-charcoal/80 dark:text-white/80 hover:text-gold transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/booking"
                onClick={() => setMobileOpen(false)}
                className="block text-center px-6 py-3 bg-charcoal dark:bg-gold text-white dark:text-charcoal font-semibold rounded-full hover:bg-gold dark:hover:bg-white transition-colors"
              >
                Book Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
