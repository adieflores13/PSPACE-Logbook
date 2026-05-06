// C:\nginx\html\pspace-logbook\pspace-logbook\components\layout\screen-layout.tsx
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type NavItem = {
  label: string;
  route: string;
  matchPaths?: string[];
  icon: (active: boolean) => React.ReactNode;
};

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    route: "/dashboardscreen/dashboard",
    matchPaths: ["/dashboardscreen/dashboard"],
    icon: (active) => (
      <Ionicons
        name={active ? "airplane" : "airplane-outline"}
        size={22}
        color={active ? COLORS.amber : COLORS.inactive}
      />
    ),
  },
  {
    label: "Aircrafts",
    route: "/aircraftscreen/aircraft_list",                                    
    matchPaths: ["/aircraftscreen/aircraft_list", "/aircraftscreen/add_aircraft"],  
    icon: (active) => (
      <MaterialCommunityIcons
        name={active ? "book-open" : "book-open-outline"}
        size={22}
        color={active ? COLORS.amber : COLORS.inactive}
      />
    ),
  },
  {
    label: "Flights",
    route: "/flightscreen/flight_list",
    matchPaths: ["/flightscreen/flight_list", "/flightscreen/add_flight"],
    icon: (active) => (
      <Ionicons
        name={active ? "paper-plane" : "paper-plane-outline"}
        size={22}
        color={active ? COLORS.amber : COLORS.inactive}
      />
    ),
  },
  {
    label: "Logbook",
    route: "/logbook",
    matchPaths: ["/logbook"],
    icon: (active) => (
      <MaterialCommunityIcons
        name={active ? "clipboard-text" : "clipboard-text-outline"}
        size={22}
        color={active ? COLORS.amber : COLORS.inactive}
      />
    ),
  },

  {
    label: "Profile",
    route: "/profile",
    matchPaths: ["/profile"],
    icon: (active) => (
      <Ionicons
        name={active ? "person" : "person-outline"}
        size={22}
        color={active ? COLORS.amber : COLORS.inactive}
      />
    ),
  },
];

function FooterNav() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const isActive = (item: NavItem) => {
    if (item.matchPaths) {
      return item.matchPaths.some(
        (p) => pathname === p || pathname.startsWith(p + "/")
      );
    }
    return pathname === item.route;
  };

  return (
    <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {NAV_ITEMS.map((item) => {
        const active = isActive(item);
        return (
          <TouchableOpacity
            key={item.route}
            style={styles.navItem}
            activeOpacity={0.7}
            onPress={() => router.push(item.route as any)}
          >
            <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
              {item.icon(active)}
            </View>
            <Text style={[styles.navLabel, active && styles.navLabelActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

interface ScreenLayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

export default function ScreenLayout({ children, hideFooter = false }: ScreenLayoutProps) {
  return (
    <View style={styles.root}>
      <View style={styles.content}>{children}</View>
      {!hideFooter && <FooterNav />}
    </View>
  );
}

const COLORS = {
  amber:    "#F5A623",
  navy:     "#1A2340",
  white:    "#FFFFFF",
  inactive: "#9AA3B8",
  border:   "#E8ECF4",
  shadow:   "#1A2340",
};

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: "#F7F8FC" },
  content: { flex: 1 },
  footer: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
    paddingHorizontal: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 12,
  },
  navItem:        { flex: 1, alignItems: "center", gap: 3 },
  iconWrap:       { width: 44, height: 34, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  iconWrapActive: { backgroundColor: "#FFF4E0" },
  navLabel:       { fontSize: 10, fontWeight: "500", color: COLORS.inactive, letterSpacing: 0.2 },
  navLabelActive: { color: COLORS.amber, fontWeight: "700" },
});
