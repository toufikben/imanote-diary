import { DEFAULT_SETTINGS, FOLDER_IDS, INK_COLORS, MOOD_IDS, STICKER_IDS, type DiaryEntry, type DiarySettings, type DrawingStroke, type EntryFolder, type EntryMood, type EntrySticker, type InkColor, type LockKind } from "./types";

export function isValidLockValue(kind: LockKind, value: string) {
  return kind === "pin" ? /^\d{4}$/.test(value) : value.trim().length >= 4;
}

export function normalizeSettings(candidate: unknown): DiarySettings {
  if (!candidate || typeof candidate !== "object") return DEFAULT_SETTINGS;
  const value = candidate as Partial<DiarySettings>;
  return {
    language: value.language === "ar" || value.language === "fr" || value.language === "en" ? value.language : DEFAULT_SETTINGS.language,
    appearance: value.appearance === "blossom" || value.appearance === "noir" ? value.appearance : DEFAULT_SETTINGS.appearance,
    defaultFont: value.defaultFont === "classic" || value.defaultFont === "clean" || value.defaultFont === "rounded" || value.defaultFont === "mono" ? value.defaultFont : DEFAULT_SETTINGS.defaultFont,
    defaultFontSize: value.defaultFontSize === "small" || value.defaultFontSize === "medium" || value.defaultFontSize === "large" ? value.defaultFontSize : DEFAULT_SETTINGS.defaultFontSize,
    defaultLineSpacing: value.defaultLineSpacing === "tight" || value.defaultLineSpacing === "normal" || value.defaultLineSpacing === "relaxed" ? value.defaultLineSpacing : DEFAULT_SETTINGS.defaultLineSpacing,
    defaultPaper: value.defaultPaper === "plain" || value.defaultPaper === "ruled" || value.defaultPaper === "dots" || value.defaultPaper === "blossom" || value.defaultPaper === "night" ? value.defaultPaper : DEFAULT_SETTINGS.defaultPaper,
    dailyReminderEnabled: typeof value.dailyReminderEnabled === "boolean" ? value.dailyReminderEnabled : DEFAULT_SETTINGS.dailyReminderEnabled,
    dailyReminderHour: Number.isInteger(value.dailyReminderHour) && (value.dailyReminderHour as number) >= 0 && (value.dailyReminderHour as number) <= 23 ? value.dailyReminderHour as number : DEFAULT_SETTINGS.dailyReminderHour,
    dailyReminderMinute: Number.isInteger(value.dailyReminderMinute) && (value.dailyReminderMinute as number) >= 0 && (value.dailyReminderMinute as number) <= 59 ? value.dailyReminderMinute as number : DEFAULT_SETTINGS.dailyReminderMinute,
  };
}

export function sortEntries(entries: DiaryEntry[]) {
  return [...entries].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

/** Removes malformed or duplicated externally restored sticker ids and caps the small decoration row. */
export function normalizeStickers(candidate: unknown): EntrySticker[] {
  if (!Array.isArray(candidate)) return [];
  return Array.from(new Set(candidate.filter((sticker): sticker is EntrySticker => typeof sticker === "string" && STICKER_IDS.includes(sticker as EntrySticker)))).slice(0, 3);
}

/** Keeps only the single supported mood category for a private diary entry. */
export function normalizeMood(candidate: unknown): EntryMood | undefined {
  return typeof candidate === "string" && MOOD_IDS.includes(candidate as EntryMood) ? candidate as EntryMood : undefined;
}

/** Keeps folder metadata in a small fixed local taxonomy for safe restores. */
export function normalizeFolder(candidate: unknown): EntryFolder | undefined {
  return typeof candidate === "string" && FOLDER_IDS.includes(candidate as EntryFolder) ? candidate as EntryFolder : undefined;
}

/** Keeps the saved ink choice inside the fixed, accessibility-reviewed local palette. */
export function normalizeInkColor(candidate: unknown): InkColor | undefined {
  return typeof candidate === "string" && INK_COLORS.includes(candidate as InkColor) ? candidate as InkColor : undefined;
}

/** Keeps a compact, safe set of locally drawn strokes during restore. */
export function normalizeDrawing(candidate: unknown): DrawingStroke[] | undefined {
  if (!Array.isArray(candidate)) return undefined;
  const strokes = candidate.slice(0, 40).flatMap((stroke) => {
    if (!stroke || typeof stroke !== "object") return [];
    const item = stroke as { color?: unknown; width?: unknown; points?: unknown };
    if (typeof item.color !== "string" || item.color.length > 16 || typeof item.width !== "number" || item.width < 1 || item.width > 12 || !Array.isArray(item.points)) return [];
    const points = item.points.slice(0, 500).flatMap((point) => point && typeof point === "object" && typeof (point as { x?: unknown }).x === "number" && typeof (point as { y?: unknown }).y === "number" ? [{ x: (point as { x: number }).x, y: (point as { y: number }).y }] : []);
    return points.length > 1 ? [{ color: item.color, width: item.width, points }] : [];
  });
  return strokes.length ? strokes : undefined;
}
