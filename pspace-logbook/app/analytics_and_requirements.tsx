import { FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Fonts } from "@/constants/theme";

// ---------------------------------------------------------------------------
// Tokens (declared first so data arrays can reference them)
// ---------------------------------------------------------------------------

const NAVY = "#001B3A";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Tab = "Overview" | "Filters" | "Requirements";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const SUMMARY_CARDS = [
  { icon: "time-outline", iconLib: "ion", label: "Total Flight Hours", value: "68:25", sub: "▲ 12% vs last year", subGreen: true },
  { icon: "weather-sunny", iconLib: "mci", label: "Day Hours", value: "52:10", sub: "76% of total", subGreen: false },
  { icon: "moon-outline", iconLib: "ion", label: "Night Hours", value: "16:15", sub: "24% of total", subGreen: false },
  { icon: "airplane-outline", iconLib: "ion", label: "Instrument Time", value: "12:30", sub: "18% of total", subGreen: false },
];

const REQUIREMENTS = [
  { icon: "time-outline", iconLib: "ion", label: "Total Flight Time", current: 82.6, total: 120, color: NAVY },
  { icon: "person-outline", iconLib: "ion", label: "Pilot-in-Command", current: 38.0, total: 60, color: "#22C55E" },
  { icon: "airplane-outline", iconLib: "ion", label: "Instrument Time", current: 12.5, total: 15, color: NAVY },
  { icon: "moon-outline", iconLib: "ion", label: "Night Time", current: 16.3, total: 25, color: NAVY },
  { icon: "navigate-outline", iconLib: "ion", label: "Cross Country", current: 4.8, total: 10, color: NAVY },
];

