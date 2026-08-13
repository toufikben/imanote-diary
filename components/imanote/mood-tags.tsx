import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { type ComponentProps } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { moodName, noMoodName } from "@/lib/imanote/copy";
import { MOOD_IDS, type AppLanguage, type EntryMood, type Palette } from "@/lib/imanote/types";

const MOOD_ICONS: Record<EntryMood, ComponentProps<typeof MaterialIcons>["name"]> = {
  joyful: "sentiment-satisfied",
  calm: "self-improvement",
  grateful: "favorite",
  reflective: "auto-awesome",
  sad: "sentiment-dissatisfied",
  stressed: "flash-on",
};

type SharedProps = { palette: Palette; language: AppLanguage; isRTL: boolean };

export function MoodPicker({ selected, onChange, palette, language, isRTL }: SharedProps & { selected?: EntryMood; onChange: (mood?: EntryMood) => void }) {
  const choices: Array<EntryMood | undefined> = [undefined, ...MOOD_IDS];
  return <View style={[s.grid, { flexDirection: isRTL ? "row-reverse" : "row" }]}>{choices.map((mood) => {
    const isSelected = mood === selected;
    return <Pressable key={mood ?? "none"} accessibilityRole="button" accessibilityState={{ selected: isSelected }} onPress={() => onChange(mood)} style={({ pressed }) => [s.choice, { borderColor: isSelected ? palette.primary : palette.border, backgroundColor: isSelected ? palette.primarySoft : palette.surface, opacity: pressed ? 0.76 : 1, flexDirection: isRTL ? "row-reverse" : "row" }]}>
      <MaterialIcons name={mood ? MOOD_ICONS[mood] : "remove-circle-outline"} size={18} color={isSelected ? palette.primary : palette.muted} />
      <Text numberOfLines={1} style={[s.choiceText, { color: palette.text, textAlign: isRTL ? "right" : "left" }]}>{mood ? moodName(mood, language) : noMoodName(language)}</Text>
    </Pressable>;
  })}</View>;
}

export function MoodBadge({ mood, palette, language, isRTL }: SharedProps & { mood?: EntryMood }) {
  if (!mood) return null;
  return <View accessible accessibilityLabel={moodName(mood, language)} style={[s.badge, { backgroundColor: palette.primarySoft, flexDirection: isRTL ? "row-reverse" : "row" }]}><MaterialIcons name={MOOD_ICONS[mood]} color={palette.primary} size={14} /><Text style={[s.badgeText, { color: palette.primary }]}>{moodName(mood, language)}</Text></View>;
}

const s = StyleSheet.create({ grid: { flexWrap: "wrap", gap: 8 }, choice: { flexBasis: "47%", flexGrow: 1, minHeight: 42, borderWidth: 1, borderRadius: 13, alignItems: "center", justifyContent: "center", gap: 7, paddingHorizontal: 10 }, choiceText: { flexShrink: 1, fontSize: 13, fontWeight: "800" }, badge: { alignSelf: "flex-start", alignItems: "center", gap: 5, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 5 }, badgeText: { fontSize: 12, fontWeight: "800" } });
