import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants';
import { WeeklyChart } from '@/components';
import { useRecords, useSettings } from '@/hooks';
import { getLastNDays, formatDateKey, formatAmount, getMonthName } from '@/utils';
import { subMonths } from 'date-fns';

type Period = 'week' | 'month';

export default function StatsScreen() {
  const { getDailySummaries, records } = useRecords();
  const { settings } = useSettings();
  const [period, setPeriod] = useState<Period>('week');

  // 週間データ
  const weekData = useMemo(() => {
    const days = getLastNDays(7);
    const dateKeys = days.map(d => formatDateKey(d));
    return getDailySummaries(dateKeys);
  }, [getDailySummaries, records]);

  // 月間データ
  const monthData = useMemo(() => {
    const days = getLastNDays(30);
    const dateKeys = days.map(d => formatDateKey(d));
    return getDailySummaries(dateKeys);
  }, [getDailySummaries, records]);

  const currentData = period === 'week' ? weekData : monthData;

  // 統計計算
  const stats = useMemo(() => {
    const daysWithRecords = currentData.filter(d => d.totalAmount > 0);
    const totalAmount = currentData.reduce((sum, d) => sum + d.totalAmount, 0);
    const avgAmount = daysWithRecords.length > 0
      ? Math.round(totalAmount / daysWithRecords.length)
      : 0;
    const maxAmount = Math.max(...currentData.map(d => d.totalAmount), 0);
    const goalAchievedDays = currentData.filter(d => d.totalAmount >= settings.dailyGoal).length;
    const achievementRate = currentData.length > 0
      ? Math.round((goalAchievedDays / currentData.length) * 100)
      : 0;

    return {
      totalAmount,
      avgAmount,
      maxAmount,
      goalAchievedDays,
      achievementRate,
      recordedDays: daysWithRecords.length,
    };
  }, [currentData, settings.dailyGoal]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 期間切り替え */}
        <View style={styles.periodSelector}>
          <TouchableOpacity
            style={[styles.periodButton, period === 'week' && styles.periodButtonActive]}
            onPress={() => setPeriod('week')}
          >
            <Text style={[styles.periodText, period === 'week' && styles.periodTextActive]}>
              週間
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodButton, period === 'month' && styles.periodButtonActive]}
            onPress={() => setPeriod('month')}
          >
            <Text style={[styles.periodText, period === 'month' && styles.periodTextActive]}>
              月間
            </Text>
          </TouchableOpacity>
        </View>

        {/* 週間チャート（週間表示時のみ） */}
        {period === 'week' && (
          <View style={styles.chartSection}>
            <Text style={styles.sectionTitle}>週間グラフ</Text>
            <WeeklyChart data={weekData} goal={settings.dailyGoal} />
          </View>
        )}

        {/* 統計カード */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>
            {period === 'week' ? '過去7日間' : '過去30日間'}の統計
          </Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>💧</Text>
              <Text style={styles.statValue}>{formatAmount(stats.totalAmount)}</Text>
              <Text style={styles.statLabel}>合計摂取量</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>📊</Text>
              <Text style={styles.statValue}>{formatAmount(stats.avgAmount)}</Text>
              <Text style={styles.statLabel}>1日平均</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>🏆</Text>
              <Text style={styles.statValue}>{formatAmount(stats.maxAmount)}</Text>
              <Text style={styles.statLabel}>最高記録</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>🎯</Text>
              <Text style={styles.statValue}>{stats.goalAchievedDays}日</Text>
              <Text style={styles.statLabel}>目標達成</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>📈</Text>
              <Text style={styles.statValue}>{stats.achievementRate}%</Text>
              <Text style={styles.statLabel}>達成率</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>📝</Text>
              <Text style={styles.statValue}>{stats.recordedDays}日</Text>
              <Text style={styles.statLabel}>記録日数</Text>
            </View>
          </View>
        </View>

        {/* ヒント */}
        <View style={styles.tipCard}>
          <Text style={styles.tipEmoji}>💡</Text>
          <Text style={styles.tipText}>
            {stats.achievementRate >= 80
              ? '素晴らしい！水分補給の習慣がしっかり身についています。'
              : stats.achievementRate >= 50
              ? '良い調子です！もう少しで習慣化できそうですね。'
              : 'リマインダーを活用して、定期的な水分補給を心がけましょう。'}
          </Text>
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
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: Colors.primary,
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textLight,
  },
  periodTextActive: {
    color: Colors.surface,
  },
  chartSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  statsSection: {
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textLight,
  },
  tipCard: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: Colors.primaryDark,
    lineHeight: 20,
  },
});
