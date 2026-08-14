import { describe, expect, it } from "vitest";
import { decryptBackupPayload, encryptBackupPayload, validateBackupPayload } from "../lib/imanote/backup";
import { getCopy, moodName } from "../lib/imanote/copy";
import { getLockWolfPeekProgress } from "../lib/imanote/lock-wolf";
import { normalizeDrawing, normalizeInkColor, normalizeMood, normalizeSettings, normalizeStickers, isValidLockValue, sortEntries } from "../lib/imanote/validation";

describe("Imanote privacy validation", () => {
  it("accepts only a four-digit PIN and a non-trivial password", () => {
    expect(isValidLockValue("pin", "1234")).toBe(true);
    expect(isValidLockValue("pin", "123")).toBe(false);
    expect(isValidLockValue("pin", "abcd")).toBe(false);
    expect(isValidLockValue("password", "rose")).toBe(true);
    expect(isValidLockValue("password", "no")).toBe(false);
  });
  it("drives the decorative lock wolf from character count only", () => {
    expect(getLockWolfPeekProgress(0)).toBe(0);
    expect(getLockWolfPeekProgress(1)).toBe(0.63);
    expect(getLockWolfPeekProgress(4)).toBeGreaterThan(getLockWolfPeekProgress(1));
    expect(getLockWolfPeekProgress(99)).toBe(1);
    expect(getLockWolfPeekProgress(-2)).toBe(0);
  });
});

describe("Imanote local data normalization", () => {
  it("repairs malformed local settings with safe defaults", () => {
    expect(normalizeSettings({ language: "fr", appearance: "noir", defaultFont: "mono", dailyReminderEnabled: true, dailyReminderHour: 7, dailyReminderMinute: 45 })).toEqual({ language: "fr", appearance: "noir", defaultFont: "mono", defaultFontSize: "medium", defaultLineSpacing: "normal", defaultPaper: "plain", dailyReminderEnabled: true, dailyReminderHour: 7, dailyReminderMinute: 45 });
    expect(normalizeSettings({ language: "bad", appearance: "bright", dailyReminderEnabled: "yes", dailyReminderHour: 25, dailyReminderMinute: -1 })).toEqual({ language: "ar", appearance: "blossom", defaultFont: "classic", defaultFontSize: "medium", defaultLineSpacing: "normal", defaultPaper: "plain", dailyReminderEnabled: false, dailyReminderHour: 20, dailyReminderMinute: 0 });
  });
  it("orders local memories by latest modification without mutating the source", () => {
    const source = [
      { id: "older", title: "", body: "", font: "classic" as const, createdAt: "2026-01-01", updatedAt: "2026-01-01" },
      { id: "newer", title: "", body: "", font: "classic" as const, createdAt: "2026-01-02", updatedAt: "2026-01-02" },
    ];
    expect(sortEntries(source).map((entry) => entry.id)).toEqual(["newer", "older"]);
    expect(source.map((entry) => entry.id)).toEqual(["older", "newer"]);
  });
  it("keeps at most three unique safe sticker identifiers", () => {
    expect(normalizeStickers(["flower", "flower", "wolf", "bad", "wolfMoon", "heart"])).toEqual(["flower", "wolf", "wolfMoon"]);
    expect(normalizeStickers("flower")).toEqual([]);
  });
  it("keeps only one supported local mood tag", () => {
    expect(normalizeMood("calm")).toBe("calm");
    expect(normalizeMood("unknown")).toBeUndefined();
    expect(normalizeMood(["calm"])).toBeUndefined();
  });
  it("keeps only an approved local ink color", () => {
    expect(normalizeInkColor("teal")).toBe("teal");
    expect(normalizeInkColor("#00ffff")).toBeUndefined();
    expect(normalizeInkColor(["teal"])).toBeUndefined();
  });
  it("keeps compact, valid handwriting strokes only", () => {
    expect(normalizeDrawing([{ color: "#334455", width: 3, points: [{ x: 1, y: 2 }, { x: 8, y: 9 }] }, { color: "#000", width: 99, points: [{ x: 1, y: 2 }, { x: 3, y: 4 }] }])).toEqual([{ color: "#334455", width: 3, points: [{ x: 1, y: 2 }, { x: 8, y: 9 }] }]);
    expect(normalizeDrawing("not-a-drawing")).toBeUndefined();
  });
});

describe("Imanote localization", () => {
  it("provides the diary label in Arabic, French, and English", () => {
    expect(getCopy("ar").diary).toBe("المذكرات");
    expect(getCopy("fr").diary).toBe("Journal");
    expect(getCopy("en").diary).toBe("Diary");
  });
  it("provides mood labels in Arabic, French, and English", () => {
    expect(moodName("calm", "ar")).toBe("هادئ");
    expect(moodName("calm", "fr")).toBe("Calme");
    expect(moodName("calm", "en")).toBe("Calm");
  });
});

describe("Imanote encrypted local backups", () => {
  const payload = {
    version: 1 as const,
    createdAt: "2026-08-13T00:00:00.000Z",
    settings: { language: "ar" as const, appearance: "blossom" as const, defaultFont: "classic" as const, defaultFontSize: "medium" as const, defaultLineSpacing: "normal" as const, defaultPaper: "plain" as const, dailyReminderEnabled: true, dailyReminderHour: 20, dailyReminderMinute: 0 },
    entries: [{ id: "memory-1", title: "A flower", body: "Private", font: "classic" as const, mood: "grateful" as const, favorite: true, inkColor: "berry" as const, createdAt: "2026-08-12T00:00:00.000Z", updatedAt: "2026-08-13T00:00:00.000Z", attachments: [{ id: "photo-1", uri: "backup://photo:memory-1:photo-1", name: "rose.jpg", mimeType: "image/jpeg" }] }],
    files: [{ key: "photo:memory-1:photo-1", name: "rose.jpg", mimeType: "image/jpeg", base64: "cGhvdG8=" }],
  };
  it("round-trips a valid backup only with its password", () => {
    const encrypted = encryptBackupPayload(payload, "four-petal-password");
    expect(encrypted).not.toContain("A flower");
    expect(decryptBackupPayload(encrypted, "four-petal-password")).toEqual(payload);
    expect(() => decryptBackupPayload(encrypted, "wrong-password")).toThrow();
  });
  it("rejects malformed backup data before any file restoration", () => {
    expect(() => validateBackupPayload({ version: 2, entries: [], files: [], settings: {}, createdAt: "today" })).toThrow();
  });
  it("rejects a backup entry with an unsupported mood tag", () => {
    const malformed = { ...payload, entries: [{ ...payload.entries[0], mood: "unknown" }] };
    expect(() => validateBackupPayload(malformed)).toThrow();
  });
  it("rejects a backup entry with an invalid favorite flag", () => {
    const malformed = { ...payload, entries: [{ ...payload.entries[0], favorite: "yes" }] };
    expect(() => validateBackupPayload(malformed)).toThrow();
  });
  it("rejects a backup entry with an unsupported ink color", () => {
    const malformed = { ...payload, entries: [{ ...payload.entries[0], inkColor: "neon" }] };
    expect(() => validateBackupPayload(malformed)).toThrow();
  });
});
