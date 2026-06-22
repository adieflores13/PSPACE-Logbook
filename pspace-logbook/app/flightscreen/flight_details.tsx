import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Fonts } from "@/constants/theme";

// ---------------------------------------------------------------------------
// Static sample data
// ---------------------------------------------------------------------------

interface FlightRecord {
  id: string;
  aircraftType: string;
  registration: string;
  date: string;
  from: string;
  to: string;
  fromName: string;   // e.g. "APA"
  toName: string;     // e.g. "DEN"
  hours: string;
  landings: number;
  instructor: string;
  isNew: boolean;
  // Expanded detail
  blockOff: string;   // "0815"
  blockOn: string;    // "1045"
  duration: string;   // "0230"
  picDual: string;    // "PIC"
  weather: string;    // "Scattered Clouds"
  remarks: string;    // free text
}

const FLIGHT_RECORDS: FlightRecord[] = [
  {
    id: "1",
    aircraftType: "Cessna 172S",
    registration: "N1234AB",
    date: "May 20, 2026",
    from: "KAPA",
    to: "KDEN",
    fromName: "APA",
    toName: "DEN",
    hours: "2.5 hrs",
    landings: 3,
    instructor: "John D. Anderson",
    isNew: true,
    blockOff: "0815",
    blockOn: "1045",
    duration: "0230",
    picDual: "PIC",
    weather: "Scattered Clouds",
    remarks: "VFR training flight. Practiced steep turns and normal landings.",
  },
  {
    id: "2",
    aircraftType: "Piper PA-28-181",
    registration: "N5678CD",
    date: "May 18, 2026",
    from: "KFTG",
    to: "KAPA",
    fromName: "FTG",
    toName: "APA",
    hours: "1.3 hrs",
    landings: 2,
    instructor: "Sarah M. Lee",
    isNew: true,
    blockOff: "0930",
    blockOn: "1048",
    duration: "0118",
    picDual: "DUAL",
    weather: "Clear",
    remarks: "Cross-country navigation exercise.",
  },
  {
    id: "3",
    aircraftType: "Cessna 172S",
    registration: "N1234AB",
    date: "May 15, 2026",
    from: "KAPA",
    to: "KBJC",
    fromName: "APA",
    toName: "BJC",
    hours: "1.8 hrs",
    landings: 2,
    instructor: "John D. Anderson",
    isNew: true,
    blockOff: "1300",
    blockOn: "1448",
    duration: "0148",
    picDual: "PIC",
    weather: "Few Clouds",
    remarks: "Pattern work and short field landings.",
  },
  {
    id: "4",
    aircraftType: "Cessna 172S",
    registration: "N1234AB",
    date: "May 15, 2026",
    from: "KAPA",
    to: "KBJC",
    fromName: "APA",
    toName: "BJC",
    hours: "1.8 hrs",
    landings: 2,
    instructor: "John D. Anderson",
    isNew: false,
    blockOff: "0800",
    blockOn: "0948",
    duration: "0148",
    picDual: "DUAL",
    weather: "Overcast",
    remarks: "Instrument approaches practice.",
  },
  {
    id: "5",
    aircraftType: "Cessna 172S",
    registration: "N1234AB",
    date: "May 15, 2026",
    from: "KAPA",
    to: "KBJC",
    fromName: "APA",
    toName: "BJC",
    hours: "1.8 hrs",
    landings: 2,
    instructor: "John D. Anderson",
    isNew: true,
    blockOff: "1500",
    blockOn: "1648",
    duration: "0148",
    picDual: "PIC",
    weather: "Scattered Clouds",
    remarks: "Night currency flight.",
  },
];

// ---------------------------------------------------------------------------
// RecordCard component
// ---------------------------------------------------------------------------

type RecordCardProps = {
  record: FlightRecord;
  isSelected: boolean;
  onPress: () => void;
};

