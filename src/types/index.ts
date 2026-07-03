export interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
  icon: string
}

export interface Barber {
  id: string
  name: string
  title: string
  bio: string
  image: string
  rating: number
}

export interface Testimonial {
  id: string
  name: string
  text: string
  rating: number
  service: string
}

export interface GalleryImage {
  id: string
  src: string
  alt: string
  category: string
}

export interface Booking {
  id: string
  serviceId: string
  barberId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  date: string
  time: string
  notes?: string
  status: 'confirmed' | 'cancelled' | 'completed'
  createdAt: string
}

export interface DaySchedule {
  day: string
  open: string
  close: string
  maxBookings: number
  enabled: boolean
}

export interface ShopSettings {
  schedules: DaySchedule[]
  slotInterval: number
}

export type TimeSlot = string
