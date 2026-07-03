import { useState, useEffect } from 'react';
import BarberCard from '../components/BarberCard';

export default function Home() {
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch('/api/barbers').then(r => r.json()).then(setBarbers);
    fetch('/api/services').then(r => r.json()).then(setServices);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">Look sharp, feel sharp.</h1>
        <p className="text-gray-500 text-lg">Book your next cut with the best barbers in town.</p>
      </div>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Our Barbers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {barbers.map((b, i) => <BarberCard key={b.id} barber={b} index={i} />)}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Services & Pricing</h2>
        <div className="bg-white rounded-2xl shadow-md divide-y divide-gray-100">
          {services.map(s => (
            <div key={s.id} className="flex items-center justify-between p-5">
              <div>
                <h3 className="font-semibold">{s.name}</h3>
                <p className="text-sm text-gray-500">{s.description}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">${s.price}</p>
                <p className="text-xs text-gray-400">{s.duration} min</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-900 text-white rounded-2xl p-10 text-center">
        <h2 className="text-2xl font-bold mb-2">Ready for a fresh look?</h2>
        <p className="text-gray-400 mb-6">Book online in under a minute.</p>
        <a href="#barbers" className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-full transition">
          Book Now
        </a>
      </section>
    </div>
  );
}
