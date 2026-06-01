import { useEffect } from 'react';
import { useAppStore } from '@/stores/appStore';
import { useChildStore } from '@/stores/childStore';
import { useStampStore } from '@/stores/stampStore';
import { Award, TrendingUp, ShoppingBag, Calendar } from 'lucide-react';
import EmptyState from '@/components/EmptyState';
import { formatDateTime } from '@/utils/date';

export default function Stamps() {
  const { selectedChildId } = useAppStore();
  const { currentChild } = useChildStore();
  const { stampRecords, loadRecords, getWeeklyStats } = useStampStore();

  useEffect(() => {
    if (selectedChildId) {
      loadRecords(selectedChildId);
    }
  }, [selectedChildId]);

  const weeklyStats = selectedChildId ? getWeeklyStats(selectedChildId) : [];
  const maxCount = Math.max(...weeklyStats.map((s) => s.count), 1);

  const recentRecords = stampRecords
    .filter((r) => r.childId === selectedChildId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 20);

  return (
    <div className="min-h-screen pb-20">
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-5">印章统计</h1>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-card">
            <Award className="w-6 h-6 mb-2" style={{ color: 'var(--color-primary)' }} />
            <span className="text-2xl font-bold text-gray-800">{currentChild?.currentStamps || 0}</span>
            <span className="text-xs text-gray-400 mt-1">当前印章</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-card">
            <TrendingUp className="w-6 h-6 mb-2 text-emerald-500" />
            <span className="text-2xl font-bold text-gray-800">{currentChild?.totalEarned || 0}</span>
            <span className="text-xs text-gray-400 mt-1">累计获得</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-card">
            <ShoppingBag className="w-6 h-6 mb-2 text-amber-500" />
            <span className="text-2xl font-bold text-gray-800">{currentChild?.totalRedeemed || 0}</span>
            <span className="text-xs text-gray-400 mt-1">已兑换</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-5 mb-6">
          <h2 className="text-base font-bold text-gray-800 mb-4">本周获章</h2>
          {weeklyStats.every((s) => s.count === 0) ? (
            <EmptyState message="本周还没有获得印章" />
          ) : (
            <div className="flex items-end justify-between gap-2 h-40">
              {weeklyStats.map((stat) => (
                <div key={stat.date} className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-full flex flex-col items-center gap-1">
                    <span className="text-xs font-bold text-gray-600">{stat.count}</span>
                    <div
                      className="w-full max-w-[32px] rounded-t-lg transition-all duration-500"
                      style={{
                        height: `${(stat.count / maxCount) * 100}px`,
                        minHeight: stat.count > 0 ? '4px' : '0',
                        backgroundColor: stat.count > 0 ? 'var(--color-primary)' : '#f3f4f6',
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400">{stat.day}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-card p-5">
          <h2 className="text-base font-bold text-gray-800 mb-4">获章记录</h2>
          {recentRecords.length === 0 ? (
            <EmptyState message="还没有获章记录" />
          ) : (
            <div className="space-y-3">
              {recentRecords.map((record) => (
                <div key={record.id} className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: record.type === 'earn' ? 'var(--color-primary)10' : record.type === 'redeem' ? '#FEF3C7' : '#F3F4F6',
                    }}
                  >
                    <span className="text-lg">
                      {record.type === 'earn' ? '⭐' : record.type === 'redeem' ? '🎁' : '🔧'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{record.taskName}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDateTime(record.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-bold shrink-0 ${
                      record.count > 0 ? 'text-emerald-500' : 'text-red-500'
                    }`}
                  >
                    {record.count > 0 ? '+' : ''}{record.count}
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
