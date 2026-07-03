'use client'

import { motion } from 'framer-motion'
import { HiMapPin, HiPhone, HiEnvelope, HiClock, HiArrowRight } from 'react-icons/hi2'
import { SHOP_INFO } from '@/lib/data'

export default function Contact() {
  return (
    <section id="contact" className="relative py-24 sm:py-32 bg-white dark:bg-charcoal-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} className="text-center mb-16">
          <span className="text-gold-dark dark:text-gold font-semibold text-sm tracking-[0.2em] uppercase">Get in Touch</span>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-charcoal dark:text-white mt-4">Visit Us</h2>
          <p className="text-charcoal/50 dark:text-white/50 max-w-xl mx-auto mt-4 text-lg">We would love to hear from you. Drop by the shop or book your appointment online.</p>
        </motion.div>
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            {[
              { icon: HiMapPin, label: 'Address', value: SHOP_INFO.address },
              { icon: HiPhone, label: 'Phone', value: SHOP_INFO.phone },
              { icon: HiEnvelope, label: 'Email', value: SHOP_INFO.email },
              { icon: HiClock, label: 'Hours', value: SHOP_INFO.hours.map(h => h.day + ' ' + h.time).join(', ') },
            ].map((item, i) => (
              <motion.div key={item.label} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-xl bg-cream dark:bg-charcoal border border-gold/10 hover:border-gold/20 transition-all group">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold/10 to-gold/5 flex items-center justify-center text-gold flex-shrink-0 group-hover:scale-110 transition-transform"><item.icon className="w-5 h-5" /></div>
                <div><p className="text-xs text-gold font-semibold tracking-wider uppercase">{item.label}</p><p className="text-charcoal dark:text-white font-medium mt-0.5">{item.value}</p></div>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-charcoal border border-gold/10">
            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <HiMapPin className="w-12 h-12 text-gold mb-4" />
              <p className="text-white font-heading text-xl font-bold">{SHOP_INFO.address}</p>
              <p className="text-white/40 text-sm mt-2">Find us at our flagship location</p>
              <a href={'https://maps.google.com/?q=' + encodeURIComponent(SHOP_INFO.address)} target="_blank" rel="noopener noreferrer"
                className="mt-6 px-6 py-3 bg-gold text-charcoal font-semibold rounded-full text-sm hover:bg-gold-light transition-all inline-flex items-center gap-2">
                Open in Maps <HiArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
