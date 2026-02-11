import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isToday, parseISO, subDays } from 'date-fns';
import { ja } from 'date-fns/locale';

// 日付をYYYY-MM-DD形式に変換
export function formatDateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

// 今日の日付キーを取得
export function getTodayKey(): string {
  return formatDateKey(new Date());
}

// 日付を表示用にフォーマット
export function formatDisplayDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'M月d日(E)', { locale: ja });
}

// 時刻を表示用にフォーマット
export function formatTime(timestamp: number): string {
  return format(new Date(timestamp), 'HH:mm');
}

// 今週の日付範囲を取得
export function getWeekRange(date: Date = new Date()): { start: Date; end: Date } {
  return {
    start: startOfWeek(date, { weekStartsOn: 1 }),
    end: endOfWeek(date, { weekStartsOn: 1 }),
  };
}

// 今月の日付範囲を取得
export function getMonthRange(date: Date = new Date()): { start: Date; end: Date } {
  return {
    start: startOfMonth(date),
    end: endOfMonth(date),
  };
}

// 範囲内の全日付を取得
export function getDaysInRange(start: Date, end: Date): Date[] {
  return eachDayOfInterval({ start, end });
}

// 過去N日間の日付を取得
export function getLastNDays(n: number): Date[] {
  const today = new Date();
  return Array.from({ length: n }, (_, i) => subDays(today, n - 1 - i));
}

// 今日かどうか
export function checkIsToday(date: Date | string): boolean {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isToday(d);
}

// 月名を取得
export function getMonthName(date: Date): string {
  return format(date, 'yyyy年M月', { locale: ja });
}

// 曜日を取得
export function getDayOfWeek(date: Date): string {
  return format(date, 'E', { locale: ja });
}
