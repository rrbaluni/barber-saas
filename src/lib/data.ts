import { Service, Barber, Testimonial, GalleryImage } from '@/types'

export const services: Service[] = [
  {
    id: 'classic-cut',
    name: 'Classic Haircut',
    description: 'Precision scissor & clipper cut with hot towel finish. Our signature service.',
    price: 45,
    duration: 45,
    icon: 'cut',
  },
  {
    id: 'beard-trim',
    name: 'Beard Sculpting',
    description: 'Expert beard shaping, straight razor line-up, and nourishing oil treatment.',
    price: 30,
    duration: 30,
    icon: 'beard',
  },
  {
    id: 'hot-towel',
    name: 'Royal Hot Towel Shave',
    description: 'Luxurious straight razor shave with hot towel compresses and aftershave.',
    price: 55,
    duration: 60,
    icon: 'razor',
  },
  {
    id: 'hair-beard',
    name: 'Haircut & Beard Combo',
    description: 'Our most popular package — full haircut plus beard sculpting at a great value.',
    price: 65,
    duration: 75,
    icon: 'combo',
  },
  {
    id: 'kid-cut',
    name: "Kid's Cut",
    description: 'Gentle, patient haircuts for children under 12. Fun and stress-free.',
    price: 28,
    duration: 30,
    icon: 'kid',
  },
  {
    id: 'color',
    name: 'Premium Color & Style',
    description: 'Professional hair coloring with a precision cut and blow-dry finish.',
    price: 85,
    duration: 90,
    icon: 'color',
  },
]

export const barbers: Barber[] = [
  {
    id: 'marco',
    name: 'Marco Silva',
    title: 'Master Barber',
    bio: 'With 15 years of experience, Marco specializes in classic cuts and straight razor shaves. His attention to detail is unmatched.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    rating: 4.9,
  },
  {
    id: 'elena',
    name: 'Elena Cruz',
    title: 'Style Specialist',
    bio: 'Elena brings a modern edge to traditional barbering. She excels at fades, color work, and contemporary styles.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
    rating: 4.8,
  },
  {
    id: 'jamal',
    name: 'Jamal Wright',
    title: 'Senior Barber',
    bio: 'Jamal has been crafting sharp looks for over a decade. Known for his precision fades and beard artistry.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    rating: 4.7,
  },
]

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'David Chen',
    text: 'Best barbershop in the city. Marco gave me the cleanest fade I\'ve ever had. The hot towel treatment at the end is pure luxury.',
    rating: 5,
    service: 'Classic Haircut',
  },
  {
    id: '2',
    name: 'James Rodriguez',
    text: "I've been coming here for two years. The consistency and quality are incredible. Elena is a true artist with scissors.",
    rating: 5,
    service: 'Haircut & Beard Combo',
  },
  {
    id: '3',
    name: 'Marcus Thompson',
    text: "The Royal Hot Towel Shave is an experience every man should have. Jamal's technique is flawless. I left feeling like a new man.",
    rating: 5,
    service: 'Royal Hot Towel Shave',
  },
  {
    id: '4',
    name: "Ryan O'Brien",
    text: 'Brought my son here for his first haircut. They were so patient and made him feel comfortable. He left with a huge smile.',
    rating: 5,
    service: "Kid's Cut",
  },
]

export const gallery: GalleryImage[] = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&h=600&fit=crop',
    alt: 'Precision fade haircut',
    category: 'haircuts',
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1596728325488-58c87691e9af?w=600&h=600&fit=crop',
    alt: 'Beard trim and shaping',
    category: 'beards',
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=600&fit=crop',
    alt: 'Hot towel shave treatment',
    category: 'shaves',
  },
  {
    id: '4',
    src: 'https://images.unsplash.com/photo-1593702288056-49a1cb54b8d5?w=600&h=600&fit=crop',
    alt: 'Modern pompadour style',
    category: 'haircuts',
  },
  {
    id: '5',
    src: 'https://images.unsplash.com/photo-1621605815971-fbc98d665666?w=600&h=600&fit=crop',
    alt: 'Barber tools and products',
    category: 'interior',
  },
  {
    id: '6',
    src: 'https://images.unsplash.com/photo-1585747861115-0deabd89d523?w=600&h=600&fit=crop',
    alt: 'Classic barber chair',
    category: 'interior',
  },
  {
    id: '7',
    src: 'https://images.unsplash.com/photo-1596728325488-58c87691e9af?w=600&h=600&fit=crop',
    alt: 'Scissors haircut precision',
    category: 'haircuts',
  },
  {
    id: '8',
    src: 'https://images.unsplash.com/photo-1567894340315-735d7c361db7?w=600&h=600&fit=crop',
    alt: 'Beard grooming session',
    category: 'beards',
  },
]

export const timeSlots: string[] = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
]

export const SHOP_INFO = {
  name: 'BARBERÍA',
  tagline: 'Where Tradition Meets Style',
  description: 'Premium grooming services in an atmosphere of timeless craftsmanship.',
  address: '123 Main Street, New York, NY 10001',
  phone: '+1 (555) 123-4567',
  email: 'hello@barberia.com',
  hours: [
    { day: 'Mon - Fri', time: '9:00 AM - 7:00 PM' },
    { day: 'Saturday', time: '9:00 AM - 6:00 PM' },
    { day: 'Sunday', time: '10:00 AM - 4:00 PM' },
  ],
  social: {
    instagram: '@barberia_nyc',
    facebook: 'barberianyc',
    twitter: '@barberia',
  },
}
