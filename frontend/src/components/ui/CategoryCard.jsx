import { useNavigate } from 'react-router-dom';

export default function CategoryCard({ cat }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/jobs?category=${cat.id}`)}
      className={`${cat.color} rounded-card p-5 text-white flex flex-col items-start gap-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 w-full text-left focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2`}
      aria-label={`Browse ${cat.label}`}
    >
      <span className="text-3xl" role="img" aria-label={cat.label}>{cat.emoji}</span>
      <div>
        <p className="font-poppins font-semibold text-sm leading-tight">{cat.label}</p>
        <p className="text-white/80 text-xs mt-0.5">{cat.count.toLocaleString('en-IN')} active</p>
      </div>
    </button>
  );
}
