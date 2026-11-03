import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { palette, type } from "@/constants/ui";

export type ActiveTab = "dashboard" | "aircrafts" | "flights" | "logbook" | "profile";

type Props = {
  active: ActiveTab;
  onBeforeNavigate?: () => void;
};

const tabs: { key: ActiveTab; label: string; icon: keyof typeof Ionicons.glyphMap; route: string }[] = [
  { key: "dashboard", label: "Dashboard", icon: "airplane-outline", route: "/dashboardscreen/dashboard" },
  { key: "aircrafts", label: "Aircrafts", icon: "calendar-outline", route: "/aircrafts" },
  { key: "flights", label: "Flights", icon: "paper-plane-outline", route: "/flights" },
  { key: "logbook", label: "Logbook", icon: "reader-outline", route: "/logbook" },
  { key: "profile", label: "Profile", icon: "person-outline", route: "/profile" },
];

export default function FiveIconNav({ active, onBeforeNavigate }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  const navigate = (route: string) => {
    onBeforeNavigate?.();
    if (pathname === route) {
      return;
    }
    router.navigate(route as never);
  };

  return (
    <View testID="main-navbar" style={[styles.nav, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        return (
          <TouchableOpacity
            accessibilityRole="tab"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: isActive }}
            key={tab.key}
            style={styles.item}
            activeOpacity={0.75}
            onPress={() => navigate(tab.route)}
          >
            <Ionicons
              name={isActive ? tab.icon.replace("-outline", "") as keyof typeof Ionicons.glyphMap : tab.icon}
              size={26}
              color={isActive ? NAVY : MUTED}
            />
            <Text style={[styles.label, isActive && styles.activeLabel]} numberOfLines={2}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const NAVY = palette.navy;
const MUTED = palette.navy;

const styles = StyleSheet.create({
  nav: {
    flexDirection: "row",
    backgroundColor: palette.surface,
    borderTopWidth: 0,
    paddingTop: 10,
    flexShrink: 0,
    zIndex: 1,
    elevation: 3,
  },
  item: { flex: 1, minWidth: 0, minHeight: 48, paddingHorizontal: 2, alignItems: "center", justifyContent: "center", gap: 4 },
  label: { ...type.caption, fontSize: 9, color: MUTED, textAlign: "center", maxWidth: "100%" },
  activeLabel: { color: NAVY, fontWeight: "800" },
});
