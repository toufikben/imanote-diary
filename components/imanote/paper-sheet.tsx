import { type ReactNode } from "react";
import { StyleSheet, type StyleProp, Text, View, type ViewStyle } from "react-native";
import { useDiary } from "@/lib/imanote/diary-context";
import type { EntryFontSize, EntryLineSpacing, PaperStyle } from "@/lib/imanote/types";

export function textMetrics(size: EntryFontSize | undefined, spacing: EntryLineSpacing | undefined, baseSize = 16) {
  const scale = size === "small" ? 0.9 : size === "large" ? 1.15 : 1;
  const lineFactor = spacing === "tight" ? 1.38 : spacing === "relaxed" ? 1.9 : 1.62;
  const fontSize = Math.round(baseSize * scale);
  return { fontSize, lineHeight: Math.round(fontSize * lineFactor) };
}

export function paperTone(paper: PaperStyle | undefined, fallbackText: string) {
  switch (paper) {
    case "ruled": return { background: "#FFFCEE", border: "#E6D5A8", line: "#D6DFF0", text: "#493A30" };
    case "dots": return { background: "#FFFDF5", border: "#E9DEBD", line: "#D6CDB5", text: "#463C31" };
    case "blossom": return { background: "#FFF4F8", border: "#F2C9DA", line: "#EFC8D8", text: "#4B2D3C" };
    case "night": return { background: "#121821", border: "#4C463D", line: "#6B5B47", text: "#F6F1E8" };
    default: return { background: "#FFFDF7", border: "#E7DED0", line: "#E2DBD0", text: fallbackText };
  }
}

export function PaperSheet({ paper, children, style, contentStyle }: { paper: PaperStyle | undefined; children: ReactNode; style?: StyleProp<ViewStyle>; contentStyle?: StyleProp<ViewStyle> }) {
  const { palette } = useDiary();
  const tone = paperTone(paper, palette.text);
  const lines = Array.from({ length: 16 });
  const dots = Array.from({ length: 48 });
  return <View style={[s.sheet, { backgroundColor: tone.background, borderColor: tone.border }, style]}>
    {paper === "ruled" && <View pointerEvents="none" style={s.ruleLayer}>{lines.map((_, index) => <View key={index} style={[s.rule, { top: 20 + index * 29, backgroundColor: tone.line }]} />)}</View>}
    {paper === "dots" && <View pointerEvents="none" style={s.dotLayer}>{dots.map((_, index) => <View key={index} style={[s.dot, { backgroundColor: tone.line }]} />)}</View>}
    {paper === "blossom" && <><View pointerEvents="none" style={[s.bloom, s.bloomTop, { backgroundColor: tone.line }]} /><View pointerEvents="none" style={[s.bloom, s.bloomBottom, { backgroundColor: tone.line }]} /></>}
    {paper === "night" && <View pointerEvents="none" style={s.ruleLayer}>{lines.map((_, index) => <View key={index} style={[s.rule, { top: 20 + index * 29, backgroundColor: tone.line, opacity: 0.42 }]} />)}</View>}
    <View style={[s.content, contentStyle]}>{children}</View>
  </View>;
}

export function PaperPreview({ paper, label, selected }: { paper: PaperStyle; label: string; selected: boolean }) {
  const { palette } = useDiary();
  const tone = paperTone(paper, palette.text);
  return <View style={[s.preview, { backgroundColor: tone.background, borderColor: selected ? palette.primary : tone.border }]}>
    {paper === "ruled" || paper === "night" ? <><View style={[s.previewLine, { backgroundColor: tone.line }]} /><View style={[s.previewLine, { backgroundColor: tone.line }]} /></> : null}
    {paper === "dots" ? <Text style={{ color: tone.line, letterSpacing: 3 }}>••••</Text> : null}
    {paper === "blossom" ? <View style={[s.previewBloom, { backgroundColor: tone.line }]} /> : null}
    {paper === "plain" ? <View style={[s.previewLine, { backgroundColor: tone.line }]} /> : null}
    <Text numberOfLines={1} style={[s.previewLabel, { color: tone.text }]}>{label}</Text>
  </View>;
}

const s = StyleSheet.create({
  sheet: { borderWidth: 1, borderRadius: 22, overflow: "hidden", position: "relative" },
  content: { zIndex: 1 },
  ruleLayer: { ...StyleSheet.absoluteFillObject },
  rule: { position: "absolute", left: 0, right: 0, height: 1 },
  dotLayer: { ...StyleSheet.absoluteFillObject, flexDirection: "row", flexWrap: "wrap", alignContent: "flex-start", gap: 14, padding: 14, opacity: 0.65 },
  dot: { width: 2, height: 2, borderRadius: 1, margin: 4 },
  bloom: { position: "absolute", width: 92, height: 92, borderRadius: 46, opacity: 0.27 },
  bloomTop: { top: -44, right: -34 },
  bloomBottom: { bottom: -46, left: -34 },
  preview: { height: 64, borderWidth: 1, borderRadius: 14, overflow: "hidden", justifyContent: "center", alignItems: "center", gap: 4 },
  previewLine: { width: "86%", height: 1 },
  previewBloom: { width: 24, height: 24, borderRadius: 12, opacity: 0.65 },
  previewLabel: { position: "absolute", bottom: 7, fontSize: 10, fontWeight: "800" },
});
