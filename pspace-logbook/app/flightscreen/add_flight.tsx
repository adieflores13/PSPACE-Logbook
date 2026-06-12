import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Platform,
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
import FlightSavedAlert from "@/components/alert";

// ---------------------------------------------------------------------------
// Static sample data
// ---------------------------------------------------------------------------

const AIRCRAFT_TYPES = [
  "Cessna 172S",
  "Cessna 152",
  "Piper PA-28 Cherokee",
  "Beechcraft Bonanza G36",
  "Diamond DA40",
  "Cirrus SR22",
];

const AIRPORTS = [
  "KAPA - Centennial (APA)",
  "KDEN - Denver Intl (DEN)",
  "KLAX - Los Angeles Intl (LAX)",
  "KJFK - John F. Kennedy Intl (JFK)",
  "KORD - O'Hare Intl (ORD)",
  "KSFO - San Francisco Intl (SFO)",
  "KPHX - Phoenix Sky Harbor (PHX)",
  "KATL - Hartsfield-Jackson Atlanta (ATL)",
];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FlightForm {
  flightDate: Date;
  aircraftType: string;
  aircraftRegistration: string;
  departureAirport: string;
  arrivalAirport: string;
  blockOffTime: string;
  blockOnTime: string;
  flightDuration: string;
  instructor: string;
  picDual: "PIC" | "Dual";
  landings: number;
  weather: string;
  remarks: string;
}

type PickerModalProps = {
  visible: boolean;
  title: string;
  options: string[];
  onSelect: (value: string) => void;
  onClose: () => void;
};

// ---------------------------------------------------------------------------
// Picker Modal
// ---------------------------------------------------------------------------

