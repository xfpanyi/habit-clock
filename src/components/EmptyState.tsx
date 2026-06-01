import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
}

export default function EmptyState({ message = '暂无数据' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
      <Inbox className="w-12 h-12 mb-3 opacity-50" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