function RecordCard({ record, isSelected, onPress }: RecordCardProps) {
  const txtMain = COLORS.navy;
  const txtSub  = isSelected ? "rgba(0,27,58,0.7)" : COLORS.textSecondary;
  const txtReg  = COLORS.navy;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.recordCard, isSelected && styles.recordCardSelected]}
      onPress={onPress}>

      {/* Top row: date + hours badge */}
      <View style={styles.cardTopRow}>
        <View style={styles.cardDateWrap}>
          <Ionicons
            name="calendar-outline"
            size={13}
            color={isSelected ? "rgba(0,27,58,0.7)" : COLORS.iconGray}
          />
          <Text style={[styles.cardDate, { color: txtSub }]}>{record.date}</Text>
        </View>
        <View style={[styles.hoursBadge, isSelected && styles.hoursBadgeSelected]}>
          <Text style={[styles.hoursBadgeText, isSelected && { color: COLORS.navy }]}>
            {record.hours}
          </Text>
        </View>
      </View>

      {/* Aircraft type + registration */}
      <View style={styles.cardTypeRow}>
        <Text style={[styles.cardType, { color: txtMain }]}>{record.aircraftType}</Text>
        <Text style={[styles.cardReg, { color: txtReg }]}>{record.registration}</Text>
      </View>

      {/* Route + landings */}
      <View style={styles.cardRouteRow}>
        <View style={styles.cardRouteWrap}>
          <MaterialCommunityIcons
            name="airplane-takeoff"
            size={14}
            color={isSelected ? COLORS.navy : COLORS.navy}
          />
          <Text style={[styles.cardRoute, { color: txtMain }]}>
            {record.from} <Text style={{ color: txtSub }}>→</Text> {record.to}
          </Text>
        </View>
        <Text style={[styles.cardLandings, { color: txtSub }]}>
          {record.landings} Landings
        </Text>
      </View>

      {/* Instructor + new badge + chevron */}
      <View style={styles.cardBottomRow}>
        <Text style={[styles.cardInstructor, { color: txtSub }]}>
          Instructor: {record.instructor}
        </Text>
        <View style={styles.newBadge}>
          <Text style={styles.newBadgeText}>View Record</Text>
        </View>
      </View>

      {/* Chevron */}
      <View style={styles.chevronWrap}>
        <Ionicons
          name="chevron-forward"
          size={16}
          color={isSelected ? COLORS.navy : COLORS.iconGray}
        />
      </View>
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// Bottom Nav
// ---------------------------------------------------------------------------

