import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { SleepEntryCard } from '../../components/SleepEntryCard';
import { getSleepEntries } from '../../utils/storage';
import { SleepEntry } from '../../types/sleep';

export default function HistoryScreen() {
  const [entries, setEntries] = useState<SleepEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  const loadEntries = useCallback(async () => {
    const allEntries = await getSleepEntries();
    setEntries(allEntries);
    setLoading(false);
  }, []);
  
  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [loadEntries])
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
  
  if (entries.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📝</Text>
          <Text style={styles.emptyTitle}>履歴がありません</Text>
          <Text style={styles.emptyText}>
            睡眠を記録すると{'\n'}ここに履歴が表示されます
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  
  const completedEntries = entries.filter(e => e.wakeTime);
  const currentSleep = entries.find(e => !e.wakeTime);
  
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={completedEntries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SleepEntryCard entry={item} onUpdate={loadEntries} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={styles.title}>睡眠履歴</Text>
            {currentSleep && (
              <View style={styles.sleepingBanner}>
                <Text style={styles.sleepingText}>💤 現在睡眠中...</Text>
              </View>
            )}
            <Text style={styles.subtitle}>
              {completedEntries.length}件の記録
            </Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyList}>
            <Text style={styles.emptyListText}>
              完了した睡眠記録がありません
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
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
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  sleepingBanner: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginVertical: 12,
  },
  sleepingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6366F1',
    textAlign: 'center',
  },
  emptyList: {
    padding: 40,
    alignItems: 'center',
  },
  emptyListText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
