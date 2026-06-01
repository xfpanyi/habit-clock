interface ProductCardProps {
  name: string;
  icon: string;
  price: number;
  onClick: () => void;
  index: number;
}

export default function ProductCard({ name, icon, price, onClick, index }: ProductCardProps) {
  return (
    <div
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-4 bg-white rounded-2xl shadow-card hover:shadow-lg transition-all duration-300 cursor-pointer select-none animate-slide-up stagger-${Math.min(index + 1, 6)}`}
    >
      <div className="text-4xl">{icon}</div>
      <h3 className="text-sm font-semibold text-gray-800 text-center truncate w-full">{name}</h3>
      <div
        className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold"
        style={{ backgroundColor: 'var(--color-primary)10', color: 'var(--color-primary)' }}
      >
        <span>⭐</span>
        <span>{price}</span>
      </div>
    </div>
  );
}
