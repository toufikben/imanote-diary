import { useThemeContext } from "@/lib/theme-provider";
import * as Crypto from "expo-crypto";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AppState, Platform } from "react-native";
import { authenticateWithBiometrics, type BiometricResult } from "./biometrics";
import { getCopy } from "./copy";
import { syncDailyReminder, type ReminderSyncResult } from "./reminders";
import { clearLock, createEncryptedBackupFile, createLock, eraseLocalDiaryData, getLockRecord, loadEntries, loadSettings, persistEntries, persistSettings, readEncryptedBackupFile, removeEntryMedia, removePhotoAttachments, removeVoiceMemo, verifyLock } from "./storage";
import { DEFAULT_SETTINGS, PALETTES, type DiaryEntry, type DiarySettings, type EntryFont, type LockKind } from "./types";
import { normalizeFolder, normalizeMood, normalizeStickers } from "./validation";

type AccessState = "loading" | "setup" | "locked" | "unlocked";
type DiaryContextValue = { ready: boolean; accessState: AccessState; settings: DiarySettings; entries: DiaryEntry[]; copy: ReturnType<typeof getCopy>; palette: (typeof PALETTES)[DiarySettings["appearance"]]; isRTL: boolean; updateSettings: (next: Partial<DiarySettings>, options?: { requestReminderPermission?: boolean }) => Promise<ReminderSyncResult | undefined>; configureLock: (kind: LockKind, value: string) => Promise<void>; unlock: (value: string) => Promise<boolean>; unlockWithBiometrics: (promptMessage: string) => Promise<BiometricResult>; requestLockChange: () => Promise<void>; wipeLocalData: () => Promise<void>; saveEntry: (draft: Omit<DiaryEntry, "id" | "createdAt" | "updatedAt"> & { id?: string }) => Promise<DiaryEntry>; toggleFavorite: (id: string) => Promise<void>; deleteEntry: (id: string) => Promise<void>; createBackup: (password: string) => Promise<string>; restoreBackup: (uri: string, password: string, mode: "merge" | "replace") => Promise<void>; fontFamily: (font: EntryFont) => string | undefined };
const DiaryContext = createContext<DiaryContextValue | null>(null);

