'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  getBookings, updateBookingStatus, updateBooking, deleteBooking,
  getSettings, saveSettings, getDailyBookingCount, getDefaultSettings
} from '@/lib/store'
import { services, barbers } from '@/lib/data'
import { Booking, ShopSettings, DaySchedule } from '@/types'
import {
  HiOutlineCheck, HiOutlineXMark, HiOutlineCalendarDays,
  HiOutlineCog6Tooth, HiOutlinePencilSquare, HiOutlineTrash,
  HiOutlineClock, HiOutlineSun, HiOutlineArrowPath
} from 'react-icons/hi2'

const ADMIN_PW_HASH = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'

async function sha256(msg: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(msg))
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

type Tab = 'dashboard' | 'settings'
type BookingStatus = Booking['status']

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all')
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [authError, setAuthError] = useState('')
  const [tab, setTab] = useState<Tab>('dashboard')
  const [settings, setSettings] = useState<ShopSettings>(getDefaultSettings())
  const [settingsSaved, setSettingsSaved] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [loginBlocked, setLoginBlocked] = useState(false)
  const loginTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Reschedule state
  const [rescheduleId, setRescheduleId] = useState<string | null>(null)
  const [rescheduleDate, setRescheduleDate] = useState('')
  const [rescheduleTime, setRescheduleTime] = useState('')

  useEffect(() => {
    setBookings(getBookings())
    setSettings(getSettings())
  }, [])

  useEffect(() => {
    if (!authenticated) return
    const interval = setInterval(() => setBookings(getBookings()), 5000)
    return () => clearInterval(interval)
  }, [authenticated])

  const refreshBookings = () => setBookings(getBookings())

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loginBlocked) return
    setAuthError('')
    const hash = await sha256(password)
    if (hash === ADMIN_PW_HASH) {
      setAuthenticated(true)
      setLoginAttempts(0)
    } else {
      const attempts = loginAttempts + 1
      setLoginAttempts(attempts)
      setAuthError(attempts >= 3 ? 'Too many attempts. Try again in 30 seconds.' : 'Incorrect password')
      if (attempts >= 3) {
        setLoginBlocked(true)
        if (loginTimer.current) clearTimeout(loginTimer.current)
        loginTimer.current = setTimeout(() => {
          setLoginBlocked(false)
          setLoginAttempts(0)
        }, 30000)
      }
    }
  }

  const handleStatus = (id: string, status: BookingStatus) => {
    updateBookingStatus(id, status)
    refreshBookings()
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this booking permanently?')) {
      deleteBooking(id)
      refreshBookings()
    }
  }

  const handleReschedule = (booking: Booking) => {
    setRescheduleId(booking.id)
    setRescheduleDate(booking.date)
    setRescheduleTime(booking.time)
  }

  const confirmReschedule = () => {
    if (!rescheduleId || !rescheduleDate || !rescheduleTime) return
    updateBooking(rescheduleId, { date: rescheduleDate, time: rescheduleTime })
    setRescheduleId(null)
    refreshBookings()
  }

  const handleSaveSettings = () => {
    saveSettings(settings)
    setSettingsSaved(true)
    setTimeout(() => setSettingsSaved(false), 2500)
  }

  const updateSchedule = (index: number, field: keyof DaySchedule, value: string | number | boolean) => {
    const s = { ...settings }
    s.schedules = s.schedules.map((d, i) => i === index ? { ...d, [field]: value } : d)
    setSettings(s)
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
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" disabled={loginBlocked}
            className="w-full px-4 py-3 rounded-xl border border-gold/10 bg-white dark:bg-charcoal-light text-charcoal dark:text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all mb-2" />
          {authError && <p className="text-red-400 text-xs mb-4">{authError}</p>}
          <button type="submit" disabled={loginBlocked}
            className="w-full px-6 py-3 bg-charcoal dark:bg-gold text-white dark:text-charcoal font-semibold rounded-xl hover:bg-gold dark:hover:bg-white transition-colors disabled:opacity-40">
            {loginBlocked ? 'Locked (30s)' : 'Sign In'}
          </button>
        </motion.form>
      </section>
    )
  }

  return (
    <section className="min-h-screen pt-28 pb-20 bg-cream dark:bg-charcoal">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-1 mb-8 p-1 bg-white dark:bg-charcoal-light rounded-xl border border-gold/10 w-fit">
          <button onClick={() => setTab('dashboard')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === 'dashboard' ? 'bg-charcoal dark:bg-gold text-white dark:text-charcoal shadow-lg' : 'text-charcoal/60 dark:text-white/60 hover:text-charcoal dark:hover:text-white'}`}>
            <HiOutlineCalendarDays className="w-4 h-4" /> Dashboard
          </button>
          <button onClick={() => setTab('settings')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === 'settings' ? 'bg-charcoal dark:bg-gold text-white dark:text-charcoal shadow-lg' : 'text-charcoal/60 dark:text-white/60 hover:text-charcoal dark:hover:text-white'}`}>
            <HiOutlineCog6Tooth className="w-4 h-4" /> Settings
          </button>
        </div>

        {tab === 'dashboard' && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-heading font-bold text-charcoal dark:text-white">Booking Dashboard</h1>
                <p className="text-charcoal/60 dark:text-white/60">{bookings.length} total booking{bookings.length !== 1 ? 's' : ''}</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {(['all', 'confirmed', 'completed', 'cancelled'] as const).map((f) => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${filter === f ? 'bg-charcoal dark:bg-gold text-white dark:text-charcoal' : 'bg-white dark:bg-charcoal-light text-charcoal/60 dark:text-white/60 border border-gold/10 hover:border-gold/30'}`}>{f}</button>
                ))}
              </div>
            </div>

            {bookings.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {(['confirmed', 'completed', 'cancelled'] as const).map((s) => {
                  const count = bookings.filter((b) => b.status === s).length
                  const colors = {
                    confirmed: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300',
                    completed: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300',
                    cancelled: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300',
                  }
                  return (
                    <div key={s} className={`p-4 rounded-xl border ${colors[s as keyof typeof colors]}`}>
                      <p className="text-sm capitalize">{s}</p>
                      <p className="text-2xl font-heading font-bold">{count}</p>
                    </div>
                  )
                })}
                <div className="p-4 rounded-xl border border-gold/10 bg-gold/5 text-gold-dark dark:text-gold">
                  <p className="text-sm">Revenue</p>
                  <p className="text-2xl font-heading font-bold">
                    ${bookings.filter(b => b.status !== 'cancelled').reduce((sum, b) => {
                      const svc = services.find(s => s.id === b.serviceId)
                      return sum + (svc?.price || 0)
                    }, 0)}
                  </p>
                </div>
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <HiOutlineCalendarDays className="w-16 h-16 text-gold/30 mx-auto mb-4" />
                <p className="text-charcoal/40 dark:text-white/40">No bookings found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((booking, i) => (
                  <motion.div key={booking.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                    className="bg-white dark:bg-charcoal-light rounded-xl p-5 border border-gold/10 hover:border-gold/20 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1.5">
                          <h3 className="font-heading font-bold text-charcoal dark:text-white truncate">{booking.customerName}</h3>
                          <span className={`shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            booking.status === 'confirmed' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                            booking.status === 'completed' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                            'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                          }`}>{booking.status}</span>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-charcoal/60 dark:text-white/60">
                          <span>{getServiceName(booking.serviceId)}</span>
                          <span>with {getBarberName(booking.barberId)}</span>
                          <span className="flex items-center gap-1"><HiOutlineCalendarDays className="w-3.5 h-3.5" />{booking.date}</span>
                          <span className="flex items-center gap-1"><HiOutlineClock className="w-3.5 h-3.5" />{booking.time}</span>
                          <span className="hidden sm:inline">{booking.customerEmail}</span>
                          <span className="hidden sm:inline">{booking.customerPhone}</span>
                        </div>
                        {booking.notes && <p className="text-xs text-charcoal/40 dark:text-white/40 mt-1 italic truncate">Notes: {booking.notes}</p>}
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <button onClick={() => handleReschedule(booking)} className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors" title="Reschedule"><HiOutlineArrowPath className="w-4 h-4" /></button>
                        {booking.status === 'confirmed' && (
                          <>
                            <button onClick={() => handleStatus(booking.id, 'completed')} className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors" title="Mark completed"><HiOutlineCheck className="w-4 h-4" /></button>
                            <button onClick={() => handleStatus(booking.id, 'cancelled')} className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors" title="Cancel"><HiOutlineXMark className="w-4 h-4" /></button>
                          </>
                        )}
                        <button onClick={() => handleDelete(booking.id)} className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors" title="Delete"><HiOutlineTrash className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <AnimatePresence>
              {rescheduleId && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
                  onClick={() => setRescheduleId(null)}>
                  <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white dark:bg-charcoal-light rounded-2xl p-6 shadow-2xl border border-gold/10 w-full max-w-sm">
                    <h3 className="text-lg font-heading font-bold text-charcoal dark:text-white mb-4">Reschedule Booking</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-charcoal/70 dark:text-white/70 mb-1">New Date</label>
                        <input type="date" value={rescheduleDate} onChange={(e) => setRescheduleDate(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-gold/10 bg-white dark:bg-charcoal-light text-charcoal dark:text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-charcoal/70 dark:text-white/70 mb-1">New Time</label>
                        <input type="time" value={rescheduleTime} onChange={(e) => setRescheduleTime(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-gold/10 bg-white dark:bg-charcoal-light text-charcoal dark:text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all" />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-6">
                      <button onClick={() => setRescheduleId(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-gold/10 text-charcoal/60 dark:text-white/60 hover:bg-gold/5 transition-all text-sm font-medium">Cancel</button>
                      <button onClick={confirmReschedule} className="flex-1 px-4 py-2.5 rounded-xl bg-charcoal dark:bg-gold text-white dark:text-charcoal font-semibold hover:bg-gold dark:hover:bg-white transition-all text-sm">Confirm</button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {tab === 'settings' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-heading font-bold text-charcoal dark:text-white">Shop Settings</h1>
                <p className="text-charcoal/60 dark:text-white/60">Configure operating hours and daily booking limits per day of the week.</p>
              </div>
              <button onClick={handleSaveSettings}
                className="px-6 py-2.5 bg-charcoal dark:bg-gold text-white dark:text-charcoal font-semibold rounded-full hover:bg-gold dark:hover:bg-white transition-all shadow-lg">
                {settingsSaved ? 'Saved!' : 'Save Settings'}
              </button>
            </div>

            <div className="bg-white dark:bg-charcoal-light rounded-2xl border border-gold/10 overflow-hidden">
              <div className="p-6 border-b border-gold/10">
                <h2 className="font-heading font-bold text-charcoal dark:text-white flex items-center gap-2">
                  <HiOutlineSun className="w-5 h-5 text-gold" /> Weekly Schedule
                </h2>
              </div>
              <div className="divide-y divide-gold/5">
                {settings.schedules.map((schedule, i) => (
                  <div key={schedule.day} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                    <div className="flex items-center gap-3 sm:w-36 shrink-0">
                      <button onClick={() => updateSchedule(i, 'enabled', !schedule.enabled)}
                        className={`w-10 h-6 rounded-full transition-colors relative ${schedule.enabled ? 'bg-gold' : 'bg-gold/20'}`}>
                        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${schedule.enabled ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
                      </button>
                      <span className={`font-medium text-sm ${schedule.enabled ? 'text-charcoal dark:text-white' : 'text-charcoal/30 dark:text-white/30'}`}>{schedule.day}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-1 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <HiOutlineSun className="w-4 h-4 text-gold/60 shrink-0" />
                        <input type="time" value={schedule.open} onChange={(e) => updateSchedule(i, 'open', e.target.value)}
                          disabled={!schedule.enabled}
                          className="w-28 px-2.5 py-1.5 rounded-lg border border-gold/10 bg-white dark:bg-charcoal-light text-sm text-charcoal dark:text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all disabled:opacity-30" />
                      </div>
                      <span className="text-charcoal/30 dark:text-white/30">→</span>
                      <div className="flex items-center gap-1.5">
                        <HiOutlineClock className="w-4 h-4 text-gold/60 shrink-0" />
                        <input type="time" value={schedule.close} onChange={(e) => updateSchedule(i, 'close', e.target.value)}
                          disabled={!schedule.enabled}
                          className="w-28 px-2.5 py-1.5 rounded-lg border border-gold/10 bg-white dark:bg-charcoal-light text-sm text-charcoal dark:text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all disabled:opacity-30" />
                      </div>
                      <div className="flex items-center gap-1.5 ml-auto">
                        <span className="text-xs text-charcoal/40 dark:text-white/40">Max:</span>
                        <input type="number" min={1} max={100} value={schedule.maxBookings} onChange={(e) => updateSchedule(i, 'maxBookings', Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                          disabled={!schedule.enabled}
                          className="w-16 px-2 py-1.5 rounded-lg border border-gold/10 bg-white dark:bg-charcoal-light text-sm text-charcoal dark:text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all text-center disabled:opacity-30" />
                        <span className="text-xs text-charcoal/40 dark:text-white/40">bookings</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 bg-white dark:bg-charcoal-light rounded-2xl border border-gold/10 p-6">
              <h2 className="font-heading font-bold text-charcoal dark:text-white mb-4">Daily Capacity Overview</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {settings.schedules.map((s) => {
                  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })
                  const isToday = s.day === today
                  return (
                    <div key={s.day} className={`p-3 rounded-xl border text-center ${isToday ? 'border-gold bg-gold/5' : s.enabled ? 'border-gold/10' : 'border-gold/5 opacity-50'}`}>
                      <p className="text-xs font-medium text-charcoal/50 dark:text-white/50">{s.day.slice(0, 3)}</p>
                      <p className="text-lg font-heading font-bold text-charcoal dark:text-white">{s.enabled ? s.maxBookings : '—'}</p>
                      <p className="text-[10px] text-charcoal/40 dark:text-white/40">slots</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
