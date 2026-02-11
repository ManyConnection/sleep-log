import { DrinkTypeInfo, AmountPreset } from '@/types';

// カラーパレット
export const Colors = {
  primary: '#4FC3F7',
  primaryDark: '#0288D1',
  primaryLight: '#B3E5FC',
  secondary: '#81D4FA',
  background: '#F5F9FC',
  surface: '#FFFFFF',
  text: '#333333',
  textLight: '#666666',
  textMuted: '#999999',
  border: '#E0E0E0',
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  water: '#4FC3F7',
  tea: '#8D6E63',
  coffee: '#5D4037',
  juice: '#FF9800',
  sports: '#66BB6A',
  other: '#9E9E9E',
};

// 飲み物タイプ情報
export const DRINK_TYPES: DrinkTypeInfo[] = [
  { type: 'water', name: '水', emoji: '💧', color: Colors.water },
  { type: 'tea', name: 'お茶', emoji: '🍵', color: Colors.tea },
  { type: 'coffee', name: 'コーヒー', emoji: '☕', color: Colors.coffee },
  { type: 'juice', name: 'ジュース', emoji: '🧃', color: Colors.juice },
  { type: 'sports', name: 'スポドリ', emoji: '🥤', color: Colors.sports },
  { type: 'other', name: 'その他', emoji: '🥛', color: Colors.other },
];

// プリセット量
export const AMOUNT_PRESETS: AmountPreset[] = [
  { label: 'コップ', amount: 200, emoji: '🥛' },
  { label: 'マグカップ', amount: 250, emoji: '☕' },
  { label: 'ペットボトル小', amount: 350, emoji: '🧴' },
  { label: 'ペットボトル', amount: 500, emoji: '🍶' },
  { label: 'ペットボトル大', amount: 1000, emoji: '🫗' },
];

// デフォルト設定
export const DEFAULT_SETTINGS = {
  dailyGoal: 2000, // 2リットル
  notificationsEnabled: true,
  reminders: [
    { id: '1', time: '09:00', enabled: true, days: [1, 2, 3, 4, 5] },
    { id: '2', time: '12:00', enabled: true, days: [1, 2, 3, 4, 5] },
    { id: '3', time: '15:00', enabled: true, days: [1, 2, 3, 4, 5] },
    { id: '4', time: '18:00', enabled: true, days: [1, 2, 3, 4, 5] },
  ],
};

// ストレージキー
export const STORAGE_KEYS = {
  RECORDS: 'water_drink_records',
  SETTINGS: 'water_drink_settings',
};