function PickerModal({ visible, title, options, onSelect, onClose }: PickerModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={modalStyles.overlay} />
      </TouchableWithoutFeedback>
      <View style={modalStyles.sheet}>
        <View style={modalStyles.handle} />
        <Text style={modalStyles.title}>{title}</Text>
        <FlatList
          data={options}
          keyExtractor={(item) => item}
          ItemSeparatorComponent={() => <View style={modalStyles.separator} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              style={modalStyles.option}
              onPress={() => {
                onSelect(item);
                onClose();
              }}>
              <Text style={modalStyles.optionText}>{item}</Text>
              <Ionicons color={COLORS.iconGray} name="chevron-forward" size={16} />
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// DropdownRow
// ---------------------------------------------------------------------------

type DropdownRowProps = {
  label: string;
  value: string;
  icon?: React.ReactNode;
  onPress?: () => void;
};

function DropdownRow({ label, value, icon, onPress }: DropdownRowProps) {
  return (
    <View style={styles.fieldRow}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TouchableOpacity activeOpacity={0.75} style={styles.dropdownBox} onPress={onPress}>
        {icon && <View style={styles.dropdownIcon}>{icon}</View>}
        <Text style={[styles.dropdownText, !value && styles.dropdownPlaceholder]}>
          {value || "Select…"}
        </Text>
        <Ionicons color={COLORS.iconGray} name="chevron-down" size={18} />
      </TouchableOpacity>
    </View>
  );
}

// ---------------------------------------------------------------------------
// TextRow
// ---------------------------------------------------------------------------

type TextRowProps = {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  keyboardType?: "default" | "numeric" | "decimal-pad";
  suffix?: string;
};

function TextRow({ label, value, onChangeText, placeholder = "", icon, keyboardType = "default", suffix }: TextRowProps) {
  return (
    <View style={styles.fieldRow}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.dropdownBox}>
        {icon && <View style={styles.dropdownIcon}>{icon}</View>}
        <TextInput
          style={styles.inlineTextInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.placeholder}
          keyboardType={keyboardType}
        />
        {suffix ? <Text style={styles.suffixText}>{suffix}</Text> : null}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

export default function AddFlightScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [form, setForm] = useState<FlightForm>({
    flightDate: new Date(2025, 4, 20),
    aircraftType: "Cessna 172S",
    aircraftRegistration: "N1234AB",
    departureAirport: "KAPA - Centennial (APA)",
    arrivalAirport: "KDEN - Denver Intl (DEN)",
    blockOffTime: "0815",
    blockOnTime: "1045",
    flightDuration: "02:30",
    instructor: "John D. Anderson",
    picDual: "PIC",
    landings: 3,
    weather: "Scattered Clouds",
    remarks: "",
  });

  const setField = <K extends keyof FlightForm>(key: K, value: FlightForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // DatePicker state
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (selectedDate) setField("flightDate", selectedDate);
  };

  // Dropdown modal state
  const [activeModal, setActiveModal] = useState<"aircraftType" | "departureAirport" | "arrivalAirport" | null>(null);
  const [showSavedAlert, setShowSavedAlert] = useState(false);

  const handleSave = () => {
    if (!form.departureAirport || !form.arrivalAirport) {
      Alert.alert("Incomplete", "Please fill in required fields.");
      return;
    }
    setShowSavedAlert(true);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />

        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons color={COLORS.textPrimary} name="arrow-back" size={22} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Enter Record</Text>
          <View style={styles.backBtn} />
        </View>

        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 16) + 32 }]}>

          {/* ── Page title ── */}
          <View style={styles.pageTitleRow}>
            <MaterialCommunityIcons color={COLORS.textPrimary} name="airplane-takeoff" size={26} />
            <Text style={styles.pageTitle}>Add Flight Record</Text>
          </View>

          <View style={styles.divider} />

          {/* ── Flight Date ── */}
          <DropdownRow
            label="Flight Date"
            value={formatDate(form.flightDate)}
            icon={<Ionicons color={COLORS.iconGray} name="calendar-outline" size={17} />}
            onPress={() => setShowDatePicker(true)}
          />

          {/* iOS inline date picker */}
          {showDatePicker && Platform.OS === "ios" && (
            <View style={styles.iosPickerWrap}>
              <DateTimePicker
                mode="date"
                display="spinner"
                value={form.flightDate}
                onChange={onDateChange}
                textColor="#FFFFFF"
                themeVariant="dark"
              />
              <TouchableOpacity style={styles.iosPickerDone} onPress={() => setShowDatePicker(false)}>
                <Text style={styles.iosPickerDoneText}>Done</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Android date picker */}
          {showDatePicker && Platform.OS === "android" && (
            <DateTimePicker
              mode="date"
              display="default"
              value={form.flightDate}
              onChange={onDateChange}
            />
          )}

          {/* ── Aircraft Type ── */}
          <DropdownRow
            label="Aircraft Type"
            value={form.aircraftType}
            icon={<MaterialCommunityIcons color={COLORS.iconGray} name="airplane" size={17} />}
            onPress={() => setActiveModal("aircraftType")}
          />

          {/* ── Aircraft Registration ── */}
          <DropdownRow
            label="Aircraft Registration"
            value={form.aircraftRegistration}
          />

          {/* ── Departure Airport ── */}
          <DropdownRow
            label="Departure Airport"
            value={form.departureAirport}
            icon={<Ionicons color={COLORS.iconGray} name="location-outline" size={17} />}
            onPress={() => setActiveModal("departureAirport")}
          />

          {/* ── Arrival Airport ── */}
          <DropdownRow
            label="Arrival Airport"
            value={form.arrivalAirport}
            icon={<Ionicons color={COLORS.iconGray} name="location-outline" size={17} />}
            onPress={() => setActiveModal("arrivalAirport")}
          />

          {/* ── Block Off / On Time ── */}
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Block Off Time</Text>
            <View style={styles.timeRowWrap}>
              <View style={styles.timeBox}>
                <Ionicons color={COLORS.iconGray} name="time-outline" size={16} style={styles.timeIcon} />
                <TextInput
                  style={styles.timeInput}
                  value={form.blockOffTime}
                  onChangeText={(v) => setField("blockOffTime", v)}
                  keyboardType="numeric"
                  placeholder="0000"
                  placeholderTextColor={COLORS.placeholder}
                />
              </View>
              <View style={styles.timeBox}>
                <Ionicons color={COLORS.iconGray} name="time-outline" size={16} style={styles.timeIcon} />
                <TextInput
                  style={styles.timeInput}
                  value={form.blockOnTime}
                  onChangeText={(v) => setField("blockOnTime", v)}
                  keyboardType="numeric"
                  placeholder="0000"
                  placeholderTextColor={COLORS.placeholder}
                />
              </View>
            </View>
          </View>

          {/* ── Flight Duration ── */}
          <TextRow
            label="Flight Duration"
            value={form.flightDuration}
            onChangeText={(v) => setField("flightDuration", v)}
            icon={<Ionicons color={COLORS.iconGray} name="time-outline" size={17} />}
            keyboardType="decimal-pad"
            suffix="(hh:mm)"
          />

          {/* ── Instructor ── */}
          <DropdownRow
            label="Instructor"
            value={form.instructor}
            icon={<Ionicons color={COLORS.iconGray} name="person-outline" size={17} />}
          />

          {/* ── PIC / Dual toggle ── */}
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>PIC / Dual</Text>
            <View style={styles.toggleWrap}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.toggleBtn, form.picDual === "PIC" && styles.toggleBtnActive]}
                onPress={() => setField("picDual", "PIC")}>
                <Text style={[styles.toggleBtnText, form.picDual === "PIC" && styles.toggleBtnTextActive]}>PIC</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.toggleBtn, form.picDual === "Dual" && styles.toggleBtnActive]}
                onPress={() => setField("picDual", "Dual")}>
                <Text style={[styles.toggleBtnText, form.picDual === "Dual" && styles.toggleBtnTextActive]}>Dual</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Landings ── */}
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Landings</Text>
            <View style={styles.dropdownBox}>
              <MaterialCommunityIcons color={COLORS.iconGray} name="airplane-landing" size={18} style={{ marginRight: 8 }} />
              <Text style={styles.landingsValue}>{form.landings}</Text>
              <View style={styles.landingsBtns}>
                <TouchableOpacity
                  style={styles.landingsBtn}
                  onPress={() => setField("landings", Math.max(0, form.landings - 1))}>
                  <Ionicons color={COLORS.textPrimary} name="remove" size={16} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.landingsBtn}
                  onPress={() => setField("landings", form.landings + 1)}>
                  <Ionicons color={COLORS.textPrimary} name="add" size={16} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* ── Weather ── */}
          <DropdownRow
            label="Weather"
            value={form.weather}
            icon={<Ionicons color={COLORS.iconGray} name="partly-sunny-outline" size={17} />}
          />

          {/* ── Remarks ── */}
          <View style={styles.remarksRow}>
            <Text style={styles.fieldLabel}>Remarks</Text>
            <TextInput
              style={styles.remarksInput}
              value={form.remarks}
              onChangeText={(v) => setField("remarks", v)}
              placeholder={"VFR training flight\nPracticed steep turns and normal landings."}
              placeholderTextColor={COLORS.placeholder}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* ── Save Button ── */}
          <TouchableOpacity activeOpacity={0.88} onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save Record</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* ── Picker Modals ── */}
      <PickerModal
        visible={activeModal === "aircraftType"}
        title="Select Aircraft Type"
        options={AIRCRAFT_TYPES}
        onSelect={(v) => setField("aircraftType", v)}
        onClose={() => setActiveModal(null)}
      />
      <PickerModal
        visible={activeModal === "departureAirport"}
        title="Select Departure Airport"
        options={AIRPORTS}
        onSelect={(v) => setField("departureAirport", v)}
        onClose={() => setActiveModal(null)}
      />
      <PickerModal
        visible={activeModal === "arrivalAirport"}
        title="Select Arrival Airport"
        options={AIRPORTS}
        onSelect={(v) => setField("arrivalAirport", v)}
        onClose={() => setActiveModal(null)}
      />

      <FlightSavedAlert
        visible={showSavedAlert}
        onDone={() => {
          setShowSavedAlert(false);
          router.back();
        }}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Tokens
