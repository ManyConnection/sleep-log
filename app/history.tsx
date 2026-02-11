import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants';
import { CalendarView, RecordList } from '@/components';
import { useRecords, useSettings } from '@/hooks';
import { getTodayKey, formatDisplayDate, formatAmount } from '@/utils';
import { parseISO } from 'date-fns';

export default function HistoryScreen() {
  const { records, getRecordsByDate, getDailySummary, deleteRecord } = useRecords();
  const { settings } = useSettings();
  const [selectedDate, setSelectedDate] = useState(getTodayKey());

  // サマリーのMapを作成
  const summariesMap = useMemo(() => {
    const map = new Map();
    records.forEach(record => {
      if (!map.has(record.date)) {
        map.set(record.date, getDailySummary(record.date));
      }
    });
    return map;
  }, [records, getDailySummary]);

  const selectedRecords = getRecordsByDate(selectedDate);
  const selectedSummary = getDailySummary(selectedDate);
  const progress = Math.min((selectedSummary.totalAmount / settings.dailyGoal) * 100, 100);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* カレンダー */}
        <CalendarView
          summaries={summariesMap}
          goal={settings.dailyGoal}
          onSelectDate={setSelectedDate}
          selectedDate={selectedDate}
        />

        {/* 選択した日の詳細 */}
        <View style={styles.detailSection}>
          <Text style={styles.dateTitle}>
            {formatDisplayDate(parseISO(selectedDate))}
          </Text>

          {/* サマリーカード */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>摂取量</Text>
                <Text style={styles.summaryValue}>
                  {formatAmount(selectedSummary.totalAmount)}
                </Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>目標</Text>
                <Text style={styles.summaryValue}>
                  {formatAmount(settings.dailyGoal)}
                </Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>達成率</Text>
                <Text style={[
                  styles.summaryValue,
                  progress >= 100 ? styles.summaryValueSuccess : null,
                ]}>
                  {Math.round(progress)}%
                </Text>
              </View>
            </View>

            {/* プログレスバー */}
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
          </View>

          {/* 記録リスト */}
          <Text style={styles.recordsTitle}>記録一覧</Text>
          <RecordList records={selectedRecords} onDelete={deleteRecord} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  detailSection: {
    marginTop: 20,
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
  },
  summaryLabel: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  summaryValueSuccess: {
    color: Colors.success,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.primaryLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  recordsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
});
