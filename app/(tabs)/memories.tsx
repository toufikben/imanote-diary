import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { EntryCard } from "@/components/imanote/visuals";
import { useDiary } from "@/lib/imanote/diary-context";

export default function MemoriesScreen() {
  const { entries, copy, palette, isRTL } = useDiary(); const [query, setQuery] = useState(""); const data = useMemo(() => { const term = query.trim().toLocaleLowerCase(); return term ? entries.filter((entry) => `${entry.title} ${entry.body}`.toLocaleLowerCase().includes(term)) : entries; }, [entries, query]);
  return <View style={[s.page, { backgroundColor: palette.background }]}><FlatList data={data} keyExtractor={(item) => item.id} contentContainerStyle={s.content} ListHeaderComponent={<><Text style={[s.heading, { color: palette.text, textAlign: isRTL ? "right" : "left" }]}>{copy.memories}</Text><View style={[s.search, { borderColor: palette.border, backgroundColor: palette.surface, flexDirection: isRTL ? "row-reverse" : "row" }]}><MaterialIcons name="search" size={21} color={palette.muted} /><TextInput value={query} onChangeText={setQuery} placeholder={copy.searchPlaceholder} placeholderTextColor={palette.muted} style={[s.input, { color: palette.text, textAlign: isRTL ? "right" : "left" }]} /></View></>} renderItem={({ item }) => <EntryCard entry={item} onPress={() => router.push(`/entry/${item.id}` as any)} />} ListEmptyComponent={<View style={s.empty}><Text style={{ color: palette.muted }}>{query ? copy.noResults : copy.noMemories}</Text></View>} /></View>;
}
const s = StyleSheet.create({ page: { flex: 1 }, content: { padding: 20, paddingTop: 24, paddingBottom: 96 }, heading: { fontSize: 29, fontWeight: "800", marginBottom: 18 }, search: { minHeight: 50, borderWidth: 1, borderRadius: 16, alignItems: "center", gap: 9, paddingHorizontal: 14, marginBottom: 18 }, input: { flex: 1, minHeight: 46, fontSize: 15 }, empty: { alignItems: "center", paddingTop: 48 } });
