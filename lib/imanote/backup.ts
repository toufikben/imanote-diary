import CryptoJS from "crypto-js";
import { MOOD_IDS, STICKER_IDS, type DiaryEntry, type DiarySettings, type EntryFont, type EntryMood, type EntrySticker } from "./types";
import { normalizeMood, normalizeSettings, normalizeStickers } from "./validation";

export type BackupFile = { key: string; name: string; mimeType: string; base64: string };
export type BackupPayload = { version: 1; createdAt: string; settings: DiarySettings; entries: DiaryEntry[]; files: BackupFile[] };
type BackupEnvelope = { format: "imanote-backup"; version: 1; createdAt: string; data: string };

function isEntryFont(value: unknown): value is EntryFont { return value === "classic" || value === "clean" || value === "rounded" || value === "mono"; }
function isSticker(value: unknown): value is EntrySticker { return typeof value === "string" && STICKER_IDS.includes(value as EntrySticker); }
function isMood(value: unknown): value is EntryMood { return typeof value === "string" && MOOD_IDS.includes(value as EntryMood); }
function isAttachment(value: unknown): boolean { if (!value || typeof value !== "object") return false; const item = value as Record<string, unknown>; return typeof item.id === "string" && typeof item.uri === "string" && typeof item.name === "string" && typeof item.mimeType === "string"; }
function isEntry(value: unknown): value is DiaryEntry { if (!value || typeof value !== "object") return false; const entry = value as Record<string, unknown>; return typeof entry.id === "string" && typeof entry.title === "string" && typeof entry.body === "string" && typeof entry.createdAt === "string" && typeof entry.updatedAt === "string" && isEntryFont(entry.font) && (entry.mood === undefined || isMood(entry.mood)) && (entry.audioUri === undefined || typeof entry.audioUri === "string") && (entry.audioDurationMs === undefined || typeof entry.audioDurationMs === "number") && (entry.attachments === undefined || (Array.isArray(entry.attachments) && entry.attachments.every(isAttachment))) && (entry.stickers === undefined || (Array.isArray(entry.stickers) && entry.stickers.length <= 3 && entry.stickers.every(isSticker))); }

export function validateBackupPayload(candidate: unknown): BackupPayload {
  if (!candidate || typeof candidate !== "object") throw new Error("Invalid backup");
  const value = candidate as Record<string, unknown>;
  if (value.version !== 1 || !Array.isArray(value.entries) || !Array.isArray(value.files) || !value.settings || typeof value.createdAt !== "string") throw new Error("Invalid backup");
  if (value.entries.length > 10000 || value.files.length > 10000 || !value.entries.every(isEntry)) throw new Error("Invalid backup");
  const files = value.files as BackupFile[];
  if (!files.every((file) => file && typeof file.key === "string" && typeof file.name === "string" && typeof file.mimeType === "string" && typeof file.base64 === "string" && file.base64.length <= 35_000_000)) throw new Error("Invalid backup");
  return { version: 1, createdAt: value.createdAt, settings: normalizeSettings(value.settings), entries: (value.entries as DiaryEntry[]).map((entry) => ({ ...entry, ...(entry.stickers === undefined ? {} : { stickers: normalizeStickers(entry.stickers) }), ...(entry.mood === undefined ? {} : { mood: normalizeMood(entry.mood) }) })), files };
}

export function encryptBackupPayload(payload: BackupPayload, password: string) {
  const data = CryptoJS.AES.encrypt(JSON.stringify(payload), password).toString();
  const envelope: BackupEnvelope = { format: "imanote-backup", version: 1, createdAt: payload.createdAt, data };
  return JSON.stringify(envelope);
}

export function decryptBackupPayload(raw: string, password: string) {
  try {
    const envelope = JSON.parse(raw) as Partial<BackupEnvelope>;
    if (envelope.format !== "imanote-backup" || envelope.version !== 1 || typeof envelope.data !== "string") throw new Error("Invalid backup");
    const plaintext = CryptoJS.AES.decrypt(envelope.data, password).toString(CryptoJS.enc.Utf8);
    if (!plaintext) throw new Error("Invalid backup password");
    return validateBackupPayload(JSON.parse(plaintext));
  } catch {
    throw new Error("Invalid backup password");
  }
}
