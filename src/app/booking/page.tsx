'use client'

import { useState, useMemo, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'
import { format, addDays, startOfWeek, isSameDay, isBefore, startOfToday } from 'date-fns'
import { services, barbers, timeSlots } from '@/lib/data'
import { saveBooking, generateId, getBookedSlots } from '@/lib/store'
import { HiCheck, HiArrowRight, HiCalendarDays, HiClock } from 'react-icons/hi2'

const steps = ['Service', 'Barber', 'Date & Time', 'Details', 'Confirm']

function BookingForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const preselectedService = searchParams.get('service')

  const [step, setStep] = useState(0)
  const [selectedService, setSelectedService] = useState(preselectedService || '')
  const [selectedBarber, setSelectedBarber] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [booked, setBooked] = useState(false)

  const today = startOfToday()
  const weekStart = startOfWeek(today, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 14 }, (_, i) => addDays(weekStart, i))
  const bookedSlots = selectedDate ? getBookedSlots(format(selectedDate, 'yyyy-MM-dd')) : []
  const availableSlots = useMemo(() => timeSlots.filter((s) => !bookedSlots.includes(s)), [bookedSlots])
  const selectedServiceData = services.find((s) => s.id === selectedService)
  const selectedBarberData = barbers.find((b) => b.id === selectedBarber)

  const handleBook = () => {
    if (!selectedDate) return
    saveBooking({ id: generateId(), serviceId: selectedService, barberId: selectedBarber, customerName: name, customerEmail: email, customerPhone: phone, date: format(selectedDate, 'yyyy-MM-dd'), time: selectedTime, notes, status: 'confirmed', createdAt: new Date().toISOString() })
    setBooked(true)
  }

  if (booked) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 px-8">
        <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6"><HiCheck className="w-10 h-10 text-gold" /></div>
        <h2 className="text-3xl font-heading font-bold text-charcoal dark:text-white mb-4">Booking Confirmed!</h2>
        <p className="text-charcoal/60 dark:text-white/60 mb-2">{selectedServiceData?.name} with {selectedBarberData?.name}</p>
        <p className="text-charcoal/60 dark:text-white/60 mb-8">{selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')} at {selectedTime}</p>
        <p className="text-sm text-charcoal/40 dark:text-white/40 mb-8">A confirmation has been sent to {email}</p>
        <button onClick={() => router.push('/')} className="px-8 py-3 bg-charcoal dark:bg-gold text-white dark:text-charcoal font-semibold rounded-full hover:bg-gold dark:hover:bg-white transition-colors">Back to Home</button>
      </motion.div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-center gap-2 mb-12">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all duration-300 ${i <= step ? 'bg-gold text-charcoal' : 'bg-gold/10 text-charcoal/30 dark:text-white/30'}`}>{i + 1}</div>
            <span className={`ml-2 text-sm font-medium hidden sm:block ${i <= step ? 'text-charcoal dark:text-white' : 'text-charcoal/30 dark:text-white/30'}`}>{s}</span>
            {i < steps.length - 1 && <div className={`w-8 h-0.5 mx-2 ${i < step ? 'bg-gold' : 'bg-gold/10'}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
            <h3 className="text-2xl font-heading font-bold text-charcoal dark:text-white mb-6 text-center">Choose a Service</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {services.map((s) => (
                <button key={s.id} onClick={() => { setSelectedService(s.id); setStep(1) }} className={`text-left p-5 rounded-xl border transition-all duration-300 ${selectedService === s.id ? 'border-gold bg-gold/5 shadow-lg shadow-gold/10' : 'border-gold/10 hover:border-gold/30 bg-white dark:bg-charcoal-light'}`}>
                  <h4 className="font-heading font-bold text-charcoal dark:text-white">{s.name}</h4>
                  <p className="text-sm text-charcoal/60 dark:text-white/60 mt-1">{s.description}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-gold font-bold">${s.price}</span>
                    <span className="text-charcoal/40 dark:text-white/40 text-sm">{s.duration} min</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
            <h3 className="text-2xl font-heading font-bold text-charcoal dark:text-white mb-6 text-center">Choose Your Barber</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {barbers.map((b) => (
                <button key={b.id} onClick={() => { setSelectedBarber(b.id); setStep(2) }} className={`text-center p-6 rounded-xl border transition-all duration-300 ${selectedBarber === b.id ? 'border-gold bg-gold/5 shadow-lg shadow-gold/10' : 'border-gold/10 hover:border-gold/30 bg-white dark:bg-charcoal-light'}`}>
                  <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4"><img src={b.image} alt={b.name} className="w-full h-full object-cover" /></div>
                  <h4 className="font-heading font-bold text-charcoal dark:text-white">{b.name}</h4>
                  <p className="text-gold text-sm">{b.title}</p>
                  <p className="text-charcoal/50 dark:text-white/50 text-xs mt-2">{b.bio.slice(0, 60)}...</p>
                </button>
              ))}
            </div>
            <div className="text-center mt-6">
              <button onClick={() => setStep(0)} className="text-sm text-charcoal/50 dark:text-white/50 hover:text-gold transition-colors">&larr; Back to services</button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
            <h3 className="text-2xl font-heading font-bold text-charcoal dark:text-white mb-6 text-center">Pick Date & Time</h3>
            <div className="mb-8">
              <p className="text-sm font-medium text-charcoal/60 dark:text-white/60 mb-3 flex items-center gap-2"><HiCalendarDays className="w-4 h-4" /> Select Date</p>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {weekDays.map((day) => {
                  const isPast = isBefore(day, today) && !isSameDay(day, today)
                  const isSelected = selectedDate && isSameDay(day, selectedDate)
                  return (
                    <button key={day.toISOString()} disabled={isPast} onClick={() => { setSelectedDate(day); setSelectedTime('') }} className={`flex-shrink-0 w-20 py-3 rounded-xl text-center transition-all duration-300 ${isPast ? 'opacity-30 cursor-not-allowed bg-gold/5' : isSelected ? 'bg-gold text-charcoal shadow-lg shadow-gold/20' : 'bg-white dark:bg-charcoal-light border border-gold/10 hover:border-gold/30 text-charcoal dark:text-white'}`}>
                      <div className="text-xs font-medium">{format(day, 'd')}</div>
                      <div className="text-xs">{format(day, 'MMM')}</div>
                    </button>
                  )
                })}
              </div>
            </div>
            {selectedDate && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <p className="text-sm font-medium text-charcoal/60 dark:text-white/60 mb-3 flex items-center gap-2"><HiClock className="w-4 h-4" /> Available Times</p>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {availableSlots.map((slot) => (
                    <button key={slot} onClick={() => setSelectedTime(slot)} className={`py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${selectedTime === slot ? 'bg-gold text-charcoal shadow-lg shadow-gold/20' : 'bg-white dark:bg-charcoal-light border border-gold/10 hover:border-gold/30 text-charcoal/70 dark:text-white/70'}`}>{slot}</button>
                  ))}
                </div>
              </motion.div>
            )}
            <div className="flex items-center justify-between mt-8">
              <button onClick={() => setStep(1)} className="text-sm text-charcoal/50 dark:text-white/50 hover:text-gold transition-colors">&larr; Back to barbers</button>
              {selectedDate && selectedTime && <button onClick={() => setStep(3)} className="px-6 py-2.5 bg-gold text-charcoal font-semibold rounded-full hover:bg-gold-light transition-colors flex items-center gap-2">Continue <HiArrowRight className="w-4 h-4" /></button>}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
            <h3 className="text-2xl font-heading font-bold text-charcoal dark:text-white mb-6 text-center">Your Details</h3>
            <div className="max-w-md mx-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal/70 dark:text-white/70 mb-1.5">Full Name *</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="w-full px-4 py-3 rounded-xl border border-gold/10 bg-white dark:bg-charcoal-light text-charcoal dark:text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal/70 dark:text-white/70 mb-1.5">Email Address *</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" className="w-full px-4 py-3 rounded-xl border border-gold/10 bg-white dark:bg-charcoal-light text-charcoal dark:text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal/70 dark:text-white/70 mb-1.5">Phone Number *</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" className="w-full px-4 py-3 rounded-xl border border-gold/10 bg-white dark:bg-charcoal-light text-charcoal dark:text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal/70 dark:text-white/70 mb-1.5">Special Requests</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any preferences or notes..." rows={3} className="w-full px-4 py-3 rounded-xl border border-gold/10 bg-white dark:bg-charcoal-light text-charcoal dark:text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all resize-none" />
              </div>
              <div className="bg-gold/5 rounded-xl p-4 border border-gold/10">
                <h4 className="font-heading font-bold text-charcoal dark:text-white mb-2">Booking Summary</h4>
                <div className="space-y-1 text-sm text-charcoal/60 dark:text-white/60">
                  <p>Service: {selectedServiceData?.name}</p>
                  <p>Barber: {selectedBarberData?.name}</p>
                  <p>Date: {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
                  <p>Time: {selectedTime}</p>
                  <p className="text-gold font-bold text-base mt-2">Total: ${selectedServiceData?.price}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-8 max-w-md mx-auto">
              <button onClick={() => setStep(2)} className="text-sm text-charcoal/50 dark:text-white/50 hover:text-gold transition-colors">&larr; Back to time</button>
              <button onClick={handleBook} className="px-8 py-3 bg-gold text-charcoal font-bold rounded-full hover:bg-gold-light transition-all flex items-center gap-2">Confirm Booking <HiCheck className="w-4 h-4" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function BookingPage() {
  return (
    <section className="relative min-h-screen pt-32 pb-20 bg-cream dark:bg-charcoal">
      <div className="absolute inset-0 bg-grid" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <span className="text-gold-dark dark:text-gold font-semibold text-sm tracking-[0.2em] uppercase">Book Your Visit</span>
          <h1 className="text-4xl sm:text-5xl font-heading font-bold text-charcoal dark:text-white mt-4">Reserve Your Chair</h1>
          <p className="text-charcoal/60 dark:text-white/60 max-w-xl mx-auto mt-4">Select your service, barber, and preferred time. We&apos;ll take care of the rest.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-charcoal-light rounded-2xl p-6 sm:p-10 shadow-xl shadow-gold/5 border border-gold/10">
          <Suspense fallback={<div className="text-center py-10"><div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" /></div>}>
            <BookingForm />
          </Suspense>
        </motion.div>
      </div>
    </section>
  )
}