export function DiaryProvider({ children }: { children: React.ReactNode }) {
  const { setColorScheme } = useThemeContext(); const [settings, setSettings] = useState(DEFAULT_SETTINGS); const [entries, setEntries] = useState<DiaryEntry[]>([]); const [accessState, setAccessState] = useState<AccessState>("loading"); const [ready, setReady] = useState(false);
  useEffect(() => { void (async () => { const [storedSettings, storedEntries, lock] = await Promise.all([loadSettings(), loadEntries(), getLockRecord()]); setSettings(storedSettings); setEntries(storedEntries); setColorScheme(storedSettings.appearance === "noir" ? "dark" : "light"); setAccessState(lock ? "locked" : "setup"); setReady(true); void syncDailyReminder(storedSettings); })(); }, [setColorScheme]);
  const updateSettings = useCallback(async (changes: Partial<DiarySettings>, options: { requestReminderPermission?: boolean } = {}) => { const next = { ...settings, ...changes }; setSettings(next); setColorScheme(next.appearance === "noir" ? "dark" : "light"); await persistSettings(next); const reminderChanged = changes.dailyReminderEnabled !== undefined || changes.dailyReminderHour !== undefined || changes.dailyReminderMinute !== undefined || changes.language !== undefined || changes.hideReminderContent !== undefined; return reminderChanged ? syncDailyReminder(next, { requestPermission: options.requestReminderPermission }) : undefined; }, [setColorScheme, settings]);
  const configureLock = useCallback(async (kind: LockKind, value: string) => { await createLock(kind, value); setAccessState("unlocked"); }, []);
  const unlock = useCallback(async (value: string) => { const ok = await verifyLock(value); if (ok) setAccessState("unlocked"); return ok; }, []);
  const unlockWithBiometrics = useCallback(async (promptMessage: string) => { const result = await authenticateWithBiometrics(promptMessage); if (result === "success") setAccessState("unlocked"); return result; }, []);
  const requestLockChange = useCallback(async () => { await clearLock(); setAccessState("setup"); }, []);
  const wipeLocalData = useCallback(async () => { await eraseLocalDiaryData(entries); setEntries([]); setSettings(DEFAULT_SETTINGS); setColorScheme("light"); setAccessState("setup"); void syncDailyReminder(DEFAULT_SETTINGS); }, [entries, setColorScheme]);
  useEffect(() => {
    if (Platform.OS === "web" || accessState !== "unlocked" || settings.autoLockMinutes === 0) return;
    let backgroundAt: number | null = null;
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        if (backgroundAt && Date.now() - backgroundAt >= settings.autoLockMinutes * 60_000) setAccessState("locked");
        backgroundAt = null;
      } else if (nextState === "background" || nextState === "inactive") backgroundAt = Date.now();
    });
    return () => subscription.remove();
  }, [accessState, settings.autoLockMinutes]);
  const saveEntry = useCallback(async (draft: Omit<DiaryEntry, "id" | "createdAt" | "updatedAt"> & { id?: string }) => { const now = new Date().toISOString(); const current = draft.id ? entries.find((entry) => entry.id === draft.id) : undefined; const folder = normalizeFolder(draft.folder); const entry: DiaryEntry = { ...draft, stickers: normalizeStickers(draft.stickers), mood: normalizeMood(draft.mood), ...(folder ? { folder } : {}), isDraft: Boolean(draft.isDraft), id: draft.id ?? Crypto.randomUUID(), createdAt: current?.createdAt ?? now, updatedAt: now }; const next = [entry, ...entries.filter((item) => item.id !== entry.id)].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)); setEntries(next); await persistEntries(next); if (current?.audioUri !== entry.audioUri) await removeVoiceMemo(current?.audioUri); const retainedUris = new Set((entry.attachments ?? []).map((attachment) => attachment.uri)); await removePhotoAttachments((current?.attachments ?? []).filter((attachment) => !retainedUris.has(attachment.uri))); return entry; }, [entries]);
  const toggleFavorite = useCallback(async (id: string) => { const next = entries.map((entry) => entry.id === id ? { ...entry, favorite: !entry.favorite } : entry); setEntries(next); await persistEntries(next); }, [entries]);
  const deleteEntry = useCallback(async (id: string) => { const removed = entries.find((entry) => entry.id === id); const next = entries.filter((entry) => entry.id !== id); setEntries(next); await persistEntries(next); await removeEntryMedia(removed); }, [entries]);
  const createBackup = useCallback((password: string) => createEncryptedBackupFile(entries, settings, password), [entries, settings]);
  const restoreBackup = useCallback(async (uri: string, password: string, mode: "merge" | "replace") => { const restored = await readEncryptedBackupFile(uri, password, entries, mode); if (mode === "replace") await Promise.all(entries.map((entry) => removeEntryMedia(entry))); setEntries(restored.entries); setColorScheme(restored.settings.appearance === "noir" ? "dark" : "light"); await Promise.all([persistEntries(restored.entries), persistSettings(restored.settings)]); void syncDailyReminder(restored.settings); }, [entries, setColorScheme]);
  const fontFamily = useCallback((font: EntryFont) => ({ classic: Platform.select({ ios: "Georgia", android: "serif", default: "serif" }), clean: Platform.select({ ios: "Avenir Next", android: "sans-serif", default: "sans-serif" }), rounded: Platform.select({ ios: "Avenir Next Rounded", android: "sans-serif-rounded", default: "sans-serif" }), mono: Platform.select({ ios: "Menlo", android: "monospace", default: "monospace" }) }[font]), []);
  const value = useMemo(() => ({ ready, accessState, settings, entries, copy: getCopy(settings.language), palette: PALETTES[settings.appearance], isRTL: settings.language === "ar", updateSettings, configureLock, unlock, unlockWithBiometrics, requestLockChange, wipeLocalData, saveEntry, toggleFavorite, deleteEntry, createBackup, restoreBackup, fontFamily }), [accessState, configureLock, createBackup, deleteEntry, entries, fontFamily, ready, requestLockChange, restoreBackup, saveEntry, settings, toggleFavorite, unlock, unlockWithBiometrics, updateSettings, wipeLocalData]);
  return <DiaryContext.Provider value={value}>{children}</DiaryContext.Provider>;
}
export function useDiary() { const context = useContext(DiaryContext); if (!context) throw new Error("useDiary must be used within DiaryProvider"); return context; }
