// app/aircraftrecord/index.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ScreenLayout from "@/components/layout/screen-layout";
import Colors from "@/constants/colors";
import { Fonts } from "@/constants/theme";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const HERO_HEIGHT = Math.round(SCREEN_HEIGHT * 0.16);

const COUNTRY1 = require("../../assets/images/country1.png");
const COUNTRY2 = require("../../assets/images/country2.png");
const COUNTRY3 = require("../../assets/images/country3.png");

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const MONTHS_H1 = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN"] as const;
const MONTHS_H2 = ["JUL", "AUG", "SEP", "OCT", "NOV", "DEC"] as const;
const MONTHS_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type MonthShort = (typeof MONTHS_H1)[number] | (typeof MONTHS_H2)[number];

interface MonthEntry {
  pic: string;
  sic: string;
  dualReceived: string;
}

const EMPTY_ENTRY: MonthEntry = { pic: "", sic: "", dualReceived: "" };

const AIRCRAFT_OPTIONS = [
  "Cessna 172 Skyhawk",
  "Cessna 152",
  "Cessna 182 Skylane",
  "Piper PA-28 Cherokee",
  "Piper PA-44 Seminole",
  "Diamond DA40",
  "Diamond DA42",
  "Beechcraft Bonanza",
  "Cirrus SR20",
  "Cirrus SR22",
  "Robinson R22",
  "Robinson R44",
];

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - i);

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
// PICKER MODAL (reusable)
// ─────────────────────────────────────────────────────────────────────────────
function PickerModal({
  visible,
  title,
  options,
  selected,
  onSelect,
  onClose,
}: {
  visible: boolean;
  title: string;
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={10}>
              <Ionicons name="close" size={22} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={options}
            keyExtractor={(item) => item}
            style={{ maxHeight: SCREEN_HEIGHT * 0.5 }}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.modalDivider} />}
            renderItem={({ item }) => {
              const isSelected = item === selected;
              return (
                <TouchableOpacity
                  style={styles.modalRow}
                  activeOpacity={0.7}
                  onPress={() => {
                    onSelect(item);
                    onClose();
                  }}
                >
                  <Text
                    style={[
                      styles.modalRowText,
                      isSelected && styles.modalRowTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                  {isSelected ? (
                    <Ionicons name="checkmark" size={20} color={Colors.yellow} />
                  ) : null}
                </TouchableOpacity>
              );
            }}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MONTH TAB
// ─────────────────────────────────────────────────────────────────────────────
function MonthTab({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.monthTab} onPress={onPress} activeOpacity={0.7}>
      <Text style={[styles.monthTabText, active && styles.monthTabTextActive]}>
        {label}
      </Text>
      {active ? <View style={styles.monthTabUnderline} /> : null}
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LABELED INPUT
// ─────────────────────────────────────────────────────────────────────────────
function LabeledInput({
  label,
  value,
  onChangeText,
  placeholder = "Input here",
}: {
  label: string;
  value: string;
  onChangeText: (s: string) => void;
  placeholder?: string;
}) {
  return (
    <View style={styles.inputBlock}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.placeholder}
        keyboardType="decimal-pad"
      />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MONTHLY ENTRY CARD
// ─────────────────────────────────────────────────────────────────────────────
function MonthlyEntryCard({
  months,
  activeMonth,
  onMonthChange,
  entry,
  onEntryChange,
  onDone,
}: {
  months: readonly string[];
  activeMonth: string;
  onMonthChange: (m: string) => void;
  entry: MonthEntry;
  onEntryChange: (e: MonthEntry) => void;
  onDone: () => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.monthTabsRow}>
        {months.map((m) => (
          <MonthTab
            key={m}
            label={m}
            active={activeMonth === m}
            onPress={() => onMonthChange(m)}
          />
        ))}
      </View>

      <LabeledInput
        label="PIC"
        value={entry.pic}
        onChangeText={(v) => onEntryChange({ ...entry, pic: v })}
      />
      <LabeledInput
        label="SECOND IN COMMAND"
        value={entry.sic}
        onChangeText={(v) => onEntryChange({ ...entry, sic: v })}
      />
      <LabeledInput
        label="DUAL RECEIVED"
        value={entry.dualReceived}
        onChangeText={(v) => onEntryChange({ ...entry, dualReceived: v })}
      />

      <View style={styles.doneBtnWrap}>
        <TouchableOpacity style={styles.doneBtn} activeOpacity={0.85} onPress={onDone}>
          <Text style={styles.doneBtnText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOTALS CARD
// ─────────────────────────────────────────────────────────────────────────────
function TotalsCard({
  title,
  monthOptions,
  selectedMonth,
  onSelectMonth,
  entry,
  totals,
}: {
  title: string;
  monthOptions: string[];
  selectedMonth: string;
  onSelectMonth: (m: string) => void;
  entry: MonthEntry;
  totals: { pic: number; sic: number; dualReceived: number };
}) {
  const [pickerVisible, setPickerVisible] = useState(false);

  const fmt = (n: number) => (n === 0 ? "0.0" : n.toFixed(1));

  return (
    <View style={styles.card}>
      <View style={styles.totalsBadge}>
        <Text style={styles.totalsBadgeText}>{title}</Text>
      </View>

      <TouchableOpacity
        style={styles.dropdown}
        activeOpacity={0.8}
        onPress={() => setPickerVisible(true)}
      >
        <Text style={styles.dropdownText}>{selectedMonth}</Text>
        <Ionicons name="chevron-down" size={18} color={Colors.textPrimary} />
      </TouchableOpacity>

      <View style={styles.readonlyBlock}>
        <Text style={styles.inputLabel}>PIC</Text>
        <View style={styles.readonlyField}>
          <Text
            style={[
              styles.readonlyText,
              entry.pic ? styles.readonlyTextFilled : null,
            ]}
          >
            {entry.pic || "—"}
          </Text>
        </View>
      </View>

      <View style={styles.readonlyBlock}>
        <Text style={styles.inputLabel}>SECOND IN COMMAND</Text>
        <View style={styles.readonlyField}>
          <Text
            style={[
              styles.readonlyText,
              entry.sic ? styles.readonlyTextFilled : null,
            ]}
          >
            {entry.sic || "—"}
          </Text>
        </View>
      </View>

      <View style={styles.readonlyBlock}>
        <Text style={styles.inputLabel}>DUAL RECEIVED</Text>
        <View style={styles.readonlyField}>
          <Text
            style={[
              styles.readonlyText,
              entry.dualReceived ? styles.readonlyTextFilled : null,
            ]}
          >
            {entry.dualReceived || "—"}
          </Text>
        </View>
      </View>

      {/* Half-period totals summary */}
      <View style={styles.totalsSummary}>
        <View style={styles.totalsSummaryRow}>
          <Text style={styles.totalsSummaryLabel}>Total PIC</Text>
          <Text style={styles.totalsSummaryValue}>{fmt(totals.pic)} hrs</Text>
        </View>
        <View style={styles.totalsSummaryRow}>
          <Text style={styles.totalsSummaryLabel}>Total SIC</Text>
          <Text style={styles.totalsSummaryValue}>{fmt(totals.sic)} hrs</Text>
        </View>
        <View style={styles.totalsSummaryRow}>
          <Text style={styles.totalsSummaryLabel}>Total Dual</Text>
          <Text style={styles.totalsSummaryValue}>
            {fmt(totals.dualReceived)} hrs
          </Text>
        </View>
      </View>

      <PickerModal
        visible={pickerVisible}
        title="Select Month"
        options={monthOptions}
        selected={selectedMonth}
        onSelect={onSelectMonth}
        onClose={() => setPickerVisible(false)}
      />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function sumEntries(entries: Record<string, MonthEntry>, monthNames: string[]) {
  return monthNames.reduce(
    (acc, m) => {
      const e = entries[m] ?? EMPTY_ENTRY;
      acc.pic += parseFloat(e.pic) || 0;
      acc.sic += parseFloat(e.sic) || 0;
      acc.dualReceived += parseFloat(e.dualReceived) || 0;
      return acc;
    },
    { pic: 0, sic: 0, dualReceived: 0 }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────────────────────────────────────
export default function AircraftRecordScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // manufacturer & year
  const [manufacturer, setManufacturer] = useState<string>("Cessna 172 Skyhawk");
  const [year, setYear] = useState<number>(CURRENT_YEAR);
  const [aircraftPickerVisible, setAircraftPickerVisible] = useState(false);
  const [yearPickerVisible, setYearPickerVisible] = useState(false);

  // active months for both editor cards
  const [activeMonthH1, setActiveMonthH1] = useState<string>("JAN");
  const [activeMonthH2, setActiveMonthH2] = useState<string>("JUL");

  // entries per month — keyed by full month name
  const [entries, setEntries] = useState<Record<string, MonthEntry>>(() =>
    MONTHS_FULL.reduce((acc, m) => ({ ...acc, [m]: { ...EMPTY_ENTRY } }), {})
  );

  // totals card selections
  const [totalsMonthH1, setTotalsMonthH1] = useState<string>("January");
  const [totalsMonthH2, setTotalsMonthH2] = useState<string>("July");

  // map short ↔ full
  const shortToFull = (s: string) =>
    MONTHS_FULL[[...MONTHS_H1, ...MONTHS_H2].indexOf(s as MonthShort)];

  const activeFullMonthH1 = shortToFull(activeMonthH1);
  const activeFullMonthH2 = shortToFull(activeMonthH2);

  const activeEntryH1 = entries[activeFullMonthH1] ?? EMPTY_ENTRY;
  const activeEntryH2 = entries[activeFullMonthH2] ?? EMPTY_ENTRY;

  const updateEntry = (fullMonth: string, e: MonthEntry) => {
    setEntries((prev) => ({ ...prev, [fullMonth]: e }));
  };

  // computed totals
  const h1MonthNames = MONTHS_FULL.slice(0, 6);
  const h2MonthNames = MONTHS_FULL.slice(6, 12);
  const totalsH1 = useMemo(() => sumEntries(entries, h1MonthNames), [entries]);
  const totalsH2 = useMemo(() => sumEntries(entries, h2MonthNames), [entries]);

  const handleDone = (fullMonth: string, label: string) => {
    const e = entries[fullMonth];
    if (!e || (!e.pic && !e.sic && !e.dualReceived)) {
      Alert.alert("Empty entry", `Please enter at least one value for ${label}.`);
      return;
    }
    Alert.alert("Saved", `${label} entry saved successfully.`);
  };

  return (
    <ScreenLayout>
      <StatusBar backgroundColor="transparent" barStyle="light-content" translucent />

      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        style={{ backgroundColor: Colors.bodyBackground }}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── HERO ── */}
        <View
          style={[
            styles.hero,
            { minHeight: HERO_HEIGHT + insets.top, paddingTop: insets.top + 10 },
          ]}
        >
          <WorldMapBackdrop />

          <View style={styles.heroRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color={Colors.white} />
            </TouchableOpacity>
            <Text style={styles.heroTitle}>Aircraft Record</Text>
            <View style={{ width: 34 }} />
          </View>
        </View>

        {/* ── BODY ── */}
        <View style={styles.body}>
          {/* Manufacturer & Year card */}
          <View style={styles.card}>
            <View style={styles.manufacturerRow}>
              <View style={{ flex: 1 }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setAircraftPickerVisible(true)}
                >
                  <Text style={styles.manufacturerLabel}>Manufacturer and Model</Text>
                  <View style={styles.manufacturerValueRow}>
                    <Text style={styles.manufacturerValue} numberOfLines={1}>
                      {manufacturer}
                    </Text>
                    <Ionicons name="chevron-down" size={14} color={Colors.muted} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setYearPickerVisible(true)}
                  style={styles.yearWrap}
                >
                  <Text style={styles.yearText}>{year}</Text>
                  <Ionicons name="chevron-down" size={14} color={Colors.muted} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.listIconBtn}
                activeOpacity={0.7}
                onPress={() => setAircraftPickerVisible(true)}
              >
                <Ionicons name="list" size={22} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* First-half editor */}
          <MonthlyEntryCard
            months={MONTHS_H1}
            activeMonth={activeMonthH1}
            onMonthChange={setActiveMonthH1}
            entry={activeEntryH1}
            onEntryChange={(e) => updateEntry(activeFullMonthH1, e)}
            onDone={() => handleDone(activeFullMonthH1, activeFullMonthH1)}
          />

          {/* Totals 1st 6 Months */}
          <TotalsCard
            title="Totals 1st 6 Months"
            monthOptions={h1MonthNames}
            selectedMonth={totalsMonthH1}
            onSelectMonth={setTotalsMonthH1}
            entry={entries[totalsMonthH1] ?? EMPTY_ENTRY}
            totals={totalsH1}
          />

          {/* Second-half editor */}
          <MonthlyEntryCard
            months={MONTHS_H2}
            activeMonth={activeMonthH2}
            onMonthChange={setActiveMonthH2}
            entry={activeEntryH2}
            onEntryChange={(e) => updateEntry(activeFullMonthH2, e)}
            onDone={() => handleDone(activeFullMonthH2, activeFullMonthH2)}
          />

          {/* Totals 2nd 6 Months */}
          <TotalsCard
            title="Totals 2nd 6 Months"
            monthOptions={h2MonthNames}
            selectedMonth={totalsMonthH2}
            onSelectMonth={setTotalsMonthH2}
            entry={entries[totalsMonthH2] ?? EMPTY_ENTRY}
            totals={totalsH2}
          />
        </View>
      </ScrollView>

      {/* Aircraft picker */}
      <PickerModal
        visible={aircraftPickerVisible}
        title="Select Aircraft"
        options={AIRCRAFT_OPTIONS}
        selected={manufacturer}
        onSelect={setManufacturer}
        onClose={() => setAircraftPickerVisible(false)}
      />

      {/* Year picker */}
      <PickerModal
        visible={yearPickerVisible}
        title="Select Year"
        options={YEAR_OPTIONS.map(String)}
        selected={String(year)}
        onSelect={(v) => setYear(parseInt(v, 10))}
        onClose={() => setYearPickerVisible(false)}
      />
    </ScreenLayout>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // ── HERO ──
  hero: {
    backgroundColor: Colors.hero,
    paddingHorizontal: 18,
    paddingBottom: 20,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  mapBase: {
    position: "absolute",
    tintColor: Colors.heroMap,
    opacity: 0.72,
  },
  mapAmericas: { left: -84, top: -44, width: 228, height: 418 },
  mapEuraf:    { right: -54, top: -30, width: 378, height: 288 },
  mapAustralia:{ right: 56, top: 224, width: 56, height: 46, opacity: 0.42 },

  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  backBtn: {
    width: 34,
    height: 34,
    justifyContent: "center",
  },
  heroTitle: {
    color: Colors.textLight,
    fontSize: 22,
    fontWeight: "800",
    fontFamily: Fonts.rounded,
    flex: 1,
    textAlign: "center",
  },

  // ── BODY ──
  body: {
    backgroundColor: Colors.hero,
    paddingTop: 16,
    paddingHorizontal: 14,
  },

  // ── CARD ──
  card: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },

  // ── MANUFACTURER ROW ──
  manufacturerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  manufacturerLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.muted,
    fontFamily: Fonts.rounded,
    marginBottom: 2,
    letterSpacing: 0.3,
  },
  manufacturerValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  manufacturerValue: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.textPrimary,
    fontFamily: Fonts.rounded,
    flexShrink: 1,
  },
  yearWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  yearText: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.textPrimary,
    fontFamily: Fonts.rounded,
    letterSpacing: 0.5,
  },
  listIconBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: Colors.bodyBackground,
  },

  // ── MONTH TABS ──
  monthTabsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
    paddingBottom: 4,
  },
  monthTab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 6,
  },
  monthTabText: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.muted,
    fontFamily: Fonts.rounded,
    letterSpacing: 0.3,
  },
  monthTabTextActive: {
    color: Colors.textPrimary,
  },
  monthTabUnderline: {
    marginTop: 4,
    height: 3,
    width: 22,
    borderRadius: 2,
    backgroundColor: Colors.yellow,
  },

  // ── INPUT ──
  inputBlock: { marginBottom: 14 },
  inputLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.textPrimary,
    fontFamily: Fonts.rounded,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  input: {
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    fontSize: 13,
    color: Colors.textPrimary,
    fontFamily: Fonts.rounded,
  },

  // ── DONE BUTTON ──
  doneBtnWrap: { alignItems: "center", marginTop: 4 },
  doneBtn: {
    backgroundColor: Colors.yellow,
    paddingHorizontal: 30,
    paddingVertical: 8,
    borderRadius: 18,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  doneBtnText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: "800",
    fontFamily: Fonts.rounded,
  },

  // ── TOTALS BADGE ──
  totalsBadge: {
    alignSelf: "flex-start",
    borderWidth: 1.4,
    borderColor: "#2E9D6A",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 14,
  },
  totalsBadgeText: {
    color: "#2E9D6A",
    fontSize: 13,
    fontWeight: "700",
    fontFamily: Fonts.rounded,
    letterSpacing: 0.3,
  },

  // ── DROPDOWN ──
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingHorizontal: 12,
    marginBottom: 14,
    backgroundColor: Colors.card,
  },
  dropdownText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textPrimary,
    fontFamily: Fonts.rounded,
  },

  // ── READONLY FIELDS ──
  readonlyBlock: { marginBottom: 14 },
  readonlyField: {
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingHorizontal: 12,
    justifyContent: "center",
    backgroundColor: Colors.bodyBackground,
  },
  readonlyText: {
    fontSize: 13,
    color: Colors.placeholder,
    fontFamily: Fonts.rounded,
  },
  readonlyTextFilled: {
    color: Colors.textPrimary,
    fontWeight: "600",
  },

  // ── TOTALS SUMMARY ──
  totalsSummary: {
    marginTop: 4,
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.bodyBackground,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  totalsSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  totalsSummaryLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.muted,
    fontFamily: Fonts.rounded,
  },
  totalsSummaryValue: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.textPrimary,
    fontFamily: Fonts.rounded,
  },

  // ── MODAL ──
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    paddingVertical: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: Colors.textPrimary,
    fontFamily: Fonts.rounded,
  },
  modalRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalRowText: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontFamily: Fonts.rounded,
    flexShrink: 1,
  },
  modalRowTextActive: {
    fontWeight: "800",
    color: Colors.yellow,
  },
  modalDivider: {
    height: 1,
    backgroundColor: Colors.cardBorder,
    marginHorizontal: 16,
  },
});