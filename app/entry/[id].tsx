import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useLocalSearchParams } from "expo-router";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { PaperSheet, paperTone, textMetrics } from "@/components/imanote/paper-sheet";
import { MoodBadge } from "@/components/imanote/mood-tags";
import { StickerRow } from "@/components/imanote/sticker-strip";
import { AudioPlayback, formatDiaryDate } from "@/components/imanote/visuals";
import { useDiary } from "@/lib/imanote/diary-context";

export default function EntryDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { entries, deleteEntry, copy, palette, isRTL, settings, fontFamily } = useDiary();
  const entry = entries.find((item) => item.id === id);
  if (!entry) return <View style={[s.page, { backgroundColor: palette.background, alignItems: "center", justifyContent: "center" }]}><Text style={{ color: palette.muted }}>{copy.noMemories}</Text></View>;
  const tone = paperTone(entry.paper, palette.text);
  const metrics = textMetrics(entry.fontSize, entry.lineSpacing, 17);
  const remove = () => Alert.alert(copy.delete, entry.title || copy.delete, [{ text: copy.cancel, style: "cancel" }, { text: copy.delete, style: "destructive", onPress: () => { void deleteEntry(entry.id); router.replace("/" as any); } }]);
  return <View style={[s.page, { backgroundColor: palette.background }]}>
    <View style={[s.top, { flexDirection: isRTL ? "row-reverse" : "row" }]}><Pressable onPress={() => router.back()} style={s.icon}><MaterialIcons name={isRTL ? "arrow-forward" : "arrow-back"} color={palette.text} size={24} /></Pressable><View style={s.actions}><Pressable onPress={() => router.push({ pathname: "/editor", params: { id: entry.id } } as any)} style={s.icon}><MaterialIcons name="edit" color={palette.text} size={21} /></Pressable><Pressable onPress={remove} style={s.icon}><MaterialIcons name="delete-outline" color={palette.danger} size={22} /></Pressable></View></View>
    <ScrollView contentContainerStyle={s.content}>
      <PaperSheet paper={entry.paper} contentStyle={s.paperContent}>
        <Text style={[s.date, { color: entry.paper === "night" ? "#C6BCAE" : palette.muted, textAlign: isRTL ? "right" : "left" }]}>{formatDiaryDate(entry.updatedAt, settings.language)}</Text>
        <MoodBadge mood={entry.mood} palette={palette} language={settings.language} isRTL={isRTL} />
        <StickerRow stickers={entry.stickers} palette={palette} isRTL={isRTL} />
        <Text style={[s.title, { color: tone.text, textAlign: isRTL ? "right" : "left", fontFamily: fontFamily(entry.font), ...textMetrics(entry.fontSize, entry.lineSpacing, 28) }]}>{entry.title || "—"}</Text>
        {entry.attachments?.length ? <View style={s.images}><Text style={[s.imageLabel, { color: entry.paper === "night" ? "#C6BCAE" : palette.muted, textAlign: isRTL ? "right" : "left" }]}>{copy.photos}</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[s.imageRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>{entry.attachments.map((attachment) => <Image key={attachment.id} source={{ uri: attachment.uri }} style={[s.image, { borderColor: entry.paper === "night" ? "#554B3D" : palette.border }]} />)}</ScrollView></View> : null}
        {entry.audioUri && <AudioPlayback uri={entry.audioUri} durationMs={entry.audioDurationMs} />}
        <Text style={[s.body, { color: tone.text, textAlign: isRTL ? "right" : "left", writingDirection: isRTL ? "rtl" : "ltr", fontFamily: fontFamily(entry.font), ...metrics }]}>{entry.body}</Text>
      </PaperSheet>
    </ScrollView>
  </View>;
}

const s = StyleSheet.create({ page: { flex: 1 }, top: { minHeight: 67, alignItems: "center", justifyContent: "space-between", paddingHorizontal: 15 }, actions: { flexDirection: "row" }, icon: { width: 44, height: 44, alignItems: "center", justifyContent: "center" }, content: { padding: 22, paddingBottom: 48 }, paperContent: { padding: 20, gap: 20 }, date: { fontSize: 13, fontWeight: "700" }, title: { fontWeight: "800", marginTop: -8 }, images: { gap: 8 }, imageLabel: { fontSize: 13, fontWeight: "800" }, imageRow: { gap: 10 }, image: { width: 185, height: 150, borderRadius: 18, borderWidth: 1 }, body: { minHeight: 110 } });
