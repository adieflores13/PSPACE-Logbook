import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import FiveIconNav from "@/components/layout/five-icon-nav";
import RegistrationStatusModal from "@/components/registration-status-modal";
import { useAircraft } from "@/context/aircraft-context";

const NAVY = "#032451";
const AMBER = "#FFBB57";
const FIELD_BORDER = "#BFC1C6";

const categories = ["Single-Engine", "Multi-Engine", "Jet", "Turboprop", "Simulator", "Other"];
const roles = ["Cadet", "Student Pilot", "PIC", "Co-Pilot", "Instructor"];

function Field({ label, icon, value, onChangeText, placeholder, chevron = false, wide = false }: {
  label: string; icon?: keyof typeof Ionicons.glyphMap; value: string; onChangeText: (value: string) => void; placeholder: string; chevron?: boolean; wide?: boolean;
}) {
  return (
    <View style={styles.fieldRow}>
      <Text style={[styles.fieldLabel, wide && styles.wideLabel]}>{label}</Text>
      <View style={styles.fieldBox}>
        {icon && <Ionicons name={icon} size={15} color={NAVY} style={styles.fieldIcon} />}
        <TextInput style={styles.fieldInput} value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#A1A5AD" />
        {chevron && <Ionicons name="chevron-down" size={19} color="#30343B" />}
      </View>
    </View>
  );
}

