'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { SHOP_INFO } from '@/lib/data'

const quickLinks = [
  { href: '/#services', label: 'Services' },
  { href: '/#about', label: 'About' },
  { href: '/#gallery', label: 'Gallery' },
  { href: '/#testimonials', label: 'Testimonials' },
  { href: '/#contact', label: 'Contact' },
]

const serviceLinks = [
  { href: '/booking?service=classic-haircut', label: 'Classic Haircut' },
  { href: '/booking?service=beard-sculpting', label: 'Beard Sculpting' },
  { href: '/booking?service=hot-towel-shave', label: 'Hot Towel Shave' },
  { href: '/booking?service=kids-cut', label: "Kid's Cut" },
]

export default function Footer() {
  return (
    <footer className="relative bg-charcoal border-t border-white/5">
      <div className="absolute inset-0 bg-grid-white opacity-5" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-charcoal font-bold text-sm">B</span>
              <span className="font-heading text-xl font-bold tracking-wider text-white">BARBERIA</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">Premium grooming services in an atmosphere of timeless craftsmanship.</p>
          </div>
          <div><h3 className="text-white font-heading font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">{quickLinks.map((l) => (<li key={l.href}><Link href={l.href} className="text-white/40 text-sm hover:text-gold transition-colors">{l.label}</Link></li>))}</ul>
          </div>
          <div><h3 className="text-white font-heading font-bold text-lg mb-4">Services</h3>
            <ul className="space-y-3">{serviceLinks.map((s) => (<li key={s.href}><Link href={s.href} className="text-white/40 text-sm hover:text-gold transition-colors">{s.label}</Link></li>))}</ul>
          </div>
          <div><h3 className="text-white font-heading font-bold text-lg mb-4">Hours</h3>
            {SHOP_INFO.hours.map((h, i) => (
              <p key={i} className="text-white/40 text-sm">{h.day} {h.time}</p>
            ))}
            <div className="mt-4 p-3 rounded-lg bg-gold/5 border border-gold/10"><p className="text-xs text-white/30">Currently</p><p className="text-gold text-sm font-medium">Open today until 7:00 PM</p></div>
          </div>
        </div>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-white/20 text-xs">&copy; {new Date().getFullYear()} BARBERIA. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-white/10 hover:text-gold/50 text-xs transition-colors">Admin</Link>
            <span className="text-white/10 text-xs">Crafted with precision &middot; Premium barbershop experience</span>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
