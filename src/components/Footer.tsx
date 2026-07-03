'use client'

import Link from 'next/link'
import { HiOutlineScissors } from 'react-icons/hi2'
import { FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa'
import { SHOP_INFO } from '@/lib/data'

export default function Footer() {
  return (
    <footer className="relative bg-charcoal dark:bg-black border-t border-white/5">
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, #C8A96E 1px, transparent 0)`,
        backgroundSize: '30px 30px',
      }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <HiOutlineScissors className="w-5 h-5 text-gold" />
              <span className="font-heading text-xl font-bold text-white">
                BARBER<span className="text-gold">ÍA</span>
              </span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed">
              {SHOP_INFO.description}
            </p>
            <div className="flex gap-3 mt-6">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:bg-gold hover:text-charcoal transition-all duration-300">
                <FaInstagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:bg-gold hover:text-charcoal transition-all duration-300">
                <FaFacebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:bg-gold hover:text-charcoal transition-all duration-300">
                <FaTwitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-heading font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {['Services', 'About', 'Gallery', 'Testimonials', 'Contact'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-white/40 hover:text-gold text-sm transition-colors duration-300"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-heading font-bold text-lg mb-4">Services</h3>
            <ul className="space-y-3">
              {['Classic Haircut', 'Beard Sculpting', 'Hot Towel Shave', "Kid's Cut"].map((item) => (
                <li key={item}>
                  <Link
                    href="/booking"
                    className="text-white/40 hover:text-gold text-sm transition-colors duration-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-heading font-bold text-lg mb-4">Hours</h3>
            <div className="space-y-2">
              {SHOP_INFO.hours.map((h) => (
                <div key={h.day} className="flex justify-between text-sm">
                  <span className="text-white/60">{h.day}</span>
                  <span className="text-white/40">{h.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} BARBERÍA. All rights reserved.
          </p>
          <p className="text-white/20 text-xs">
            Crafted with precision • Premium barbershop experience
          </p>
        </div>
      </div>
    </footer>
  )
}