// ---------------------------------------------------------------------------

const COLORS = {
  white: "#FFFFFF",
  background: "#F5F6F8",
  textPrimary: "#001B3A",
  textSecondary: "#5A6474",
  placeholder: "#B0B5BE",
  border: "#DDE1E8",
  iconGray: "#7A8494",
  yellow: "#F9C231",
  toggleActive: "#1A3560",
  toggleActiveTxt: "#FFFFFF",
  toggleInactiveTxt: "#5A6474",
  sheetBg: "#FFFFFF",
  overlay: "rgba(0,0,0,0.35)",
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.white },

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
  headerTitle: { fontFamily: Fonts.rounded, fontWeight: "700", fontSize: 18, color: COLORS.textPrimary },

  scrollContent: { paddingHorizontal: 20, paddingTop: 16, backgroundColor: COLORS.white },

  pageTitleRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14 },
  pageTitle: { fontFamily: Fonts.rounded, fontWeight: "700", fontSize: 20, color: COLORS.textPrimary },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: COLORS.border, marginBottom: 18 },

  fieldRow: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  fieldLabel: {
    width: "34%",
    fontFamily: Fonts.rounded,
    fontWeight: "600",
    fontSize: 13,
    color: COLORS.textPrimary,
    paddingRight: 8,
  },

  dropdownBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    borderRadius: 10,
    borderWidth: 1.4,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
  },
  dropdownIcon: { marginRight: 8 },
  dropdownText: { flex: 1, fontFamily: Fonts.rounded, fontSize: 13, color: COLORS.textPrimary },
  dropdownPlaceholder: { color: COLORS.placeholder },

  inlineTextInput: { flex: 1, fontFamily: Fonts.rounded, fontSize: 13, color: COLORS.textPrimary, padding: 0 },
  suffixText: { fontFamily: Fonts.rounded, fontSize: 11, color: COLORS.textSecondary, marginLeft: 4 },

  // iOS date picker
  iosPickerWrap: {
    backgroundColor: "#001B3A",
    borderRadius: 12,
    marginBottom: 14,
    overflow: "hidden",
    borderWidth: 1.4,
    borderColor: COLORS.border,
  },
  iosPickerDone: { alignItems: "flex-end", paddingHorizontal: 16, paddingBottom: 10 },
  iosPickerDoneText: { fontFamily: Fonts.rounded, fontWeight: "700", fontSize: 15, color: COLORS.yellow },

  timeRowWrap: { flex: 1, flexDirection: "row", gap: 10 },
  timeBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    borderRadius: 10,
    borderWidth: 1.4,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    paddingHorizontal: 10,
  },
  timeIcon: { marginRight: 6 },
  timeInput: { flex: 1, fontFamily: Fonts.rounded, fontSize: 14, color: COLORS.textPrimary, padding: 0 },

  toggleWrap: {
    flex: 1,
    flexDirection: "row",
    borderRadius: 10,
    borderWidth: 1.4,
    borderColor: COLORS.border,
    overflow: "hidden",
    height: 44,
  },
  toggleBtn: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.background },
  toggleBtnActive: { backgroundColor: COLORS.toggleActive },
  toggleBtnText: { fontFamily: Fonts.rounded, fontWeight: "700", fontSize: 14, color: COLORS.toggleInactiveTxt },
  toggleBtnTextActive: { color: COLORS.toggleActiveTxt },

  landingsValue: { flex: 1, fontFamily: Fonts.rounded, fontWeight: "700", fontSize: 15, color: COLORS.textPrimary },
  landingsBtns: { flexDirection: "row", gap: 2 },
  landingsBtn: {
    width: 28, height: 28,
    borderRadius: 6,
    borderWidth: 1.2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
  },

  remarksRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 28 },
  remarksInput: {
    flex: 1,
    minHeight: 96,
    borderRadius: 10,
    borderWidth: 1.4,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingTop: 10,
    fontFamily: Fonts.rounded,
    fontSize: 13,
    color: COLORS.textPrimary,
  },

  saveButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: COLORS.yellow,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  saveButtonText: { fontFamily: Fonts.rounded, fontWeight: "800", fontSize: 16, color: COLORS.textPrimary, letterSpacing: 0.2 },
});

const modalStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: COLORS.overlay },
  sheet: {
    backgroundColor: COLORS.sheetBg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingBottom: 32,
    maxHeight: "60%",
  },
  handle: {
    width: 40, height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: "center",
    marginBottom: 12,
  },
  title: {
    fontFamily: Fonts.rounded,
    fontWeight: "700",
    fontSize: 16,
    color: COLORS.textPrimary,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: COLORS.border, marginHorizontal: 20 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  optionText: { fontFamily: Fonts.rounded, fontSize: 14, color: COLORS.textPrimary, flex: 1 },
});