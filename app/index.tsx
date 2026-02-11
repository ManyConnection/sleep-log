import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants';
import { WaterGauge, QuickAddButtons, RecordList } from '@/components';
import { useRecords, useSettings } from '@/hooks';
import { formatDisplayDate, requestNotificationPermissions } from '@/utils';

export default function HomeScreen() {
  const { getTodayRecords, getTodayTotal, addRecord, deleteRecord, loading } = useRecords();
  const { settings, loading: settingsLoading } = useSettings();
  const [refreshing, setRefreshing] = useState(false);

  // 通知権限をリクエスト
  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  const todayRecords = getTodayRecords();
  const todayTotal = getTodayTotal();

  const handleQuickAdd = async (amount: number) => {
    await addRecord('water', amount);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // データの再読み込みはuseRecords内で自動的に行われる
    setTimeout(() => setRefreshing(false), 500);
  };

  if (loading || settingsLoading) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>読み込み中...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* 今日の日付 */}
        <Text style={styles.date}>{formatDisplayDate(new Date())}</Text>

        {/* 水分ゲージ */}
        <View style={styles.gaugeContainer}>
          <WaterGauge current={todayTotal} goal={settings.dailyGoal} size={220} />
        </View>

        {/* 達成メッセージ */}
        {todayTotal >= settings.dailyGoal ? (
          <View style={styles.achievementBanner}>
            <Text style={styles.achievementEmoji}>🎉</Text>
            <Text style={styles.achievementText}>今日の目標を達成しました！</Text>
          </View>
        ) : (
          <Text style={styles.encouragement}>
            あと {settings.dailyGoal - todayTotal}ml で目標達成！
          </Text>
        )}

        {/* クイック記録ボタン */}
        <QuickAddButtons onAdd={handleQuickAdd} />

        {/* 今日の記録 */}
        <View style={styles.recordsSection}>
          <Text style={styles.sectionTitle}>今日の記録</Text>
          <RecordList records={todayRecords} onDelete={deleteRecord} />
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
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textLight,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  date: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  gaugeContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  achievementBanner: {
    flexDirection: 'row',
    backgroundColor: Colors.success + '20',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  achievementEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  achievementText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.success,
  },
  encouragement: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 8,
  },
  recordsSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
});
