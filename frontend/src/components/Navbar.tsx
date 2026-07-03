import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight">
          <span className="text-green-400">Fade</span>Zone
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-green-400 transition">Home</Link>
          <Link to="/my-bookings" className="hover:text-green-400 transition">My Bookings</Link>
          <Link to="/admin" className="hover:text-green-400 transition">Admin</Link>
        </div>
      </div>
    </nav>
  );
}
