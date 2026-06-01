import { Check } from 'lucide-react';
import { useState } from 'react';

interface TaskCardProps {
  id: string;
  name: string;
  icon: string;
  stampReward: number;
  description: string;
  completed: boolean;
  onComplete: () => void;
  index: number;
}

export default function TaskCard({ name, icon, stampReward, description, completed, onComplete, index }: TaskCardProps) {
  const [animating, setAnimating] = useState(false);

  const handleClick = () => {
    if (completed) return;
    setAnimating(true);
    onComplete();
    setTimeout(() => setAnimating(false), 600);
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-center gap-3 p-4 rounded-2xl shadow-card transition-all duration-300 cursor-pointer select-none animate-slide-up stagger-${Math.min(index + 1, 6)} ${
        completed
          ? 'bg-primary/5 border-2 border-primary/20'
          : 'bg-white border-2 border-transparent hover:shadow-lg'
      } ${animating ? 'animate-card-bounce' : ''}`}
      style={completed ? { backgroundColor: 'var(--color-primary)10', borderColor: 'var(--color-primary)30' } : {}}
    >
      <div
        className={`flex items-center justify-center w-14 h-14 rounded-2xl text-2xl shrink-0 ${
          completed ? 'bg-primary/10' : 'bg-gray-50'
        }`}
        style={completed ? { backgroundColor: 'var(--color-primary)15' } : {}}
      >
        {completed ? (
          <div
            className="flex items-center justify-center w-10 h-10 rounded-full"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <Check className="w-5 h-5 text-white" />
          </div>
        ) : (
          <span>{icon}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className={`text-base font-semibold truncate ${completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
          {name}
        </h3>
        <p className="text-xs text-gray-400 truncate mt-0.5">{description}</p>
      </div>
      <div
        className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold shrink-0"
        style={{
          backgroundColor: completed ? 'var(--color-primary)15' : 'var(--color-primary)10',
          color: completed ? 'var(--color-primary)' : 'var(--color-primary)',
        }}
      >
        <span>⭐</span>
        <span>+{stampReward}</span>
      </div>
    </div>
  );
}
