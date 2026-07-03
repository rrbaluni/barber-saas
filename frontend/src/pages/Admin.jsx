import { useState, useEffect } from 'react';

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
        active ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'
      }`}
    >
      {label}
    </button>
  );
}

function BookingsTab() {
  const [bookings, setBookings] = useState([]);

  const load = () => fetch('/api/admin/bookings').then(r => r.json()).then(setBookings);

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await fetch(`/api/admin/bookings/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    load();
  };

  const badge = (s) => {
    const map = {
      confirmed: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-gray-100 text-gray-500',
      'no-show': 'bg-red-100 text-red-700',
    };
    return `text-xs px-2 py-1 rounded-full font-medium ${map[s] || ''}`;
  };

  return (
    <div className="space-y-3">
      {bookings.length === 0 && <p className="text-gray-500">No bookings yet.</p>}
      {bookings.map(b => (
        <div key={b.id} className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="font-semibold">{b.customer_name}</p>
              <p className="text-sm text-gray-500">{b.service_name} with {b.barber_name}</p>
            </div>
            <span className={badge(b.status)}>{b.status}</span>
          </div>
          <p className="text-sm text-gray-500 mb-3">{b.date} at {b.time} · ${b.price}</p>
          {b.status === 'confirmed' && (
            <div className="flex gap-2">
              <button onClick={() => updateStatus(b.id, 'completed')} className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium hover:bg-green-200">Complete</button>
              <button onClick={() => updateStatus(b.id, 'cancelled')} className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full font-medium hover:bg-red-200">Cancel</button>
              <button onClick={() => updateStatus(b.id, 'no-show')} className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium hover:bg-yellow-200">No Show</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function BarbersTab() {
  const [barbers, setBarbers] = useState([]);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');

  const load = () => fetch('/api/barbers').then(r => r.json()).then(setBarbers);

  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    if (!name) return;
    await fetch('/api/admin/barbers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, bio }),
    });
    setName('');
    setBio('');
    load();
  };

  const toggle = async (id, active) => {
    await fetch(`/api/admin/barbers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: active ? 0 : 1 }),
    });
    load();
  };

  return (
    <div>
      <form onSubmit={add} className="flex gap-3 mb-6">
        <input placeholder="Barber name" value={name} onChange={e => setName(e.target.value)} className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
        <input placeholder="Bio (optional)" value={bio} onChange={e => setBio(e.target.value)} className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
        <button className="bg-gray-900 text-white px-4 rounded-xl text-sm font-semibold hover:bg-gray-800">Add</button>
      </form>
      <div className="space-y-2">
        {barbers.map(b => (
          <div key={b.id} className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3">
            <div>
              <p className="font-medium">{b.name}</p>
              <p className="text-xs text-gray-500">{b.bio}</p>
            </div>
            <button onClick={() => toggle(b.id, b.active)} className={`text-xs px-3 py-1 rounded-full font-medium ${b.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {b.active ? 'Active' : 'Inactive'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ServicesTab() {
  const [services, setServices] = useState([]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');

  const load = () => fetch('/api/services').then(r => r.json()).then(setServices);

  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    if (!name || !price || !duration) return;
    await fetch('/api/admin/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description: desc, price: Number(price), duration: Number(duration) }),
    });
    setName(''); setDesc(''); setPrice(''); setDuration('');
    load();
  };

  return (
    <div>
      <form onSubmit={add} className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
        <input placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
        <input placeholder="Price" type="number" value={price} onChange={e => setPrice(e.target.value)} className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
        <input placeholder="Duration (min)" type="number" value={duration} onChange={e => setDuration(e.target.value)} className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
        <button className="bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800">Add</button>
      </form>
      <div className="space-y-2">
        {services.map(s => (
          <div key={s.id} className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3">
            <div>
              <p className="font-medium">{s.name}</p>
              <p className="text-xs text-gray-500">{s.duration}min · ${s.price}</p>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${s.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {s.active ? 'Active' : 'Inactive'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Admin() {
  const [tab, setTab] = useState('bookings');

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-gray-500 mb-8">Manage your barbershop.</p>

      <div className="flex gap-2 mb-8 border-b border-gray-200 pb-2">
        <Tab label="Bookings" active={tab === 'bookings'} onClick={() => setTab('bookings')} />
        <Tab label="Barbers" active={tab === 'barbers'} onClick={() => setTab('barbers')} />
        <Tab label="Services" active={tab === 'services'} onClick={() => setTab('services')} />
      </div>

      {tab === 'bookings' && <BookingsTab />}
      {tab === 'barbers' && <BarbersTab />}
      {tab === 'services' && <ServicesTab />}
    </div>
  );
}
