"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { HiSun, HiMoon, HiMiniScissors } from "react-icons/hi2"
import { useTheme } from "@/components/ThemeProvider"

const navLinks = [
  { href: "/#services", label: "Services" },
  { href: "/#about", label: "Our Team" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#testimonials", label: "Reviews" },
  { href: "/#contact", label: "Contact" },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const { theme, toggleTheme } = useTheme()
  const lastScroll = useRef(0)
  const menuBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      setVisible(y < 80 || y < lastScroll.current)
      lastScroll.current = y

      const sections = navLinks.map((l) => l.href.replace("/#", ""))
      for (const id of sections.reverse()) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top < 200) {
          setActiveSection(id)
          return
        }
      }
      setActiveSection("")
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          visible ? "translate-y-0" : "-translate-y-full"
        } ${scrolled ? "bg-white/90 dark:bg-charcoal/90 backdrop-blur-2xl shadow-[0_1px_0_rgba(201,149,60,0.1)]" : "bg-transparent"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <span className="relative w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center overflow-hidden">
                <HiMiniScissors className="w-5 h-5 text-charcoal group-hover:scale-110 transition-transform duration-300" />
              </span>
              <span className={`font-heading text-lg font-bold tracking-[0.12em] transition-colors duration-500 ${scrolled ? "text-charcoal dark:text-white" : "text-white"}`}>
                BARBERIA
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const section = link.href.replace("/#", "")
                const isActive = activeSection === section
                return (
                  <Link key={link.href} href={link.href}
                    className={`relative text-sm font-medium tracking-wide transition-colors duration-300 py-1 ${
                      isActive
                        ? "text-gold"
                        : `${scrolled ? "text-charcoal/60 dark:text-white/60 hover:text-charcoal dark:hover:text-white" : "text-white/70 hover:text-white"}`
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span layoutId="nav-dot"
                        className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold"
                      />
                    )}
                  </Link>
                )
              })}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <button onClick={toggleTheme}
                className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                  scrolled
                    ? "text-charcoal/50 dark:text-white/50 hover:text-gold hover:bg-gold/10"
                    : "text-white/60 hover:text-gold hover:bg-white/10"
                }`}
                aria-label="Toggle theme"
              >
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {theme === "dark" ? <HiSun className="w-4 h-4" /> : <HiMoon className="w-4 h-4" />}
                </motion.div>
              </button>
              <Link href="/booking"
                className="relative px-6 py-2.5 bg-gradient-to-r from-gold to-gold-dark text-charcoal text-sm font-semibold rounded-full overflow-hidden group transition-all duration-300 shadow-lg shadow-gold/20 hover:shadow-gold/30"
              >
                <span className="relative z-10">Book Now</span>
                <span className="absolute inset-0 bg-gradient-to-r from-gold-light to-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <button onClick={toggleTheme}
                className={`p-2 rounded-full transition-all ${
                  scrolled ? "text-charcoal/50 dark:text-white/50 hover:text-gold" : "text-white/70 hover:text-gold"
                }`}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
              </button>
              <button ref={menuBtnRef} onClick={() => setMenuOpen(true)}
                className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  scrolled ? "text-charcoal dark:text-white hover:bg-gold/10" : "text-white hover:bg-white/10"
                }`}
                aria-label="Open menu"
              >
                <div className="flex flex-col items-center justify-center gap-[3px]">
                  <span className={`block h-[1.5px] rounded-full transition-all duration-300 ${scrolled ? "bg-charcoal dark:bg-white" : "bg-white"}`} style={{ width: "16px" }} />
                  <span className={`block h-[1.5px] rounded-full transition-all duration-300 ${scrolled ? "bg-charcoal dark:bg-white" : "bg-white"}`} style={{ width: "16px" }} />
                  <span className={`block h-[1.5px] rounded-full transition-all duration-300 ${scrolled ? "bg-charcoal dark:bg-white" : "bg-white"}`} style={{ width: "10px" }} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] md:hidden"
          >
            <div className="absolute inset-0 bg-charcoal/95 backdrop-blur-xl" />
            <div className="relative h-full flex flex-col p-8">
              <div className="flex items-center justify-between mb-16">
                <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                    <HiMiniScissors className="w-5 h-5 text-charcoal" />
                  </span>
                  <span className="font-heading text-lg font-bold tracking-[0.12em] text-white">BARBERIA</span>
                </Link>
                <button onClick={() => setMenuOpen(false)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-gold hover:bg-white/5 transition-all"
                  aria-label="Close menu"
                >
                  <motion.svg initial={{ rotate: -45 }} animate={{ rotate: 0 }} width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <line x1="2" y1="2" x2="18" y2="18" />
                    <line x1="18" y1="2" x2="2" y2="18" />
                  </motion.svg>
                </button>
              </div>

              <nav className="flex-1 flex flex-col justify-center gap-2 -mt-16">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <Link href={link.href} onClick={() => setMenuOpen(false)}
                      className="group flex items-center gap-4 py-4 border-b border-white/5"
                    >
                      <span className="text-4xl sm:text-5xl font-heading font-bold text-white/90 group-hover:text-gold transition-colors duration-300">
                        {link.label}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="pt-8 border-t border-white/10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                >
                  <Link href="/booking" onClick={() => setMenuOpen(false)}
                    className="block w-full py-4 bg-gradient-to-r from-gold to-gold-dark text-charcoal text-center font-bold rounded-2xl text-lg tracking-wide shadow-lg shadow-gold/20"
                  >
                    Book Appointment
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
