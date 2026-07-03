'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { HiBars3, HiXMark, HiSun, HiMoon } from 'react-icons/hi2'
import { useTheme } from '@/components/ThemeProvider'

const navLinks = [
  { href: '/#services', label: 'Services' },
  { href: '/#about', label: 'Our Team' },
  { href: '/#gallery', label: 'Gallery' },
  { href: '/#testimonials', label: 'Reviews' },
  { href: '/#contact', label: 'Contact' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const { theme, toggleTheme } = useTheme()
  const lastScroll = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      setVisible(y < 80 || y < lastScroll.current)
      lastScroll.current = y

      const sections = navLinks.map(l => l.href.replace('/#', ''))
      for (const id of sections.reverse()) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top < 200) {
          setActiveSection(id)
          return
        }
      }
      setActiveSection('')
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        visible ? 'translate-y-0' : '-translate-y-full'
      } ${
        scrolled
          ? 'bg-white/80 dark:bg-charcoal/80 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-gold/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-charcoal font-bold text-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-gold/20">B</span>
            <span className="font-heading text-xl font-bold tracking-[0.15em] text-charcoal dark:text-white">BARBERIA</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const section = link.href.replace('/#', '')
              const isActive = activeSection === section
              return (
                <Link key={link.href} href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                    isActive
                      ? 'text-gold bg-gold/10'
                      : 'text-charcoal/60 dark:text-white/60 hover:text-charcoal dark:hover:text-white hover:bg-white/5'
                  }`}>
                  {link.label}
                </Link>
              )
            })}
            <div className="w-px h-6 bg-gold/10 mx-2" />
            <button onClick={toggleTheme}
              className="p-2.5 rounded-full text-charcoal/50 dark:text-white/50 hover:text-gold hover:bg-gold/10 transition-all" aria-label="Toggle theme">
              {theme === 'dark' ? <HiSun className="w-4 h-4" /> : <HiMoon className="w-4 h-4" />}
            </button>
            <Link href="/booking"
              className="ml-1 px-5 py-2.5 bg-gradient-to-r from-gold to-gold-dark text-charcoal text-sm font-semibold rounded-full hover:from-gold-light hover:to-gold transition-all duration-300 shadow-lg shadow-gold/20 hover:shadow-gold/30">
              Book Now
            </Link>
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <button onClick={toggleTheme}
              className="p-2 rounded-full text-charcoal/50 dark:text-white/50 hover:text-gold transition-all">
              {theme === 'dark' ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
            </button>
            <button onClick={() => setMobileOpen(true)}
              className="p-2 rounded-full text-charcoal dark:text-white hover:text-gold transition-all">
              <HiBars3 className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60 md:hidden" onClick={() => setMobileOpen(false)}>
            <motion.nav initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute top-0 right-0 bottom-0 w-80 bg-white dark:bg-charcoal-light p-8 shadow-2xl border-l border-gold/10">
              <div className="flex items-center justify-between mb-10">
                <span className="font-heading text-lg font-bold tracking-wider text-charcoal dark:text-white">Menu</span>
                <button onClick={() => setMobileOpen(false)} className="p-2 rounded-full text-charcoal/50 dark:text-white/50 hover:text-gold hover:bg-gold/10 transition-all">
                  <HiXMark className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                    className="group flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-medium text-charcoal/70 dark:text-white/70 hover:text-gold hover:bg-gold/5 transition-all">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold/30 group-hover:bg-gold transition-colors" />
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="mt-8 pt-8 border-t border-gold/10">
                <Link href="/booking" onClick={() => setMobileOpen(false)}
                  className="block w-full px-6 py-3.5 bg-gradient-to-r from-gold to-gold-dark text-charcoal font-semibold rounded-xl text-center hover:from-gold-light hover:to-gold transition-all shadow-lg shadow-gold/20">
                  Book Appointment
                </Link>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
