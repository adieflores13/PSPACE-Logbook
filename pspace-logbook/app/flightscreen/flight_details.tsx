import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native";

import { Fonts } from "@/constants/theme";

// ---------------------------------------------------------------------------
// Static sample data
// ---------------------------------------------------------------------------

interface FlightRecord {
  id: string;
  aircraftType: string;
  manufacturer: string;
  engineType: string;
  registration: string;
  date: string;
  from: string;
  to: string;
}

const FLIGHT_RECORDS: FlightRecord[] = [
  {
    id: "1",
    aircraftType: "Cessna 172S",
    manufacturer: "Cessna",
    engineType: "Piston (Reciprocating)",
    registration: "N1234AB",
    date: "May 20, 2025",
    from: "KAPA",
    to: "KDEN",
  },
  {
    id: "2",
    aircraftType: "Piper PA-28 Cherokee",
    manufacturer: "Piper Aircraft",
    engineType: "Piston (Reciprocating)",
    registration: "N5678CD",
    date: "May 18, 2025",
    from: "KLAX",
    to: "KSFO",
  },
  {
    id: "3",
    aircraftType: "Beechcraft Bonanza G36",
    manufacturer: "Beechcraft",
    engineType: "Piston (Reciprocating)",
    registration: "N9012EF",
    date: "May 15, 2025",
    from: "KORD",
    to: "KJFK",
  },
  {
    id: "4",
    aircraftType: "Diamond DA40",
    manufacturer: "Diamond Aircraft",
    engineType: "Piston (Reciprocating)",
    registration: "N3456GH",
    date: "May 12, 2025",
    from: "KDEN",
    to: "KPHX",
  },
  {
    id: "5",
    aircraftType: "Cirrus SR22",
    manufacturer: "Cirrus Aircraft",
    engineType: "Piston (Reciprocating)",
    registration: "N7890IJ",
    date: "May 10, 2025",
    from: "KATL",
    to: "KMIA",
  },
];

// ---------------------------------------------------------------------------
// DetailField component
// ---------------------------------------------------------------------------

type DetailFieldProps = {
  label: string;
  value: string;
};

function DetailField({ label, value }: DetailFieldProps) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.fieldBox}>
        <Text style={styles.fieldValue}>{value}</Text>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// RecordCard component
// ---------------------------------------------------------------------------

type RecordCardProps = {
  record: FlightRecord;
  isSelected: boolean;
  onPress: () => void;
};

function RecordCard({ record, isSelected, onPress }: RecordCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={[styles.recordCard, isSelected && styles.recordCardSelected]}
      onPress={onPress}>
      <View style={styles.recordCardLeft}>
        <MaterialCommunityIcons
          name="airplane"
          size={20}
          color={isSelected ? COLORS.white : COLORS.navy}
          style={{ marginRight: 10 }}
        />
        <View>
          <Text style={[styles.recordCardType, isSelected && styles.recordCardTypeSelected]}>
            {record.aircraftType}
          </Text>
          <Text style={[styles.recordCardSub, isSelected && styles.recordCardSubSelected]}>
            {record.from} → {record.to} · {record.date}
          </Text>
        </View>
      </View>
      <Ionicons
        name="chevron-forward"
        size={16}
        color={isSelected ? COLORS.white : COLORS.iconGray}
      />
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function FlightDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string>(FLIGHT_RECORDS[0].id);

  const filtered = FLIGHT_RECORDS.filter(
    (r) =>
      r.aircraftType.toLowerCase().includes(search.toLowerCase()) ||
      r.manufacturer.toLowerCase().includes(search.toLowerCase()) ||
      r.from.toLowerCase().includes(search.toLowerCase()) ||
      r.to.toLowerCase().includes(search.toLowerCase()),
  );

  const selected = FLIGHT_RECORDS.find((r) => r.id === selectedId) ?? FLIGHT_RECORDS[0];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />

        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons color={COLORS.navy} name="arrow-back" size={22} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Flight Details</Text>
          <View style={styles.backBtn} />
        </View>

        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 16) + 32 },
          ]}>

          {/* ── Section label ── */}
          <View style={styles.sectionLabelRow}>
            <MaterialCommunityIcons color={COLORS.navy} name="airplane-takeoff" size={24} />
            <Text style={styles.sectionLabel}>Details</Text>
          </View>

          {/* ── Search bar ── */}
          <View style={styles.searchBar}>
            <Ionicons color={COLORS.iconGray} name="search-outline" size={18} style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
              placeholder="Search records..."
              placeholderTextColor={COLORS.placeholder}
              returnKeyType="search"
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Ionicons color={COLORS.iconGray} name="close-circle" size={17} />
              </TouchableOpacity>
            )}
          </View>

          {/* ── Record list ── */}
          <View style={styles.recordList}>
            {filtered.length === 0 ? (
              <Text style={styles.emptyText}>No records match your search.</Text>
            ) : (
              filtered.map((record) => (
                <RecordCard
                  key={record.id}
                  record={record}
                  isSelected={record.id === selectedId}
                  onPress={() => setSelectedId(record.id)}
                />
              ))
            )}
          </View>

          <View style={styles.divider} />

          {/* ── Detail fields for selected record ── */}
          <DetailField label="Aircraft Type" value={selected.aircraftType} />
          <DetailField label="Manufacturer" value={selected.manufacturer} />
          <DetailField label="Engine Type" value={selected.engineType} />
          <DetailField label="Registration" value={selected.registration} />
          <DetailField label="Date" value={selected.date} />
          <DetailField label="Departure" value={selected.from} />
          <DetailField label="Arrival" value={selected.to} />
        </ScrollView>
      </View>
    </>
  );
}

