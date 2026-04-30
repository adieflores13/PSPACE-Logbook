// C:\nginx\html\pspace-logbook\pspace-logbook\app\dashboardscreen\dashboard.tsx
import React, { useRef, useEffect } from "react";
import {
  Animated,
  Easing,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import ScreenLayout from "@/components/layout/screen-layout";

// ─── Mock data — swap with real API later ────────────────────────────────────
const CADET_NAME      = "Juan dela Cruz";
const NOTIFICATION_COUNT = 3;

const STATS = {
  timeFilter:    "ALL",
  aircraftFilter:"ALL",
  totalHours:    "00:00",
  takeoffs:      4,
  landings:      5,
  nightHours:    "00:00",
  ifrHours:      "00:00",
  picHours:      "00:00",
};
// ─────────────────────────────────────────────────────────────────────────────

const NAVY  = "#1A2340";
const AMBER = "#F5A623";
const WHITE = "#FFFFFF";
const BG    = "#F7F8FC";
const CARD  = "#FFFFFF";
const MUTED = "#9AA3B8";
const BORDER= "#E8ECF4";

// Animated stat card
function StatCard({
  label,
  value,
  delay = 0,
  flex = 1,
}: {
  label: string;
  value: string | number;
  delay?: number;
  flex?: number;
}) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 400,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.statCard,
        { flex },
        {
          opacity: anim,
          transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
        },
      ]}
    >
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </Animated.View>
  );
}

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Header fade-in
  const headerAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <ScreenLayout>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 8 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Top Logo Bar ── */}
        <View className="" style={styles.logoBar}>
          <Image
            source={require("@/assets/images/logo-with-map.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* ── Welcome Banner ── */}
        <Animated.View
          style={[
            styles.banner,
            {
              opacity: headerAnim,
              transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-10, 0] }) }],
            },
          ]}
        >
          {/* Avatar */}
          <View style={styles.avatarWrap}>
            <FontAwesome5 name="user-astronaut" size={22} color={AMBER} />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.welcomeText}>Welcome,</Text>
            <Text style={styles.cadetName}>{CADET_NAME}!</Text>
          </View>

          {/* Notification bell */}
          <TouchableOpacity style={styles.bellWrap} activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={22} color={WHITE} />
            {NOTIFICATION_COUNT > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{NOTIFICATION_COUNT}</Text>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* ── Dashboard Title ── */}
        <Animated.View
          style={[
            styles.titleBlock,
            {
              opacity: headerAnim,
              transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }],
            },
          ]}
        >
          <Text style={styles.dashTitle}>DASHBOARD</Text>
          <Text style={styles.dashSubtitle}>
            View schedules, aircraft status, and live aviation data at a glance.
          </Text>
        </Animated.View>

        {/* ── Filter Row: Time | Clock Icon | Aircraft ── */}
        <View style={styles.filterCard}>
          <View style={styles.filterSide}>
            <Text style={styles.filterLabel}>Time:</Text>
            <Text style={styles.filterValue}>{STATS.timeFilter}</Text>
          </View>

          <View style={styles.filterDivider} />

          <View style={styles.clockCircle}>
            <Ionicons name="time-outline" size={32} color={NAVY} />
          </View>

          <View style={styles.filterDivider} />

          <View style={styles.filterSide}>
            <Text style={styles.filterLabel}>Aircraft:</Text>
            <Text style={styles.filterValue}>{STATS.aircraftFilter}</Text>
          </View>
        </View>

        {/* ── Stats Grid ── */}

        {/* Row 1: Total Hours | Takeoffs */}
        <View style={styles.statsRow}>
          <StatCard label="Total Hours:" value={STATS.totalHours} delay={80} />
          <StatCard label="Takeoffs:" value={STATS.takeoffs} delay={130} />
        </View>

        {/* Row 2: Landings | Night Hours */}
        <View style={styles.statsRow}>
          <StatCard label="Landings:" value={STATS.landings} delay={180} />
          <StatCard label="Night hours:" value={STATS.nightHours} delay={230} />
        </View>

        {/* Row 3: IFR Hours | PIC Hours */}
        <View style={styles.statsRow}>
          <StatCard label="IFR Hours:" value={STATS.ifrHours} delay={280} />
          <StatCard label="PIC hours:" value={STATS.picHours} delay={330} />
        </View>

        {/* ── Action Buttons ── */}
        <View style={styles.actionRow}>
          {/* <TouchableOpacity
            style={styles.actionBtn}
            activeOpacity={0.8}
            onPress={() => router.push("/logbook")}
          >
            <Text style={styles.actionBtnText}>View and Manage Logbook</Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={styles.actionBtn}
            activeOpacity={0.8}
            onPress={() => router.push("/flightscreen/add_flight")}
          >
            <Text style={styles.actionBtnText}>Add Logbook Entry</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            activeOpacity={0.8}
            onPress={() => router.push("/aircraftscreen/aircraft_list")}
          >
            <Text style={styles.actionBtnText}>View and Manage Aircraft</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  scroll:        { flex: 1, backgroundColor: BG },
  scrollContent: { paddingHorizontal: 0, paddingBottom: 12 },

  // ── Logo bar ────────────────────────────────────────────────────────────────
  logoBar: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 10,
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },

  logoImage: {
    width: 120,
    height: 60,
  },

  // ── Banner ───────────────────────────────────────────────────────────────────
  banner: {
    backgroundColor: NAVY,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
    gap: 12,
  },

  avatarWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 2,
    borderColor: AMBER,
    alignItems: "center",
    justifyContent: "center",
  },

  welcomeText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "500",
  },

  cadetName: {
    fontSize: 16,
    fontWeight: "800",
    color: WHITE,
    letterSpacing: 0.3,
  },

  bellWrap: { position: "relative", padding: 4 },

  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: AMBER,
    alignItems: "center",
    justifyContent: "center",
  },

  badgeText: { fontSize: 9, fontWeight: "800", color: WHITE },

  // ── Title block ──────────────────────────────────────────────────────────────
  titleBlock: {
    backgroundColor: NAVY,
    paddingHorizontal: 18,
    paddingBottom: 22,
    alignItems: "center",
  },

  dashTitle: {
    fontSize: 30,
    fontWeight: "900",
    color: AMBER,
    letterSpacing: 3,
    textAlign: "center",
  },

  dashSubtitle: {
    fontSize: 11,
    color: "rgba(255,255,255,0.55)",
    textAlign: "center",
    marginTop: 4,
    letterSpacing: 0.2,
  },

  // ── Filter card ──────────────────────────────────────────────────────────────
  filterCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CARD,
    marginHorizontal: 16,
    marginTop: 18,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: BORDER,
  },

  filterSide: {
    flex: 1,
    alignItems: "center",
  },

  filterLabel: {
    fontSize: 11,
    color: MUTED,
    fontWeight: "500",
    letterSpacing: 0.3,
  },

  filterValue: {
    fontSize: 22,
    fontWeight: "900",
    color: NAVY,
    marginTop: 2,
    letterSpacing: 1,
  },

  filterDivider: {
    width: 1,
    height: 40,
    backgroundColor: BORDER,
    marginHorizontal: 10,
  },

  clockCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: NAVY,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: WHITE,
  },

  // ── Stats ────────────────────────────────────────────────────────────────────
  statsRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 12,
    gap: 12,
  },

  statCard: {
    backgroundColor: CARD,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: BORDER,
  },

  statLabel: {
    fontSize: 11,
    color: MUTED,
    fontWeight: "500",
    letterSpacing: 0.3,
  },

  statValue: {
    fontSize: 24,
    fontWeight: "900",
    color: NAVY,
    marginTop: 3,
    letterSpacing: 0.5,
  },

  // ── Action buttons ───────────────────────────────────────────────────────────
  actionRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 18,
    gap: 8,
    flexWrap: "nowrap",
  },

  actionBtn: {
    flex: 1,
    backgroundColor: NAVY,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  actionBtnText: {
    fontSize: 9.5,
    fontWeight: "700",
    color: WHITE,
    textAlign: "center",
    letterSpacing: 0.2,
    lineHeight: 13,
  },
});