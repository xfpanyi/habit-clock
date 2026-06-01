import { Home, Award, Gift, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const tabs = [
  { path: '/home', label: '首页', icon: Home },
  { path: '/stamps', label: '印章', icon: Award },
  { path: '/redeem', label: '兑换', icon: Gift },
  { path: '/profile', label: '我的', icon: User },
];

export default function TabBar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-gray-100 safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center justify-center gap-0.5 w-16 h-full relative"
            >
              <div
                className={`p-1.5 rounded-xl transition-all duration-300 ${
                  isActive ? 'bg-primary/10' : ''
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-colors duration-300 ${
                    isActive ? 'text-primary' : 'text-gray-400'
                  }`}
                  style={{ color: isActive ? 'var(--color-primary)' : undefined }}
                />
              </div>
              <span
                className={`text-[11px] font-medium transition-colors duration-300 ${
                  isActive ? 'text-primary' : 'text-gray-400'
                }`}
                style={{ color: isActive ? 'var(--color-primary)' : undefined }}
              >
                {tab.label}
              </span>
              {isActive && (
                <div
                  className="absolute -top-0.5 w-8 h-0.5 rounded-full"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
