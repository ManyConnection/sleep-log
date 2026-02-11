// 飲み物の種類
export type DrinkType = 'water' | 'tea' | 'coffee' | 'juice' | 'sports' | 'other';

// 飲み物の記録
export interface DrinkRecord {
  id: string;
  type: DrinkType;
  amount: number; // ml
  timestamp: number; // Unix timestamp
  date: string; // YYYY-MM-DD
}

// 1日の記録サマリー
export interface DailySummary {
  date: string;
  totalAmount: number;
  records: DrinkRecord[];
}

// リマインダー設定
export interface ReminderSetting {
  id: string;
  time: string; // HH:mm
  enabled: boolean;
  days: number[]; // 0-6 (日-土)
}

// アプリ設定
export interface AppSettings {
  dailyGoal: number; // ml
  reminders: ReminderSetting[];
  notificationsEnabled: boolean;
}

// 飲み物タイプの情報
export interface DrinkTypeInfo {
  type: DrinkType;
  name: string;
  emoji: string;
  color: string;
}

// プリセット量
export interface AmountPreset {
  label: string;
  amount: number;
  emoji: string;
}
