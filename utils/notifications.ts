import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { ReminderSetting } from '@/types';

// 通知の設定
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// 通知権限をリクエスト
export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('reminders', {
      name: 'リマインダー',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#4FC3F7',
    });
  }

  return true;
}

// リマインダー通知をスケジュール
export async function scheduleReminder(reminder: ReminderSetting): Promise<string[]> {
  const identifiers: string[] = [];
  const [hours, minutes] = reminder.time.split(':').map(Number);

  for (const day of reminder.days) {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: '💧 水分補給の時間です',
        body: '健康のために、お水を飲みましょう！',
        data: { reminderId: reminder.id },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: day === 0 ? 1 : day + 1, // Expoは1=日曜日
        hour: hours,
        minute: minutes,
      },
    });
    identifiers.push(identifier);
  }

  return identifiers;
}

// すべての通知をキャンセル
export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// リマインダーを再スケジュール
export async function rescheduleReminders(reminders: ReminderSetting[]): Promise<void> {
  await cancelAllNotifications();

  for (const reminder of reminders) {
    if (reminder.enabled) {
      await scheduleReminder(reminder);
    }
  }
}

// 即時通知を送信（テスト用）
export async function sendTestNotification(): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '💧 テスト通知',
      body: 'リマインダー通知が正常に動作しています！',
    },
    trigger: null,
  });
}
