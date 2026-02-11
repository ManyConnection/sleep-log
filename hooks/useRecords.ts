import { useState, useEffect, useCallback } from 'react';
import { DrinkRecord, DailySummary, DrinkType } from '@/types';
import { loadRecords, saveRecords, generateId, formatDateKey, getTodayKey } from '@/utils';

export function useRecords() {
  const [records, setRecords] = useState<DrinkRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // 初回読み込み
  useEffect(() => {
    loadRecords().then(data => {
      setRecords(data);
      setLoading(false);
    });
  }, []);

  // 記録を追加
  const addRecord = useCallback(async (type: DrinkType, amount: number) => {
    const now = Date.now();
    const newRecord: DrinkRecord = {
      id: generateId(),
      type,
      amount,
      timestamp: now,
      date: formatDateKey(new Date(now)),
    };

    const updated = [...records, newRecord];
    setRecords(updated);
    await saveRecords(updated);
    return newRecord;
  }, [records]);

  // 記録を削除
  const deleteRecord = useCallback(async (id: string) => {
    const updated = records.filter(r => r.id !== id);
    setRecords(updated);
    await saveRecords(updated);
  }, [records]);

  // 今日の記録を取得
  const getTodayRecords = useCallback((): DrinkRecord[] => {
    const today = getTodayKey();
    return records.filter(r => r.date === today);
  }, [records]);

  // 今日の合計量を取得
  const getTodayTotal = useCallback((): number => {
    return getTodayRecords().reduce((sum, r) => sum + r.amount, 0);
  }, [getTodayRecords]);

  // 特定日の記録を取得
  const getRecordsByDate = useCallback((date: string): DrinkRecord[] => {
    return records.filter(r => r.date === date);
  }, [records]);

  // 日別サマリーを取得
  const getDailySummary = useCallback((date: string): DailySummary => {
    const dayRecords = getRecordsByDate(date);
    return {
      date,
      totalAmount: dayRecords.reduce((sum, r) => sum + r.amount, 0),
      records: dayRecords,
    };
  }, [getRecordsByDate]);

  // 期間内の日別サマリーを取得
  const getDailySummaries = useCallback((dates: string[]): DailySummary[] => {
    return dates.map(date => getDailySummary(date));
  }, [getDailySummary]);

  return {
    records,
    loading,
    addRecord,
    deleteRecord,
    getTodayRecords,
    getTodayTotal,
    getRecordsByDate,
    getDailySummary,
    getDailySummaries,
  };
}
