import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useLocalSearchParams } from "expo-router";
import { RecordingPresets, requestRecordingPermissionsAsync, setAudioModeAsync, useAudioRecorder, useAudioRecorderState } from "expo-audio";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useMemo, useState } from "react";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PaperPreview, PaperSheet, paperTone, textMetrics } from "@/components/imanote/paper-sheet";
import { MoodPicker } from "@/components/imanote/mood-tags";
import { StickerPicker } from "@/components/imanote/sticker-strip";
import { fontName, fontSizeName, lineSpacingName, moodTitle, paperName, stickerTitle } from "@/lib/imanote/copy";
import { useDiary } from "@/lib/imanote/diary-context";
import { preservePhotoAttachment, preserveVoiceMemo } from "@/lib/imanote/storage";
import type { EntryFont, EntryFontSize, EntryLineSpacing, EntryMood, EntrySticker, PaperStyle, PhotoAttachment } from "@/lib/imanote/types";

const FONT_OPTIONS: EntryFont[] = ["classic", "clean", "rounded", "mono"];
const SIZE_OPTIONS: EntryFontSize[] = ["small", "medium", "large"];
const SPACING_OPTIONS: EntryLineSpacing[] = ["tight", "normal", "relaxed"];
const PAPER_OPTIONS: PaperStyle[] = ["plain", "ruled", "dots", "blossom", "night"];

