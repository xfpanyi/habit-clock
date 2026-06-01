import { STORAGE_KEYS } from './constants';

export function getItem<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

export function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeItem(key: string): void {
  localStorage.removeItem(key);
}

export function getChildTasks(childId: string) {
  return getItem(STORAGE_KEYS.TASKS(childId)) || [];
}

export function setChildTasks(childId: string, tasks: unknown) {
  setItem(STORAGE_KEYS.TASKS(childId), tasks);
}

export function getStampRecords(childId: string) {
  return getItem(STORAGE_KEYS.STAMP_RECORDS(childId)) || [];
}

export function setStampRecords(childId: string, records: unknown) {
  setItem(STORAGE_KEYS.STAMP_RECORDS(childId), records);
}

export function getRedeemRecords(childId: string) {
  return getItem(STORAGE_KEYS.REDEEM_RECORDS(childId)) || [];
}

export function setRedeemRecords(childId: string, records: unknown) {
  setItem(STORAGE_KEYS.REDEEM_RECORDS(childId), records);
}

export function getChildList() {
  return getItem(STORAGE_KEYS.CHILD_LIST) || [];
}

export function setChildList(children: unknown) {
  setItem(STORAGE_KEYS.CHILD_LIST, children);
}

export function getSelectedChildId() {
  return getItem<string>(STORAGE_KEYS.SELECTED_CHILD_ID);
}

export function setSelectedChildId(childId: string) {
  setItem(STORAGE_KEYS.SELECTED_CHILD_ID, childId);
}

export function getProducts() {
  return getItem(STORAGE_KEYS.PRODUCTS) || [];
}

export function setProducts(products: unknown) {
  setItem(STORAGE_KEYS.PRODUCTS, products);
}

export function getUserRole() {
  return getItem<string>(STORAGE_KEYS.USER_ROLE);
}

export function setUserRole(role: string) {
  setItem(STORAGE_KEYS.USER_ROLE, role);
}

export function getTheme() {
  return getItem<string>(STORAGE_KEYS.THEME);
}

export function setTheme(theme: string) {
  setItem(STORAGE_KEYS.THEME, theme);
}

export function getParentPassword() {
  return getItem<string>(STORAGE_KEYS.PARENT_PASSWORD);
}

export function setParentPassword(password: string) {
  setItem(STORAGE_KEYS.PARENT_PASSWORD, password);
}

export function getTaskTemplates() {
  return getItem(STORAGE_KEYS.TASK_TEMPLATES) || [];
}

export function setTaskTemplates(templates: unknown) {
  setItem(STORAGE_KEYS.TASK_TEMPLATES, templates);
}

export function clearAllData() {
  const keys = Object.keys(localStorage).filter(k => k.startsWith('demo_') || ['childList', 'selectedChildId', 'managed_products', 'userRole', 'theme', 'task_templates'].includes(k));
  keys.forEach(k => localStorage.removeItem(k));
}