export default function AircraftRegistrationScreen() {
  const router = useRouter();
  const { addAircraft } = useAircraft();
  const [registration, setRegistration] = useState("N1234AB");
  const [aircraftType, setAircraftType] = useState("Cessna 172S");
  const [category, setCategory] = useState("Multi-Engine");
  const [selectedRoles, setSelectedRoles] = useState<string[]>(["Cadet", "Student Pilot"]);
  const [picDual, setPicDual] = useState("PIC");
  const [remarks, setRemarks] = useState("VFR training flight.\nPracticed steep turns and\nnormal landings.");
  const [modalState, setModalState] = useState<"confirm" | "success" | null>(null);

  const toggleRole = (role: string) => setSelectedRoles((current) => current.includes(role) ? current.filter((item) => item !== role) : [...current, role]);
  const registerAircraft = () => {
    const parts = aircraftType.trim().split(/\s+/);
    addAircraft({ registration, make: parts[0] || "Aircraft", model: parts.slice(1).join(" "), variant: "" });
    setModalState("success");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Image source={require("@/assets/images/country2.png")} style={styles.map} resizeMode="cover" />
        <View style={styles.pageHeader}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={NAVY} /></TouchableOpacity>
          <Text style={styles.title}>Registration</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.sectionTitleRow}><Ionicons name="airplane-outline" size={29} color={NAVY} /><Text style={styles.sectionTitle}>Registration</Text></View>

        <Field label="Flight Date" icon="calendar-outline" value="May 20, 2025" onChangeText={() => {}} placeholder="Flight date" chevron />
        <Field label="Aircraft Type" icon="airplane-outline" value={aircraftType} onChangeText={setAircraftType} placeholder="Aircraft type" />
        <Field label="Aircraft Registration" value={registration} onChangeText={setRegistration} placeholder="Registration" wide />
        <Field label="Departure Airport" icon="location-outline" value="KAPA - Centennial (APA)" onChangeText={() => {}} placeholder="Departure airport" wide />
        <Field label="Arrival Airport" icon="location-outline" value="KDEN - Denver Intl (DEN)" onChangeText={() => {}} placeholder="Arrival airport" wide />

        <View style={styles.fieldRow}><Text style={styles.fieldLabel}>Block Off Time</Text><View style={styles.timeWrap}><View style={styles.timeBox}><Ionicons name="time-outline" size={15} color={NAVY} /><Text style={styles.timeText}>08:15</Text></View><View style={styles.timeBox}><Ionicons name="time-outline" size={15} color={NAVY} /><Text style={styles.timeText}>10:45</Text></View></View></View>
        <View style={styles.fieldRow}><Text style={styles.fieldLabel}>Flight Duration</Text><View style={styles.durationBox}><Ionicons name="time-outline" size={15} color={NAVY} /><Text style={styles.timeText}>02:30</Text><Text style={styles.hhmm}>(HH:MM)</Text></View></View>
        <Field label="Instructor" icon="person-outline" value="John D. Anderson" onChangeText={() => {}} placeholder="Instructor" chevron />

        <View style={styles.fieldRow}><Text style={styles.fieldLabel}>PIC / Dual</Text><View style={styles.segment}><TouchableOpacity style={[styles.segmentOption, picDual === "PIC" && styles.segmentActive]} onPress={() => setPicDual("PIC")}><Text style={[styles.segmentText, picDual === "PIC" && styles.segmentTextActive]}>PIC</Text></TouchableOpacity><TouchableOpacity style={[styles.segmentOption, picDual === "Dual" && styles.segmentActive]} onPress={() => setPicDual("Dual")}><Text style={[styles.segmentText, picDual === "Dual" && styles.segmentTextActive]}>Dual</Text></TouchableOpacity></View></View>
        <View style={styles.fieldRow}><Text style={styles.fieldLabel}>Landings</Text><View style={styles.landingBox}><Ionicons name="airplane-outline" size={16} color={NAVY} /><Text style={styles.timeText}>3</Text><View style={styles.stepper}><Text style={styles.stepperText}>-</Text><Text style={styles.stepperText}>+</Text></View></View></View>
        <Field label="Weather" icon="cloud-outline" value="Scattered Clouds" onChangeText={() => {}} placeholder="Weather" chevron />

        <View style={styles.subHeader}><Text style={styles.subHeaderText}>Aircraft / Engine Category</Text><Ionicons name="help-circle-outline" size={18} color={NAVY} /></View>
        <View style={styles.optionGrid}>{categories.map((item) => <TouchableOpacity key={item} style={[styles.category, category === item && styles.categoryActive]} onPress={() => setCategory(item)}><Ionicons name={item === "Jet" ? "paper-plane-outline" : item === "Simulator" ? "disc-outline" : "airplane-outline"} size={21} color={category === item ? "#FFFFFF" : NAVY} /><Text style={[styles.categoryText, category === item && styles.categoryTextActive]}>{item}</Text>{category === item && <Ionicons name="checkmark-circle" size={14} color="#FFFFFF" style={styles.selectedMark} />}</TouchableOpacity>)}</View>

        <Text style={styles.subHeaderText}>Who is this for?</Text>
        <View style={styles.roles}>{roles.map((role) => <TouchableOpacity key={role} style={[styles.role, selectedRoles.includes(role) && (role === "Student Pilot" ? styles.studentRole : styles.roleActive)]} onPress={() => toggleRole(role)}><Ionicons name={role === "Cadet" ? "school-outline" : role === "PIC" ? "person-outline" : role === "Co-Pilot" ? "headset-outline" : "people-outline"} size={19} color={selectedRoles.includes(role) && role !== "Student Pilot" ? "#FFFFFF" : NAVY} /><Text style={[styles.roleText, selectedRoles.includes(role) && role !== "Student Pilot" && styles.roleTextActive]}>{role}</Text>{selectedRoles.includes(role) && <Ionicons name="checkmark-circle" size={13} color={role === "Student Pilot" ? NAVY : "#FFFFFF"} style={styles.roleCheck} />}</TouchableOpacity>)}</View>

        <Text style={styles.remarksLabel}>Remarks</Text>
        <TextInput style={styles.remarks} multiline value={remarks} onChangeText={setRemarks} placeholder="Enter remarks..." placeholderTextColor="#9FA3AA" textAlignVertical="top" />
        <View style={styles.info}><Ionicons name="information-circle-outline" size={19} color={NAVY} /><Text style={styles.infoText}>Role selection affects how this flight is recorded in your logbook.</Text></View>
        <TouchableOpacity style={styles.proceed} activeOpacity={0.85} onPress={() => setModalState("confirm")}><Text style={styles.proceedText}>Proceed</Text></TouchableOpacity>
      </ScrollView>
      <FiveIconNav active="aircrafts" />
      <RegistrationStatusModal
        visible={modalState !== null}
        variant={modalState ?? "confirm"}
        registration={registration}
        aircraftType={aircraftType}
        onConfirm={registerAircraft}
        onCancel={() => setModalState(null)}
        onViewRegistration={() => router.replace({ pathname: "/aircraft_details", params: { registration } } as never)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { paddingHorizontal: 18, paddingBottom: 28, overflow: "hidden" },
  map: { position: "absolute", width: "125%", height: 210, top: -56, right: -88, opacity: 0.055 },
  pageHeader: { height: 76, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backButton: { width: 42, height: 42, justifyContent: "center" },
  title: { color: NAVY, fontSize: 27, fontWeight: "900" }, headerSpacer: { width: 42 },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: 24, marginTop: 18, marginBottom: 39 },
  sectionTitle: { color: NAVY, fontSize: 17, fontWeight: "900" },
  fieldRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  fieldLabel: { width: 100, color: NAVY, fontSize: 11, fontWeight: "800" }, wideLabel: { fontSize: 10 },
  fieldBox: { flex: 1, minHeight: 28, flexDirection: "row", alignItems: "center", borderWidth: 1.5, borderColor: FIELD_BORDER, borderRadius: 5, paddingHorizontal: 8 },
  fieldIcon: { marginRight: 8 }, fieldInput: { flex: 1, color: NAVY, fontSize: 10, paddingVertical: 5 },
  timeWrap: { flex: 1, flexDirection: "row", gap: 14 }, timeBox: { flex: 1, height: 28, borderWidth: 1.5, borderColor: FIELD_BORDER, borderRadius: 5, flexDirection: "row", alignItems: "center", paddingHorizontal: 8, gap: 15 },
  timeText: { fontSize: 10, color: NAVY }, durationBox: { flex: 1, height: 28, borderWidth: 1.5, borderColor: FIELD_BORDER, borderRadius: 5, flexDirection: "row", alignItems: "center", paddingHorizontal: 8, gap: 15 }, hhmm: { marginLeft: "auto", fontSize: 7, color: NAVY, fontWeight: "800" },
  segment: { flex: 1, height: 28, borderRadius: 4, borderWidth: 1.5, borderColor: FIELD_BORDER, flexDirection: "row", overflow: "hidden" }, segmentOption: { flex: 1, alignItems: "center", justifyContent: "center" }, segmentActive: { backgroundColor: NAVY }, segmentText: { fontSize: 10, color: NAVY, fontWeight: "700" }, segmentTextActive: { color: "#FFFFFF" },
  landingBox: { flex: 1, height: 28, borderRadius: 5, borderWidth: 1.5, borderColor: FIELD_BORDER, flexDirection: "row", alignItems: "center", paddingLeft: 8, gap: 15 }, stepper: { height: 20, borderRadius: 4, backgroundColor: "#2F3034", marginLeft: "auto", flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 8, marginRight: 5 }, stepperText: { color: "#FFFFFF", fontSize: 12, fontWeight: "800" },
  subHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 11, marginBottom: 12 }, subHeaderText: { color: NAVY, fontSize: 13, fontWeight: "900", marginTop: 12, marginBottom: 12 },
  optionGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 7 }, category: { width: "47.7%", height: 42, borderWidth: 1.5, borderColor: FIELD_BORDER, borderRadius: 4, flexDirection: "row", alignItems: "center", paddingHorizontal: 9, gap: 15 }, categoryActive: { backgroundColor: NAVY, borderColor: NAVY }, categoryText: { color: NAVY, fontSize: 10, fontWeight: "800" }, categoryTextActive: { color: "#FFFFFF" }, selectedMark: { marginLeft: "auto" },
  roles: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 10, marginBottom: 21 }, role: { width: "31%", height: 41, borderWidth: 1.5, borderColor: FIELD_BORDER, borderRadius: 4, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9 }, roleActive: { backgroundColor: NAVY, borderColor: NAVY }, studentRole: { backgroundColor: "#B7D2F0", borderColor: "#93B5D9" }, roleText: { color: NAVY, fontSize: 9, fontWeight: "800" }, roleTextActive: { color: "#FFFFFF" }, roleCheck: { position: "absolute", top: 3, right: 3 },
  remarksLabel: { color: NAVY, fontSize: 12, fontWeight: "900", marginBottom: 8 }, remarks: { minHeight: 95, borderWidth: 1.5, borderColor: FIELD_BORDER, borderRadius: 5, padding: 9, fontSize: 10, color: NAVY },
  info: { minHeight: 62, backgroundColor: "#CCF2F9", borderRadius: 5, marginTop: 23, paddingHorizontal: 43, paddingVertical: 11, flexDirection: "row", alignItems: "center", gap: 13 }, infoText: { color: NAVY, fontSize: 10, lineHeight: 14, flex: 1 },
  proceed: { alignSelf: "center", width: 101, height: 35, borderRadius: 11, backgroundColor: AMBER, borderWidth: 1.5, borderColor: "#2563FF", justifyContent: "center", alignItems: "center", marginTop: 23 }, proceedText: { color: NAVY, fontSize: 11, fontWeight: "900" },
});
