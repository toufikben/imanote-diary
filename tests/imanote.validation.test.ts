import { describe, expect, it } from "vitest";
import { decryptBackupPayload, encryptBackupPayload, validateBackupPayload } from "../lib/imanote/backup";
import { getCopy } from "../lib/imanote/copy";
import { normalizeSettings, isValidLockValue, sortEntries } from "../lib/imanote/validation";

describe("Imanote privacy validation", () => {
  it("accepts only a four-digit PIN and a non-trivial password", () => {
    expect(isValidLockValue("pin", "1234")).toBe(true);
    expect(isValidLockValue("pin", "123")).toBe(false);
    expect(isValidLockValue("pin", "abcd")).toBe(false);
    expect(isValidLockValue("password", "rose")).toBe(true);
    expect(isValidLockValue("password", "no")).toBe(false);
  });
});

describe("Imanote local data normalization", () => {
  it("repairs malformed local settings with safe defaults", () => {
    expect(normalizeSettings({ language: "fr", appearance: "noir", defaultFont: "mono" })).toEqual({ language: "fr", appearance: "noir", defaultFont: "mono" });
    expect(normalizeSettings({ language: "bad", appearance: "bright" })).toEqual({ language: "ar", appearance: "blossom", defaultFont: "classic" });
  });
  it("orders local memories by latest modification without mutating the source", () => {
    const source = [
      { id: "older", title: "", body: "", font: "classic" as const, createdAt: "2026-01-01", updatedAt: "2026-01-01" },
      { id: "newer", title: "", body: "", font: "classic" as const, createdAt: "2026-01-02", updatedAt: "2026-01-02" },
    ];
    expect(sortEntries(source).map((entry) => entry.id)).toEqual(["newer", "older"]);
    expect(source.map((entry) => entry.id)).toEqual(["older", "newer"]);
  });
});

describe("Imanote localization", () => {
  it("provides the diary label in Arabic, French, and English", () => {
    expect(getCopy("ar").diary).toBe("المذكرات");
    expect(getCopy("fr").diary).toBe("Journal");
    expect(getCopy("en").diary).toBe("Diary");
  });
});

describe("Imanote encrypted local backups", () => {
  const payload = {
    version: 1 as const,
    createdAt: "2026-08-13T00:00:00.000Z",
    settings: { language: "ar" as const, appearance: "blossom" as const, defaultFont: "classic" as const },
    entries: [{ id: "memory-1", title: "A flower", body: "Private", font: "classic" as const, createdAt: "2026-08-12T00:00:00.000Z", updatedAt: "2026-08-13T00:00:00.000Z", attachments: [{ id: "photo-1", uri: "backup://photo:memory-1:photo-1", name: "rose.jpg", mimeType: "image/jpeg" }] }],
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
});
