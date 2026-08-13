import { DEFAULT_SETTINGS, STICKER_IDS, type DiaryEntry, type DiarySettings, type EntrySticker, type LockKind } from "./types";

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
