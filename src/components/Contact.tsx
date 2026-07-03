'use client'

import { motion } from 'framer-motion'
import { SHOP_INFO } from '@/lib/data'
import { HiPhone, HiEnvelope, HiMapPin, HiClock } from 'react-icons/hi2'

export default function Contact() {
  return (
    <section id="contact" className="relative py-32 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold-dark dark:text-gold font-semibold text-sm tracking-[0.2em] uppercase">
            Get in Touch
          </span>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-charcoal dark:text-white mt-4">
            Visit Us
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                <HiMapPin className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-charcoal dark:text-white text-lg">Address</h3>
                <p className="text-charcoal/60 dark:text-white/60">{SHOP_INFO.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                <HiPhone className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-charcoal dark:text-white text-lg">Phone</h3>
                <p className="text-charcoal/60 dark:text-white/60">{SHOP_INFO.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                <HiEnvelope className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-charcoal dark:text-white text-lg">Email</h3>
                <p className="text-charcoal/60 dark:text-white/60">{SHOP_INFO.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                <HiClock className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-charcoal dark:text-white text-lg">Hours</h3>
                <div className="space-y-1">
                  {SHOP_INFO.hours.map((h) => (
                    <div key={h.day} className="flex gap-4 text-charcoal/60 dark:text-white/60">
                      <span className="w-24 font-medium">{h.day}</span>
                      <span>{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-auto lg:h-full min-h-[400px]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-charcoal to-black flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                  <HiMapPin className="w-8 h-8 text-gold" />
                </div>
                <p className="text-white/60 mb-2">Find us at</p>
                <p className="text-white font-heading text-lg">{SHOP_INFO.address}</p>
                <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-gold/10 rounded-full border border-gold/20">
                  <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                  <span className="text-gold text-sm">Open today until 7:00 PM</span>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 ring-1 ring-gold/10 rounded-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