export default function EditorScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { entries, copy, palette, isRTL, settings, saveEntry, fontFamily } = useDiary();
  const insets = useSafeAreaInsets();
  const existing = useMemo(() => entries.find((entry) => entry.id === id), [entries, id]);
  const [title, setTitle] = useState(existing?.title ?? "");
  const [body, setBody] = useState(existing?.body ?? "");
  const [font, setFont] = useState<EntryFont>(existing?.font ?? settings.defaultFont);
  const [fontSize, setFontSize] = useState<EntryFontSize>(existing?.fontSize ?? settings.defaultFontSize);
  const [lineSpacing, setLineSpacing] = useState<EntryLineSpacing>(existing?.lineSpacing ?? settings.defaultLineSpacing);
  const [paper, setPaper] = useState<PaperStyle>(existing?.paper ?? settings.defaultPaper);
  const [stickers, setStickers] = useState<EntrySticker[]>(existing?.stickers ?? []);
  const [mood, setMood] = useState<EntryMood | undefined>(existing?.mood);
  const [audioUri, setAudioUri] = useState<string | undefined>(existing?.audioUri);
  const [duration, setDuration] = useState(existing?.audioDurationMs);
  const [attachments, setAttachments] = useState<PhotoAttachment[]>(existing?.attachments ?? []);
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);
  const textTone = paperTone(paper, palette.text).text;
  const bodyMetrics = textMetrics(fontSize, lineSpacing);

  useEffect(() => { void setAudioModeAsync({ playsInSilentMode: true, allowsRecording: true }); }, []);
  const record = async () => {
    if (recorderState.isRecording) { await recorder.stop(); setAudioUri(recorder.uri ?? undefined); setDuration(recorderState.durationMillis); return; }
    const permission = await requestRecordingPermissionsAsync();
    if (!permission.granted) return Alert.alert(copy.voiceNote, copy.recordingUnavailable);
    await recorder.prepareToRecordAsync(); recorder.record();
  };
  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.78, allowsEditing: false });
    if (result.canceled) return;
    const asset = result.assets[0];
    setAttachments((current) => [...current, { id: asset.assetId ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, uri: asset.uri, name: asset.fileName ?? `photo-${Date.now()}.jpg`, mimeType: asset.mimeType ?? "image/jpeg", width: asset.width, height: asset.height }]);
  };
  const save = async () => {
    if (!title.trim() && !body.trim()) return Alert.alert(copy.createMemory, copy.requiredBody);
    const entryId = existing?.id ?? `memory-${Date.now()}`;
    const transientAudio = audioUri && audioUri !== existing?.audioUri;
    const savedAudio = transientAudio ? await preserveVoiceMemo(audioUri, entryId) : audioUri;
    const savedAttachments = await Promise.all(attachments.map((attachment) => existing?.attachments?.some((saved) => saved.uri === attachment.uri) ? attachment : preservePhotoAttachment(attachment, entryId)));
    const entry = await saveEntry({ id: existing?.id, title: title.trim(), body: body.trim(), font, fontSize, lineSpacing, paper, stickers, mood, audioUri: savedAudio, audioDurationMs: duration, attachments: savedAttachments });
    router.replace({ pathname: "/entry/[id]", params: { id: entry.id } } as any);
  };

  return <View style={[s.page, { backgroundColor: palette.background }]}>
    <View style={[s.top, { borderBottomColor: palette.border, flexDirection: isRTL ? "row-reverse" : "row" }]}>
      <Pressable onPress={() => router.back()} style={s.icon}><MaterialIcons name="close" size={25} color={palette.text} /></Pressable>
      <Text style={[s.topTitle, { color: palette.text }]}>{existing ? copy.editMemory : copy.createMemory}</Text>
      <View style={s.headerSpacer} />
    </View>
    <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
      <Text style={[s.label, { color: palette.muted, textAlign: isRTL ? "right" : "left" }]}>{copy.title}</Text>
      <TextInput value={title} onChangeText={setTitle} placeholder={copy.titlePlaceholder} placeholderTextColor={palette.muted} style={[s.titleInput, { color: palette.text, borderBottomColor: palette.border, textAlign: isRTL ? "right" : "left", fontFamily: fontFamily(font) }]} />
      <Text style={[s.label, { color: palette.muted, textAlign: isRTL ? "right" : "left" }]}>{moodTitle(settings.language)}</Text>
      <MoodPicker selected={mood} onChange={setMood} palette={palette} language={settings.language} isRTL={isRTL} />
      <Text style={[s.label, { color: palette.muted, textAlign: isRTL ? "right" : "left" }]}>{copy.font}</Text>
      <View style={[s.fonts, { flexDirection: isRTL ? "row-reverse" : "row" }]}>{FONT_OPTIONS.map((item) => <Pressable key={item} onPress={() => setFont(item)} style={[s.font, { borderColor: font === item ? palette.primary : palette.border, backgroundColor: font === item ? palette.primarySoft : palette.surface }]}><Text style={[s.fontName, { color: palette.text, fontFamily: fontFamily(item) }]}>{fontName(item, settings.language)}</Text><Text style={[s.fontSample, { color: palette.muted, fontFamily: fontFamily(item) }]}>أ ب · Aa</Text></Pressable>)}</View>
      <Text style={[s.label, { color: palette.muted, textAlign: isRTL ? "right" : "left" }]}>{copy.fontSize}</Text>
      <View style={[s.chips, { flexDirection: isRTL ? "row-reverse" : "row" }]}>{SIZE_OPTIONS.map((item) => <Pressable key={item} onPress={() => setFontSize(item)} style={[s.chip, { borderColor: fontSize === item ? palette.primary : palette.border, backgroundColor: fontSize === item ? palette.primarySoft : palette.surface }]}><Text style={{ color: palette.text, fontWeight: "800", fontSize: item === "small" ? 12 : item === "large" ? 17 : 14 }}>{fontSizeName(item, settings.language)}</Text></Pressable>)}</View>
      <Text style={[s.label, { color: palette.muted, textAlign: isRTL ? "right" : "left" }]}>{copy.lineSpacing}</Text>
      <View style={[s.chips, { flexDirection: isRTL ? "row-reverse" : "row" }]}>{SPACING_OPTIONS.map((item) => <Pressable key={item} onPress={() => setLineSpacing(item)} style={[s.chip, { borderColor: lineSpacing === item ? palette.primary : palette.border, backgroundColor: lineSpacing === item ? palette.primarySoft : palette.surface }]}><Text style={{ color: palette.text, fontWeight: "800", lineHeight: item === "tight" ? 16 : item === "relaxed" ? 25 : 20 }}>{lineSpacingName(item, settings.language)}</Text></Pressable>)}</View>
      <Text style={[s.label, { color: palette.muted, textAlign: isRTL ? "right" : "left" }]}>{copy.paper}</Text>
      <View style={[s.paperGrid, { flexDirection: isRTL ? "row-reverse" : "row" }]}>{PAPER_OPTIONS.map((item) => <Pressable key={item} onPress={() => setPaper(item)} style={s.paperOption}><PaperPreview paper={item} label={paperName(item, settings.language)} selected={paper === item} /></Pressable>)}</View>
      <Text style={[s.label, { color: palette.muted, textAlign: isRTL ? "right" : "left" }]}>{stickerTitle(settings.language)}</Text>
      <StickerPicker selected={stickers} onChange={setStickers} palette={palette} language={settings.language} isRTL={isRTL} />
      <Text style={[s.label, { color: palette.muted, textAlign: isRTL ? "right" : "left" }]}>{copy.body}</Text>
      <PaperSheet paper={paper} contentStyle={s.paperContent}><TextInput value={body} onChangeText={setBody} placeholder={copy.bodyPlaceholder} placeholderTextColor={paper === "night" ? "#AFA79A" : palette.muted} multiline textAlignVertical="top" style={[s.bodyInput, { color: textTone, textAlign: isRTL ? "right" : "left", writingDirection: isRTL ? "rtl" : "ltr", fontFamily: fontFamily(font), ...bodyMetrics }]} /></PaperSheet>
      <View style={[s.photoHeading, { flexDirection: isRTL ? "row-reverse" : "row" }]}><Text style={[s.label, { color: palette.muted, textAlign: isRTL ? "right" : "left", flex: 1 }]}>{copy.photos}</Text><Pressable onPress={() => void pickPhoto()} style={[s.addPhoto, { borderColor: palette.primary, backgroundColor: palette.primarySoft, flexDirection: isRTL ? "row-reverse" : "row" }]}><MaterialIcons name="add-photo-alternate" color={palette.primary} size={18} /><Text style={{ color: palette.primary, fontWeight: "800", fontSize: 13 }}>{copy.addPhoto}</Text></Pressable></View>
      {attachments.length > 0 && <View style={[s.photoGrid, { flexDirection: isRTL ? "row-reverse" : "row" }]}>{attachments.map((attachment) => <View key={attachment.id} style={[s.photoWrap, { borderColor: palette.border }]}><Image source={{ uri: attachment.uri }} style={s.photo} /><Pressable onPress={() => setAttachments((items) => items.filter((item) => item.id !== attachment.id))} style={[s.removePhoto, { backgroundColor: palette.danger }]}><MaterialIcons name="close" color="#fff" size={15} /></Pressable></View>)}</View>}
      <Text style={[s.label, { color: palette.muted, textAlign: isRTL ? "right" : "left" }]}>{copy.voiceNote}</Text>
      <Pressable onPress={() => void record()} style={[s.record, { borderColor: recorderState.isRecording ? palette.danger : palette.border, backgroundColor: recorderState.isRecording ? palette.primarySoft : palette.surface, flexDirection: isRTL ? "row-reverse" : "row" }]}><View style={[s.recordIcon, { backgroundColor: recorderState.isRecording ? palette.danger : palette.primary }]}><MaterialIcons name={recorderState.isRecording ? "stop" : audioUri ? "check" : "mic-none"} color="#fff" size={22} /></View><View style={{ flex: 1 }}><Text style={[s.recordTitle, { color: palette.text, textAlign: isRTL ? "right" : "left" }]}>{recorderState.isRecording ? copy.stop : audioUri ? copy.saved : copy.record}</Text><Text style={[s.recordHint, { color: palette.muted, textAlign: isRTL ? "right" : "left" }]}>{recorderState.isRecording ? `${Math.floor((recorderState.durationMillis ?? 0) / 1000)}s` : copy.voiceNote}</Text></View></Pressable>
    </ScrollView>
    <View pointerEvents="box-none" style={[s.saveDock, { bottom: Math.max(insets.bottom, 12) + 20 }]}>
      <Pressable accessibilityRole="button" accessibilityLabel={copy.save} onPress={() => void save()} style={({ pressed }) => [s.save, { backgroundColor: palette.primary, flexDirection: isRTL ? "row-reverse" : "row" }, pressed && s.savePressed]}>
        <MaterialIcons name="bookmark" size={19} color="#fff" />
        <Text style={s.saveText}>{copy.save}</Text>
      </Pressable>
    </View>
  </View>;
}

