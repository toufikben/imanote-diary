import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import type { AppLanguage, DiarySettings } from "./types";

const DAILY_REMINDER_CHANNEL = "private-diary-reminders";
const DAILY_REMINDER_KIND = "private-diary-daily-reminder";

export type ReminderSyncResult = "scheduled" | "disabled" | "denied" | "unavailable";

export function reminderCopy(language: AppLanguage) {
  return ({
    ar: { title: "لحظة لذكرياتك", body: "افتح مذكراتك واكتب سطراً صغيراً لنفسك.", heading: "تذكير يومي", description: "دعوة لطيفة لكتابة ذكرى، تُحفظ على جهازك فقط.", time: "وقت التذكير", chooseTime: "اختَر وقتاً يومياً", denied: "لم يُسمح بالإشعارات. فعّلها من إعدادات الهاتف لاستخدام التذكير اليومي.", unavailable: "يمكن اختبار التذكير اليومي من تطبيق الهاتف، وليس من نسخة الويب." },
    fr: { title: "Un moment pour vos souvenirs", body: "Ouvrez votre journal et écrivez quelques mots pour vous.", heading: "Rappel quotidien", description: "Une douce invitation à écrire, enregistrée uniquement sur cet appareil.", time: "Heure du rappel", chooseTime: "Choisissez une heure quotidienne", denied: "Les notifications ne sont pas autorisées. Activez-les dans les réglages du téléphone pour utiliser le rappel.", unavailable: "Le rappel quotidien est disponible dans l’application mobile, pas dans la version web." },
    en: { title: "A moment for your memories", body: "Open your diary and write a small line for yourself.", heading: "Daily reminder", description: "A gentle writing prompt stored only on this device.", time: "Reminder time", chooseTime: "Choose a daily time", denied: "Notifications are not allowed. Enable them in your phone settings to use the daily reminder.", unavailable: "The daily reminder is available in the mobile app, not the web preview." },
  } as const)[language];
}

async function ensureNotificationChannel() {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync(DAILY_REMINDER_CHANNEL, {
    name: "Private Diary reminders",
    description: "Gentle daily writing reminders",
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 180],
    lightColor: "#C24F78",
  });
}

async function removeScheduledDiaryReminders() {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(scheduled
    .filter((notification) => notification.content.data?.kind === DAILY_REMINDER_KIND)
    .map((notification) => Notifications.cancelScheduledNotificationAsync(notification.identifier)));
}

async function hasNotificationPermission(requestPermission: boolean) {
  const existing = await Notifications.getPermissionsAsync();
  if (existing.granted || existing.status === "granted") return true;
  if (!requestPermission) return false;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted || requested.status === "granted";
}

/** Schedules one recurring on-device notification and never contacts an external service. */
export async function syncDailyReminder(settings: DiarySettings, options: { requestPermission?: boolean } = {}): Promise<ReminderSyncResult> {
  if (Platform.OS === "web") return "unavailable";
  Notifications.setNotificationHandler({
    handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false }),
  });
  await ensureNotificationChannel();
  await removeScheduledDiaryReminders();
  if (!settings.dailyReminderEnabled) return "disabled";
  if (!(await hasNotificationPermission(options.requestPermission ?? false))) return "denied";

  const copy = reminderCopy(settings.language);
  await Notifications.scheduleNotificationAsync({
    content: { title: copy.title, body: copy.body, data: { kind: DAILY_REMINDER_KIND } },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: settings.dailyReminderHour,
      minute: settings.dailyReminderMinute,
      channelId: DAILY_REMINDER_CHANNEL,
    },
  });
  return "scheduled";
}
