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
import Colors from "@/constants/colors";   // ← shared palette
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
  day: string;
  month: string;
  year: string;
  type: FlightType;
  totalTime: number;
  registration: string;
  departure: string;
  arrival: string;
  notes?: string;
}

const SAMPLE_FLIGHTS: Flight[] = [
  {
    id: "1",
    date: "Apr 28, 2026",
    day: "28",
    month: "Apr",
    year: "2026",
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
    day: "25",
    month: "Apr",
    year: "2026",
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
    day: "22",
    month: "Apr",
    year: "2026",
    type: "Charter",
    totalTime: 5.8,
    registration: "RP-C1104",
    departure: "RPLL",
    arrival: "RPMZ",
  },
  {
    id: "4",
    date: "Apr 18, 2026",
    day: "18",
    month: "Apr",
    year: "2026",
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
    day: "14",
    month: "Apr",
    year: "2026",
    type: "Commercial",
    totalTime: 4.4,
    registration: "RP-C3341",
    departure: "RPLL",
    arrival: "RPMD",
  },
  {
    id: "6",
    date: "Apr 10, 2026",
    day: "10",
    month: "Apr",
    year: "2026",
    type: "Private",
    totalTime: 0.9,
    registration: "RP-C9901",
    departure: "RPVB",
    arrival: "RPVC",
    notes: "Training flight.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// TYPE META
// ─────────────────────────────────────────────────────────────────────────────
const TYPE_META: Record<FlightType, { accent: string; bg: string }> = {
  Commercial: { accent: Colors.commercialAccent, bg: Colors.commercialBg },
  Private:    { accent: Colors.privateAccent,    bg: Colors.privateBg    },
  Cargo:      { accent: Colors.cargoAccent,      bg: Colors.cargoBg      },
  Charter:    { accent: "#9B59D9",               bg: "#EFE4FA"           },
};

function totalHours(flights: Flight[]) {
  return flights.reduce((sum, f) => sum + f.totalTime, 0).toFixed(1);
}

// ─────────────────────────────────────────────────────────────────────────────
// WORLD MAP BACKDROP
// ─────────────────────────────────────────────────────────────────────────────
function WorldMapBackdrop() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Image fadeDuration={0} resizeMode="contain" source={COUNTRY1}
        style={[styles.mapBase, styles.mapAmericas]} />
      <Image fadeDuration={0} resizeMode="contain" source={COUNTRY2}
        style={[styles.mapBase, styles.mapEuraf]} />
      <Image fadeDuration={0} resizeMode="contain" source={COUNTRY3}
        style={[styles.mapBase, styles.mapAustralia]} />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STAT CHIP
// ─────────────────────────────────────────────────────────────────────────────
function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statChip}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FILTER PILL
// ─────────────────────────────────────────────────────────────────────────────
type FilterType = "All" | FlightType;
const FILTERS: FilterType[] = ["All", "Commercial", "Private", "Cargo", "Charter"];

function FilterPill({
  label,
  active,
  onPress,
}: {
  label: FilterType;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.pill, active && styles.pillActive]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Text style={[styles.pillText, active && styles.pillTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FLIGHT CARD
// ─────────────────────────────────────────────────────────────────────────────
function FlightCard({ flight, onPress }: { flight: Flight; onPress: () => void }) {
  const meta = TYPE_META[flight.type];

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* ── HEADER STRIP ── */}
      <View style={[styles.cardHeader, { backgroundColor: meta.accent }]}>
        <View style={styles.cardHeaderLeft}>
          <Ionicons name="airplane" size={14} color={Colors.white} />
          <Text style={styles.cardHeaderFlt}>FLT</Text>
        </View>
        <View style={styles.cardHeaderDivider} />
        <View style={styles.cardHeaderRight}>
          <Text style={styles.cardHeaderReg}>{flight.registration}</Text>
        </View>
      </View>

      {/* ── BODY (3 columns) ── */}
      <View style={styles.cardBody}>
        {/* Date column */}
        <View style={styles.dateCol}>
          <Text style={styles.dateMonth}>{flight.month}</Text>
          <Text style={styles.dateDay}>{flight.day}</Text>
          <Text style={styles.dateYear}>{flight.year}</Text>
        </View>

        <View style={styles.cardDivider} />

        {/* Center column: route + footer */}
        <View style={styles.cardCenter}>
          <View style={styles.routeRow}>
            {/* Departure icon */}
            <View style={styles.routeIcon}>
              <MaterialCommunityIcons name="airplane-takeoff" size={14} color={Colors.textPrimary} />
            </View>
            <Text style={styles.icao}>{flight.departure}</Text>

            {/* Route line with badge centered */}
            <View style={styles.routeLineWrap}>
              <View style={styles.routeDot} />
              <View style={styles.routeLine} />
              <Ionicons name="airplane" size={12} color={Colors.textPrimary} style={styles.routePlane} />
              <View style={[styles.typeBadge, { backgroundColor: meta.bg }]}>
                <Text style={[styles.typeText, { color: meta.accent }]}>{flight.type}</Text>
              </View>
            </View>

            <Text style={styles.icao}>{flight.arrival}</Text>
            {/* Arrival icon */}
            <View style={styles.routeIcon}>
              <MaterialCommunityIcons name="airplane-landing" size={14} color={Colors.textPrimary} />
            </View>
          </View>

          {/* Footer: notes (left) + full date (right) */}
          <View style={styles.cardFooterRow}>
            {flight.notes ? (
              <Text style={styles.notesText} numberOfLines={1}>{flight.notes}</Text>
            ) : (
              <View style={{ flex: 1 }} />
            )}
            <Text style={styles.cardFooterDate}>{flight.date}</Text>
          </View>
        </View>

        <View style={styles.cardDivider} />

        {/* Hours column */}
        <View style={styles.cardRight}>
          <Text style={styles.hoursValue}>{flight.totalTime.toFixed(1)}</Text>
          <Text style={styles.hoursUnit}>hrs</Text>
        </View>
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

  const filtered =
    activeFilter === "All"
      ? SAMPLE_FLIGHTS
      : SAMPLE_FLIGHTS.filter((f) => f.type === activeFilter);

  return (
    <ScreenLayout>
      <StatusBar backgroundColor="transparent" barStyle="light-content" translucent />

      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom:  0}}
        style={{ backgroundColor: Colors.bodyBackground }}
      >
        {/* ── HERO ── */}
        <View
          style={[
            styles.hero,
            { paddingTop: insets.top + 10 },
          ]}
        >
          <WorldMapBackdrop />

          {/* <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity> */}

          <Text style={styles.heroTitle}>Flights</Text>

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
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pillsRow}
            style={styles.pillsScroll}
          >
            {FILTERS.map((f) => (
              <FilterPill
                key={f}
                label={f}
                active={activeFilter === f}
                onPress={() => setActiveFilter(f)}
              />
            ))}
          </ScrollView>

          <Text style={styles.resultsCount}>
            {filtered.length} {filtered.length === 1 ? "flight" : "flights"}
          </Text>

          {filtered.length === 0 ? (
            <View style={styles.emptyWrap}>
              <MaterialCommunityIcons name="airplane-off" size={44} color={Colors.muted} />
              <Text style={styles.emptyText}>No flights for this filter</Text>
            </View>
          ) : (
            filtered.map((flight) => (
              <FlightCard key={flight.id} flight={flight} onPress={() => {}} />
            ))
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.addBtn}
              activeOpacity={0.88}
              onPress={() => router.push("/flightscreen/add_flight")}
            >
              <Ionicons name="add" size={20} color={Colors.textPrimary} />
              <Text style={styles.addBtnText}>Add Flight</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  hero: {
    backgroundColor: Colors.hero,
    paddingHorizontal: 18,
    paddingBottom: 28,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  mapBase: {
    position: "absolute",
    tintColor: Colors.heroMap,
    opacity: 0.72,
  },
  mapAmericas: {
    left: -84,
    top: -44,
    width: 228,
    height: 418,
  },
  mapEuraf: {
    right: -54,
    top: -30,
    width: 378,
    height: 288,
  },
  mapAustralia: {
    right: 56,
    top: 224,
    width: 56,
    height: 46,
    opacity: 0.42,
  },

  backBtn: {
    width: 34,
    height: 34,
    justifyContent: "center",
    marginBottom: 4,
  },
  heroTitle: {
    color: Colors.textLight,
    fontSize: 28,
    fontWeight: "800",
    fontFamily: Fonts.rounded,
    marginBottom: 16,

  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.10)",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "space-around",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  statChip:  { alignItems: "center", flex: 1 },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.white,
    fontFamily: Fonts.rounded,
  },
  statLabel: {
    fontSize: 11,
    color: "rgba(241,245,251,0.65)",
    fontWeight: "500",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
  },

  body: {
    backgroundColor: Colors.hero,
    paddingTop: 16,
    paddingHorizontal: 8,
  },

  pillsScroll: { marginBottom: 4, paddingHorizontal: 4 },
  pillsRow:    { gap: 8, paddingRight: 8 },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1.4,
    borderColor: Colors.cardBorder,
  },
  pillActive: {
    backgroundColor: Colors.yellow,
    borderColor: Colors.blueStroke,
  },
  pillText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.muted,
    fontFamily: Fonts.rounded,
  },
  pillTextActive: {
    color: Colors.textPrimary,
  },

  resultsCount: {
    fontSize: 12,
    color: Colors.muted,
    fontWeight: "600",
    marginTop: 14,
    marginBottom: 10,
    marginLeft: 6,
  },

  // ── CARD CONTAINER ──
  card: {
    backgroundColor: Colors.card,
    // borderRadius: 14,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    marginBottom: 14,
    overflow: "hidden",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 7,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },

  // ── HEADER STRIP ──
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    height: 24,
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    width: 60, // matches dateCol width for vertical alignment
  },
  cardHeaderFlt: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "700",
    fontFamily: Fonts.rounded,
    letterSpacing: 0.5,
  },
  cardHeaderDivider: {
    width: 1,
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  cardHeaderRight: {
    flex: 1,
    paddingHorizontal: 14,
    justifyContent: "center",
  },
  cardHeaderReg: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "700",
    fontFamily: Fonts.rounded,
    letterSpacing: 0.3,
  },

  // ── BODY ──
  cardBody: {
    flexDirection: "row",
    minHeight: 96,
  },

  // Date column
  dateCol: {
    width: 60,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  dateMonth: {
    fontSize: 13,
    color: Colors.muted,
    fontWeight: "600",
    fontFamily: Fonts.rounded,
  },
  dateDay: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.textPrimary,
    fontFamily: Fonts.rounded,
    lineHeight: 40,
  },
  dateYear: {
    fontSize: 12,
    color: Colors.muted,
    fontWeight: "500",
  },

  cardDivider: {
    width: 1,
    backgroundColor: Colors.cardBorder,
    marginVertical: 10,
  },

  // Center column
  cardCenter: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    justifyContent: "space-between",
  },
  routeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  routeIcon: {
    width: 20,
    height: 20,
    borderRadius: 13,
    backgroundColor: Colors.yellow,
    alignItems: "center",
    justifyContent: "center",
  },
  icao: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.textPrimary,
    fontFamily: Fonts.rounded,
    letterSpacing: 0.5,
  },
  routeLineWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  routeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.textPrimary,
  },
  routeLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: Colors.cardBorder,
  },
  routePlane: {
    position: "absolute",
    right: "30%",
  },
  typeBadge: {
    position: "absolute",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    top: 10,
  },
  typeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.2,
  },

  // Footer row inside center column
  cardFooterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 18,
    gap: 8,
  },
  notesText: {
    flex: 1,
    fontSize: 12,
    color: Colors.muted,
    fontStyle: "italic",
  },
  cardFooterDate: {
    fontSize: 12,
    color: Colors.muted,
    fontWeight: "500",
  },

  // Hours column
  cardRight: {
    width: 60,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  hoursValue: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.textPrimary,
    fontFamily: Fonts.rounded,
    lineHeight: 36,
  },
  hoursUnit: {
    fontSize: 13,
    color: Colors.muted,
    fontWeight: "600",
    marginTop: 2,
  },

  emptyWrap: {
    alignItems: "center",
    paddingVertical: 56,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.muted,
    fontWeight: "500",
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    maxWidth: 220,
    height: 62,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: Colors.textPrimary,
    backgroundColor: Colors.yellow,
    justifyContent: "center",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  addBtnText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: "800",
    fontFamily: Fonts.rounded,
  },
});