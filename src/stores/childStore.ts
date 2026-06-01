import { create } from 'zustand';
import type { Child } from '@/types';
import { getChildList, setChildList, getSelectedChildId, setSelectedChildId } from '@/utils/storage';
import { useAppStore } from './appStore';

interface ChildState {
  children: Child[];
  currentChild: Child | null;

  loadChildren: () => void;
  addChild: (child: Omit<Child, 'id' | 'createdAt' | 'currentStamps' | 'totalEarned' | 'totalRedeemed'>) => void;
  updateChild: (id: string, data: Partial<Child>) => void;
  deleteChild: (id: string) => void;
  selectChild: (id: string) => void;
  updateStamps: (childId: string, delta: number) => void;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

export const useChildStore = create<ChildState>((set, get) => ({
  children: [],
  currentChild: null,

  loadChildren: () => {
    const list = getChildList() as Child[];
    const selectedId = getSelectedChildId();
    set({
      children: list,
      currentChild: list.find((c: Child) => c.id === selectedId) || list[0] || null,
    });
    if (list.length > 0 && selectedId) {
      useAppStore.getState().setSelectedChild(selectedId);
    }
  },

  addChild: (child) => {
    const newChild: Child = {
      ...child,
      id: generateId(),
      currentStamps: 0,
      totalEarned: 0,
      totalRedeemed: 0,
      createdAt: new Date().toISOString(),
    };
    const updated = [...get().children, newChild];
    setChildList(updated);
    set({ children: updated });
    useAppStore.getState().showToast('添加孩子成功', 'success');
  },

  updateChild: (id, data) => {
    const updated = get().children.map((c) => (c.id === id ? { ...c, ...data } : c));
    setChildList(updated);
    set({ children: updated, currentChild: updated.find((c) => c.id === get().currentChild?.id) || null });
  },

  deleteChild: (id) => {
    const updated = get().children.filter((c) => c.id !== id);
    setChildList(updated);
    const newCurrent = updated[0] || null;
    set({ children: updated, currentChild: newCurrent });
    if (newCurrent) {
      setSelectedChildId(newCurrent.id);
      useAppStore.getState().setSelectedChild(newCurrent.id);
    } else {
      localStorage.removeItem('selectedChildId');
      useAppStore.getState().setSelectedChild(null);
    }
    useAppStore.getState().showToast('删除成功', 'success');
  },

  selectChild: (id) => {
    const child = get().children.find((c) => c.id === id) || null;
    set({ currentChild: child });
    setSelectedChildId(id);
    useAppStore.getState().setSelectedChild(id);
  },

  updateStamps: (childId, delta) => {
    const updated = get().children.map((c) => {
      if (c.id === childId) {
        const newEarned = delta > 0 ? c.totalEarned + delta : c.totalEarned;
        const newRedeemed = delta < 0 ? c.totalRedeemed + Math.abs(delta) : c.totalRedeemed;
        return {
          ...c,
          currentStamps: Math.max(0, c.currentStamps + delta),
          totalEarned: newEarned,
          totalRedeemed: newRedeemed,
        };
      }
      return c;
    });
    setChildList(updated);
    set({ children: updated, currentChild: updated.find((c) => c.id === childId) || null });
  },
}));
