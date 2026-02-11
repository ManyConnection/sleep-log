import { SleepEntry, SleepStats, DailySleepData } from '../types/sleep';
import { startOfDay, differenceInMinutes, parseISO, format, subDays, isWithinInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

const IDEAL_SLEEP_DURATION = 480; // 8 hours in minutes
const MIN_GOOD_SLEEP = 420; // 7 hours
const MAX_GOOD_SLEEP = 540; // 9 hours

export function calculateSleepDuration(sleepTime: string, wakeTime: string): number {
  const sleep = parseISO(sleepTime);
  const wake = parseISO(wakeTime);
  return differenceInMinutes(wake, sleep);
}

export function calculateSleepScore(entries: SleepEntry[]): number {
  if (entries.length === 0) return 0;
  
  const completedEntries = entries.filter(e => e.wakeTime);
  if (completedEntries.length === 0) return 0;
  
  // Use last 7 days of data
  const recentEntries = completedEntries.slice(0, 7);
  
  let totalScore = 0;
  
  for (const entry of recentEntries) {
    const duration = calculateSleepDuration(entry.sleepTime, entry.wakeTime!);
    
    // Duration score (0-50 points)
    let durationScore = 0;
    if (duration >= MIN_GOOD_SLEEP && duration <= MAX_GOOD_SLEEP) {
      durationScore = 50;
    } else if (duration < MIN_GOOD_SLEEP) {
      durationScore = Math.max(0, 50 - (MIN_GOOD_SLEEP - duration) / 10);
    } else {
      durationScore = Math.max(0, 50 - (duration - MAX_GOOD_SLEEP) / 15);
    }
    
    // Timing score (0-30 points) - ideal sleep time is 22:00-00:00
    const sleepHour = parseISO(entry.sleepTime).getHours();
    let timingScore = 0;
    if (sleepHour >= 22 || sleepHour === 0) {
      timingScore = 30;
    } else if (sleepHour >= 21 || sleepHour <= 1) {
      timingScore = 25;
    } else if (sleepHour >= 20 || sleepHour <= 2) {
      timingScore = 15;
    } else {
      timingScore = 5;
    }
    
    // Consistency bonus (0-20 points) - based on regularity
    const consistencyScore = 20; // Simplified for now
    
    totalScore += durationScore + timingScore + consistencyScore;
  }
  
  return Math.round(totalScore / recentEntries.length);
}

export function calculateConsistency(entries: SleepEntry[]): number {
  if (entries.length < 2) return 0;
  
  const completedEntries = entries.filter(e => e.wakeTime).slice(0, 14);
  if (completedEntries.length < 2) return 0;
  
  const sleepHours = completedEntries.map(e => {
    const hour = parseISO(e.sleepTime).getHours();
    return hour > 12 ? hour : hour + 24; // Normalize to 12-36 range
  });
  
  const avgHour = sleepHours.reduce((a, b) => a + b, 0) / sleepHours.length;
  const variance = sleepHours.reduce((sum, h) => sum + Math.pow(h - avgHour, 2), 0) / sleepHours.length;
  const stdDev = Math.sqrt(variance);
  
  // Lower standard deviation = higher consistency
  // stdDev of 0 = 100%, stdDev of 3+ hours = 0%
  return Math.round(Math.max(0, 100 - (stdDev * 33)));
}

export function calculateStats(entries: SleepEntry[]): SleepStats {
  const completedEntries = entries.filter(e => e.wakeTime);
  
  if (completedEntries.length === 0) {
    return {
      averageDuration: 0,
      totalEntries: 0,
      sleepScore: 0,
      consistency: 0,
    };
  }
  
  const totalDuration = completedEntries.reduce((sum, entry) => {
    return sum + calculateSleepDuration(entry.sleepTime, entry.wakeTime!);
  }, 0);
  
  return {
    averageDuration: Math.round(totalDuration / completedEntries.length),
    totalEntries: completedEntries.length,
    sleepScore: calculateSleepScore(entries),
    consistency: calculateConsistency(entries),
  };
}

export function getDailySleepData(entries: SleepEntry[], days: number): DailySleepData[] {
  const completedEntries = entries.filter(e => e.wakeTime);
  const result: DailySleepData[] = [];
  const today = startOfDay(new Date());
  
  for (let i = days - 1; i >= 0; i--) {
    const targetDate = subDays(today, i);
    const dateStr = format(targetDate, 'yyyy-MM-dd');
    
    // Find entry that ended on this day
    const entry = completedEntries.find(e => {
      const wakeDate = format(parseISO(e.wakeTime!), 'yyyy-MM-dd');
      return wakeDate === dateStr;
    });
    
    if (entry) {
      result.push({
        date: dateStr,
        duration: calculateSleepDuration(entry.sleepTime, entry.wakeTime!),
        sleepTime: entry.sleepTime,
        wakeTime: entry.wakeTime!,
      });
    } else {
      result.push({
        date: dateStr,
        duration: 0,
        sleepTime: '',
        wakeTime: '',
      });
    }
  }
  
  return result;
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}時間${mins}分`;
}

export function formatTime(isoString: string): string {
  return format(parseISO(isoString), 'HH:mm');
}

export function formatDate(isoString: string): string {
  return format(parseISO(isoString), 'M/d (E)');
}

export function getScoreEmoji(score: number): string {
  if (score >= 80) return '😴💯';
  if (score >= 60) return '😊';
  if (score >= 40) return '😐';
  if (score >= 20) return '😰';
  return '😵';
}

export function getScoreColor(score: number): string {
  if (score >= 80) return '#4CAF50';
  if (score >= 60) return '#8BC34A';
  if (score >= 40) return '#FFC107';
  if (score >= 20) return '#FF9800';
  return '#F44336';
}
