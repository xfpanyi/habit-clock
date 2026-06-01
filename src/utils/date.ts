import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns';

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'yyyy-MM-dd');
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'yyyy-MM-dd HH:mm');
}

export function getToday(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getWeekDates(): string[] {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = addDays(weekStart, i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    dates.push(`${year}-${month}-${day}`);
  }
  return dates;
}

export function isToday(dateStr: string): boolean {
  return isSameDay(parseISO(dateStr), new Date());
}

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const WEEK_DAYS_CN = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

export function getWeekDayLabel(dateStr: string): string {
  const date = parseISO(dateStr);
  const dayIndex = date.getDay();
  const idx = dayIndex === 0 ? 6 : dayIndex - 1;
  return WEEK_DAYS_CN[idx];
}
