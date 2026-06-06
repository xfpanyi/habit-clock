import { useEffect, useState } from 'react';
import { useAppStore } from '@/stores/appStore';
import { useChildStore } from '@/stores/childStore';
import { useStampStore } from '@/stores/stampStore';
import { Award, TrendingUp, ShoppingBag, Calendar, CheckCircle2, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import EmptyState from '@/components/EmptyState';
import { formatDateTime, getToday } from '@/utils/date';
import type { DailyTaskRecord } from '@/types';

interface DailyTaskGroup {
  date: string;
  completed: DailyTaskRecord[];
  incomplete: DailyTaskRecord[];
}

export default function Stamps() {
  const { selectedChildId } = useAppStore();
  const { currentChild } = useChildStore();
  const { stampRecords, loadRecords, getWeeklyStats, dailyTaskRecords } = useStampStore();
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());

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

  const taskHistory: DailyTaskGroup[] = [];
  if (selectedChildId) {
    const dateMap = new Map<string, DailyTaskGroup>();
    dailyTaskRecords
      .filter((r) => r.childId === selectedChildId)
      .forEach((record) => {
        if (!dateMap.has(record.date)) {
          dateMap.set(record.date, { date: record.date, completed: [], incomplete: [] });
        }
        const group = dateMap.get(record.date)!;
        if (record.completed) {
          group.completed.push(record);
        } else {
          group.incomplete.push(record);
        }
      });
    taskHistory.push(...Array.from(dateMap.values()).sort((a, b) => b.date.localeCompare(a.date)));
  }

  const toggleDate = (date: string) => {
    setExpandedDates((prev) => {
      const next = new Set(prev);
      if (next.has(date)) {
        next.delete(date);
      } else {
        next.add(date);
      }
      return next;
    });
  };

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

        <div className="bg-white rounded-2xl shadow-card p-5 mb-6">
          <h2 className="text-base font-bold text-gray-800 mb-4">历史任务完成情况</h2>
          {taskHistory.length === 0 ? (
            <EmptyState message="还没有任务完成记录" />
          ) : (
            <div className="space-y-3">
              {taskHistory.map((group) => {
                const isExpanded = expandedDates.has(group.date);
                const total = group.completed.length + group.incomplete.length;
                const isToday = group.date === getToday();
                return (
                  <div key={group.date} className="border border-gray-100 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleDate(group.date)}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-semibold text-gray-700">
                          {isToday ? '今天' : group.date}
                        </span>
                        <span className="text-xs text-gray-400">
                          ({group.completed.length}/{total} 完成)
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {group.incomplete.length > 0 && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-500">
                            {group.incomplete.length} 未完成
                          </span>
                        )}
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </button>
                    {isExpanded && (
                      <div className="p-3 space-y-2">
                        {group.completed.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-emerald-600 mb-1.5 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              已完成 ({group.completed.length})
                            </p>
                            <div className="space-y-1.5">
                              {group.completed.map((task) => (
                                <div key={task.id} className="flex items-center gap-2 text-sm text-gray-600">
                                  <span className="text-emerald-500">✓</span>
                                  <span className="flex-1">{task.taskName}</span>
                                  <span className="text-xs text-emerald-500">+{task.stampReward}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {group.incomplete.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-red-500 mb-1.5 flex items-center gap-1">
                              <XCircle className="w-3 h-3" />
                              未完成 ({group.incomplete.length})
                            </p>
                            <div className="space-y-1.5">
                              {group.incomplete.map((task) => (
                                <div key={task.id} className="flex items-center gap-2 text-sm text-gray-600">
                                  <span className="text-red-400">✗</span>
                                  <span className="flex-1">{task.taskName}</span>
                                  <span className="text-xs text-gray-400">+{task.stampReward}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
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
