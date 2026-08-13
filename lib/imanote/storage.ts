import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import * as FileSystem from "expo-file-system/legacy";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { DEFAULT_SETTINGS, type DiaryEntry, type DiarySettings, type LockKind, type LockRecord } from "./types";
import { normalizeSettings, sortEntries } from "./validation";

const SETTINGS_KEY = "imanote.settings.v1";
const ENTRIES_KEY = "imanote.entries.v1";
const LOCK_KEY = "imanote.lock.v1";
const webStore = () => typeof globalThis !== "undefined" && "localStorage" in globalThis ? globalThis.localStorage : null;
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
export async function preserveVoiceMemo(uri: string, id: string) { if (Platform.OS === "web") return uri; const extension = uri.split(".").pop()?.split("?")[0] || "m4a"; const folder = `${FileSystem.documentDirectory ?? ""}imanote-audio/`; const target = `${folder}${id}-${Date.now()}.${extension}`; if (!(await FileSystem.getInfoAsync(folder)).exists) await FileSystem.makeDirectoryAsync(folder, { intermediates: true }); await FileSystem.copyAsync({ from: uri, to: target }); return target; }
export async function removeVoiceMemo(uri?: string) { if (!uri || Platform.OS === "web" || !uri.startsWith("file:")) return; if ((await FileSystem.getInfoAsync(uri)).exists) await FileSystem.deleteAsync(uri, { idempotent: true }); }
