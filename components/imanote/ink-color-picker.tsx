import { Pressable, StyleSheet, Text, View } from "react-native";
import { INK_COLORS, INK_COLOR_VALUES, type AppLanguage, type InkColor, type Palette } from "@/lib/imanote/types";

const labels: Record<AppLanguage, { title: string; names: Record<InkColor, string> }> = {
  ar: { title: "لون الحبر", names: { graphite: "فحمي", ocean: "أزرق", forest: "أخضر", berry: "خمري", plum: "بنفسجي", copper: "نحاسي", teal: "فيروزي", gold: "ذهبي" } },
  fr: { title: "Couleur de l’encre", names: { graphite: "Graphite", ocean: "Bleu", forest: "Vert", berry: "Bordeaux", plum: "Prune", copper: "Cuivre", teal: "Sarcelle", gold: "Or" } },
  en: { title: "Ink color", names: { graphite: "Graphite", ocean: "Ocean", forest: "Forest", berry: "Berry", plum: "Plum", copper: "Copper", teal: "Teal", gold: "Gold" } },
};

export function InkColorPicker({ selected, onChange, palette, language, isRTL }: { selected: InkColor; onChange: (color: InkColor) => void; palette: Palette; language: AppLanguage; isRTL: boolean }) {
  const copy = labels[language];
  return <View accessibilityLabel={copy.title} style={[s.wrap, { flexDirection: isRTL ? "row-reverse" : "row" }]}>{INK_COLORS.map((color) => <Pressable key={color} accessibilityRole="button" accessibilityLabel={copy.names[color]} accessibilityState={{ selected: color === selected }} onPress={() => onChange(color)} style={[s.item, { borderColor: color === selected ? palette.primary : palette.border, backgroundColor: color === selected ? palette.primarySoft : palette.surface }]}><View style={[s.dot, { backgroundColor: INK_COLOR_VALUES[color], borderColor: color === "gold" ? "#846018" : "rgba(0,0,0,0.08)" }]} /><Text style={{ color: palette.text, fontSize: 11, fontWeight: "800" }}>{copy.names[color]}</Text></Pressable>)}</View>;
}

const s = StyleSheet.create({ wrap: { flexWrap: "wrap", gap: 8 }, item: { minWidth: 74, minHeight: 42, borderWidth: 1, borderRadius: 12, paddingHorizontal: 8, alignItems: "center", justifyContent: "center", gap: 4 }, dot: { width: 14, height: 14, borderRadius: 7, borderWidth: 1 } });
