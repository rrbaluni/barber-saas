import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface Barber { id: number; name: string; bio: string | null; }
interface Service { id: number; name: string; price: number; duration: number; }

function getNext7(): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });
}

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function Booking() {
  const { barberId } = useParams<{ barberId: string }>();
  const navigate = useNavigate();
  const [barber, setBarber] = useState<Barber | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [dates] = useState(getNext7);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/barbers/${barberId}`)
      .then(r => r.json())
      .then(data => { setBarber(data); setServices(data.services || []); });
  }, [barberId]);

  useEffect(() => {
    fetch(`/api/barbers/${barberId}/availability?date=${selectedDate}`)
      .then(r => r.json()).then(setSlots);
  }, [barberId, selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        barber_id: Number(barberId),
        service_id: Number(selectedService),
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone,
        date: selectedDate,
        time: selectedTime,
        notes: form.notes,
      }),
    });
    if (!res.ok) { const data = await res.json(); setError(data.error || 'Something went wrong'); return; }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">✂️</div>
        <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
        <p className="text-gray-500 mb-6">A confirmation has been sent to {form.email}.</p>
        <button onClick={() => navigate('/')} className="bg-gray-900 text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-800 transition">Back Home</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {barber && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Book with {barber.name}</h1>
          <p className="text-gray-500">{barber.bio}</p>
        </div>
      )}
      <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
        <div className="mb-8">
          <h2 className="font-semibold mb-3">1. Select a Service</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {services.map(s => (
              <button key={s.id} onClick={() => { setSelectedService(String(s.id)); setSelectedTime(''); }}
                className={`text-left p-3 rounded-xl border-2 transition ${selectedService === String(s.id) ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="font-medium">{s.name}</div>
                <div className="text-sm text-gray-500">${s.price} · {s.duration}min</div>
              </button>
            ))}
          </div>
        </div>
        {selectedService && (
          <div className="mb-8">
            <h2 className="font-semibold mb-3">2. Pick a Date</h2>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {dates.map(d => {
                const f = formatDate(d);
                return (
                  <button key={f} onClick={() => { setSelectedDate(f); setSelectedTime(''); }}
                    className={`flex-shrink-0 px-4 py-3 rounded-xl text-center border-2 transition ${f === selectedDate ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="text-xs text-gray-500">{DAYS[d.getDay()]}</div>
                    <div className="text-lg font-bold">{d.getDate()}</div>
                    <div className="text-xs text-gray-500">{MONTHS[d.getMonth()]}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
        {selectedDate && slots.length > 0 && (
          <div className="mb-8">
            <h2 className="font-semibold mb-3">3. Pick a Time</h2>
            <div className="flex flex-wrap gap-2">
              {slots.map(t => (
                <button key={t} onClick={() => setSelectedTime(t)}
                  className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition ${selectedTime === t ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 hover:border-gray-300'}`}>{t}</button>
              ))}
            </div>
          </div>
        )}
        {slots.length === 0 && selectedService && selectedDate && (
          <p className="text-gray-500 text-sm mb-6">No available slots for this date.</p>
        )}
        {selectedTime && (
          <form onSubmit={handleSubmit}>
            <h2 className="font-semibold mb-3">4. Your Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <input required placeholder="Your Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400" />
              <input required type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400" />
              <input placeholder="Phone (optional)" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400" />
              <input placeholder="Notes (optional)" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400" />
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button type="submit" className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition">Confirm Booking</button>
          </form>
        )}
      </div>
    </div>
  );
}