// ---------------------------------------------------------------------------
// Tokens
// ---------------------------------------------------------------------------

const COLORS = {
  white: "#FFFFFF",
  background: "#F5F6F8",
  navy: "#001B3A",
  iconGray: "#7A8494",
  placeholder: "#B0B5BE",
  border: "#DDE1E8",
  textSecondary: "#5A6474",
  selectedBg: "#001B3A",
  cardBg: "#F0F2F5",
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.white },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  backBtn: { width: 36, height: 36, justifyContent: "center", alignItems: "flex-start" },
  headerTitle: {
    fontFamily: Fonts.rounded,
    fontWeight: "700",
    fontSize: 18,
    color: COLORS.navy,
  },

  /* Scroll */
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: COLORS.white,
  },

  /* Section label */
  sectionLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  sectionLabel: {
    fontFamily: Fonts.rounded,
    fontWeight: "700",
    fontSize: 20,
    color: COLORS.navy,
  },

  /* Search */
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    borderRadius: 10,
    borderWidth: 1.4,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.rounded,
    fontSize: 14,
    color: COLORS.navy,
    padding: 0,
  },

  /* Record list */
  recordList: { gap: 8, marginBottom: 20 },
  recordCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1.4,
    borderColor: COLORS.border,
  },
  recordCardSelected: {
    backgroundColor: COLORS.selectedBg,
    borderColor: COLORS.selectedBg,
  },
  recordCardLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  recordCardType: {
    fontFamily: Fonts.rounded,
    fontWeight: "700",
    fontSize: 13,
    color: COLORS.navy,
  },
  recordCardTypeSelected: { color: COLORS.white },
  recordCardSub: {
    fontFamily: Fonts.rounded,
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  recordCardSubSelected: { color: "rgba(255,255,255,0.7)" },
  emptyText: {
    fontFamily: Fonts.rounded,
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 12,
  },

  /* Divider */
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.border,
    marginBottom: 20,
  },

  /* Detail fields */
  fieldWrap: { marginBottom: 16 },
  fieldLabel: {
    fontFamily: Fonts.rounded,
    fontWeight: "600",
    fontSize: 13,
    color: COLORS.navy,
    marginBottom: 6,
  },
  fieldBox: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1.4,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    paddingHorizontal: 14,
    justifyContent: "center",
  },
  fieldValue: {
    fontFamily: Fonts.rounded,
    fontSize: 14,
    color: COLORS.navy,
  },
});