const s = StyleSheet.create({ page: { flex: 1 }, top: { minHeight: 68, paddingHorizontal: 16, alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1 }, icon: { width: 42, height: 42, alignItems: "center", justifyContent: "center" }, topTitle: { fontSize: 16, fontWeight: "800" }, headerSpacer: { width: 42, height: 42 }, saveDock: { position: "absolute", left: 20, right: 20, bottom: 24 }, save: { minHeight: 52, paddingHorizontal: 20, justifyContent: "center", alignItems: "center", borderRadius: 16, gap: 8, shadowColor: "#241A21", shadowOpacity: 0.16, shadowRadius: 14, shadowOffset: { width: 0, height: 7 }, elevation: 5 }, savePressed: { opacity: 0.9, transform: [{ scale: 0.98 }] }, saveText: { color: "#fff", fontSize: 15, fontWeight: "800" }, content: { padding: 20, paddingBottom: 116 }, label: { fontSize: 13, fontWeight: "800", marginBottom: 8, marginTop: 17 }, titleInput: { minHeight: 48, fontSize: 22, fontWeight: "700", borderBottomWidth: 1, paddingHorizontal: 0 }, fonts: { flexWrap: "wrap", gap: 9 }, font: { minHeight: 70, flexGrow: 1, flexBasis: "46%", borderWidth: 1, borderRadius: 15, paddingHorizontal: 12, justifyContent: "center", gap: 3 }, fontName: { fontSize: 15, fontWeight: "800" }, fontSample: { fontSize: 14 }, chips: { gap: 8 }, chip: { minHeight: 42, flex: 1, borderWidth: 1, borderRadius: 13, alignItems: "center", justifyContent: "center", paddingHorizontal: 8 }, paperGrid: { flexWrap: "wrap", gap: 8 }, paperOption: { width: "31%" }, paperContent: { minHeight: 250 }, bodyInput: { minHeight: 250, paddingHorizontal: 15, paddingTop: 14, paddingBottom: 16 }, photoHeading: { alignItems: "center", gap: 10 }, addPhoto: { minHeight: 35, paddingHorizontal: 11, borderWidth: 1, borderRadius: 11, alignItems: "center", gap: 5 }, photoGrid: { flexWrap: "wrap", gap: 10 }, photoWrap: { width: 86, height: 86, borderWidth: 1, borderRadius: 16, overflow: "visible" }, photo: { width: "100%", height: "100%", borderRadius: 15 }, removePhoto: { position: "absolute", top: -7, right: -7, width: 23, height: 23, borderRadius: 12, alignItems: "center", justifyContent: "center" }, record: { borderWidth: 1, borderRadius: 18, padding: 13, gap: 12, alignItems: "center" }, recordIcon: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center" }, recordTitle: { fontSize: 15, fontWeight: "800" }, recordHint: { fontSize: 13, marginTop: 3 } });
