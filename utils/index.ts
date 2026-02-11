export * from './storage';
export * from './date';
export * from './notifications';

// ユニークIDを生成
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// mlをリットル表示に変換
export function formatAmount(ml: number): string {
  if (ml >= 1000) {
    const liters = ml / 1000;
    return `${liters.toFixed(1)}L`;
  }
  return `${ml}ml`;
}

// パーセンテージを計算
export function calculatePercentage(current: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.min(Math.round((current / goal) * 100), 100);
}
