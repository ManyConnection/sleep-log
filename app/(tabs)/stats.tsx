import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { SleepChart } from '../../components/SleepChart';
import { ScoreCard } from '../../components/ScoreCard';
import { getSleepEntries } from '../../utils/storage';
import { calculateStats, getDailySleepData } from '../../utils/sleepScore';
import { SleepEntry, SleepStats, DailySleepData } from '../../types/sleep';

type ChartPeriod = 'week' | 'month';

export default function StatsScreen() {
  const [entries, setEntries] = useState<SleepEntry[]>([]);
  const [stats, setStats] = useState<SleepStats>({
    averageDuration: 0,
    totalEntries: 0,
    sleepScore: 0,
    consistency: 0,
  });
  const [weekData, setWeekData] = useState<DailySleepData[]>([]);
  const [monthData, setMonthData] = useState<DailySleepData[]>([]);
  const [period, setPeriod] = useState<ChartPeriod>('week');
  const [loading, setLoading] = useState(true);
  
  const loadData = useCallback(async () => {
    const allEntries = await getSleepEntries();
    setEntries(allEntries);
    setStats(calculateStats(allEntries));
    setWeekData(getDailySleepData(allEntries, 7));
    setMonthData(getDailySleepData(allEntries, 30));
    setLoading(false);
  }, []);
  
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );
  
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>読み込み中...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  const completedEntries = entries.filter(e => e.wakeTime);
  
  if (completedEntries.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>😴</Text>
          <Text style={styles.emptyTitle}>まだデータがありません</Text>
          <Text style={styles.emptyText}>
            睡眠を記録すると{'\n'}統計情報がここに表示されます
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>睡眠統計</Text>
        
        <ScoreCard
          score={stats.sleepScore}
          consistency={stats.consistency}
          averageDuration={stats.averageDuration}
        />
        
        <View style={styles.periodToggle}>
          <TouchableOpacity
            style={[styles.toggleButton, period === 'week' && styles.toggleActive]}
            onPress={() => setPeriod('week')}
          >
            <Text style={[styles.toggleText, period === 'week' && styles.toggleTextActive]}>
              週間
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, period === 'month' && styles.toggleActive]}
            onPress={() => setPeriod('month')}
          >
            <Text style={[styles.toggleText, period === 'month' && styles.toggleTextActive]}>
              月間
            </Text>
          </TouchableOpacity>
        </View>
        
        <SleepChart 
          data={period === 'week' ? weekData : monthData} 
          type={period}
        />
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>サマリー</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>記録数</Text>
            <Text style={styles.summaryValue}>{stats.totalEntries}件</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>過去7日間の平均就寝時刻</Text>
            <Text style={styles.summaryValue}>
              {getAverageSleepTime(entries.filter(e => e.wakeTime).slice(0, 7))}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>過去7日間の平均起床時刻</Text>
            <Text style={styles.summaryValue}>
              {getAverageWakeTime(entries.filter(e => e.wakeTime).slice(0, 7))}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getAverageSleepTime(entries: SleepEntry[]): string {
  if (entries.length === 0) return '--:--';
  
  const totalMinutes = entries.reduce((sum, e) => {
    const date = new Date(e.sleepTime);
    let hours = date.getHours();
    if (hours < 12) hours += 24; // Normalize to 12-36 range
    return sum + hours * 60 + date.getMinutes();
  }, 0);
  
  let avgMinutes = Math.round(totalMinutes / entries.length);
  if (avgMinutes >= 24 * 60) avgMinutes -= 24 * 60;
  
  const hours = Math.floor(avgMinutes / 60);
  const mins = avgMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

function getAverageWakeTime(entries: SleepEntry[]): string {
  if (entries.length === 0) return '--:--';
  
  const totalMinutes = entries.reduce((sum, e) => {
    if (!e.wakeTime) return sum;
    const date = new Date(e.wakeTime);
    return sum + date.getHours() * 60 + date.getMinutes();
  }, 0);
  
  const avgMinutes = Math.round(totalMinutes / entries.length);
  const hours = Math.floor(avgMinutes / 60);
  const mins = avgMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  periodToggle: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    padding: 4,
    marginVertical: 8,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  toggleTextActive: {
    color: '#1F2937',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
});
