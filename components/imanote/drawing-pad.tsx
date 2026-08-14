import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useMemo, useRef, useState } from "react";
import { PanResponder, Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import type { DrawingStroke, Palette } from "@/lib/imanote/types";

function toPath(points: DrawingStroke["points"]) {
  return points.map((point, index) => `${index ? "L" : "M"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
}

export function DrawingPreview({ strokes, palette, height = 132 }: { strokes?: DrawingStroke[]; palette: Palette; height?: number }) {
  if (!strokes?.length) return null;
  return <View style={[s.preview, { height, borderColor: palette.border, backgroundColor: palette.surface }]}><Svg width="100%" height="100%" viewBox="0 0 320 160">{strokes.map((stroke, index) => <Path key={`${index}-${stroke.points.length}`} d={toPath(stroke.points)} stroke={stroke.color} strokeWidth={stroke.width} strokeLinecap="round" strokeLinejoin="round" fill="none" />)}</Svg></View>;
}

export function DrawingPad({ value, onChange, palette, isRTL, language, strokeColor }: { value: DrawingStroke[]; onChange: (value: DrawingStroke[]) => void; palette: Palette; isRTL: boolean; language: "ar" | "fr" | "en"; strokeColor?: string }) {
  const [active, setActive] = useState<DrawingStroke | null>(null);
  const valueRef = useRef(value); const activeRef = useRef<DrawingStroke | null>(null);
  useEffect(() => { valueRef.current = value; }, [value]);
  const label = language === "ar" ? "رسم يدوي" : language === "fr" ? "Dessin" : "Handwriting";
  const clear = language === "ar" ? "مسح" : language === "fr" ? "Effacer" : "Clear";
  const update = (point: { x: number; y: number }) => { const current = activeRef.current; if (!current) return; const next = { ...current, points: [...current.points, point] }; activeRef.current = next; setActive(next); };
  const responder = useMemo(() => PanResponder.create({ onStartShouldSetPanResponder: () => true, onMoveShouldSetPanResponder: () => true, onPanResponderGrant: (event) => { const point = { x: event.nativeEvent.locationX, y: event.nativeEvent.locationY }; const next = { color: strokeColor ?? palette.primary, width: 3.2, points: [point] }; activeRef.current = next; setActive(next); }, onPanResponderMove: (event) => update({ x: event.nativeEvent.locationX, y: event.nativeEvent.locationY }), onPanResponderRelease: () => { const completed = activeRef.current; if (completed?.points.length && valueRef.current.length < 40) onChange([...valueRef.current, completed]); activeRef.current = null; setActive(null); }, onPanResponderTerminate: () => { activeRef.current = null; setActive(null); } }), [palette.primary, strokeColor, onChange]);
  const strokes = active ? [...value, active] : value;
  return <View style={[s.wrap, { borderColor: palette.border, backgroundColor: palette.surface }]}><View style={[s.heading, { flexDirection: isRTL ? "row-reverse" : "row" }]}><View style={[s.titleRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}><MaterialIcons name="gesture" size={18} color={palette.primary} /><Text style={{ color: palette.text, fontWeight: "800" }}>{label}</Text></View><Pressable accessibilityRole="button" accessibilityLabel={clear} onPress={() => onChange([])} style={[s.clear, { backgroundColor: palette.primarySoft }]}><Text style={{ color: palette.primary, fontWeight: "800", fontSize: 12 }}>{clear}</Text></Pressable></View><View {...responder.panHandlers} style={[s.canvas, { borderColor: palette.border }]}><Svg width="100%" height="100%" viewBox="0 0 320 160">{strokes.map((stroke, index) => <Path key={`${index}-${stroke.points.length}`} d={toPath(stroke.points)} stroke={stroke.color} strokeWidth={stroke.width} strokeLinecap="round" strokeLinejoin="round" fill="none" />)}</Svg></View></View>;
}

const s = StyleSheet.create({ wrap: { borderWidth: 1, borderRadius: 18, padding: 12, gap: 10 }, heading: { justifyContent: "space-between", alignItems: "center" }, titleRow: { alignItems: "center", gap: 6 }, clear: { minHeight: 30, paddingHorizontal: 11, borderRadius: 10, justifyContent: "center" }, canvas: { height: 160, borderWidth: 1, borderRadius: 12, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.45)" }, preview: { borderWidth: 1, borderRadius: 14, overflow: "hidden" } });
