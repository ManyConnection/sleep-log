import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants';
import { useSettings } from '@/hooks';
import { formatAmount, sendTestNotification, requestNotificationPermissions } from '@/utils';
import { Ionicons } from '@expo/vector-icons';

const GOAL_PRESETS = [1500, 2000, 2500, 3000];
const DAYS = ['日', '月', '火', '水', '木', '金', '土'];

export default function SettingsScreen() {
  const {
    settings,
    setDailyGoal,
    setNotificationsEnabled,
    updateReminder,
    deleteReminder,
    addReminder,
  } = useSettings();
  const [customGoal, setCustomGoal] = useState(settings.dailyGoal.toString());

  const handleGoalChange = async (goal: number) => {
    await setDailyGoal(goal);
    setCustomGoal(goal.toString());
  };

  const handleCustomGoalSubmit = async () => {
    const goal = parseInt(customGoal);
    if (goal > 0 && goal <= 10000) {
      await setDailyGoal(goal);
    } else {
      Alert.alert('エラー', '1〜10000mlの範囲で入力してください');
      setCustomGoal(settings.dailyGoal.toString());
    }
  };

  const handleNotificationToggle = async (enabled: boolean) => {
    if (enabled) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        Alert.alert(
          '通知の許可が必要です',
          '設定アプリから通知を許可してください。'
        );
        return;
      }
    }
    await setNotificationsEnabled(enabled);
  };

  const handleTestNotification = async () => {
    await sendTestNotification();
    Alert.alert('テスト通知を送信しました');
  };

  const handleAddReminder = () => {
    Alert.prompt(
      'リマインダーを追加',
      '時刻を入力 (例: 10:00)',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '追加',
          onPress: async (time) => {
            if (time && /^\d{1,2}:\d{2}$/.test(time)) {
              await addReminder(time, [1, 2, 3, 4, 5]); // 平日のみ
            } else {
              Alert.alert('エラー', '正しい形式で入力してください (例: 10:00)');
            }
          },
        },
      ],
      'plain-text',
      '',
      'numbers-and-punctuation'
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 目標設定 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1日の目標量</Text>
          <View style={styles.card}>
            <View style={styles.goalPresets}>
              {GOAL_PRESETS.map((goal) => (
                <TouchableOpacity
                  key={goal}
                  style={[
                    styles.goalButton,
                    settings.dailyGoal === goal && styles.goalButtonActive,
                  ]}
                  onPress={() => handleGoalChange(goal)}
                >
                  <Text
                    style={[
                      styles.goalButtonText,
                      settings.dailyGoal === goal && styles.goalButtonTextActive,
                    ]}
                  >
                    {formatAmount(goal)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.customGoalRow}>
              <Text style={styles.customGoalLabel}>カスタム:</Text>
              <TextInput
                style={styles.customGoalInput}
                value={customGoal}
                onChangeText={setCustomGoal}
                onBlur={handleCustomGoalSubmit}
                keyboardType="number-pad"
                maxLength={5}
              />
              <Text style={styles.customGoalUnit}>ml</Text>
            </View>
          </View>
        </View>

        {/* 通知設定 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>通知設定</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons name="notifications" size={24} color={Colors.primary} />
                <Text style={styles.settingLabel}>リマインダー通知</Text>
              </View>
              <Switch
                value={settings.notificationsEnabled}
                onValueChange={handleNotificationToggle}
                trackColor={{ false: Colors.border, true: Colors.primaryLight }}
                thumbColor={settings.notificationsEnabled ? Colors.primary : Colors.textMuted}
              />
            </View>

            {settings.notificationsEnabled && (
              <>
                <View style={styles.divider} />
                <TouchableOpacity
                  style={styles.testButton}
                  onPress={handleTestNotification}
                >
                  <Text style={styles.testButtonText}>テスト通知を送信</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* リマインダー一覧 */}
        {settings.notificationsEnabled && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>リマインダー時刻</Text>
              <TouchableOpacity onPress={handleAddReminder}>
                <Ionicons name="add-circle" size={28} color={Colors.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.card}>
              {settings.reminders.map((reminder, index) => (
                <View key={reminder.id}>
                  {index > 0 && <View style={styles.divider} />}
                  <View style={styles.reminderRow}>
                    <Text style={styles.reminderTime}>{reminder.time}</Text>
                    <View style={styles.reminderDays}>
                      {DAYS.map((day, dayIndex) => (
                        <TouchableOpacity
                          key={dayIndex}
                          style={[
                            styles.dayButton,
                            reminder.days.includes(dayIndex) && styles.dayButtonActive,
                          ]}
                          onPress={async () => {
                            const newDays = reminder.days.includes(dayIndex)
                              ? reminder.days.filter(d => d !== dayIndex)
                              : [...reminder.days, dayIndex].sort();
                            await updateReminder(reminder.id, { days: newDays });
                          }}
                        >
                          <Text
                            style={[
                              styles.dayText,
                              reminder.days.includes(dayIndex) && styles.dayTextActive,
                            ]}
                          >
                            {day}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <View style={styles.reminderActions}>
                      <Switch
                        value={reminder.enabled}
                        onValueChange={(enabled) => updateReminder(reminder.id, { enabled })}
                        trackColor={{ false: Colors.border, true: Colors.primaryLight }}
                        thumbColor={reminder.enabled ? Colors.primary : Colors.textMuted}
                      />
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => {
                          Alert.alert(
                            'リマインダーを削除',
                            `${reminder.time} のリマインダーを削除しますか？`,
                            [
                              { text: 'キャンセル', style: 'cancel' },
                              {
                                text: '削除',
                                style: 'destructive',
                                onPress: () => deleteReminder(reminder.id),
                              },
                            ]
                          );
                        }}
                      >
                        <Ionicons name="trash-outline" size={20} color={Colors.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}

              {settings.reminders.length === 0 && (
                <Text style={styles.emptyText}>
                  リマインダーがありません
                </Text>
              )}
            </View>
          </View>
        )}

        {/* アプリ情報 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>アプリ情報</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>バージョン</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>開発者</Text>
              <Text style={styles.infoValue}>ManyConnection</Text>
            </View>
          </View>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
  },
  goalPresets: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  goalButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  goalButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  goalButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textLight,
  },
  goalButtonTextActive: {
    color: Colors.primaryDark,
  },
  customGoalRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customGoalLabel: {
    fontSize: 14,
    color: Colors.textLight,
    marginRight: 8,
  },
  customGoalInput: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    width: 100,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  customGoalUnit: {
    fontSize: 14,
    color: Colors.textLight,
    marginLeft: 8,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  testButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  testButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  reminderRow: {
    paddingVertical: 8,
  },
  reminderTime: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  reminderDays: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
    backgroundColor: Colors.background,
  },
  dayButtonActive: {
    backgroundColor: Colors.primary,
  },
  dayText: {
    fontSize: 12,
    color: Colors.textLight,
  },
  dayTextActive: {
    color: Colors.surface,
    fontWeight: '600',
  },
  reminderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.textLight,
    paddingVertical: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.textLight,
  },
  infoValue: {
    fontSize: 14,
    color: Colors.text,
  },
});
