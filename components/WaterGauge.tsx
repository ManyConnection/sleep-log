import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '@/constants';
import { formatAmount, calculatePercentage } from '@/utils';

interface WaterGaugeProps {
  current: number;
  goal: number;
  size?: number;
}

export function WaterGauge({ current, goal, size = 200 }: WaterGaugeProps) {
  const percentage = calculatePercentage(current, goal);
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* 背景の円 */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={Colors.primaryLight}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* プログレスの円 */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={Colors.primary}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={[styles.content, { width: size, height: size }]}>
        <Text style={styles.emoji}>💧</Text>
        <Text style={styles.amount}>{formatAmount(current)}</Text>
        <Text style={styles.goal}>/ {formatAmount(goal)}</Text>
        <Text style={styles.percentage}>{percentage}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  amount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
  },
  goal: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 2,
  },
  percentage: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginTop: 4,
  },
});
