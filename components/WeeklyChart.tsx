import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DailySummary } from '@/types';
import { Colors } from '@/constants';
import { getDayOfWeek, checkIsToday, formatAmount } from '@/utils';
import { parseISO } from 'date-fns';

interface WeeklyChartProps {
  data: DailySummary[];
  goal: number;
}

export function WeeklyChart({ data, goal }: WeeklyChartProps) {
  const maxHeight = 120;
  const maxAmount = Math.max(goal, ...data.map(d => d.totalAmount));

  const getBarHeight = (amount: number) => {
    return Math.max((amount / maxAmount) * maxHeight, 4);
  };

  const getBarColor = (amount: number, isToday: boolean) => {
    if (amount >= goal) return Colors.success;
    if (isToday) return Colors.primary;
    return Colors.primaryLight;
  };

  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        {/* 目標ライン */}
        <View style={[styles.goalLine, { bottom: (goal / maxAmount) * maxHeight }]}>
          <Text style={styles.goalText}>{formatAmount(goal)}</Text>
        </View>

        {/* バー */}
        <View style={styles.bars}>
          {data.map((day) => {
            const date = parseISO(day.date);
            const isToday = checkIsToday(date);
            const height = getBarHeight(day.totalAmount);
            const color = getBarColor(day.totalAmount, isToday);

            return (
              <View key={day.date} style={styles.barContainer}>
                <View style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      { height, backgroundColor: color },
                    ]}
                  />
                </View>
                <Text style={[styles.dayLabel, isToday && styles.dayLabelToday]}>
                  {getDayOfWeek(date)}
                </Text>
                <Text style={styles.amountLabel}>
                  {day.totalAmount > 0 ? formatAmount(day.totalAmount) : '-'}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* 凡例 */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.success }]} />
          <Text style={styles.legendText}>目標達成</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.primary }]} />
          <Text style={styles.legendText}>今日</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.primaryLight }]} />
          <Text style={styles.legendText}>未達成</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
  },
  chart: {
    position: 'relative',
    marginBottom: 16,
  },
  goalLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: Colors.warning,
    borderStyle: 'dashed',
  },
  goalText: {
    position: 'absolute',
    right: 0,
    top: -16,
    fontSize: 10,
    color: Colors.warning,
  },
  bars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    height: 120,
    justifyContent: 'flex-end',
  },
  bar: {
    width: 24,
    borderRadius: 4,
    minHeight: 4,
  },
  dayLabel: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 4,
  },
  dayLabelToday: {
    color: Colors.primary,
    fontWeight: '600',
  },
  amountLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: Colors.textLight,
  },
});
