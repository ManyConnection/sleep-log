import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Line, Text as SvgText, G } from 'react-native-svg';
import { DailySleepData } from '../types/sleep';
import { format, parseISO } from 'date-fns';

interface SleepChartProps {
  data: DailySleepData[];
  type: 'week' | 'month';
}

const CHART_HEIGHT = 200;
const BAR_COLOR = '#6366F1';
const IDEAL_LINE_COLOR = '#22C55E';
const GRID_COLOR = '#E5E7EB';
const TEXT_COLOR = '#6B7280';

export function SleepChart({ data, type }: SleepChartProps) {
  const screenWidth = Dimensions.get('window').width - 40;
  const barWidth = type === 'week' ? (screenWidth - 60) / 7 - 8 : (screenWidth - 60) / data.length - 2;
  const maxDuration = 660; // 11 hours as max
  
  const getBarHeight = (duration: number) => {
    return (duration / maxDuration) * (CHART_HEIGHT - 40);
  };
  
  const idealHeight = getBarHeight(480); // 8 hours
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {type === 'week' ? '週間睡眠グラフ' : '月間睡眠グラフ'}
      </Text>
      
      <Svg width={screenWidth} height={CHART_HEIGHT + 40}>
        {/* Grid lines */}
        {[0, 2, 4, 6, 8, 10].map((hours, i) => {
          const y = CHART_HEIGHT - 20 - getBarHeight(hours * 60);
          return (
            <G key={i}>
              <Line
                x1={40}
                y1={y}
                x2={screenWidth - 10}
                y2={y}
                stroke={GRID_COLOR}
                strokeWidth={1}
              />
              <SvgText
                x={5}
                y={y + 4}
                fill={TEXT_COLOR}
                fontSize={10}
              >
                {hours}h
              </SvgText>
            </G>
          );
        })}
        
        {/* Ideal sleep line (8 hours) */}
        <Line
          x1={40}
          y1={CHART_HEIGHT - 20 - idealHeight}
          x2={screenWidth - 10}
          y2={CHART_HEIGHT - 20 - idealHeight}
          stroke={IDEAL_LINE_COLOR}
          strokeWidth={2}
          strokeDasharray="5,5"
        />
        
        {/* Bars */}
        {data.map((item, index) => {
          const barHeight = getBarHeight(item.duration);
          const x = 50 + index * (barWidth + (type === 'week' ? 8 : 2));
          const y = CHART_HEIGHT - 20 - barHeight;
          
          return (
            <G key={item.date}>
              <Rect
                x={x}
                y={item.duration > 0 ? y : CHART_HEIGHT - 21}
                width={barWidth}
                height={item.duration > 0 ? barHeight : 1}
                fill={item.duration > 0 ? BAR_COLOR : GRID_COLOR}
                rx={type === 'week' ? 4 : 2}
              />
              {type === 'week' && (
                <SvgText
                  x={x + barWidth / 2}
                  y={CHART_HEIGHT}
                  fill={TEXT_COLOR}
                  fontSize={10}
                  textAnchor="middle"
                >
                  {format(parseISO(item.date), 'E')}
                </SvgText>
              )}
            </G>
          );
        })}
      </Svg>
      
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: BAR_COLOR }]} />
          <Text style={styles.legendText}>睡眠時間</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendLine, { backgroundColor: IDEAL_LINE_COLOR }]} />
          <Text style={styles.legendText}>理想 (8時間)</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendBox: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  legendLine: {
    width: 16,
    height: 3,
    borderRadius: 1,
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
  },
});
