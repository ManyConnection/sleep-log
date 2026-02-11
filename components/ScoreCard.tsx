import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getScoreColor, getScoreEmoji } from '../utils/sleepScore';

interface ScoreCardProps {
  score: number;
  consistency: number;
  averageDuration: number;
}

export function ScoreCard({ score, consistency, averageDuration }: ScoreCardProps) {
  const hours = Math.floor(averageDuration / 60);
  const mins = averageDuration % 60;
  
  return (
    <View style={styles.container}>
      <View style={styles.scoreSection}>
        <Text style={styles.emoji}>{getScoreEmoji(score)}</Text>
        <Text style={[styles.score, { color: getScoreColor(score) }]}>{score}</Text>
        <Text style={styles.scoreLabel}>睡眠スコア</Text>
      </View>
      
      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{hours}h {mins}m</Text>
          <Text style={styles.statLabel}>平均睡眠</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{consistency}%</Text>
          <Text style={styles.statLabel}>規則性</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  scoreSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  score: {
    fontSize: 64,
    fontWeight: '700',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
  },
});
