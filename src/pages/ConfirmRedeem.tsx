import { useEffect } from 'react';
import { useStampStore } from '@/stores/stampStore';
import { useChildStore } from '@/stores/childStore';
import { Check, X, Baby } from 'lucide-react';
import Navbar from '@/components/Navbar';
import EmptyState from '@/components/EmptyState';
import { REDEEM_STATUS_LABELS } from '@/utils/constants';
import { formatDateTime } from '@/utils/date';

export default function ConfirmRedeem() {
  const { redeemRecords, loadRecords, confirmRedeem } = useStampStore();
  const { children } = useChildStore();

  useEffect(() => {
    children.forEach((c) => loadRecords(c.id));
  }, []);

  const allRecords = children.flatMap((child) => {
    const childRecords = redeemRecords.filter((r) => r.childId === child.id);
    return childRecords.map((r) => ({ ...r, childName: child.name, childAvatar: child.avatar }));
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const pendingRecords = allRecords.filter((r) => r.status === 'pending');
  const historyRecords = allRecords.filter((r) => r.status !== 'pending');

  return (
    <div className="min-h-screen pb-4">
      <Navbar title="兑换审批" />
      <div className="px-5 pt-4 pb-4">
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 mb-3">待审批 ({pendingRecords.length})</h2>
          {pendingRecords.length === 0 ? (
            <EmptyState message="没有待审批的兑换" />
          ) : (
            <div className="space-y-3">
              {pendingRecords.map((record) => (
                <div key={record.id} className="p-4 bg-white rounded-2xl shadow-card">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-2xl">{record.childAvatar}</div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">{record.childName}</p>
                      <p className="text-xs text-gray-400">{formatDateTime(record.applyDate)}</p>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600">
                      <span>⭐</span>
                      <span>{record.stampCost}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-3">
                    <div className="text-2xl">🎁</div>
                    <p className="text-sm font-medium text-gray-700">{record.productName}</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => confirmRedeem(record.id, false)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <X className="w-4 h-4 inline mr-1" />
                      拒绝
                    </button>
                    <button
                      onClick={() => confirmRedeem(record.id, true)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-colors"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                      <Check className="w-4 h-4 inline mr-1" />
                      确认
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-500 mb-3">历史记录</h2>
          {historyRecords.length === 0 ? (
            <EmptyState message="没有历史记录" />
          ) : (
            <div className="space-y-2">
              {historyRecords.map((record) => (
                <div key={record.id} className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-card">
                  <Baby className="w-5 h-5 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{record.childName} · {record.productName}</p>
                    <p className="text-xs text-gray-400">{formatDateTime(record.confirmDate || record.applyDate)}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    record.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {REDEEM_STATUS_LABELS[record.status]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
