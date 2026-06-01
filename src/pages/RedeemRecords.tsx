import { useEffect, useState } from 'react';
import { useStampStore } from '@/stores/stampStore';
import { useChildStore } from '@/stores/childStore';
import { Baby, Filter } from 'lucide-react';
import Navbar from '@/components/Navbar';
import EmptyState from '@/components/EmptyState';
import { REDEEM_STATUS_LABELS } from '@/utils/constants';
import { formatDateTime } from '@/utils/date';

export default function RedeemRecords() {
  const { redeemRecords, loadRecords } = useStampStore();
  const { children } = useChildStore();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    children.forEach((c) => loadRecords(c.id));
  }, []);

  const allRecords = children.flatMap((child) => {
    const childRecords = redeemRecords.filter((r) => r.childId === child.id);
    return childRecords.map((r) => ({ ...r, childName: child.name }));
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const filteredRecords = filter === 'all' ? allRecords : allRecords.filter((r) => r.status === filter);

  const filters = [
    { key: 'all' as const, label: '全部' },
    { key: 'pending' as const, label: '待处理' },
    { key: 'approved' as const, label: '已完成' },
    { key: 'rejected' as const, label: '已拒绝' },
  ];

  return (
    <div className="min-h-screen pb-4">
      <Navbar title="兑换记录" />
      <div className="px-5 pt-4 pb-4">
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 -mx-1 px-1">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                filter === f.key ? 'text-white' : 'bg-white text-gray-500 shadow-card'
              }`}
              style={filter === f.key ? { backgroundColor: 'var(--color-primary)' } : {}}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filteredRecords.length === 0 ? (
          <EmptyState message="没有兑换记录" />
        ) : (
          <div className="space-y-2">
            {filteredRecords.map((record) => (
              <div key={record.id} className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-card">
                <Baby className="w-5 h-5 text-gray-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{record.childName} · {record.productName}</p>
                  <p className="text-xs text-gray-400">{formatDateTime(record.applyDate)}</p>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--color-primary)10', color: 'var(--color-primary)' }}>
                  <span>⭐</span>
                  <span>{record.stampCost}</span>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  record.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                  record.status === 'rejected' ? 'bg-red-50 text-red-600' :
                  'bg-amber-50 text-amber-600'
                }`}>
                  {REDEEM_STATUS_LABELS[record.status]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
