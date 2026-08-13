export type AppLanguage = "ar" | "fr" | "en";
export type AppAppearance = "blossom" | "noir";
export type EntryFont = "classic" | "clean" | "rounded" | "mono";
export type EntryFontSize = "small" | "medium" | "large";
export type EntryLineSpacing = "tight" | "normal" | "relaxed";
export type PaperStyle = "plain" | "ruled" | "dots" | "blossom" | "night";
export type EntrySticker = "flower" | "heart" | "star" | "coffee" | "moon" | "leaf" | "wolfMoon";
export type LockKind = "pin" | "password";

export type PhotoAttachment = { id: string; uri: string; name: string; mimeType: string; width?: number; height?: number };
export type DiaryEntry = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  font: EntryFont;
  fontSize?: EntryFontSize;
  lineSpacing?: EntryLineSpacing;
  paper?: PaperStyle;
  stickers?: EntrySticker[];
  audioUri?: string;
  audioDurationMs?: number;
  attachments?: PhotoAttachment[];
};

export type DiarySettings = { language: AppLanguage; appearance: AppAppearance; defaultFont: EntryFont; defaultFontSize: EntryFontSize; defaultLineSpacing: EntryLineSpacing; defaultPaper: PaperStyle; dailyReminderEnabled: boolean; dailyReminderHour: number; dailyReminderMinute: number };
export type LockRecord = { kind: LockKind; salt: string; verifier: string };
export type Palette = { background: string; surface: string; softSurface: string; text: string; muted: string; primary: string; primarySoft: string; border: string; danger: string; flower: string; leaf: string };

export const DEFAULT_SETTINGS: DiarySettings = { language: "ar", appearance: "blossom", defaultFont: "classic", defaultFontSize: "medium", defaultLineSpacing: "normal", defaultPaper: "plain", dailyReminderEnabled: false, dailyReminderHour: 20, dailyReminderMinute: 0 };
export const STICKER_IDS: EntrySticker[] = ["flower", "heart", "star", "coffee", "moon", "leaf", "wolfMoon"];
export const PALETTES: Record<AppAppearance, Palette> = {
  blossom: { background: "#FFF5FA", surface: "#FFFDFE", softSurface: "#FFF0F5", text: "#3B2631", muted: "#8D6575", primary: "#C24F78", primarySoft: "#FBE0EA", border: "#F0C9D8", danger: "#B4435D", flower: "#DE6C99", leaf: "#85A875" },
  noir: { background: "#0C1017", surface: "#161C26", softSurface: "#1D2633", text: "#F5F2EC", muted: "#A7B0C0", primary: "#D0A676", primarySoft: "#342A23", border: "#2D3A4C", danger: "#E08A8A", flower: "#D0A676", leaf: "#687E70" },
};
