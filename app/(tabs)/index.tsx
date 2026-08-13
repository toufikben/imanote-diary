import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { EntryCard, formatDiaryDate, WolfMark } from "@/components/imanote/visuals";
import { useDiary } from "@/lib/imanote/diary-context";

export default function HomeScreen() {
  const { entries, copy, palette, isRTL, settings } = useDiary();
  const noir = settings.appearance === "noir";
  return (
    <View style={[s.page, { backgroundColor: palette.background }]}>
      <View pointerEvents="none" style={[s.halo, { backgroundColor: palette.primarySoft, right: noir ? -84 : -95, top: noir ? -82 : 88, opacity: noir ? 0.52 : 0.75 }]} />
      {!noir && <View pointerEvents="none" style={[s.bloomDot, { backgroundColor: palette.flower }]} />}
      <FlatList
        data={entries.slice(0, 4)}
        keyExtractor={(item) => item.id}
        contentContainerStyle={s.content}
        ListHeaderComponent={<>
          <View style={[s.header, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
            <View><Text style={[s.date, { color: palette.muted, textAlign: isRTL ? "right" : "left" }]}>{formatDiaryDate(new Date().toISOString(), settings.language)}</Text><Text style={[s.welcome, { color: palette.text, textAlign: isRTL ? "right" : "left" }]}>{copy.welcome}</Text></View>
            <View style={[s.mark, { backgroundColor: palette.primarySoft, borderColor: noir ? palette.border : "transparent" }]}>{noir ? <WolfMark color={palette.primary} /> : <MaterialIcons name="local-florist" color={palette.primary} size={25} />}</View>
          </View>
          <Pressable onPress={() => router.push("/editor" as any)} style={[s.newCard, { backgroundColor: palette.primary, flexDirection: isRTL ? "row-reverse" : "row" }]}>
            <View style={{ flex: 1 }}><Text style={s.newTitle}>{copy.newMemory}</Text><Text style={[s.newCopy, { color: noir ? "#FAEBD9" : "#FFF3F7" }]}>{copy.startWriting}</Text></View>
            <View style={s.newIcon}><MaterialIcons name="edit" size={22} color={palette.primary} /></View>
          </Pressable>
          <View style={[s.section, { flexDirection: isRTL ? "row-reverse" : "row" }]}><Text style={[s.sectionTitle, { color: palette.text }]}>{copy.recent}</Text><Text style={{ color: palette.muted, fontWeight: "800" }}>{entries.length}</Text></View>
        </>}
        renderItem={({ item }) => <EntryCard entry={item} onPress={() => router.push(`/entry/${item.id}` as any)} />}
        ListEmptyComponent={<View style={[s.empty, { borderColor: palette.border, backgroundColor: palette.surface }]}><MaterialIcons name="auto-stories" size={32} color={palette.primary} /><Text style={[s.emptyTitle, { color: palette.text }]}>{copy.noMemories}</Text><Text style={[s.emptyCopy, { color: palette.muted }]}>{copy.startWriting}</Text></View>}
      />
      <Pressable onPress={() => router.push("/editor" as any)} style={[s.fab, { backgroundColor: palette.primary }]}><MaterialIcons name="add" color="#fff" size={29} /></Pressable>
    </View>
  );
}
const s = StyleSheet.create({ page: { flex: 1, overflow: "hidden" }, content: { padding: 20, paddingTop: 23, paddingBottom: 115 }, halo: { position: "absolute", width: 220, height: 220, borderRadius: 110 }, bloomDot: { position: "absolute", width: 11, height: 11, borderRadius: 6, top: 137, right: 52, opacity: 0.7 }, header: { alignItems: "center", justifyContent: "space-between", marginBottom: 22 }, date: { fontSize: 13, fontWeight: "700", marginBottom: 5 }, welcome: { fontSize: 28, fontWeight: "800" }, mark: { width: 54, height: 54, borderRadius: 19, borderWidth: 1, alignItems: "center", justifyContent: "center" }, newCard: { borderRadius: 24, padding: 19, alignItems: "center", gap: 12, marginBottom: 24 }, newTitle: { color: "#fff", fontSize: 19, fontWeight: "800" }, newCopy: { fontSize: 13, marginTop: 5 }, newIcon: { backgroundColor: "#fff", width: 43, height: 43, borderRadius: 22, alignItems: "center", justifyContent: "center" }, section: { alignItems: "center", justifyContent: "space-between", marginBottom: 13 }, sectionTitle: { fontSize: 18, fontWeight: "800" }, empty: { borderWidth: 1, borderRadius: 22, padding: 28, alignItems: "center", gap: 8 }, emptyTitle: { fontSize: 17, fontWeight: "800" }, emptyCopy: { fontSize: 14, textAlign: "center" }, fab: { position: "absolute", right: 22, bottom: 22, width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center", elevation: 4 } });
