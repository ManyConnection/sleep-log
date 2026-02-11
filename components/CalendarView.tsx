import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/constants';
import { formatDateKey, getMonthName, getDaysInRange, checkIsToday, formatAmount } from '@/utils';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, subMonths, isSameMonth, parseISO } from 'date-fns';
import { DailySummary } from '@/types';
import { Ionicons } from '@expo/vector-icons';

interface CalendarViewProps {
  summaries: Map<string, DailySummary>;
  goal: number;
  onSelectDate: (date: string) => void;
  selectedDate: string;
}

export function CalendarView({ summaries, goal, onSelectDate, selectedDate }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = getDaysInRange(calendarStart, calendarEnd);

  const weekDays = ['月', '火', '水', '木', '金', '土', '日'];

  const goToPrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToToday = () => setCurrentMonth(new Date());

  const getDayStyle = (date: Date) => {
    const dateKey = formatDateKey(date);
    const summary = summaries.get(dateKey);
    const isCurrentMonth = isSameMonth(date, currentMonth);
    const isToday = checkIsToday(date);
    const isSelected = dateKey === selectedDate;
    const hasReachedGoal = summary && summary.totalAmount >= goal;
    const hasRecords = summary && summary.totalAmount > 0;

    return {
      isCurrentMonth,
      isToday,
      isSelected,
      hasReachedGoal,
      hasRecords,
      amount: summary?.totalAmount || 0,
    };
  };

  return (
    <View style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goToPrevMonth} style={styles.navButton}>
          <Ionicons name="chevron-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={goToToday}>
          <Text style={styles.monthTitle}>{getMonthName(currentMonth)}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
          <Ionicons name="chevron-forward" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* 曜日ヘッダー */}
      <View style={styles.weekDays}>
        {weekDays.map((day, index) => (
          <Text
            key={day}
            style={[
              styles.weekDay,
              index === 5 && styles.saturday,
              index === 6 && styles.sunday,
            ]}
          >
            {day}
          </Text>
        ))}
      </View>

      {/* カレンダーグリッド */}
      <View style={styles.grid}>
        {days.map((date) => {
          const dateKey = formatDateKey(date);
          const { isCurrentMonth, isToday, isSelected, hasReachedGoal, hasRecords, amount } = getDayStyle(date);

          return (
            <TouchableOpacity
              key={dateKey}
              style={[
                styles.day,
                isSelected && styles.daySelected,
                isToday && styles.dayToday,
              ]}
              onPress={() => onSelectDate(dateKey)}
              disabled={!isCurrentMonth}
            >
              <Text
                style={[
                  styles.dayText,
                  !isCurrentMonth && styles.dayTextOther,
                  isToday && styles.dayTextToday,
                  isSelected && styles.dayTextSelected,
                ]}
              >
                {date.getDate()}
              </Text>
              {hasRecords && (
                <View
                  style={[
                    styles.indicator,
                    hasReachedGoal ? styles.indicatorSuccess : styles.indicatorPartial,
                  ]}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 凡例 */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.indicatorSuccess]} />
          <Text style={styles.legendText}>目標達成</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.indicatorPartial]} />
          <Text style={styles.legendText}>記録あり</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textLight,
  },
  saturday: {
    color: Colors.primary,
  },
  sunday: {
    color: Colors.error,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  day: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  daySelected: {
    backgroundColor: Colors.primary,
  },
  dayToday: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  dayText: {
    fontSize: 14,
    color: Colors.text,
  },
  dayTextOther: {
    color: Colors.textMuted,
  },
  dayTextToday: {
    fontWeight: '600',
    color: Colors.primary,
  },
  dayTextSelected: {
    color: Colors.surface,
    fontWeight: '600',
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 2,
  },
  indicatorSuccess: {
    backgroundColor: Colors.success,
  },
  indicatorPartial: {
    backgroundColor: Colors.primaryLight,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
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
