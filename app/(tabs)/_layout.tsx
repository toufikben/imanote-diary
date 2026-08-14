import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HapticTab } from "@/components/haptic-tab";
import { wellbeingCopy } from "@/lib/imanote/copy";
import { useDiary } from "@/lib/imanote/diary-context";

export default function TabLayout() {
  const { copy, palette, settings } = useDiary();
  const insets = useSafeAreaInsets();
  const bottom = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  const wellbeing = wellbeingCopy(settings.language); return <Tabs screenOptions={{ headerShown: false, tabBarButton: HapticTab, tabBarActiveTintColor: palette.primary, tabBarInactiveTintColor: palette.muted, tabBarStyle: { backgroundColor: palette.surface, borderTopColor: palette.border, height: 56 + bottom, paddingBottom: bottom, paddingTop: 7 } }}><Tabs.Screen name="index" options={{ title: copy.diary, tabBarIcon: ({ color }) => <MaterialIcons name="menu-book" size={25} color={color} /> }} /><Tabs.Screen name="memories" options={{ title: copy.memories, tabBarIcon: ({ color }) => <MaterialIcons name="format-list-bulleted" size={25} color={color} /> }} /><Tabs.Screen name="insights" options={{ title: wellbeing.tab, tabBarIcon: ({ color }) => <MaterialIcons name="auto-graph" size={24} color={color} /> }} /><Tabs.Screen name="settings" options={{ title: copy.settings, tabBarIcon: ({ color }) => <MaterialIcons name="settings" size={24} color={color} /> }} /></Tabs>;
}
