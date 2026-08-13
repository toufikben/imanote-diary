import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import * as FileSystem from "expo-file-system/legacy";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { decryptBackupPayload, encryptBackupPayload, type BackupFile, type BackupPayload } from "./backup";
import { DEFAULT_SETTINGS, type DiaryEntry, type DiarySettings, type LockKind, type LockRecord, type PhotoAttachment } from "./types";
import { normalizeSettings, sortEntries } from "./validation";

const SETTINGS_KEY = "imanote.settings.v1";
const ENTRIES_KEY = "imanote.entries.v1";
const LOCK_KEY = "imanote.lock.v1";
const webStore = () => typeof globalThis !== "undefined" && "localStorage" in globalThis ? globalThis.localStorage : null;
const fileFolder = (name: string) => `${FileSystem.documentDirectory ?? ""}${name}/`;
const safeName = (value: string) => value.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-100) || "attachment";
async function ensureFolder(folder: string) { if (!(await FileSystem.getInfoAsync(folder)).exists) await FileSystem.makeDirectoryAsync(folder, { intermediates: true }); }
async function secretSet(key: string, value: string) { if (Platform.OS === "web") webStore()?.setItem(key, value); else await SecureStore.setItemAsync(key, value); }
async function secretGet(key: string) { return Platform.OS === "web" ? webStore()?.getItem(key) ?? null : SecureStore.getItemAsync(key); }
async function secretRemove(key: string) { if (Platform.OS === "web") webStore()?.removeItem(key); else await SecureStore.deleteItemAsync(key); }
const lockHash = (value: string, salt: string) => Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${value}`);

export async function loadSettings(): Promise<DiarySettings> { try { return normalizeSettings(JSON.parse((await AsyncStorage.getItem(SETTINGS_KEY)) ?? "{}")); } catch { return DEFAULT_SETTINGS; } }
export const persistSettings = (settings: DiarySettings) => AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
export async function loadEntries(): Promise<DiaryEntry[]> { try { return sortEntries(JSON.parse((await AsyncStorage.getItem(ENTRIES_KEY)) ?? "[]") as DiaryEntry[]); } catch { return []; } }
export const persistEntries = (entries: DiaryEntry[]) => AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
export async function getLockRecord(): Promise<LockRecord | null> { try { const raw = await secretGet(LOCK_KEY); return raw ? JSON.parse(raw) as LockRecord : null; } catch { return null; } }
export async function createLock(kind: LockKind, value: string) { const salt = Crypto.randomUUID(); await secretSet(LOCK_KEY, JSON.stringify({ kind, salt, verifier: await lockHash(value, salt) } satisfies LockRecord)); }
export async function verifyLock(value: string) { const lock = await getLockRecord(); return lock ? (await lockHash(value, lock.salt)) === lock.verifier : false; }
export const clearLock = () => secretRemove(LOCK_KEY);
export async function preserveVoiceMemo(uri: string, id: string) { if (Platform.OS === "web" || uri.includes("/imanote-audio/")) return uri; const extension = uri.split(".").pop()?.split("?")[0] || "m4a"; const folder = fileFolder("imanote-audio"); const target = `${folder}${safeName(id)}-${Date.now()}.${extension}`; await ensureFolder(folder); await FileSystem.copyAsync({ from: uri, to: target }); return target; }
export async function preservePhotoAttachment(attachment: PhotoAttachment, entryId: string): Promise<PhotoAttachment> { if (Platform.OS === "web" || attachment.uri.includes("/imanote-images/")) return attachment; const extension = attachment.name.split(".").pop()?.split("?")[0] || attachment.uri.split(".").pop()?.split("?")[0] || "jpg"; const folder = fileFolder("imanote-images"); const target = `${folder}${safeName(entryId)}-${safeName(attachment.id)}-${Date.now()}.${extension}`; await ensureFolder(folder); await FileSystem.copyAsync({ from: attachment.uri, to: target }); return { ...attachment, uri: target }; }
export async function removeLocalFile(uri?: string) { if (!uri || Platform.OS === "web" || !uri.startsWith("file:")) return; if ((await FileSystem.getInfoAsync(uri)).exists) await FileSystem.deleteAsync(uri, { idempotent: true }); }
export const removeVoiceMemo = removeLocalFile;
export async function removePhotoAttachments(attachments?: PhotoAttachment[]) { await Promise.all((attachments ?? []).map((attachment) => removeLocalFile(attachment.uri))); }
export async function removeEntryMedia(entry?: DiaryEntry) { await Promise.all([removeVoiceMemo(entry?.audioUri), removePhotoAttachments(entry?.attachments)]); }

function audioKey(entryId: string) { return `audio:${entryId}`; }
function photoKey(entryId: string, attachmentId: string) { return `photo:${entryId}:${attachmentId}`; }
async function readBackupFile(key: string, uri: string, name: string, mimeType: string): Promise<BackupFile | null> { if (Platform.OS === "web" || !uri.startsWith("file:")) return null; const info = await FileSystem.getInfoAsync(uri); if (!info.exists) return null; return { key, name: safeName(name), mimeType, base64: await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 }) }; }
async function buildBackupPayload(entries: DiaryEntry[], settings: DiarySettings): Promise<BackupPayload> {
  const files: BackupFile[] = [];
  const copiedEntries = await Promise.all(entries.map(async (entry) => {
    const next: DiaryEntry = { ...entry, attachments: entry.attachments ? [...entry.attachments] : undefined };
    if (entry.audioUri) { const key = audioKey(entry.id); const file = await readBackupFile(key, entry.audioUri, `${entry.id}.m4a`, "audio/m4a"); if (file) { files.push(file); next.audioUri = `backup://${key}`; } }
    if (entry.attachments?.length) next.attachments = await Promise.all(entry.attachments.map(async (attachment) => { const key = photoKey(entry.id, attachment.id); const file = await readBackupFile(key, attachment.uri, attachment.name, attachment.mimeType); if (file) { files.push(file); return { ...attachment, uri: `backup://${key}` }; } return attachment; }));
    return next;
  }));
  return { version: 1, createdAt: new Date().toISOString(), settings, entries: copiedEntries, files };
}
export async function createEncryptedBackupFile(entries: DiaryEntry[], settings: DiarySettings, password: string) { if (Platform.OS === "web") throw new Error("Backups are available in the mobile app"); const payload = await buildBackupPayload(entries, settings); const folder = `${FileSystem.cacheDirectory ?? fileFolder("imanote-backups")}imanote-backups/`; await ensureFolder(folder); const uri = `${folder}private-diary-${Date.now()}.imanote`; await FileSystem.writeAsStringAsync(uri, encryptBackupPayload(payload, password), { encoding: FileSystem.EncodingType.UTF8 }); return uri; }

