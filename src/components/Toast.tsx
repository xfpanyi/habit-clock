import { useAppStore } from '@/stores/appStore';
import { CheckCircle, XCircle, Info } from 'lucide-react';

export default function Toast() {
  const toast = useAppStore((s) => s.toast);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const bgColors = {
    success: 'bg-emerald-50 border-emerald-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
  };

  return (
    <div className="fixed bottom-24 left-0 right-0 z-50 flex justify-center pointer-events-none animate-slide-up">
      <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border shadow-lg ${bgColors[toast.type]}`}>
        {icons[toast.type]}
        <span className="text-sm font-medium text-gray-700">{toast.message}</span>
      </div>
    </div>
  );
}
