// app/flightscreen/index.tsx
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ScreenLayout from "@/components/layout/screen-layout";
import { Fonts } from "@/constants/theme";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const HERO_HEIGHT = Math.round(SCREEN_HEIGHT * 0.3);

const COUNTRY1 = require("../../assets/images/country1.png");
const COUNTRY2 = require("../../assets/images/country2.png");
const COUNTRY3 = require("../../assets/images/country3.png");

// ─────────────────────────────────────────────────────────────────────────────
// SAMPLE DATA
// ─────────────────────────────────────────────────────────────────────────────
type FlightType = "Commercial" | "Private" | "Cargo" | "Charter";

interface Flight {
  id: string;
  date: string;
  type: FlightType;
  totalTime: number;        // hours
  registration: string;
  departure: string;        // ICAO
  arrival: string;          // ICAO
  notes?: string;
}

const SAMPLE_FLIGHTS: Flight[] = [
  {
    id: "1",
    date: "Apr 28, 2026",
    type: "Commercial",
    totalTime: 3.5,
    registration: "RP-C3341",
    departure: "RPLL",
    arrival: "RPVM",
    notes: "Smooth flight, good visibility throughout.",
  },
  {
    id: "2",
    date: "Apr 25, 2026",
    type: "Private",
    totalTime: 1.2,
    registration: "RP-C7812",
    departure: "RPVM",
    arrival: "RPVB",
    notes: "Light turbulence over mountains.",
  },
  {
    id: "3",
    date: "Apr 22, 2026",
    type: "Charter",
    totalTime: 5.8,
    registration: "RP-C1104",
    departure: "RPLL",
    arrival: "RPMZ",
  },
  {
    id: "4",
    date: "Apr 18, 2026",
    type: "Cargo",
    totalTime: 2.1,
    registration: "RP-C5506",
    departure: "RPMZ",
    arrival: "RPLL",
    notes: "Night flight, cargo delivery.",
  },
  {
    id: "5",
    date: "Apr 14, 2026",
    type: "Commercial",
    totalTime: 4.4,
    registration: "RP-C3341",
    departure: "RPLL",
    arrival: "RPMD",
  },
  {
    id: "6",
    date: "Apr 10, 2026",
    type: "Private",
    totalTime: 0.9,
    registration: "RP-C9901",
    departure: "RPVB",
    arrival: "RPVC",
    notes: "Training flight.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const TYPE_META: Record<FlightType, { color: string; bg: string; icon: string }> = {
  Commercial: { color: "#1A6FD4", bg: "#E8F0FD", icon: "airplane" },
  Private:    { color: "#2E9E6B", bg: "#E4F7EE", icon: "airplane-outline" },
  Cargo:      { color: "#C47B12", bg: "#FDF3E0", icon: "cube-outline" },
  Charter:    { color: "#8B44CC", bg: "#F2E8FC", icon: "star-outline" },
};

function totalHours(flights: Flight[]) {
  return flights.reduce((sum, f) => sum + f.totalTime, 0).toFixed(1);
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function WorldMapBackdrop() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Image fadeDuration={0} resizeMode="contain" source={COUNTRY1}
        style={[styles.countryBase, styles.countryAmericas]} />
      <Image fadeDuration={0} resizeMode="contain" source={COUNTRY2}
        style={[styles.countryBase, styles.countryEuraf]} />
      <Image fadeDuration={0} resizeMode="contain" source={COUNTRY3}
        style={[styles.countryBase, styles.countryAustralia]} />
    </View>
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statChip}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

type FilterType = "All" | FlightType;
const FILTERS: FilterType[] = ["All", "Commercial", "Private", "Cargo", "Charter"];

function FilterPill({ label, active, onPress }: { label: FilterType; active: boolean; onPress: () => void }) {
  const meta = label !== "All" ? TYPE_META[label] : null;
  return (
    <TouchableOpacity
      style={[
        styles.pill,
        active && { backgroundColor: meta ? meta.color : COLORS.navy },
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Text style={[styles.pillText, active && styles.pillTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function FlightCard({ flight, onPress }: { flight: Flight; onPress: () => void }) {
  const meta = TYPE_META[flight.type];
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.82}>
      {/* Left accent bar */}
      <View style={[styles.cardAccent, { backgroundColor: meta.color }]} />

      <View style={styles.cardInner}>
        {/* Top row: route + date */}
        <View style={styles.cardTop}>
          <View style={styles.routeRow}>
            <Text style={styles.icao}>{flight.departure}</Text>
            <View style={styles.routeLineWrap}>
              <View style={styles.routeDot} />
              <View style={styles.routeLine} />
              <Ionicons name="airplane" size={14} color={COLORS.amber} style={styles.routePlane} />
              <View style={styles.routeLine} />
              <View style={styles.routeDot} />
            </View>
            <Text style={styles.icao}>{flight.arrival}</Text>
          </View>
          <Text style={styles.cardDate}>{flight.date}</Text>
        </View>

        {/* Bottom row: reg + type badge + hours */}
        <View style={styles.cardBottom}>
          <View style={styles.regWrap}>
            <Ionicons name="newspaper-outline" size={12} color={COLORS.muted} />
            <Text style={styles.regText}>{flight.registration}</Text>
          </View>

          <View style={[styles.typeBadge, { backgroundColor: meta.bg }]}>
            <Ionicons name={meta.icon as any} size={11} color={meta.color} />
            <Text style={[styles.typeText, { color: meta.color }]}>{flight.type}</Text>
          </View>

          <View style={styles.hoursWrap}>
            <Ionicons name="time-outline" size={12} color={COLORS.muted} />
            <Text style={styles.hoursText}>{flight.totalTime.toFixed(1)} hrs</Text>
          </View>
        </View>

        {/* Notes (optional) */}
        {flight.notes ? (
          <Text style={styles.notesText} numberOfLines={1}>{flight.notes}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────────────────────────────────────
export default function FlightListScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");

  const filtered = activeFilter === "All"
    ? SAMPLE_FLIGHTS
    : SAMPLE_FLIGHTS.filter(f => f.type === activeFilter);

  return (
    <ScreenLayout>
      <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />

      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* ── HERO ── */}
        <View style={[styles.hero, { height: HERO_HEIGHT + insets.top, paddingTop: insets.top + 10 }]}>
          <WorldMapBackdrop />

          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={COLORS.navy} />
          </TouchableOpacity>

          <Text style={styles.heroTitle}>Flights</Text>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <StatChip label="Total Flights" value={String(SAMPLE_FLIGHTS.length)} />
            <View style={styles.statDivider} />
            <StatChip label="Total Hours"   value={totalHours(SAMPLE_FLIGHTS)} />
            <View style={styles.statDivider} />
            <StatChip label="This Month"    value="6" />
          </View>
        </View>

        {/* ── BODY ── */}
        <View style={styles.body}>

          {/* Filter pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pillsRow}
            style={styles.pillsScroll}
          >
            {FILTERS.map(f => (
              <FilterPill
                key={f}
                label={f}
                active={activeFilter === f}
                onPress={() => setActiveFilter(f)}
              />
            ))}
          </ScrollView>

          {/* Results count */}
          <Text style={styles.resultsCount}>
            {filtered.length} {filtered.length === 1 ? "flight" : "flights"}
          </Text>

          {/* Flight cards */}
          {filtered.length === 0 ? (
            <View style={styles.emptyWrap}>
              <MaterialCommunityIcons name="airplane-off" size={44} color={COLORS.muted} />
              <Text style={styles.emptyText}>No flights for this filter</Text>
            </View>
          ) : (
            filtered.map(flight => (
              <FlightCard
                key={flight.id}
                flight={flight}
                onPress={() => {
                  // navigate to detail when you build it:
                  // router.push(`/flightscreen/${flight.id}`)
                }}
              />
            ))
          )}

          {/* Add button */}
          <TouchableOpacity
            style={styles.addBtn}
            activeOpacity={0.88}
            onPress={() => router.push("/flightscreen/add_flight")}
          >
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.addBtnText}>Add Flight</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COLORS
// ─────────────────────────────────────────────────────────────────────────────
const COLORS = {
  amber:   "#F5A623",
  navy:    "#1A2340",
  white:   "#FFFFFF",
  offWhite:"#F4F6FB",
  muted:   "#9AA3B8",
  border:  "#E4E8F4",
  shadow:  "#1A2340",
};

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // ── Hero ──
  hero: {
    backgroundColor: "#FFBB57",
    paddingHorizontal: 24,
    overflow: "hidden",
    justifyContent: "flex-end",
    paddingBottom: 28,
  },
  countryBase:      { position: "absolute", opacity: 0.96 },
  countryAmericas:  { left: -56, top: -2,  width: 194, height: 356, opacity: 0.96 },
  countryEuraf:     { right: -54, top: -8, width: 372, height: 264, opacity: 0.94 },
  countryAustralia: { right: 24, top: 206, width: 60,  height: 50,  opacity: 0.96 },

  backBtn: { position: "absolute", top: 0, left: 24, padding: 6, zIndex: 10 },

  heroTitle: {
    color: COLORS.navy,
    fontSize: 40,
    fontWeight: "800",
    fontFamily: Fonts.rounded,
    textAlign: "center",
    marginBottom: 20,
  },

  statsRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.55)",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "space-around",
  },
  statChip:  { alignItems: "center", flex: 1 },
  statValue: { fontSize: 22, fontWeight: "800", color: COLORS.navy, fontFamily: Fonts.rounded },
  statLabel: { fontSize: 11, color: COLORS.navy, opacity: 0.65, fontWeight: "500", marginTop: 2 },
  statDivider: { width: 1, height: 32, backgroundColor: "rgba(26,35,64,0.15)" },

  // ── Body ──
  body: {
    backgroundColor: COLORS.offWhite,
    paddingTop: 20,
    paddingHorizontal: 16,
  },

  // ── Filter pills ──
  pillsScroll: { marginBottom: 4 },
  pillsRow:    { gap: 8, paddingRight: 8 },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pillText:       { fontSize: 13, fontWeight: "600", color: COLORS.muted },
  pillTextActive: { color: COLORS.white },

  resultsCount: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: "500",
    marginTop: 14,
    marginBottom: 10,
    marginLeft: 2,
  },

  // ── Flight card ──
  card: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 18,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardAccent: { width: 4, borderRadius: 0 },
  cardInner:  { flex: 1, paddingHorizontal: 14, paddingVertical: 12 },

  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  routeRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  icao:     { fontSize: 18, fontWeight: "800", color: COLORS.navy, fontFamily: Fonts.rounded },
  routeLineWrap: { flexDirection: "row", alignItems: "center" },
  routeDot:  { width: 5, height: 5, borderRadius: 3, backgroundColor: COLORS.muted },
  routeLine: { width: 18, height: 1.5, backgroundColor: COLORS.border },
  routePlane:{ marginHorizontal: 2 },
  cardDate:  { fontSize: 12, color: COLORS.muted, fontWeight: "500" },

  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  regWrap:  { flexDirection: "row", alignItems: "center", gap: 4 },
  regText:  { fontSize: 12, color: COLORS.muted, fontWeight: "500" },
  typeBadge:{
    flexDirection: "row", alignItems: "center", gap: 4,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8,
  },
  typeText: { fontSize: 11, fontWeight: "700" },
  hoursWrap:{ flexDirection: "row", alignItems: "center", gap: 4, marginLeft: "auto" },
  hoursText:{ fontSize: 12, color: COLORS.muted, fontWeight: "600" },
  notesText:{
    fontSize: 11, color: COLORS.muted, marginTop: 8,
    fontStyle: "italic", paddingLeft: 2,
  },

  // ── Empty ──
  emptyWrap: { alignItems: "center", paddingVertical: 48, gap: 10 },
  emptyText: { fontSize: 15, color: COLORS.muted, fontWeight: "500" },

  // ── Add button ──
  addBtn: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.navy,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 28,
    marginTop: 8,
    shadowColor: COLORS.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 6,
  },
  addBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
});