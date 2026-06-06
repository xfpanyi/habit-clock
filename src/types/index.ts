export interface Child {
  id: string;
  name: string;
  avatar: string;
  gender: 'boy' | 'girl';
  age: number;
  theme: 'boy' | 'girl';
  currentStamps: number;
  totalEarned: number;
  totalRedeemed: number;
  createdAt: string;
}

export type TimeSlot = 'morning' | 'afternoon' | 'evening';

export const TIME_SLOT_LABELS: Record<TimeSlot, string> = {
  morning: '上午',
  afternoon: '下午',
  evening: '晚上',
};

export interface Task {
  id: string;
  childId: string;
  name: string;
  icon: string;
  stampReward: number;
  description: string;
  enabled: boolean;
  category: string;
  timeSlot: TimeSlot;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  icon: string;
  price: number;
  category: 'toy' | 'snack' | 'stationery' | 'other';
  stock: number;
  createdAt: string;
}

export interface StampRecord {
  id: string;
  childId: string;
  taskId: string;
  taskName: string;
  count: number;
  date: string;
  type: 'earn' | 'redeem' | 'adjust';
  createdAt: string;
}

export interface DailyTaskRecord {
  id: string;
  childId: string;
  date: string;
  taskId: string;
  taskName: string;
  completed: boolean;
  stampReward: number;
  createdAt: string;
}

export interface RedeemRecord {
  id: string;
  childId: string;
  productId: string;
  productName: string;
  stampCost: number;
  status: 'pending' | 'approved' | 'rejected';
  applyDate: string;
  confirmDate?: string;
  createdAt: string;
}

export interface TaskTemplateItem {
  name: string;
  icon: string;
  stampReward: number;
  description: string;
  category: string;
  timeSlot: TimeSlot;
}

export interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  applyDays: number[];
  tasks: TaskTemplateItem[];
  createdAt: string;
}

export type UserRole = 'child' | 'parent' | null;
export type Theme = 'boy' | 'girl';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
