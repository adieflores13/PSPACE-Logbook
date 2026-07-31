// C:\nginx\html\pspace-logbook\pspace-logbook\components\layout\sidebar.tsx
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const NAVY   = "#032451";
const AMBER  = "#FFBB57";
const WHITE  = "#FFFFFF";
const BG     = "#F0F2F5";
const MUTED  = "#8A8F9B";
const BORDER = "#E8EAF0";
const DISABLED = "#C3C7D1";

const CADET_NAME = "Cadet Name";
const CADET_META = "Student Pilot · CD-10284";
const CADET_ACADEMY = "Centennial Flight Academy";

type IconLib = "ion" | "fa5" | "mci";

type SidebarItem = {
  label: string;
  route?: string;
  iconLib: IconLib;
  icon: string;
  activeIcon?: string;
};

type SidebarSection = {
  title: string;
  items: SidebarItem[];
};

const SECTIONS: SidebarSection[] = [
  {
    title: "MAIN",
    items: [
      { label: "Dashboard", route: "/dashboardscreen/dashboard", iconLib: "ion", icon: "stats-chart-outline", activeIcon: "stats-chart" },
      { label: "Flights", route: "/flightscreen/flight_list", iconLib: "ion", icon: "paper-plane-outline", activeIcon: "paper-plane" },
      { label: "Aircraft", route: "/aircraftscreen/aircraft_list", iconLib: "ion", icon: "airplane-outline", activeIcon: "airplane" },
      { label: "Logbook", route: "/logbook", iconLib: "ion", icon: "clipboard-outline", activeIcon: "clipboard" },
      { label: "Analytics", route: "/analytics_and_requirements", iconLib: "ion", icon: "analytics-outline", activeIcon: "analytics" },
    ],
  },
  {
    title: "TRAINING",
    items: [
      { label: "Ratings & Requirements", route: "/analytics_and_requirements", iconLib: "ion", icon: "trending-up-outline", activeIcon: "trending-up" },
      { label: "Currency Tracker", iconLib: "ion", icon: "time-outline" },
      { label: "Endorsements", iconLib: "ion", icon: "document-text-outline" },
      { label: "Training Schedule", iconLib: "ion", icon: "calendar-outline" },
    ],
  },
  {
    title: "ACCOUNT",
    items: [
      { label: "Notifications", iconLib: "ion", icon: "notifications-outline" },
      { label: "Profile", route: "/profile", iconLib: "ion", icon: "person-outline", activeIcon: "person" },
      { label: "Settings", iconLib: "ion", icon: "settings-outline" },
    ],
  },
];

function ItemIcon({ lib, name, size, color }: { lib: IconLib; name: string; size: number; color: string }) {
  if (lib === "mci") return <MaterialCommunityIcons name={name as any} size={size} color={color} />;
  if (lib === "fa5") return <FontAwesome5 name={name as any} size={size} color={color} />;
  return <Ionicons name={name as any} size={size} color={color} />;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DRAWER_WIDTH = Math.min(280, SCREEN_WIDTH * 0.8);

export default function Sidebar({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1, duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0, duration: 280,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0, duration: 180,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH, duration: 220,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  function handleItemPress(item: SidebarItem) {
    if (!item.route) return;
    onClose();
    if (pathname !== item.route) {
      router.push(item.route as any);
    }
  }

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.drawer,
          {
            width: DRAWER_WIDTH,
            paddingTop: insets.top + 16,
            paddingBottom: insets.bottom + 16,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* ── Brand header ── */}
          <View style={styles.brandRow}>
            <View style={styles.brandBadge}>
              <MaterialCommunityIcons name="airplane" size={20} color={WHITE} />
            </View>
            <Text style={styles.brandText}>PILOT LOGBOOK</Text>
          </View>

          {/* ── Profile card ── */}
          <View style={styles.profileCard}>
            <View style={styles.avatarCircle}>
              <FontAwesome5 name="user" size={18} color={NAVY} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.profileName} numberOfLines={1}>{CADET_NAME}</Text>
              <Text style={styles.profileMeta} numberOfLines={1}>{CADET_META}</Text>
              <Text style={styles.profileMeta} numberOfLines={1}>{CADET_ACADEMY}</Text>
            </View>
          </View>

          {/* ── Sections ── */}
          {SECTIONS.map((section) => (
            <View key={section.title} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.items.map((item) => {
                const enabled = !!item.route;
                const active = enabled && (pathname === item.route || pathname?.startsWith(item.route + "/"));
                const iconName = active && item.activeIcon ? item.activeIcon : item.icon;
                const color = active ? WHITE : enabled ? NAVY : DISABLED;

                return (
                  <TouchableOpacity
                    key={item.label}
                    style={[styles.item, active && styles.itemActive]}
                    activeOpacity={enabled ? 0.7 : 1}
                    disabled={!enabled}
                    onPress={() => handleItemPress(item)}
                  >
                    <ItemIcon lib={item.iconLib} name={iconName} size={19} color={color} />
                    <Text
                      style={[
                        styles.itemLabel,
                        active && styles.itemLabelActive,
                        !enabled && styles.itemLabelDisabled,
                      ]}
                      numberOfLines={1}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  drawer: {
    position: "absolute",
    top: 0, bottom: 0, left: 0,
    backgroundColor: WHITE,
    paddingHorizontal: 18,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 20,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 18,
  },
  brandBadge: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: NAVY,
    alignItems: "center", justifyContent: "center",
  },
  brandText: { fontSize: 14, fontWeight: "900", color: NAVY, letterSpacing: 1.5 },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: BG,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 12,
    marginBottom: 20,
  },
  avatarCircle: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: WHITE,
    borderWidth: 2, borderColor: BORDER,
    alignItems: "center", justifyContent: "center",
  },
  profileName: { fontSize: 14, fontWeight: "800", color: NAVY, marginBottom: 2 },
  profileMeta: { fontSize: 10.5, color: MUTED },

  section: { marginBottom: 18 },
  sectionTitle: {
    fontSize: 10.5,
    fontWeight: "800",
    color: MUTED,
    letterSpacing: 1,
    marginBottom: 8,
    paddingHorizontal: 4,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 2,
  },
  itemActive: { backgroundColor: NAVY },
  itemLabel: { fontSize: 13.5, fontWeight: "600", color: NAVY },
  itemLabelActive: { color: WHITE, fontWeight: "800" },
  itemLabelDisabled: { color: DISABLED },
});
