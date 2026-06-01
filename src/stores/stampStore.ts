import { create } from 'zustand';
import type { StampRecord, RedeemRecord, Product } from '@/types';
import { getStampRecords, setStampRecords, getRedeemRecords, setRedeemRecords } from '@/utils/storage';
import { getToday, getWeekDates } from '@/utils/date';
import { useAppStore } from './appStore';
import { useChildStore } from './childStore';

interface StampState {
  stampRecords: StampRecord[];
  redeemRecords: RedeemRecord[];

  loadRecords: (childId: string) => void;
  addStamp: (childId: string, taskId: string, taskName: string, count: number) => void;
  applyRedeem: (childId: string, product: Product) => void;
  confirmRedeem: (recordId: string, approved: boolean) => void;
  getWeeklyStats: (childId: string) => { date: string; day: string; count: number }[];
  getTodayEarned: (childId: string) => number;
  getPendingRedeems: () => RedeemRecord[];
  getRedeemHistory: (childId: string) => RedeemRecord[];
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

export const useStampStore = create<StampState>((set, get) => ({
  stampRecords: [],
  redeemRecords: [],

  loadRecords: (childId) => {
    const stamps = getStampRecords(childId) as StampRecord[];
    const redeems = getRedeemRecords(childId) as RedeemRecord[];
    set({ stampRecords: stamps, redeemRecords: redeems });
  },

  addStamp: (childId, taskId, taskName, count) => {
    const record: StampRecord = {
      id: generateId(),
      childId,
      taskId,
      taskName,
      count,
      date: getToday(),
      type: 'earn',
      createdAt: new Date().toISOString(),
    };
    const updated = [...get().stampRecords, record];
    setStampRecords(childId, updated);
    set({ stampRecords: updated });
    useChildStore.getState().updateStamps(childId, count);
    useAppStore.getState().showToast(`获得 ${count} 枚印章！`, 'success');
  },

  applyRedeem: (childId, product) => {
    const child = useChildStore.getState().children.find((c) => c.id === childId);
    if (!child || child.currentStamps < product.price) {
      useAppStore.getState().showToast('印章不足，继续加油！', 'error');
      return;
    }

    const record: RedeemRecord = {
      id: generateId(),
      childId,
      productId: product.id,
      productName: product.name,
      stampCost: product.price,
      status: 'pending',
      applyDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    const updated = [...get().redeemRecords, record];
    setRedeemRecords(childId, updated);
    set({ redeemRecords: updated });
    useAppStore.getState().showToast('兑换申请已提交，等待家长确认', 'info');
  },

  confirmRedeem: (recordId, approved) => {
    const record = get().redeemRecords.find((r) => r.id === recordId);
    if (!record) return;

    const updated = get().redeemRecords.map((r) =>
      r.id === recordId
        ? {
            ...r,
            status: approved ? ('approved' as const) : ('rejected' as const),
            confirmDate: new Date().toISOString(),
          }
        : r
    );
    setRedeemRecords(record.childId, updated);
    set({ redeemRecords: updated });

    if (approved) {
      useChildStore.getState().updateStamps(record.childId, -record.stampCost);
      const stampRecord: StampRecord = {
        id: generateId(),
        childId: record.childId,
        taskId: record.productId,
        taskName: `兑换: ${record.productName}`,
        count: -record.stampCost,
        date: getToday(),
        type: 'redeem',
        createdAt: new Date().toISOString(),
      };
      const stampUpdated = [...get().stampRecords, stampRecord];
      setStampRecords(record.childId, stampUpdated);
      set({ stampRecords: stampUpdated });
      useAppStore.getState().showToast('兑换已确认', 'success');
    } else {
      useAppStore.getState().showToast('已拒绝兑换申请', 'info');
    }
  },

  getWeeklyStats: (childId) => {
    const weekDates = getWeekDates();
    const records = get().stampRecords.filter(
      (r) => r.childId === childId && r.type === 'earn'
    );
    return weekDates.map((date) => {
      const dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
      const dayIndex = new Date(date).getDay();
      const dayLabel = dayNames[dayIndex === 0 ? 6 : dayIndex - 1];
      const count = records
        .filter((r) => r.date === date)
        .reduce((sum, r) => sum + r.count, 0);
      return { date, day: dayLabel, count };
    });
  },

  getTodayEarned: (childId) => {
    return get().stampRecords
      .filter((r) => r.childId === childId && r.date === getToday() && r.type === 'earn')
      .reduce((sum, r) => sum + r.count, 0);
  },

  getPendingRedeems: () => {
    return get().redeemRecords.filter((r) => r.status === 'pending');
  },

  getRedeemHistory: (childId) => {
    return get().redeemRecords
      .filter((r) => r.childId === childId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
}));
