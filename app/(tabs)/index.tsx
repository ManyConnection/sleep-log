import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Animated } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { 
  getCurrentSleepState, 
  setCurrentSleepState, 
  getCurrentSleepStart,
  setCurrentSleepStart,
  saveSleepEntry,
  generateId
} from '../../utils/storage';
import { SleepState } from '../../types/sleep';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';

export default function HomeScreen() {
  const [sleepState, setSleepState] = useState<SleepState>('awake');
  const [sleepStart, setSleepStart] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [elapsedTime, setElapsedTime] = useState('');
  const pulseAnim = useState(new Animated.Value(1))[0];
  
  const loadState = useCallback(async () => {
    const state = await getCurrentSleepState();
    const start = await getCurrentSleepStart();
    setSleepState(state);
    setSleepStart(start);
    setLoading(false);
  }, []);
  
  useFocusEffect(
    useCallback(() => {
      loadState();
    }, [loadState])
  );
  
  // Update elapsed time every minute when sleeping
  useEffect(() => {
    if (sleepState === 'sleeping' && sleepStart) {
      const updateElapsed = () => {
        const elapsed = formatDistanceToNow(parseISO(sleepStart), { locale: ja });
        setElapsedTime(elapsed);
      };
      updateElapsed();
      const interval = setInterval(updateElapsed, 60000);
      return () => clearInterval(interval);
    }
  }, [sleepState, sleepStart]);
  
  // Pulse animation when sleeping
  useEffect(() => {
    if (sleepState === 'sleeping') {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [sleepState, pulseAnim]);
  
  const handlePress = async () => {
    if (sleepState === 'awake') {
      // Start sleeping
      const now = new Date().toISOString();
      await setCurrentSleepState('sleeping');
      await setCurrentSleepStart(now);
      setSleepState('sleeping');
      setSleepStart(now);
    } else {
      // Wake up - save entry
      const now = new Date().toISOString();
      if (sleepStart) {
        await saveSleepEntry({
          id: generateId(),
          sleepTime: sleepStart,
          wakeTime: now,
          notes: '',
          createdAt: now,
        });
      }
      await setCurrentSleepState('awake');
      await setCurrentSleepStart(null);
      setSleepState('awake');
      setSleepStart(null);
    }
  };
  
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="moon" size={48} color="#6366F1" />
        </View>
      </SafeAreaView>
    );
  }
  
  const isSleeping = sleepState === 'sleeping';
  
  return (
    <SafeAreaView style={[styles.container, isSleeping && styles.sleepingContainer]}>
      <View style={styles.content}>
        <Text style={[styles.title, isSleeping && styles.sleepingText]}>
          ねむりログ
        </Text>
        
        <Text style={[styles.status, isSleeping && styles.sleepingText]}>
          {isSleeping ? '💤 おやすみなさい' : '☀️ おはようございます'}
        </Text>
        
        {isSleeping && sleepStart && (
          <View style={styles.sleepInfo}>
            <Text style={styles.sleepStartTime}>
              就寝時刻: {format(parseISO(sleepStart), 'HH:mm')}
            </Text>
            <Text style={styles.elapsedTime}>
              {elapsedTime}経過
            </Text>
          </View>
        )}
        
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity
            style={[styles.button, isSleeping && styles.wakeButton]}
            onPress={handlePress}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isSleeping ? 'sunny' : 'moon'}
              size={64}
              color="#FFFFFF"
            />
            <Text style={styles.buttonText}>
              {isSleeping ? '起きる' : 'おやすみ'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
        
        <Text style={[styles.hint, isSleeping && styles.sleepingHint]}>
          {isSleeping 
            ? 'ボタンを押して起床を記録' 
            : 'ボタンを押して就寝を記録'
          }
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  sleepingContainer: {
    backgroundColor: '#1E1B4B',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  sleepingText: {
    color: '#FFFFFF',
  },
  status: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 40,
  },
  sleepInfo: {
    alignItems: 'center',
    marginBottom: 40,
  },
  sleepStartTime: {
    fontSize: 16,
    color: '#A5B4FC',
    marginBottom: 8,
  },
  elapsedTime: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  button: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  wakeButton: {
    backgroundColor: '#F59E0B',
    shadowColor: '#F59E0B',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 8,
  },
  hint: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 40,
  },
  sleepingHint: {
    color: '#A5B4FC',
  },
});