function NavItem({
  icon, label, active = false, onPress,
}: {
  icon: string; label: string; active?: boolean; onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={onPress}>
      <Ionicons name={icon as any} size={22} color={active ? COLORS.navy : COLORS.iconGray} />
      <Text style={[styles.navLabel, active && styles.navLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// RecordDetailModal component
// ---------------------------------------------------------------------------

function fmtTime(t: string) {
  // "0815" -> "08:15"
  if (t.length === 4) return `${t.slice(0, 2)}:${t.slice(2)}`;
  return t;
}

type DetailRowProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

function DetailRow({ icon, label, value }: DetailRowProps) {
  return (
    <View style={modalStyles.detailRow}>
      <View style={modalStyles.detailIcon}>{icon}</View>
      <Text style={modalStyles.detailText}>
        <Text style={modalStyles.detailLabel}>{label}: </Text>
        {value}
      </Text>
    </View>
  );
}

function RecordDetailModal({
  record,
  onClose,
}: {
  record: FlightRecord | null;
  onClose: () => void;
}) {
  const visible = record !== null;

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={modalStyles.backdrop} />
      </TouchableWithoutFeedback>

      {record && (
        <View style={modalStyles.centerWrap} pointerEvents="box-none">
          <View style={modalStyles.card}>
            {/* Header: date + collapse */}
            <View style={modalStyles.cardHeader}>
              <View style={modalStyles.cardDateWrap}>
                <Ionicons name="calendar-outline" size={14} color={COLORS.iconGray} />
                <Text style={modalStyles.cardDate}>{record.date}</Text>
              </View>
              <TouchableOpacity style={modalStyles.collapseWrap} onPress={onClose}>
                <Text style={modalStyles.collapseText}>Collapse</Text>
                <Ionicons name="chevron-up" size={14} color={COLORS.iconGray} />
              </TouchableOpacity>
            </View>

            {/* Inner highlighted block */}
            <View style={modalStyles.innerBlock}>
              {/* Aircraft + reg + hrs */}
              <View style={modalStyles.aircraftRow}>
                <View style={modalStyles.aircraftLeft}>
                  <MaterialCommunityIcons name="airplane" size={16} color={COLORS.navy} />
                  <Text style={modalStyles.aircraftType}>
                    {record.aircraftType.replace(/(\d+\w*)$/, "")}
                    <Text style={modalStyles.aircraftModel}>
                      {record.aircraftType.match(/(\d+\w*)$/)?.[0] ?? ""}
                    </Text>
                  </Text>
                </View>
                <Text style={modalStyles.aircraftReg}>{record.registration}</Text>
                <View style={modalStyles.hrsBadge}>
                  <Text style={modalStyles.hrsBadgeText}>{record.hours}</Text>
                </View>
              </View>

              {/* Route */}
              <View style={modalStyles.routeRow}>
                <Ionicons name="location" size={14} color={COLORS.amber} />
                <Text style={modalStyles.routeText}>
                  {record.from} ({record.fromName})
                </Text>
                <MaterialCommunityIcons name="arrow-right" size={16} color={COLORS.navy} style={{ marginHorizontal: 6 }} />
                <Ionicons name="location" size={14} color={COLORS.amber} />
                <Text style={modalStyles.routeText}>
                  {record.to} ({record.toName})
                </Text>
              </View>
            </View>

            <View style={modalStyles.hDivider} />

            {/* Two columns */}
            <View style={modalStyles.columns}>
              {/* Left */}
              <View style={modalStyles.col}>
                <DetailRow
                  icon={<Ionicons name="time-outline" size={14} color={COLORS.iconGray} />}
                  label="Block Off"
                  value={fmtTime(record.blockOff)}
                />
                <DetailRow
                  icon={<Ionicons name="time-outline" size={14} color={COLORS.iconGray} />}
                  label="Block On"
                  value={fmtTime(record.blockOn)}
                />
                <DetailRow
                  icon={<Ionicons name="hourglass-outline" size={14} color={COLORS.iconGray} />}
                  label="Duration"
                  value={fmtTime(record.duration)}
                />
                <DetailRow
                  icon={<MaterialCommunityIcons name="airplane-landing" size={14} color={COLORS.iconGray} />}
                  label="Landings"
                  value={String(record.landings).padStart(2, "0")}
                />
              </View>

              <View style={modalStyles.vDivider} />

              {/* Right */}
              <View style={modalStyles.col}>
                <DetailRow
                  icon={<Ionicons name="person-outline" size={14} color={COLORS.iconGray} />}
                  label="Instructor"
                  value={record.instructor}
                />
                <DetailRow
                  icon={<MaterialCommunityIcons name="seat-passenger" size={14} color={COLORS.iconGray} />}
                  label="PIC / DUAL"
                  value={record.picDual}
                />
                <DetailRow
                  icon={<Ionicons name="cloud-outline" size={14} color={COLORS.iconGray} />}
                  label="Weather"
                  value={record.weather}
                />
                <DetailRow
                  icon={<Ionicons name="list-outline" size={14} color={COLORS.iconGray} />}
                  label="Remarks"
                  value={record.remarks}
                />
              </View>
            </View>

            {/* Close button */}
            <TouchableOpacity style={modalStyles.closeBtn} activeOpacity={0.85} onPress={onClose}>
              <Text style={modalStyles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Modal>
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
  const [expandedRecord, setExpandedRecord] = useState<FlightRecord | null>(null);

  const filtered = FLIGHT_RECORDS.filter(
    (r) =>
      r.aircraftType.toLowerCase().includes(search.toLowerCase()) ||
      r.registration.toLowerCase().includes(search.toLowerCase()) ||
      r.instructor.toLowerCase().includes(search.toLowerCase()) ||
      r.from.toLowerCase().includes(search.toLowerCase()) ||
      r.to.toLowerCase().includes(search.toLowerCase()),
  );

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
          contentContainerStyle={styles.scrollContent}>

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
                  onPress={() => {
                    setSelectedId(record.id);
                    setExpandedRecord(record);
                  }}
                />
              ))
            )}
          </View>
        </ScrollView>

        {/* ── Save and Continue button ── */}
        <View style={styles.saveBtnWrap}>
          <TouchableOpacity
            style={styles.saveBtn}
            activeOpacity={0.85}
            onPress={() => {
              // TODO: hook up save logic
              router.back();
            }}>
            <Text style={styles.saveBtnText}>Save and Continue</Text>
          </TouchableOpacity>
        </View>

        {/* ── Bottom Navigation ── */}
        <View style={[styles.bottomNav, { paddingBottom: insets.bottom + 6 }]}>
          <NavItem icon="airplane"    label="Dashboard" onPress={() => router.push("/dashboardscreen/dashboard")} />
          <NavItem icon="business"    label="Aircrafts" onPress={() => {}} />
          <NavItem icon="paper-plane" label="Flights"   active onPress={() => {}} />
          <NavItem icon="book"        label="Logbook"   onPress={() => {}} />
          <NavItem icon="person"      label="Profile"   onPress={() => {}} />
        </View>

        {/* ── Record Detail Modal ── */}
        <RecordDetailModal
          record={expandedRecord}
          onClose={() => setExpandedRecord(null)}
        />
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
  amber: "#FFBB57",
  iconGray: "#7A8494",
  placeholder: "#B0B5BE",
  border: "#DDE1E8",
  textSecondary: "#5A6474",
  selectedBg: "#9CA2AD",
  selectedBorder: "#8A909B",
  cardBg: "#FFFFFF",
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
    paddingBottom: 20,
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
  recordList: { gap: 12 },

  recordCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1.4,
    borderColor: COLORS.border,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  recordCardSelected: {
    backgroundColor: COLORS.selectedBg,
    borderColor: COLORS.selectedBorder,
  },

  /* Card rows */
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cardDateWrap: { flexDirection: "row", alignItems: "center", gap: 5 },
  cardDate: {
    fontFamily: Fonts.rounded,
    fontSize: 11,
  },
  hoursBadge: {
    backgroundColor: COLORS.background,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  hoursBadgeSelected: {
    backgroundColor: "rgba(255,255,255,0.55)",
    borderColor: "rgba(0,27,58,0.2)",
  },
  hoursBadgeText: {
    fontFamily: Fonts.rounded,
    fontWeight: "700",
    fontSize: 11,
    color: COLORS.navy,
  },

  cardTypeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  cardType: {
    fontFamily: Fonts.rounded,
    fontWeight: "800",
    fontSize: 14,
  },
  cardReg: {
    fontFamily: Fonts.rounded,
    fontWeight: "700",
    fontSize: 12,
  },

  cardRouteRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cardRouteWrap: { flexDirection: "row", alignItems: "center", gap: 6 },
  cardRoute: {
    fontFamily: Fonts.rounded,
    fontWeight: "600",
    fontSize: 12,
  },
  cardLandings: {
    fontFamily: Fonts.rounded,
    fontSize: 11,
  },

  cardBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardInstructor: {
    fontFamily: Fonts.rounded,
    fontSize: 10.5,
    fontStyle: "italic",
    flex: 1,
  },
  newBadge: {
    backgroundColor: COLORS.amber,
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  newBadgeText: {
    fontFamily: Fonts.rounded,
    fontWeight: "800",
    fontSize: 8.5,
    color: COLORS.navy,
  },

  chevronWrap: {
    position: "absolute",
    right: 10,
    top: "50%",
    marginTop: -8,
    display: "none", // hidden — keeping layout clean like mockup; remove if you want chevron
  },

  emptyText: {
    fontFamily: Fonts.rounded,
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 12,
  },

  /* Save button */
  saveBtnWrap: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: COLORS.white,
  },
  saveBtn: {
    backgroundColor: COLORS.amber,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
  },
  saveBtnText: {
    fontFamily: Fonts.rounded,
    fontWeight: "800",
    fontSize: 15,
    color: COLORS.navy,
  },

  /* Bottom nav */
  bottomNav: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
  },
  navItem: { flex: 1, alignItems: "center", gap: 3 },
  navLabel: {
    fontFamily: Fonts.rounded,
    fontSize: 10,
    color: COLORS.iconGray,
    fontWeight: "500",
  },
  navLabelActive: { color: COLORS.navy, fontWeight: "700" },
});

// ---------------------------------------------------------------------------
// Modal Styles
// ---------------------------------------------------------------------------

const modalStyles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(8,20,40,0.55)",
  },
  centerWrap: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  card: {
    width: "100%",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 24,
  },

  /* Header */
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardDateWrap: { flexDirection: "row", alignItems: "center", gap: 6 },
  cardDate: {
    fontFamily: Fonts.rounded,
    fontWeight: "700",
    fontSize: 13,
    color: COLORS.navy,
  },
  collapseWrap: { flexDirection: "row", alignItems: "center", gap: 3 },
  collapseText: {
    fontFamily: Fonts.rounded,
    fontSize: 12,
    color: COLORS.iconGray,
  },

  /* Inner block */
  innerBlock: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  aircraftRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  aircraftLeft: { flexDirection: "row", alignItems: "center", gap: 6, flex: 1 },
  aircraftType: {
    fontFamily: Fonts.rounded,
    fontWeight: "800",
    fontSize: 14,
    color: COLORS.navy,
  },
  aircraftModel: { color: COLORS.amber },
  aircraftReg: {
    fontFamily: Fonts.rounded,
    fontWeight: "800",
    fontSize: 13,
    color: COLORS.navy,
    marginRight: 10,
  },
  hrsBadge: {
    backgroundColor: COLORS.white,
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  hrsBadgeText: {
    fontFamily: Fonts.rounded,
    fontWeight: "800",
    fontSize: 12,
    color: COLORS.navy,
  },

  routeRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap" },
  routeText: {
    fontFamily: Fonts.rounded,
    fontWeight: "700",
    fontSize: 13,
    color: COLORS.amber,
    marginLeft: 3,
  },

  /* Dividers */
  hDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 16,
  },
  vDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 12,
  },

  /* Columns */
  columns: { flexDirection: "row", marginBottom: 18 },
  col: { flex: 1, gap: 12 },
  detailRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  detailIcon: { width: 16, alignItems: "center", marginTop: 1 },
  detailText: {
    flex: 1,
    fontFamily: Fonts.rounded,
    fontSize: 11.5,
    color: COLORS.navy,
    lineHeight: 16,
  },
  detailLabel: { color: COLORS.textSecondary, fontWeight: "600" },

  /* Close button */
  closeBtn: {
    alignSelf: "center",
    backgroundColor: COLORS.amber,
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 32,
  },
  closeBtnText: {
    fontFamily: Fonts.rounded,
    fontWeight: "800",
    fontSize: 13,
    color: COLORS.navy,
  },
});