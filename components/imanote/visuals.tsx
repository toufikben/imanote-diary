import { useDiary } from "@/lib/imanote/diary-context";
import { isValidLockValue } from "@/lib/imanote/validation";
import { securityCopy } from "@/lib/imanote/copy";
import type { DiaryEntry, LockKind } from "@/lib/imanote/types";
import { MoodBadge } from "@/components/imanote/mood-tags";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Image, PanResponder, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

const LOCK_WOLF_ART = "https://imanote-diar-wyf44srw.manus.space/manus-storage/imanote-lock-wolf_3bf9dfcd.png";
const LOCK_SUCCESS_SOUND = require("@/assets/sounds/lock-success-wolf-howl.wav");
const LOCK_FAILURE_SOUND = require("@/assets/sounds/lock-failure-gentle.wav");

function Flower({ size = 100, color = "#E989A7", locked = false }: { size?: number; color?: string; locked?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {[0, 72, 144, 216, 288].map((rotation) => (
        <Path key={rotation} d="M50 50 C15 34 20 4 50 17 C80 4 85 34 50 50" fill={color} transform={`rotate(${rotation} 50 50)`} />
      ))}
      <Circle cx="50" cy="50" r="15" fill="#F5D481" />
      {locked ? (
        <>
          <Path d="M40 53V47a10 10 0 0 1 20 0v6" stroke="#785E44" strokeWidth="5" strokeLinecap="round" fill="none" />
          <Path d="M36 51h28v22H36z" fill="#785E44" />
          <Circle cx="50" cy="62" r="3" fill="#F5D481" />
        </>
      ) : (
        <Circle cx="50" cy="50" r="5" fill="#C65B7C" />
      )}
    </Svg>
  );
}

export function WolfMark({ size = 54, color = "#D0A676" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 100" fill="none">
      <Path d="M20 63c2-20 15-34 37-34 20 0 35 10 42 28l-8 8-6-12v30H71V59H52v24H38V62l-10 9-8-8Z" stroke={color} strokeWidth="5" strokeLinejoin="round" />
      <Path d="m41 34 8-17 10 12 14-12 7 19" stroke={color} strokeWidth="5" strokeLinejoin="round" />
      <Path d="M42 51c6 5 20 5 27 0m-14-4v9" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <Circle cx="48" cy="44" r="3" fill={color} />
      <Circle cx="66" cy="44" r="3" fill={color} />
      <Path d="M57 62c3 3 7 3 10 0M86 50c11-2 16 4 16 12" stroke={color} strokeWidth="4" strokeLinecap="round" />
    </Svg>
  );
}

type Petal = { id: number; x: number; y: number; size: number; color: string; rotation: number };

export function FloralSplash({ onFinish }: { onFinish: () => void }) {
  const [petals, setPetals] = useState<Petal[]>([]);
  const opacity = useRef(new Animated.Value(1)).current;
  const count = useRef(0);

  useEffect(() => {
    const timeout = setTimeout(
      () => Animated.timing(opacity, { toValue: 0, duration: 380, easing: Easing.out(Easing.quad), useNativeDriver: true }).start(onFinish),
      1500,
    );
    return () => clearTimeout(timeout);
  }, [onFinish, opacity]);

  const bloom = (x: number, y: number) => {
    setPetals((items) => [
      ...items.slice(-35),
      ...[0, 1, 2].map((i) => ({
        id: count.current++,
        x: x + (i - 1) * 15,
        y: y + (i % 2 ? -7 : 7),
        size: 23 + i * 7,
        color: ["#F7C7D5", "#E989A7", "#F0A8BB"][i],
        rotation: i * 25,
      })),
    ]);
  };

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (event) => bloom(event.nativeEvent.locationX, event.nativeEvent.locationY),
      onPanResponderMove: (event) => bloom(event.nativeEvent.locationX, event.nativeEvent.locationY),
    }),
  ).current;

  return (
    <Animated.View style={[s.splash, { opacity }]} {...responder.panHandlers}>
      <View style={s.haloA} />
      <View style={s.haloB} />
      {petals.map((petal) => (
        <View key={petal.id} style={{ position: "absolute", left: petal.x - petal.size / 2, top: petal.y - petal.size / 2, transform: [{ rotate: `${petal.rotation}deg` }] }}>
          <Flower size={petal.size} color={petal.color} />
        </View>
      ))}
      <View style={s.splashFlower}><Flower size={116} /></View>
    </Animated.View>
  );
}

