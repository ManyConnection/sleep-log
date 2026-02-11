import { useState, useEffect, useCallback } from 'react';
import { AppSettings, ReminderSetting } from '@/types';
import { loadSettings, saveSettings, rescheduleReminders, generateId } from '@/utils';
import { DEFAULT_SETTINGS } from '@/constants';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  // 初回読み込み
  useEffect(() => {
    loadSettings().then(data => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  // 設定を更新
  const updateSettings = useCallback(async (updates: Partial<AppSettings>) => {
    const updated = { ...settings, ...updates };
    setSettings(updated);
    await saveSettings(updated);
    
    // リマインダーが変更された場合は再スケジュール
    if (updates.reminders || updates.notificationsEnabled !== undefined) {
      if (updated.notificationsEnabled) {
        await rescheduleReminders(updated.reminders);
      }
    }
  }, [settings]);

  // 目標量を設定
  const setDailyGoal = useCallback(async (goal: number) => {
    await updateSettings({ dailyGoal: goal });
  }, [updateSettings]);

  // リマインダーを追加
  const addReminder = useCallback(async (time: string, days: number[]) => {
    const newReminder: ReminderSetting = {
      id: generateId(),
      time,
      enabled: true,
      days,
    };
    await updateSettings({
      reminders: [...settings.reminders, newReminder],
    });
  }, [settings.reminders, updateSettings]);

  // リマインダーを更新
  const updateReminder = useCallback(async (id: string, updates: Partial<ReminderSetting>) => {
    const reminders = settings.reminders.map(r =>
      r.id === id ? { ...r, ...updates } : r
    );
    await updateSettings({ reminders });
  }, [settings.reminders, updateSettings]);

  // リマインダーを削除
  const deleteReminder = useCallback(async (id: string) => {
    const reminders = settings.reminders.filter(r => r.id !== id);
    await updateSettings({ reminders });
  }, [settings.reminders, updateSettings]);

  // 通知を有効/無効
  const setNotificationsEnabled = useCallback(async (enabled: boolean) => {
    await updateSettings({ notificationsEnabled: enabled });
  }, [updateSettings]);

  return {
    settings,
    loading,
    updateSettings,
    setDailyGoal,
    addReminder,
    updateReminder,
    deleteReminder,
    setNotificationsEnabled,
  };
}
