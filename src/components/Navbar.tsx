import { ArrowLeft, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  title: string;
  showBack?: boolean;
  showSettings?: boolean;
  onSettingsClick?: () => void;
  rightContent?: React.ReactNode;
}

export default function Navbar({ title, showBack = true, showSettings = false, onSettingsClick, rightContent }: NavbarProps) {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-2">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
          )}
          <h1 className="text-lg font-bold text-gray-800">{title}</h1>
        </div>
        <div className="flex items-center gap-1">
          {rightContent}
          {showSettings && (
            <button
              onClick={onSettingsClick}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
