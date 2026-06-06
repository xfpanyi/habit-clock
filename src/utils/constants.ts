export const IS_DEMO_MODE = true;

export const DEFAULT_PARENT_PASSWORD = '123456';

export const STORAGE_KEYS = {
  CHILD_LIST: 'childList',
  SELECTED_CHILD_ID: 'selectedChildId',
  TASKS: (childId: string) => `demo_tasks_${childId}`,
  STAMP_RECORDS: (childId: string) => `demo_stamp_records_${childId}`,
  REDEEM_RECORDS: (childId: string) => `demo_redeem_${childId}`,
  DAILY_TASK_RECORDS: (childId: string) => `demo_daily_tasks_${childId}`,
  PRODUCTS: 'managed_products',
  USER_ROLE: 'userRole',
  THEME: 'theme',
  PARENT_PASSWORD: 'parentPassword',
  TASK_TEMPLATES: 'task_templates',
  AUTO_IMPORT_DATE: (childId: string) => `auto_import_date_${childId}`,
} as const;

export const DEFAULT_TASKS = [
  { name: '完成作业', icon: '✏️', stampReward: 5, description: '认真完成今天的作业', category: '学习', timeSlot: 'afternoon' as const },
  { name: '认真刷牙', icon: '🪥', stampReward: 3, description: '早晚刷牙，每次2分钟', category: '生活', timeSlot: 'morning' as const },
  { name: '跳绳锻炼', icon: '🏃', stampReward: 4, description: '跳绳100下或运动15分钟', category: '运动', timeSlot: 'evening' as const },
  { name: '阅读课外书', icon: '📚', stampReward: 5, description: '阅读30分钟以上', category: '学习', timeSlot: 'evening' as const },
  { name: '考试优秀', icon: '🌟', stampReward: 20, description: '考试成绩达到优秀', category: '学习', timeSlot: 'afternoon' as const },
  { name: '帮忙做家务', icon: '🧹', stampReward: 5, description: '主动帮助家人做家务', category: '生活', timeSlot: 'evening' as const },
];

export const DEFAULT_PRODUCTS = [
  { name: '彩色积木套装', icon: '🧱', price: 80, category: 'toy' as const, stock: 999 },
  { name: '彩虹棒棒糖', icon: '🍭', price: 30, category: 'snack' as const, stock: 999 },
  { name: '儿童故事书', icon: '📖', price: 60, category: 'stationery' as const, stock: 999 },
  { name: '小熊饼干', icon: '🍪', price: 25, category: 'snack' as const, stock: 999 },
  { name: '玩具汽车', icon: '🚗', price: 100, category: 'toy' as const, stock: 999 },
  { name: '草莓冰淇淋', icon: '🍦', price: 40, category: 'snack' as const, stock: 999 },
];

export const PRODUCT_CATEGORIES = [
  { key: 'all', label: '全部' },
  { key: 'toy', label: '玩具' },
  { key: 'snack', label: '零食' },
  { key: 'stationery', label: '文具' },
  { key: 'other', label: '其他' },
] as const;

export const REDEEM_STATUS_LABELS = {
  pending: '待处理',
  approved: '已完成',
  rejected: '已拒绝',
} as const;

export const GENDER_OPTIONS = [
  { value: 'boy', label: '男生', emoji: '👦' },
  { value: 'girl', label: '女生', emoji: '👧' },
] as const;

export const TIME_SLOT_OPTIONS = [
  { value: 'morning', label: '上午', icon: '☀️' },
  { value: 'afternoon', label: '下午', icon: '☀️' },
  { value: 'evening', label: '晚上', icon: '🌙' },
] as const;

export const WEEK_DAYS = [
  { value: 1, label: '周一' },
  { value: 2, label: '周二' },
  { value: 3, label: '周三' },
  { value: 4, label: '周四' },
  { value: 5, label: '周五' },
  { value: 6, label: '周六' },
  { value: 0, label: '周日' },
] as const;