async function restorePayloadFiles(payload: BackupPayload, entries: DiaryEntry[]) {
  if (Platform.OS === "web") throw new Error("Backups are available in the mobile app");
  const byKey = new Map(payload.files.map((file) => [file.key, file])); const restored = new Map<string, string>(); const folder = `${fileFolder("imanote-imports")}${Date.now()}/`; await ensureFolder(folder);
  const restoreUri = async (uri: string | undefined) => { if (!uri?.startsWith("backup://")) return uri; const key = uri.slice("backup://".length); if (restored.has(key)) return restored.get(key); const file = byKey.get(key); if (!file) throw new Error("Invalid backup"); const target = `${folder}${safeName(file.name)}`; await FileSystem.writeAsStringAsync(target, file.base64, { encoding: FileSystem.EncodingType.Base64 }); restored.set(key, target); return target; };
  return Promise.all(entries.map(async (entry) => ({ ...entry, audioUri: await restoreUri(entry.audioUri), attachments: entry.attachments ? await Promise.all(entry.attachments.map(async (attachment) => ({ ...attachment, uri: (await restoreUri(attachment.uri)) ?? attachment.uri }))) : undefined })));
}
export async function readEncryptedBackupFile(uri: string, password: string, currentEntries: DiaryEntry[], mode: "merge" | "replace") { if (Platform.OS === "web") throw new Error("Backups are available in the mobile app"); const payload = decryptBackupPayload(await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.UTF8 }), password); const selected = mode === "replace" ? payload.entries : payload.entries.filter((incoming) => { const current = currentEntries.find((entry) => entry.id === incoming.id); return !current || incoming.updatedAt > current.updatedAt; }); const restored = await restorePayloadFiles(payload, selected); const entries = mode === "replace" ? restored : sortEntries([...currentEntries.filter((current) => !restored.some((incoming) => incoming.id === current.id)), ...restored]); return { entries, settings: payload.settings };
}