type LockOutcome = "success" | "failure" | null;

function WalkingLockWolf({ color, isRTL, outcome, outcomeKey }: { color: string; isRTL: boolean; outcome: LockOutcome; outcomeKey: number }) {
  const journey = useRef(new Animated.Value(0)).current;
  const reaction = useRef(new Animated.Value(0)).current;
  const [artUnavailable, setArtUnavailable] = useState(false);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(journey, { toValue: 1, duration: 1750, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
        Animated.delay(180),
        Animated.timing(journey, { toValue: 0, duration: 1750, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
        Animated.delay(300),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [journey]);

  useEffect(() => {
    reaction.stopAnimation();
    reaction.setValue(0);
    if (!outcome) return;
    const animation = outcome === "success"
      ? Animated.sequence([
          Animated.timing(reaction, { toValue: 1, duration: 210, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.delay(100),
          Animated.timing(reaction, { toValue: 0, duration: 430, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        ])
      : Animated.sequence([
          Animated.timing(reaction, { toValue: 1, duration: 160, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(reaction, { toValue: 0, duration: 360, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        ]);
    animation.start();
    return () => animation.stop();
  }, [outcome, outcomeKey, reaction]);

  const translateX = journey.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: isRTL ? [24, -3, -25] : [-24, 3, 25],
  });
  const lift = journey.interpolate({ inputRange: [0, 0.25, 0.5, 0.75, 1], outputRange: [0, -3, 0, -3, 0] });
  const turn = journey.interpolate({
    inputRange: [0, 0.42, 0.58, 1],
    outputRange: isRTL ? ["-7deg", "-7deg", "7deg", "-7deg"] : ["7deg", "7deg", "-7deg", "7deg"],
  });
  const reactionLift = reaction.interpolate({ inputRange: [0, 1], outputRange: [0, outcome === "success" ? -17 : 4] });
  const reactionTurn = reaction.interpolate({ inputRange: [0, 1], outputRange: ["0deg", outcome === "success" ? (isRTL ? "-16deg" : "16deg") : (isRTL ? "5deg" : "-5deg")] });
  const reactionScale = reaction.interpolate({ inputRange: [0, 1], outputRange: [1, outcome === "failure" ? 0.94 : 1.04] });

  return (
    <View pointerEvents="none" accessible={false} importantForAccessibility="no-hide-descendants" style={s.walkWolfStage}>
      <Animated.View style={[s.walkWolf, { transform: [{ translateX }, { translateY: lift }, { translateY: reactionLift }, { rotate: turn }, { rotate: reactionTurn }, { scale: reactionScale }, { scaleX: isRTL ? -1 : 1 }] }]}> 
        {artUnavailable ? (
          <WolfMark size={58} color={color} />
        ) : (
          <Image accessibilityIgnoresInvertColors source={{ uri: LOCK_WOLF_ART }} style={s.walkWolfArt} onError={() => setArtUnavailable(true)} />
        )}
      </Animated.View>
    </View>
  );
}

export function PrivacyGate() {
  const { accessState, configureLock, unlock, unlockWithBiometrics, settings, copy, palette, isRTL } = useDiary();
  const successSound = useAudioPlayer(LOCK_SUCCESS_SOUND);
  const failureSound = useAudioPlayer(LOCK_FAILURE_SOUND);
  const [kind, setKind] = useState<LockKind>("pin");
  const [first, setFirst] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [biometricBusy, setBiometricBusy] = useState(false);
  const [lockOutcome, setLockOutcome] = useState<{ type: LockOutcome; key: number }>({ type: null, key: 0 });
  const setup = accessState === "setup";
  const pin = kind === "pin";
  const active = setup && first.length === 4 ? confirm : first;
  const security = securityCopy(settings.language);
  const playLockResult = (accepted: boolean) => {
    setLockOutcome({ type: accepted ? "success" : "failure", key: Date.now() });
    if (!settings.lockSoundsEnabled) return;
    const player = accepted ? successSound : failureSound;
    void setAudioModeAsync({ playsInSilentMode: true }).catch(() => undefined);
    player.seekTo(0);
    player.play();
  };

  const submit = async () => {
    setError("");
    if (setup) {
      if (!isValidLockValue(kind, first)) return setError(copy.invalidPin);
      if (first !== confirm) return setError(copy.mismatch);
      await configureLock(kind, first);
    } else if (!isValidLockValue(kind, first)) {
      setError(pin ? copy.invalidPin : copy.wrongLock);
    } else {
      const accepted = await unlock(first);
      playLockResult(accepted);
      if (!accepted) setError(copy.wrongLock);
    }
  };

  const digit = (value: string) => {
    if (value === "⌫") {
      return setup && first.length === 4 ? setConfirm((current) => current.slice(0, -1)) : setFirst((current) => current.slice(0, -1));
    }
    if (first.length < 4) setFirst((current) => `${current}${value}`);
    else if (setup && confirm.length < 4) setConfirm((current) => `${current}${value}`);
  };
  const useBiometrics = async () => {
    setError(""); setBiometricBusy(true);
    const result = await unlockWithBiometrics(security.biometricAction);
    setBiometricBusy(false);
    if (result === "unavailable") setError(security.biometricUnavailable);
    else if (result === "failed") setError(security.biometricFailed);
  };

  return (
    <View style={[s.gate, { backgroundColor: palette.background }]}>
      <View style={[s.gateBubble, { backgroundColor: palette.primarySoft }]} />
      <View style={s.gateContent}>
        <Flower size={92} color={palette.flower} locked />
        <Text style={[s.gateTitle, { color: palette.text, textAlign: isRTL ? "right" : "left" }]}>Imanote</Text>
        <Text style={[s.gateBody, { color: palette.muted, textAlign: isRTL ? "right" : "left" }]}>{setup ? copy.setupBody : copy.localOnly}</Text>
        {setup && (
          <View style={s.segments}>
            {(["pin", "password"] as LockKind[]).map((option) => (
              <Pressable key={option} onPress={() => { setKind(option); setFirst(""); setConfirm(""); setError(""); }} style={[s.segment, { borderColor: palette.border, backgroundColor: kind === option ? palette.primary : palette.surface }]}>
                <Text style={{ color: kind === option ? "#fff" : palette.text, fontWeight: "800" }}>{option === "pin" ? copy.choosePin : copy.choosePassword}</Text>
              </Pressable>
            ))}
          </View>
        )}
        {pin ? (
          <View style={s.pinBlock}>
            <Text style={[s.hint, { color: palette.muted }]}>{setup ? first.length < 4 ? copy.choosePin : copy.confirmPin : copy.enterPin}</Text>
            <View style={s.lockSurface}>
              <WalkingLockWolf color={palette.primary} isRTL={isRTL} outcome={lockOutcome.type} outcomeKey={lockOutcome.key} />
              <View style={s.dots}>
                {[0, 1, 2, 3].map((item) => <View key={item} style={[s.dot, { backgroundColor: item < active.length ? palette.primary : palette.border }]} />)}
              </View>
            </View>
            <View style={s.keypad}>
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"].map((key) => (
                <Pressable key={key || "blank"} disabled={!key} onPress={() => digit(key)} style={({ pressed }) => [s.key, { backgroundColor: key ? palette.surface : "transparent", opacity: pressed ? 0.7 : 1 }]}>
                  <Text style={[s.keyText, { color: palette.text }]}>{key}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : (
          <View style={s.passwordBlock}>
            <View style={s.lockSurface}>
              <WalkingLockWolf color={palette.primary} isRTL={isRTL} outcome={lockOutcome.type} outcomeKey={lockOutcome.key} />
              <TextInput value={first} onChangeText={setFirst} placeholder={setup ? copy.choosePassword : copy.enterPassword} placeholderTextColor={palette.muted} secureTextEntry autoCapitalize="none" style={[s.input, { backgroundColor: palette.surface, color: palette.text, borderColor: palette.border, textAlign: isRTL ? "right" : "left" }]} />
            </View>
            {setup && (
              <View style={s.lockSurface}>
                <WalkingLockWolf color={palette.primary} isRTL={isRTL} outcome={lockOutcome.type} outcomeKey={lockOutcome.key} />
                <TextInput value={confirm} onChangeText={setConfirm} placeholder={copy.confirmPassword} placeholderTextColor={palette.muted} secureTextEntry autoCapitalize="none" style={[s.input, { backgroundColor: palette.surface, color: palette.text, borderColor: palette.border, textAlign: isRTL ? "right" : "left" }]} />
              </View>
            )}
          </View>
        )}
        {!!error && <Text style={[s.error, { color: palette.danger }]}>{error}</Text>}
        {!setup && settings.biometricEnabled && <Pressable disabled={biometricBusy} onPress={() => void useBiometrics()} style={({ pressed }) => [s.biometric, { borderColor: palette.border, backgroundColor: palette.surface, opacity: pressed || biometricBusy ? 0.7 : 1, flexDirection: isRTL ? "row-reverse" : "row" }]}><MaterialIcons name="fingerprint" size={21} color={palette.primary} /><Text style={{ color: palette.text, fontWeight: "800" }}>{security.biometricAction}</Text></Pressable>}
        <Pressable onPress={() => void submit()} style={({ pressed }) => [s.primary, { backgroundColor: palette.primary, opacity: pressed ? 0.85 : 1 }]}>
          <Text style={s.primaryText}>{setup ? copy.createLock : copy.unlock}</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function formatDiaryDate(value: string, language: "ar" | "fr" | "en") {
  return new Intl.DateTimeFormat(language === "ar" ? "ar-DZ" : language === "fr" ? "fr-FR" : "en-US", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

export function EntryCard({ entry, onPress }: { entry: DiaryEntry; onPress: () => void }) {
  const { palette, settings, isRTL, fontFamily } = useDiary();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.card, { backgroundColor: palette.surface, borderColor: palette.border, opacity: pressed ? 0.72 : 1 }]}>
      <View style={[s.cardRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
        <View style={[s.miniFlower, { backgroundColor: palette.primarySoft }]}><MaterialIcons name="auto-awesome" size={16} color={palette.primary} /></View>
        <View style={s.cardCopy}>
          <Text numberOfLines={1} style={[s.cardTitle, { color: palette.text, textAlign: isRTL ? "right" : "left", fontFamily: fontFamily(entry.font) }]}>{entry.title || "—"}</Text>
          <Text numberOfLines={2} style={[s.cardBody, { color: palette.muted, textAlign: isRTL ? "right" : "left", fontFamily: fontFamily(entry.font) }]}>{entry.body.replace(/\s+/g, " ").trim() || "…"}</Text>
          <View style={[s.cardMeta, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
            <Text style={[s.cardDate, { color: palette.muted }]}>{formatDiaryDate(entry.updatedAt, settings.language)}</Text>
            <MoodBadge mood={entry.mood} palette={palette} language={settings.language} isRTL={isRTL} />
            {entry.favorite && <MaterialIcons name="star" color={palette.primary} size={16} />}
            {entry.audioUri && <MaterialIcons name="mic-none" color={palette.primary} size={15} />}
            {entry.attachments?.length ? <MaterialIcons name="photo" color={palette.primary} size={15} /> : null}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export function AudioPlayback({ uri, durationMs }: { uri: string; durationMs?: number }) {
  const { copy, palette, isRTL } = useDiary();
  const player = useAudioPlayer({ uri });
  const status = useAudioPlayerStatus(player);
  const seconds = Math.max(0, Math.floor(status.duration || (durationMs ?? 0) / 1000));
  const toggle = () => {
    if (status.playing) player.pause();
    else {
      if (status.currentTime >= status.duration && status.duration > 0) player.seekTo(0);
      player.play();
    }
  };
  return (
    <View style={[s.playback, { backgroundColor: palette.softSurface, borderColor: palette.border, flexDirection: isRTL ? "row-reverse" : "row" }]}>
      <Pressable onPress={toggle} style={[s.playButton, { backgroundColor: palette.primary }]}><MaterialIcons name={status.playing ? "pause" : "play-arrow"} color="#fff" size={24} /></Pressable>
      <View style={{ flex: 1 }}>
        <Text style={[s.playTitle, { color: palette.text, textAlign: isRTL ? "right" : "left" }]}>{copy.voiceNote}</Text>
        <Text style={[s.playInfo, { color: palette.muted, textAlign: isRTL ? "right" : "left" }]}>{status.playing ? copy.pause : copy.play} · {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  splash: { flex: 1, backgroundColor: "#C7D1F0", overflow: "hidden" },
  haloA: { position: "absolute", width: 330, height: 330, borderRadius: 165, backgroundColor: "#DEE5FA", top: 94, left: -74 },
  haloB: { position: "absolute", width: 300, height: 300, borderRadius: 150, backgroundColor: "#F8DCE6", bottom: 40, right: -100, opacity: 0.52 },
  splashFlower: { position: "absolute", top: "43%", left: "50%", transform: [{ translateX: -58 }, { translateY: -58 }] },
  gate: { flex: 1, justifyContent: "center", padding: 24, overflow: "hidden" },
  gateBubble: { position: "absolute", width: 350, height: 350, borderRadius: 175, right: -125, top: -135 },
  gateContent: { width: "100%", maxWidth: 430, alignSelf: "center", gap: 17 },
  gateTitle: { fontSize: 29, lineHeight: 37, fontWeight: "800" },
  gateBody: { fontSize: 15, lineHeight: 23 },
  segments: { flexDirection: "row", gap: 9 },
  segment: { flex: 1, minHeight: 48, borderWidth: 1, borderRadius: 15, alignItems: "center", justifyContent: "center", paddingHorizontal: 8 },
  pinBlock: { gap: 15 },
  hint: { textAlign: "center", fontSize: 14, fontWeight: "700" },
  lockSurface: { position: "relative", alignItems: "center", minHeight: 72, overflow: "visible" },
  walkWolfStage: { position: "absolute", top: -16, width: 126, height: 60, alignItems: "center", justifyContent: "center", zIndex: 2 },
  walkWolf: { position: "absolute", width: 58, height: 58 },
  walkWolfArt: { width: 58, height: 58, resizeMode: "contain" },
  dots: { flexDirection: "row", justifyContent: "center", gap: 14, marginTop: 28, zIndex: 1 },
  dot: { width: 13, height: 13, borderRadius: 7 },
  keypad: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 10 },
  key: { width: "29%", aspectRatio: 1.28, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  keyText: { fontSize: 23, fontWeight: "700" },
  passwordBlock: { gap: 12 },
  input: { minHeight: 54, width: "100%", marginTop: 20, paddingHorizontal: 16, fontSize: 16, borderRadius: 16, borderWidth: 1, zIndex: 1 },
  error: { textAlign: "center", fontSize: 14, fontWeight: "700" },
  biometric: { minHeight: 50, borderRadius: 16, borderWidth: 1, alignItems: "center", justifyContent: "center", gap: 8 },
  primary: { minHeight: 54, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  primaryText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  card: { borderWidth: 1, borderRadius: 20, padding: 15, marginBottom: 11 },
  cardRow: { gap: 12, alignItems: "flex-start" },
  miniFlower: { width: 35, height: 35, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  cardCopy: { flex: 1, gap: 5 },
  cardTitle: { fontSize: 17, lineHeight: 23, fontWeight: "800" },
  cardBody: { fontSize: 14, lineHeight: 20 },
  cardMeta: { alignItems: "center", flexWrap: "wrap", gap: 8, marginTop: 2 },
  cardDate: { fontSize: 12, fontWeight: "600" },
  playback: { borderWidth: 1, borderRadius: 18, padding: 12, alignItems: "center", gap: 12 },
  playButton: { width: 43, height: 43, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  playTitle: { fontSize: 14, fontWeight: "800" },
  playInfo: { fontSize: 13, marginTop: 3 },
});
