import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/appStore';
import { useChildStore } from '@/stores/childStore';
import { useTaskStore } from '@/stores/taskStore';
import { useStampStore } from '@/stores/stampStore';
import { Award, Settings, Sparkles, ClipboardList, Package, Users, CheckCircle, Sun, Sunrise, Moon } from 'lucide-react';
import TaskCard from '@/components/TaskCard';
import EmptyState from '@/components/EmptyState';
import { getToday } from '@/utils/date';
import type { TimeSlot } from '@/types';
import { TIME_SLOT_OPTIONS } from '@/utils/constants';

export default function Home() {
  const navigate = useNavigate();
  const { userRole, selectedChildId } = useAppStore();
  const { currentChild, children } = useChildStore();
  const { tasks, loadTasks, importDefaultTasks } = useTaskStore();
  const { stampRecords, loadRecords, addStamp } = useStampStore();
  const [completedTaskIds, setCompletedTaskIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (selectedChildId) {
      loadTasks(selectedChildId);
      loadRecords(selectedChildId);
    }
  }, [selectedChildId]);

  useEffect(() => {
    if (selectedChildId) {
      const today = getToday();
      const completed = new Set(
        stampRecords
          .filter((r) => r.childId === selectedChildId && r.date === today && r.type === 'earn')
          .map((r) => r.taskId)
      );
      setCompletedTaskIds(completed);
    }
  }, [stampRecords, selectedChildId]);

  const handleCompleteTask = (taskId: string, taskName: string, stampReward: number) => {
    if (!selectedChildId || completedTaskIds.has(taskId)) return;
    addStamp(selectedChildId, taskId, taskName, stampReward);
    setCompletedTaskIds((prev) => new Set(prev).add(taskId));
  };

  const progress = tasks.length > 0 ? Math.round((completedTaskIds.size / tasks.filter(t => t.enabled).length) * 100) : 0;

  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.timeSlot]) acc[task.timeSlot] = [];
    acc[task.timeSlot].push(task);
    return acc;
  }, {} as Record<TimeSlot, typeof tasks>);

  const parentQuickLinks = [
    { label: '任务管理', icon: ClipboardList, path: '/task-manage', color: '#4A90E2' },
    { label: '商品管理', icon: Package, path: '/product-manage', color: '#FF6B9D' },
    { label: '孩子管理', icon: Users, path: '/child-manage', color: '#10B981' },
    { label: '兑换审批', icon: CheckCircle, path: '/confirm-redeem', color: '#F59E0B' },
  ];

  if (userRole === 'parent') {
    return (
      <div className="min-h-screen pb-20">
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">家长管理</h1>
              <p className="text-sm text-gray-400 mt-1">管理孩子的任务、商品和兑换</p>
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="p-2.5 rounded-xl bg-white shadow-card hover:shadow-lg transition-all"
            >
              <Settings className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {parentQuickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className="flex flex-col items-center gap-2 p-5 bg-white rounded-2xl shadow-card hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: link.color + '15' }}>
                    <Icon className="w-6 h-6" style={{ color: link.color }} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{link.label}</span>
                </button>
              );
            })}
          </div>

          {children.length > 0 && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold text-gray-500 mb-3">孩子概览</h2>
              <div className="space-y-3">
                {children.map((child) => (
                  <div key={child.id} className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-card">
                    <div className="text-3xl">{child.avatar}</div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-gray-800">{child.name}</h3>
                      <p className="text-xs text-gray-400">{child.age}岁</p>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--color-primary)10', color: 'var(--color-primary)' }}>
                      <span>⭐</span>
                      <span>{child.currentStamps}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{currentChild?.avatar || '👶'}</div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">{currentChild?.name || '小朋友'}</h1>
              <p className="text-xs text-gray-400">今天也要加油哦！</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-card">
            <Award className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
            <span className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>
              {currentChild?.currentStamps || 0}
            </span>
          </div>
        </div>

        {tasks.filter(t => t.enabled).length > 0 && (
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">今日进度</span>
              <span className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>{progress}%</span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%`, backgroundColor: 'var(--color-primary)' }} />
            </div>
          </div>
        )}

        {tasks.length === 0 && (
          <div className="mb-4">
            <button
              onClick={() => selectedChildId && importDefaultTasks(selectedChildId)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-gray-200 text-sm text-gray-400 hover:border-primary hover:text-primary transition-all"
            >
              <Sparkles className="w-4 h-4" />
              导入今日模板任务
            </button>
          </div>
        )}

        <div className="space-y-5">
          {(['morning', 'afternoon', 'evening'] as TimeSlot[]).map((slot) => {
            const slotTasks = groupedTasks[slot] || [];
            const enabledTasks = slotTasks.filter(t => t.enabled);
            if (enabledTasks.length === 0) return null;
            const slotLabel = TIME_SLOT_OPTIONS.find((s) => s.value === slot);
            const slotIcons = { morning: Sunrise, afternoon: Sun, evening: Moon };
            const SlotIcon = slotIcons[slot];
            return (
              <div key={slot}>
                <div className="flex items-center gap-2 mb-3">
                  <SlotIcon className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                  <h3 className="text-sm font-bold text-gray-600">{slotLabel?.label}</h3>
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-xs text-gray-400">
                    {enabledTasks.filter(t => completedTaskIds.has(t.id)).length}/{enabledTasks.length}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {enabledTasks.map((task, index) => (
                    <TaskCard
                      key={task.id}
                      id={task.id}
                      name={task.name}
                      icon={task.icon}
                      stampReward={task.stampReward}
                      description={task.description}
                      completed={completedTaskIds.has(task.id)}
                      onComplete={() => handleCompleteTask(task.id, task.name, task.stampReward)}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            );
          })}
          {tasks.filter(t => t.enabled).length === 0 && tasks.length > 0 && (
            <EmptyState message="没有启用的任务" />
          )}
        </div>
      </div>
    </div>
  );
}
