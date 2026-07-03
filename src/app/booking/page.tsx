'use client'

import { useState, useMemo, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'
import { format, addDays, startOfWeek, isSameDay, isBefore, startOfToday } from 'date-fns'
import { services, barbers, timeSlots } from '@/lib/data'
import { saveBooking, generateId, getBookedSlots, getDailyBookingCount, getSettings } from '@/lib/store'
import { HiCheck, HiArrowRight, HiCalendarDays, HiClock, HiExclamationCircle } from 'react-icons/hi2'

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
  const [errors, setErrors] = useState<Record<string, string>>({})

  const today = startOfToday()
  const weekStart = startOfWeek(today, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 14 }, (_, i) => addDays(weekStart, i))
  const settings = getSettings()
  const bookedSlots = selectedDate ? getBookedSlots(format(selectedDate, 'yyyy-MM-dd')) : []
  const dailyCount = selectedDate ? getDailyBookingCount(format(selectedDate, 'yyyy-MM-dd')) : 0

  const dayName = selectedDate ? format(selectedDate, 'EEEE') : ''
  const daySchedule = settings.schedules.find((s) => s.day === dayName)
  const isAtCapacity = daySchedule ? dailyCount >= daySchedule.maxBookings : false

  const availableSlots = useMemo(() => {
    let slots = timeSlots.filter((s) => !bookedSlots.includes(s))
    if (daySchedule && !isAtCapacity) {
      slots = slots.filter((s) => s >= daySchedule.open && s <= daySchedule.close)
    }
    return slots
  }, [bookedSlots, daySchedule, isAtCapacity])

  const selectedServiceData = services.find((s) => s.id === selectedService)
  const selectedBarberData = barbers.find((b) => b.id === selectedBarber)

  const validateDetails = () => {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Name is required'
    if (!email.trim()) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email address'
    if (!phone.trim()) errs.phone = 'Phone is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleBook = () => {
    if (!selectedDate) return
    saveBooking({ id: generateId(), serviceId: selectedService, barberId: selectedBarber, customerName: name, customerEmail: email, customerPhone: phone, date: format(selectedDate, 'yyyy-MM-dd'), time: selectedTime, notes, status: 'confirmed', createdAt: new Date().toISOString() })
    setBooked(true)
  }

  const handleDetailsContinue = () => {
    if (validateDetails()) setStep(4)
  }

  if (booked) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 px-8" role="status" aria-live="polite">
        <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6"><HiCheck className="w-10 h-10 text-gold" /></div>
        <h2 className="text-3xl font-heading font-bold text-charcoal dark:text-white mb-4">Booking Confirmed!</h2>
        <p className="text-charcoal/60 dark:text-white/60 mb-2">{selectedServiceData?.name} with {selectedBarberData?.name}</p>
        <p className="text-charcoal/60 dark:text-white/60 mb-8">{selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')} at {selectedTime}</p>
        <p className="text-sm text-charcoal/40 dark:text-white/40 mb-8">A confirmation has been sent to {email}</p>
        <button onClick={() => router.push('/')} className="px-8 py-3 bg-charcoal dark:bg-gold text-white dark:text-charcoal font-semibold rounded-full hover:bg-gold dark:hover:bg-white transition-colors">Back to Home</button>
      </motion.div>
    )
  }

  const StepIndicator = ({ num, label }: { num: number; label: string }) => (
    <div className="flex items-center">
      <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all duration-300 ${num <= step ? 'bg-gold text-charcoal' : 'bg-gold/10 text-charcoal/30 dark:text-white/30'}`} aria-current={num === step ? 'step' : undefined}>{num + 1}</div>
      <span className={`ml-2 text-sm font-medium hidden sm:block ${num <= step ? 'text-charcoal dark:text-white' : 'text-charcoal/30 dark:text-white/30'}`}>{label}</span>
      {num < steps.length - 1 && <div className={`w-8 h-0.5 mx-2 ${num < step ? 'bg-gold' : 'bg-gold/10'}`} />}
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto">
      <nav className="flex items-center justify-center gap-2 mb-12" aria-label="Booking steps">
        {steps.map((s, i) => <StepIndicator key={s} num={i} label={s} />)}
      </nav>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
            <h3 className="text-2xl font-heading font-bold text-charcoal dark:text-white mb-6 text-center">Choose a Service</h3>
            <div className="grid md:grid-cols-2 gap-4" role="radiogroup" aria-label="Services">
              {services.map((s) => (
                <button key={s.id} onClick={() => { setSelectedService(s.id); setStep(1) }} role="radio" aria-checked={selectedService === s.id}
                  className={`text-left p-5 rounded-xl border transition-all duration-300 ${selectedService === s.id ? 'border-gold bg-gold/5 shadow-lg shadow-gold/10' : 'border-gold/10 hover:border-gold/30 bg-white dark:bg-charcoal-light'}`}>
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
            <div className="grid md:grid-cols-3 gap-6" role="radiogroup" aria-label="Barbers">
              {barbers.map((b) => (
                <button key={b.id} onClick={() => { setSelectedBarber(b.id); setStep(2) }} role="radio" aria-checked={selectedBarber === b.id}
                  className={`text-center p-6 rounded-xl border transition-all duration-300 ${selectedBarber === b.id ? 'border-gold bg-gold/5 shadow-lg shadow-gold/10' : 'border-gold/10 hover:border-gold/30 bg-white dark:bg-charcoal-light'}`}>
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
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" role="radiogroup" aria-label="Dates">
                {weekDays.map((day) => {
                  const isPast = isBefore(day, today) && !isSameDay(day, today)
                  const isSelected = selectedDate && isSameDay(day, selectedDate)
                  const dName = format(day, 'EEEE')
                  const dSchedule = settings.schedules.find((s) => s.day === dName)
                  const isOff = dSchedule && !dSchedule.enabled
                  return (
                    <button key={day.toISOString()} disabled={isPast || !!isOff} onClick={() => { setSelectedDate(day); setSelectedTime('') }} role="radio" aria-checked={!!isSelected} aria-label={format(day, 'EEEE, MMMM d, yyyy')}
                      className={`flex-shrink-0 w-20 py-3 rounded-xl text-center transition-all duration-300 ${isPast || isOff ? 'opacity-30 cursor-not-allowed bg-gold/5' : isSelected ? 'bg-gold text-charcoal shadow-lg shadow-gold/20' : 'bg-white dark:bg-charcoal-light border border-gold/10 hover:border-gold/30 text-charcoal dark:text-white'}`}>
                      <div className="text-xs font-medium">{format(day, 'd')}</div>
                      <div className="text-xs">{format(day, 'MMM')}</div>
                    </button>
                  )
                })}
              </div>
            </div>
            {selectedDate && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-charcoal/60 dark:text-white/60 flex items-center gap-2"><HiClock className="w-4 h-4" /> Available Times</p>
                  {daySchedule && (
                    <span className="text-xs text-charcoal/40 dark:text-white/40">
                      {dailyCount}/{daySchedule.maxBookings} booked
                    </span>
                  )}
                </div>
                {isAtCapacity ? (
                  <div className="text-center py-8 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
                    <p className="text-amber-700 dark:text-amber-300 font-medium">This day is fully booked</p>
                    <p className="text-amber-600/60 dark:text-amber-300/60 text-sm mt-1">Please select another date.</p>
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="text-center py-8 bg-gold/5 rounded-xl border border-gold/10">
                    <p className="text-charcoal/50 dark:text-white/50">No available time slots for this date.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2" role="radiogroup" aria-label="Times">
                    {availableSlots.map((slot) => (
                      <button key={slot} onClick={() => setSelectedTime(slot)} role="radio" aria-checked={selectedTime === slot}
                        className={`py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${selectedTime === slot ? 'bg-gold text-charcoal shadow-lg shadow-gold/20' : 'bg-white dark:bg-charcoal-light border border-gold/10 hover:border-gold/30 text-charcoal/70 dark:text-white/70'}`}>{slot}</button>
                    ))}
                  </div>
                )}
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
                <label htmlFor="booking-name" className="block text-sm font-medium text-charcoal/70 dark:text-white/70 mb-1.5">Full Name <span className="text-gold">*</span></label>
                <input id="booking-name" type="text" value={name} onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })) }} placeholder="John Doe"
                  className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-charcoal-light text-charcoal dark:text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all ${errors.name ? 'border-red-400' : 'border-gold/10'}`}
                  aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} />
                {errors.name && <p id="name-error" className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><HiExclamationCircle className="w-3 h-3" />{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="booking-email" className="block text-sm font-medium text-charcoal/70 dark:text-white/70 mb-1.5">Email Address <span className="text-gold">*</span></label>
                <input id="booking-email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })) }} placeholder="john@example.com"
                  className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-charcoal-light text-charcoal dark:text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all ${errors.email ? 'border-red-400' : 'border-gold/10'}`}
                  aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} />
                {errors.email && <p id="email-error" className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><HiExclamationCircle className="w-3 h-3" />{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="booking-phone" className="block text-sm font-medium text-charcoal/70 dark:text-white/70 mb-1.5">Phone Number <span className="text-gold">*</span></label>
                <input id="booking-phone" type="tel" value={phone} onChange={(e) => { setPhone(e.target.value); setErrors((p) => ({ ...p, phone: '' })) }} placeholder="+1 (555) 000-0000"
                  className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-charcoal-light text-charcoal dark:text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all ${errors.phone ? 'border-red-400' : 'border-gold/10'}`}
                  aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'phone-error' : undefined} />
                {errors.phone && <p id="phone-error" className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><HiExclamationCircle className="w-3 h-3" />{errors.phone}</p>}
              </div>
              <div>
                <label htmlFor="booking-notes" className="block text-sm font-medium text-charcoal/70 dark:text-white/70 mb-1.5">Special Requests</label>
                <textarea id="booking-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any preferences or notes..." rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gold/10 bg-white dark:bg-charcoal-light text-charcoal dark:text-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all resize-none" />
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
              <button onClick={handleDetailsContinue} className="px-8 py-3 bg-gold text-charcoal font-bold rounded-full hover:bg-gold-light transition-all flex items-center gap-2">Continue <HiArrowRight className="w-4 h-4" /></button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
            <h3 className="text-2xl font-heading font-bold text-charcoal dark:text-white mb-6 text-center">Confirm Booking</h3>
            <div className="max-w-md mx-auto bg-cream dark:bg-charcoal rounded-xl p-6 border border-gold/10 space-y-3">
              <div className="flex justify-between"><span className="text-charcoal/50 dark:text-white/50 text-sm">Service</span><span className="font-medium text-charcoal dark:text-white">{selectedServiceData?.name}</span></div>
              <div className="flex justify-between"><span className="text-charcoal/50 dark:text-white/50 text-sm">Barber</span><span className="font-medium text-charcoal dark:text-white">{selectedBarberData?.name}</span></div>
              <div className="flex justify-between"><span className="text-charcoal/50 dark:text-white/50 text-sm">Date</span><span className="font-medium text-charcoal dark:text-white">{selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}</span></div>
              <div className="flex justify-between"><span className="text-charcoal/50 dark:text-white/50 text-sm">Time</span><span className="font-medium text-charcoal dark:text-white">{selectedTime}</span></div>
              <div className="flex justify-between"><span className="text-charcoal/50 dark:text-white/50 text-sm">Name</span><span className="font-medium text-charcoal dark:text-white">{name}</span></div>
              <div className="flex justify-between"><span className="text-charcoal/50 dark:text-white/50 text-sm">Email</span><span className="font-medium text-charcoal dark:text-white">{email}</span></div>
              <div className="flex justify-between"><span className="text-charcoal/50 dark:text-white/50 text-sm">Phone</span><span className="font-medium text-charcoal dark:text-white">{phone}</span></div>
              <div className="pt-3 border-t border-gold/10 flex justify-between"><span className="font-heading font-bold text-charcoal dark:text-white">Total</span><span className="font-heading font-bold text-gold text-lg">${selectedServiceData?.price}</span></div>
            </div>
            <div className="flex items-center justify-between mt-8 max-w-md mx-auto">
              <button onClick={() => setStep(3)} className="text-sm text-charcoal/50 dark:text-white/50 hover:text-gold transition-colors">&larr; Edit details</button>
              <button onClick={handleBook} className="px-8 py-3 bg-gold text-charcoal font-bold rounded-full hover:bg-gold-light transition-all flex items-center gap-2 shadow-lg shadow-gold/20">Confirm Booking <HiCheck className="w-4 h-4" /></button>
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
