import { useState } from 'react';

export default function MyBookings() {
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState([]);
  const [searched, setSearched] = useState(false);

  const search = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/bookings?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    setBookings(data);
    setSearched(true);
  };

  const cancel = async (id) => {
    await fetch(`/api/bookings/${id}/cancel`, { method: 'PATCH' });
    setBookings(bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
  };

  const badge = (status) => {
    const map = {
      confirmed: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-gray-100 text-gray-500',
      'no-show': 'bg-red-100 text-red-700',
    };
    return `text-xs font-medium px-2.5 py-1 rounded-full ${map[status] || 'bg-gray-100'}`;
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

      <form onSubmit={search} className="flex gap-3 mb-8">
        <input
          required
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <button className="bg-gray-900 text-white px-6 rounded-xl font-semibold hover:bg-gray-800 transition">
          Search
        </button>
      </form>

      {searched && bookings.length === 0 && (
        <p className="text-gray-500">No bookings found for this email.</p>
      )}

      <div className="space-y-4">
        {bookings.map(b => (
          <div key={b.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold">{b.service_name}</h3>
                <p className="text-sm text-gray-500">with {b.barber_name}</p>
              </div>
              <span className={badge(b.status)}>{b.status}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <span>📅 {b.date}</span>
              <span>⏰ {b.time}</span>
              <span>💰 ${b.price}</span>
            </div>
            {b.status === 'confirmed' && (
              <button
                onClick={() => cancel(b.id)}
                className="text-sm text-red-500 hover:text-red-600 font-medium"
              >
                Cancel Booking
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
