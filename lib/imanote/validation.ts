import { DEFAULT_SETTINGS, type DiaryEntry, type DiarySettings, type LockKind } from "./types";

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
  };
}

export function sortEntries(entries: DiaryEntry[]) {
  return [...entries].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
