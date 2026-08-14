import { MOOD_IDS, type DiaryEntry, type EntryMood } from "./types";

export type WeekDayInsight = { key: string; label: string; total: number; moods: Record<EntryMood, number> };
export type WellbeingInsights = { totalEntries: number; streak: number; activeWeekday: number | undefined; moodTotals: Record<EntryMood, number>; week: WeekDayInsight[] };

function localKey(date: Date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }
function entriesForInsights(entries: DiaryEntry[]) { return entries.filter((entry) => !entry.isDraft); }
function emptyMoods(): Record<EntryMood, number> { return { joyful: 0, calm: 0, grateful: 0, reflective: 0, sad: 0, stressed: 0 }; }
function entryDate(entry: DiaryEntry) { const parsed = new Date(entry.updatedAt); return Number.isNaN(parsed.getTime()) ? null : parsed; }

export function deriveWellbeingInsights(entries: DiaryEntry[], now = new Date()): WellbeingInsights {
  const completed = entriesForInsights(entries);
  const moodTotals = emptyMoods(); const activeDays = new Set<string>(); const weekdayCounts = Array.from({ length: 7 }, () => 0);
  completed.forEach((entry) => { const date = entryDate(entry); if (!date) return; activeDays.add(localKey(date)); weekdayCounts[date.getDay()] += 1; if (entry.mood) moodTotals[entry.mood] += 1; });
  const week = Array.from({ length: 7 }, (_, offset) => { const date = new Date(now); date.setHours(0, 0, 0, 0); date.setDate(date.getDate() - (6 - offset)); return { key: localKey(date), label: String(date.getDate()), total: 0, moods: emptyMoods() }; });
  const weekByKey = new Map(week.map((day) => [day.key, day]));
  completed.forEach((entry) => { const date = entryDate(entry); if (!date) return; const day = weekByKey.get(localKey(date)); if (day) { day.total += 1; if (entry.mood) day.moods[entry.mood] += 1; } });
  const cursor = new Date(now); cursor.setHours(0, 0, 0, 0); if (!activeDays.has(localKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0; while (activeDays.has(localKey(cursor))) { streak += 1; cursor.setDate(cursor.getDate() - 1); }
  const maximum = Math.max(0, ...weekdayCounts); const activeWeekday = maximum ? weekdayCounts.indexOf(maximum) : undefined;
  return { totalEntries: completed.length, streak, activeWeekday, moodTotals, week };
}

export function gratitudePromptIndex(now = new Date(), count = 4) { const start = new Date(now.getFullYear(), 0, 0); return Math.abs(Math.floor((now.getTime() - start.getTime()) / 86_400_000)) % count; }