const FILTER_ITEMS = [
  { icon: "airplane-outline", iconLib: "ion", label: "Aircraft Type" },
  { icon: "business-outline", iconLib: "ion", label: "Manufacturer" },
  { icon: "settings-outline", iconLib: "ion", label: "Engine Type" },
  { icon: "git-compare-outline", iconLib: "ion", label: "Jet versus Non-Jet" },
  { icon: "barbell-outline", iconLib: "ion", label: "Aircraft weight category" },
  { icon: "layers-outline", iconLib: "ion", label: "Multi-engine vs other categories" },
  { icon: "calendar-outline", iconLib: "ion", label: "Date Range" },
  { icon: "sunny-outline", iconLib: "ion", label: "Day versus night flying" },
  { icon: "navigate-circle-outline", iconLib: "ion", label: "Instrument Time" },
  { icon: "moon-outline", iconLib: "ion", label: "Night Flights" },
  { icon: "person-circle-outline", iconLib: "ion", label: "Pilot-in-command / PIC under supervision" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function IconComp({ lib, name, size, color }: { lib: string; name: string; size: number; color: string }) {
  if (lib === "mci") return <MaterialCommunityIcons name={name as any} size={size} color={color} />;
  if (lib === "fa5") return <FontAwesome5 name={name as any} size={size} color={color} />;
  return <Ionicons name={name as any} size={size} color={color} />;
}

// ---------------------------------------------------------------------------
// Donut chart (pure RN — no SVG dependency)
// ---------------------------------------------------------------------------

function DonutChart({ percent }: { percent: number }) {
  const SIZE = 110;
  const STROKE = 14;
  const R = (SIZE - STROKE) / 2;
  const CIRCUMFERENCE = 2 * Math.PI * R;
  const progress = (percent / 100) * CIRCUMFERENCE;

  return (
    <View style={{ width: SIZE, height: SIZE, justifyContent: "center", alignItems: "center" }}>
      {/* background track */}
      <View
        style={{
          position: "absolute",
          width: SIZE,
          height: SIZE,
          borderRadius: SIZE / 2,
          borderWidth: STROKE,
          borderColor: "#E5E7EB",
        }}
      />
      {/* filled arc approximated with a clipped view */}
      <View
        style={{
          position: "absolute",
          width: SIZE,
          height: SIZE,
          borderRadius: SIZE / 2,
          borderWidth: STROKE,
          borderColor: "transparent",
          borderTopColor: NAVY,
          borderRightColor: percent > 25 ? NAVY : "transparent",
          borderBottomColor: percent > 50 ? NAVY : "transparent",
          borderLeftColor: percent > 75 ? NAVY : "transparent",
          transform: [{ rotate: "-90deg" }],
        }}
      />
      <Text style={{ fontFamily: Fonts.rounded, fontWeight: "800", fontSize: 22, color: NAVY }}>
        {percent}%
      </Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Progress bar row
// ---------------------------------------------------------------------------

function ProgressRow({
  iconLib,
  iconName,
  label,
  current,
  total,
  barColor,
}: {
  iconLib: string;
  iconName: string;
  label: string;
  current: number;
  total: number;
  barColor: string;
}) {
  const pct = Math.min((current / total) * 100, 100);
  return (
    <View style={styles.progressRow}>
      <View style={styles.progressLabelRow}>
        <IconComp lib={iconLib} name={iconName} size={16} color={NAVY} />
        <Text style={styles.progressLabel}>{label}</Text>
        <Text style={styles.progressValues}>
          <Text style={styles.progressCurrent}>{current}</Text>
          <Text style={styles.progressTotal}> / {total} hrs</Text>
        </Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: barColor }]} />
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Summary card
// ---------------------------------------------------------------------------

function SummaryCard({
  iconLib,
  iconName,
  label,
  value,
  sub,
  subGreen,
}: {
  iconLib: string;
  iconName: string;
  label: string;
  value: string;
  sub: string;
  subGreen: boolean;
}) {
  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryCardTop}>
        <IconComp lib={iconLib} name={iconName} size={16} color={NAVY} />
        <Text style={styles.summaryCardLabel}>{label}</Text>
      </View>
      <Text style={styles.summaryCardValue}>{value}</Text>
      <Text style={[styles.summaryCardSub, subGreen && styles.summaryCardSubGreen]}>{sub}</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  const tabs: Tab[] = ["Overview", "Filters", "Requirements"];
  return (
    <View style={styles.tabBar}>
      {tabs.map((t) => (
        <TouchableOpacity key={t} style={styles.tabItem} onPress={() => onChange(t)} activeOpacity={0.7}>
          <Text style={[styles.tabLabel, active === t && styles.tabLabelActive]}>{t}</Text>
          {active === t && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Overview tab
// ---------------------------------------------------------------------------

function OverviewTab() {
  return (
    <>
      {/* Summary section */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <TouchableOpacity style={styles.yearPill} activeOpacity={0.75}>
            <Text style={styles.yearPillText}>This Year</Text>
            <Ionicons name="chevron-down" size={13} color={NAVY} />
          </TouchableOpacity>
        </View>

        <View style={styles.summaryGrid}>
          {SUMMARY_CARDS.map((c) => (
            <SummaryCard
              key={c.label}
              iconLib={c.iconLib}
              iconName={c.icon}
              label={c.label}
              value={c.value}
              sub={c.sub}
              subGreen={c.subGreen}
            />
          ))}
        </View>
      </View>

      {/* Requirement Tracking section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Requirement Tracking</Text>

        <View style={styles.atplRow}>
          <DonutChart percent={68} />
          <View style={styles.atplInfo}>
            <Text style={styles.atplTitle}>Unrestricted ATPL Progress</Text>
            <Text style={styles.atplCompleted}>82.6 / 120 hrs completed</Text>
            <Text style={styles.atplRemaining}>Remaining: 37.4 hrs</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {REQUIREMENTS.map((r) => (
          <ProgressRow
            key={r.label}
            iconLib={r.iconLib}
            iconName={r.icon}
            label={r.label}
            current={r.current}
            total={r.total}
            barColor={r.color}
          />
        ))}
      </View>
    </>
  );
}

// ---------------------------------------------------------------------------
// Filters tab
// ---------------------------------------------------------------------------

function FiltersTab() {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Quick Filters</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.clearAll}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {FILTER_ITEMS.map((f, i) => (
        <View key={f.label}>
          <View style={styles.filterRow}>
            <View style={styles.filterLeft}>
              <IconComp lib={f.iconLib} name={f.icon} size={18} color={NAVY} />
              <Text style={styles.filterLabel}>{f.label}</Text>
            </View>
            <TouchableOpacity style={styles.filterPill} activeOpacity={0.75}>
              <Text style={styles.filterPillText}>All</Text>
              <Ionicons name="chevron-down" size={13} color={NAVY} />
            </TouchableOpacity>
          </View>
          {i < FILTER_ITEMS.length - 1 && <View style={styles.filterDivider} />}
        </View>
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Requirements tab
// ---------------------------------------------------------------------------

function RequirementsTab() {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>ATPL Requirements</Text>

      <View style={styles.atplRow}>
        <DonutChart percent={68} />
        <View style={styles.atplInfo}>
          <Text style={styles.atplTitle}>Unrestricted ATPL Progress</Text>
          <Text style={styles.atplCompleted}>82.6 / 120 hrs completed</Text>
          <Text style={styles.atplRemaining}>Remaining: 37.4 hrs</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {REQUIREMENTS.map((r) => (
        <ProgressRow
          key={r.label}
          iconLib={r.iconLib}
          iconName={r.icon}
          label={r.label}
          current={r.current}
          total={r.total}
          barColor={r.color}
        />
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function AnalyticsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <StatusBar backgroundColor={C.white} barStyle="dark-content" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={NAVY} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Analytics & Requirements</Text>
          <View style={styles.backBtn} />
        </View>

        {/* Tab bar */}
        <TabBar active={activeTab} onChange={setActiveTab} />

        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 16) + 32 }]}>
          {activeTab === "Overview" && <OverviewTab />}
          {activeTab === "Filters" && <FiltersTab />}
          {activeTab === "Requirements" && <RequirementsTab />}
        </ScrollView>
      </View>
    </>
  );
}

// ---------------------------------------------------------------------------
// Tokens
// ---------------------------------------------------------------------------

const C = {
  white: "#FFFFFF",
  background: "#F5F6F8",
  border: "#DDE1E8",
  textSecondary: "#6B7280",
  green: "#22C55E",
  cardBg: "#F0F2F5",
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.white },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.border,
    backgroundColor: C.white,
  },
  backBtn: { width: 36, height: 36, justifyContent: "center", alignItems: "flex-start" },
  headerTitle: { fontFamily: Fonts.rounded, fontWeight: "700", fontSize: 17, color: NAVY },

  /* Tab bar */
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.border,
    backgroundColor: C.white,
  },
  tabItem: { flex: 1, alignItems: "center", paddingVertical: 12 },
  tabLabel: { fontFamily: Fonts.rounded, fontSize: 13, fontWeight: "600", color: C.textSecondary },
  tabLabelActive: { color: NAVY },
  tabUnderline: { position: "absolute", bottom: 0, left: 12, right: 12, height: 2.5, borderRadius: 2, backgroundColor: NAVY },

  /* Scroll */
  scrollContent: { paddingHorizontal: 18, paddingTop: 20, backgroundColor: C.background },

  /* Section */
  section: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  sectionTitle: { fontFamily: Fonts.rounded, fontWeight: "700", fontSize: 17, color: NAVY, marginBottom: 14 },

  /* Year pill */
  yearPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1.2,
    borderColor: C.border,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  yearPillText: { fontFamily: Fonts.rounded, fontSize: 12, fontWeight: "600", color: NAVY },

  /* Summary grid */
  summaryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  summaryCard: {
    width: "47.5%",
    backgroundColor: C.cardBg,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.2,
    borderColor: C.border,
  },
  summaryCardTop: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
  summaryCardLabel: { fontFamily: Fonts.rounded, fontSize: 10, color: C.textSecondary, flex: 1 },
  summaryCardValue: { fontFamily: Fonts.rounded, fontWeight: "800", fontSize: 22, color: NAVY, marginBottom: 2 },
  summaryCardSub: { fontFamily: Fonts.rounded, fontSize: 10, color: C.textSecondary },
  summaryCardSubGreen: { color: C.green },

  /* ATPL row */
  atplRow: { flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 16 },
  atplInfo: { flex: 1 },
  atplTitle: { fontFamily: Fonts.rounded, fontWeight: "700", fontSize: 13, color: NAVY, marginBottom: 4 },
  atplCompleted: { fontFamily: Fonts.rounded, fontSize: 12, color: C.textSecondary, marginBottom: 2 },
  atplRemaining: { fontFamily: Fonts.rounded, fontSize: 12, color: C.textSecondary },

  /* Divider */
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: C.border, marginBottom: 14 },

  /* Progress rows */
  progressRow: { marginBottom: 14 },
  progressLabelRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  progressLabel: { fontFamily: Fonts.rounded, fontSize: 13, color: NAVY, flex: 1 },
  progressValues: {},
  progressCurrent: { fontFamily: Fonts.rounded, fontWeight: "700", fontSize: 12, color: NAVY },
  progressTotal: { fontFamily: Fonts.rounded, fontSize: 12, color: C.textSecondary },
  progressTrack: { height: 7, borderRadius: 4, backgroundColor: C.border },
  progressFill: { height: 7, borderRadius: 4 },

  /* Filters */
  clearAll: { fontFamily: Fonts.rounded, fontSize: 13, fontWeight: "600", color: C.textSecondary },
  filterRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12 },
  filterLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  filterLabel: { fontFamily: Fonts.rounded, fontSize: 13, color: NAVY, flex: 1 },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1.2,
    borderColor: C.border,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  filterPillText: { fontFamily: Fonts.rounded, fontSize: 12, fontWeight: "600", color: NAVY },
  filterDivider: { height: StyleSheet.hairlineWidth, backgroundColor: C.border },
});