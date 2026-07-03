'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getBookings, updateBookingStatus } from '@/lib/store'
import { services, barbers } from '@/lib/data'
import { Booking } from '@/types'
import { HiOutlineCheck, HiOutlineXMark, HiOutlineCalendarDays } from 'react-icons/hi2'

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filter, setFilter] = useState<Booking['status'] | 'all'>('all')
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => { setBookings(getBookings()) }, [])

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'admin123') setAuthenticated(true)
  }

  const handleStatus = (id: string, status: Booking['status']) => {
    updateBookingStatus(id, status)
    setBookings(getBookings())
  }

  const getServiceName = (id: string) => services.find((s) => s.id === id)?.name || id
  const getBarberName = (id: string) => barbers.find((b) => b.id === id)?.name || id
  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter)

  if (!authenticated) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-cream dark:bg-charcoal">
        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleAuth}
          className="bg-white dark:bg-charcoal-light rounded-2xl p-8 shadow-xl border border-gold/10 w-full max-w-sm">
          <h1 className="text-2xl font-heading font-bold text-charcoal dark:text-white mb-2 text-center">Admin Access</h1>
          <p className="text-charcoal/60 dark:text-white/60 text-sm text-center mb-6">Enter the admin password to manage bookings.</p>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
            className="w-full px-4 py-3 rounded-xl border border-gold/10 bg-white dark:bg-charcoal-light text-charcoal dark:text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all mb-4" />
          <button type="submit" className="w-full px-6 py-3 bg-charcoal dark:bg-gold text-white dark:text-charcoal font-semibold rounded-xl hover:bg-gold dark:hover:bg-white transition-colors">Sign In</button>
        </motion.form>
      </section>
    )
  }

  return (
    <section className="min-h-screen pt-32 pb-20 bg-cream dark:bg-charcoal">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-charcoal dark:text-white">Booking Dashboard</h1>
            <p className="text-charcoal/60 dark:text-white/60">{bookings.length} total booking{bookings.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex gap-2">
            {(['all', 'confirmed', 'completed', 'cancelled'] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${filter === f ? 'bg-charcoal dark:bg-gold text-white dark:text-charcoal' : 'bg-white dark:bg-charcoal-light text-charcoal/60 dark:text-white/60 border border-gold/10'}`}>{f}</button>
            ))}
          </div>
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <HiOutlineCalendarDays className="w-16 h-16 text-gold/30 mx-auto mb-4" />
            <p className="text-charcoal/40 dark:text-white/40">No bookings found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((booking, i) => (
              <motion.div key={booking.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-charcoal-light rounded-xl p-6 border border-gold/10 hover:border-gold/20 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-heading font-bold text-charcoal dark:text-white">{booking.customerName}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${booking.status === 'confirmed' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : booking.status === 'completed' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>{booking.status}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-charcoal/60 dark:text-white/60">
                      <span>{getServiceName(booking.serviceId)}</span>
                      <span>with {getBarberName(booking.barberId)}</span>
                      <span>{booking.date} at {booking.time}</span>
                      <span>{booking.customerEmail}</span>
                      <span>{booking.customerPhone}</span>
                    </div>
                    {booking.notes && <p className="text-xs text-charcoal/40 dark:text-white/40 mt-1 italic">Notes: {booking.notes}</p>}
                  </div>
                  <div className="flex gap-2">
                    {booking.status === 'confirmed' && (
                      <>
                        <button onClick={() => handleStatus(booking.id, 'completed')} className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 hover:bg-green-200 transition-colors" title="Mark completed"><HiOutlineCheck className="w-4 h-4" /></button>
                        <button onClick={() => handleStatus(booking.id, 'cancelled')} className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 hover:bg-red-200 transition-colors" title="Cancel booking"><HiOutlineXMark className="w-4 h-4" /></button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
