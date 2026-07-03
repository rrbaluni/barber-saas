import { Link } from 'react-router-dom';

const avatars = ['🧔', '💈', '✂️', '🪒', '👨'];

interface BarberCardProps {
  barber: { id: number; name: string; bio: string | null };
  index: number;
}

export default function BarberCard({ barber, index }: BarberCardProps) {
  return (
    <Link
      to={`/book/${barber.id}`}
      className="block bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow p-6 border border-gray-100"
    >
      <div className="text-5xl mb-4">{avatars[index % avatars.length]}</div>
      <h3 className="text-lg font-bold mb-1">{barber.name}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{barber.bio}</p>
      <div className="mt-4 inline-block text-sm font-semibold text-green-600 hover:text-green-700">
        Book Now →
      </div>
    </Link>
  );
}
