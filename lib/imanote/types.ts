export type AppLanguage = "ar" | "fr" | "en";
export type AppAppearance = "blossom" | "noir";
export type EntryFont = "classic" | "clean" | "mono";
export type LockKind = "pin" | "password";

export type PhotoAttachment = { id: string; uri: string; name: string; mimeType: string; width?: number; height?: number };
export type DiaryEntry = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  font: EntryFont;
  audioUri?: string;
  audioDurationMs?: number;
  attachments?: PhotoAttachment[];
};

export type DiarySettings = { language: AppLanguage; appearance: AppAppearance; defaultFont: EntryFont };
export type LockRecord = { kind: LockKind; salt: string; verifier: string };
export type Palette = { background: string; surface: string; softSurface: string; text: string; muted: string; primary: string; primarySoft: string; border: string; danger: string; flower: string; leaf: string };

export const DEFAULT_SETTINGS: DiarySettings = { language: "ar", appearance: "blossom", defaultFont: "classic" };
export const PALETTES: Record<AppAppearance, Palette> = {
  blossom: { background: "#FFF7FA", surface: "#FFFFFF", softSurface: "#FFF0F5", text: "#3A2430", muted: "#8D6B79", primary: "#C65B7C", primarySoft: "#F7D7E1", border: "#F0D8E1", danger: "#B4435D", flower: "#E989A7", leaf: "#8CAD85" },
  noir: { background: "#111318", surface: "#1B1F27", softSurface: "#232935", text: "#F2F0EC", muted: "#A8AFBA", primary: "#C59A6D", primarySoft: "#3A3029", border: "#303846", danger: "#E08A8A", flower: "#C59A6D", leaf: "#758A73" },
};
