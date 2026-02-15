import * as Notifications from 'expo-notifications';
import {
  requestNotificationPermissions,
  scheduleReminder,
  cancelAllNotifications,
  rescheduleReminders,
  sendTestNotification,
} from '../utils/notifications';
import { ReminderSetting } from '../types';

// expo-notifications is mocked via __mocks__/expo-notifications.js

describe('Notifications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('requestNotificationPermissions', () => {
    it('should return true when permissions are granted', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
      
      const result = await requestNotificationPermissions();
      expect(result).toBe(true);
    });

    it('should request permissions when not already granted', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'undetermined' });
      (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
      
      const result = await requestNotificationPermissions();
      expect(Notifications.requestPermissionsAsync).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false when permissions are denied', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });
      (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });
      
      const result = await requestNotificationPermissions();
      expect(result).toBe(false);
    });
  });

  describe('scheduleReminder', () => {
    it('should schedule notifications for each day', async () => {
      const reminder: ReminderSetting = {
        id: '1',
        time: '09:00',
        enabled: true,
        days: [1, 2, 3, 4, 5], // Mon-Fri
      };

      const identifiers = await scheduleReminder(reminder);
      
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledTimes(5);
      expect(identifiers).toHaveLength(5);
    });

    it('should parse time correctly', async () => {
      const reminder: ReminderSetting = {
        id: '1',
        time: '14:30',
        enabled: true,
        days: [0], // Sunday
      };

      await scheduleReminder(reminder);
      
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            title: '💧 水分補給の時間です',
            body: '健康のために、お水を飲みましょう！',
          }),
          trigger: expect.objectContaining({
            hour: 14,
            minute: 30,
          }),
        })
      );
    });

    it('should handle empty days array', async () => {
      const reminder: ReminderSetting = {
        id: '1',
        time: '09:00',
        enabled: true,
        days: [],
      };

      const identifiers = await scheduleReminder(reminder);
      
      expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
      expect(identifiers).toHaveLength(0);
    });
  });

  describe('cancelAllNotifications', () => {
    it('should cancel all scheduled notifications', async () => {
      await cancelAllNotifications();
      expect(Notifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalled();
    });
  });

  describe('rescheduleReminders', () => {
    it('should cancel all and reschedule enabled reminders', async () => {
      const reminders: ReminderSetting[] = [
        { id: '1', time: '09:00', enabled: true, days: [1, 2, 3] },
        { id: '2', time: '12:00', enabled: false, days: [1, 2, 3] },
        { id: '3', time: '18:00', enabled: true, days: [4, 5] },
      ];

      await rescheduleReminders(reminders);
      
      expect(Notifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalled();
      // 3 days for first + 0 for disabled + 2 days for third = 5
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledTimes(5);
    });

    it('should handle empty reminders array', async () => {
      await rescheduleReminders([]);
      
      expect(Notifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalled();
      expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
    });
  });

  describe('sendTestNotification', () => {
    it('should send an immediate notification', async () => {
      await sendTestNotification();
      
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            title: '💧 テスト通知',
          }),
          trigger: null,
        })
      );
    });
  });
});
