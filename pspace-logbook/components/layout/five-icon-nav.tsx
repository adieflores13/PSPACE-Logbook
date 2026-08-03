import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ActiveTab = "dashboard" | "aircrafts" | "flights" | "logbook" | "profile";

type Props = {
  active: ActiveTab;
  onBeforeNavigate?: () => void;
};

const tabs: { key: ActiveTab; label: string; icon: keyof typeof Ionicons.glyphMap; route: string }[] = [
  { key: "dashboard", label: "Dashboard", icon: "airplane-outline", route: "/dashboardscreen/dashboard" },
  { key: "aircrafts", label: "Aircrafts", icon: "calendar-outline", route: "/aircrafts" },
  { key: "flights", label: "Flights", icon: "paper-plane-outline", route: "/flightscreen/flight_list" },
  { key: "logbook", label: "Logbook", icon: "reader-outline", route: "/logbook" },
  { key: "profile", label: "Profile", icon: "person-outline", route: "/profile" },
];

export default function FiveIconNav({ active, onBeforeNavigate }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const navigate = (route: string, tab: ActiveTab) => {
    onBeforeNavigate?.();
    if (tab === active) {
      return;
    }
    router.push(route as never);
  };

  return (
    <View style={[styles.nav, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.item}
            activeOpacity={0.75}
            onPress={() => navigate(tab.route, tab.key)}
          >
            <Ionicons
              name={isActive ? tab.icon.replace("-outline", "") as keyof typeof Ionicons.glyphMap : tab.icon}
              size={23}
              color={isActive ? NAVY : MUTED}
            />
            <Text style={[styles.label, isActive && styles.activeLabel]} numberOfLines={1}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const NAVY = "#032451";
const MUTED = "#8A8F9B";

const styles = StyleSheet.create({
  nav: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E8EAF0",
    paddingTop: 10,
  },
  item: { flex: 1, alignItems: "center", gap: 3 },
  label: { fontSize: 9, color: MUTED, fontWeight: "500" },
  activeLabel: { color: NAVY, fontWeight: "800" },
});
