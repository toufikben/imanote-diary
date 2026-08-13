import { Pressable, StyleSheet, Text, View } from "react-native";
import type { AppLanguage, EntrySticker, Palette } from "@/lib/imanote/types";
import { stickerName } from "@/lib/imanote/copy";

const STICKERS: { id: EntrySticker; glyph: string }[] = [
  { id: "flower", glyph: "🌸" }, { id: "heart", glyph: "💗" }, { id: "star", glyph: "⭐" },
  { id: "coffee", glyph: "☕" }, { id: "moon", glyph: "🌙" }, { id: "leaf", glyph: "🍃" }, { id: "wolf", glyph: "🐺" }, { id: "wolfMoon", glyph: "🌙🐺" },
];

export function StickerPicker({ selected, onChange, palette, language, isRTL }: { selected: EntrySticker[]; onChange: (next: EntrySticker[]) => void; palette: Palette; language: AppLanguage; isRTL: boolean }) {
  const toggle = (id: EntrySticker) => {
    if (selected.includes(id)) return onChange(selected.filter((item) => item !== id));
    if (selected.length < 3) onChange([...selected, id]);
  };
  return <View style={[s.grid, { flexDirection: isRTL ? "row-reverse" : "row" }]}>{STICKERS.map((item) => {
    const active = selected.includes(item.id);
    return <Pressable key={item.id} accessibilityLabel={stickerName(item.id, language)} onPress={() => toggle(item.id)} style={[s.option, { backgroundColor: active ? palette.primarySoft : palette.surface, borderColor: active ? palette.primary : palette.border, opacity: !active && selected.length >= 3 ? 0.45 : 1 }]}>
      <Text style={s.glyph}>{item.glyph}</Text><Text numberOfLines={1} style={[s.name, { color: active ? palette.primary : palette.muted }]}>{stickerName(item.id, language)}</Text>
    </Pressable>;
  })}</View>;
}

export function StickerRow({ stickers, palette, isRTL }: { stickers?: EntrySticker[]; palette: Palette; isRTL: boolean }) {
  const selected = STICKERS.filter((item) => stickers?.includes(item.id));
  if (!selected.length) return null;
  return <View style={[s.row, { flexDirection: isRTL ? "row-reverse" : "row" }]}>{selected.map((item) => <View key={item.id} style={[s.badge, { backgroundColor: palette.primarySoft, borderColor: palette.border }]}><Text style={s.badgeGlyph}>{item.glyph}</Text></View>)}</View>;
}

const s = StyleSheet.create({ grid: { flexWrap: "wrap", gap: 8 }, option: { width: "23%", minHeight: 69, borderWidth: 1, borderRadius: 15, alignItems: "center", justifyContent: "center", paddingHorizontal: 4, gap: 2 }, glyph: { fontSize: 22 }, name: { fontSize: 10, fontWeight: "700" }, row: { gap: 7, flexWrap: "wrap", marginTop: -7 }, badge: { minWidth: 34, height: 31, borderRadius: 12, borderWidth: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 5 }, badgeGlyph: { fontSize: 17 } });
