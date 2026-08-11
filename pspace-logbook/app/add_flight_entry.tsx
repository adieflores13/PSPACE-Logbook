import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Image, Modal, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import FiveIconNav from "@/components/layout/five-icon-nav";
import { useAircraft } from "@/context/aircraft-context";
import { useFlights } from "@/context/flight-context";

const NAVY = "#032451";
const AMBER = "#FFBB57";

function InputRow({ label, value, onChange, icon, suffix, onPress }: { label: string; value: string; onChange?: (value: string) => void; icon?: keyof typeof Ionicons.glyphMap; suffix?: string; onPress?: () => void }) {
  const inner = <View style={styles.inputBox}>{icon && <Ionicons name={icon} size={15} color={NAVY} />}<TextInput style={styles.input} value={value} editable={!onPress} onChangeText={onChange} /><Text style={styles.suffix}>{suffix}</Text>{onPress && <Ionicons name="chevron-down" size={18} color={NAVY} />}</View>;
  return <View style={styles.row}><Text style={styles.label}>{label}</Text>{onPress ? <TouchableOpacity style={styles.flex} onPress={onPress}>{inner}</TouchableOpacity> : <View style={styles.flex}>{inner}</View>}</View>;
}

export default function AddFlightEntryScreen() {
  const router = useRouter();
  const { aircraft } = useAircraft();
  const { addFlight } = useFlights();
  const [date, setDate] = useState("July 25, 2026"); const [departure, setDeparture] = useState("KFRG - Republic"); const [destination, setDestination] = useState("KBOS - Boston Logan"); const [duration, setDuration] = useState("1.6"); const [instructor, setInstructor] = useState("CFI John Smith"); const [landings, setLandings] = useState("2"); const [remarks, setRemarks] = useState("Training flight - Steep turns, stalls,\nlanding practice."); const [period, setPeriod] = useState("Day"); const [pickerVisible, setPickerVisible] = useState(false);
  const [selectedAircraftId, setSelectedAircraftId] = useState<string | null>(null);
  const selectedAircraft = useMemo(() => aircraft.find((item) => item.id === selectedAircraftId) ?? aircraft[0], [aircraft, selectedAircraftId]);
  const aircraftValue = selectedAircraft ? `${selectedAircraft.registration} - ${selectedAircraft.makeModelVariant.replaceAll(" / ", " ")}` : "Add an aircraft first";
  const saveFlight = () => { if (!selectedAircraft) return; addFlight({ date, departure: departure.split(" ")[0], destination: destination.split(" ")[0], aircraftType: selectedAircraft.makeModelVariant.replaceAll(" / ", " "), aircraftRegistration: selectedAircraft.registration, duration, landings, instructor }); router.replace("/flights" as never); };
  return <SafeAreaView style={styles.safeArea}>
    <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Image source={require("@/assets/images/country2.png")} style={styles.map} resizeMode="cover" />
      <View style={styles.header}><TouchableOpacity style={styles.backButton} onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={NAVY} /></TouchableOpacity><Text style={styles.title}>Add Flight Entry</Text><View style={styles.headerSpacer} /></View>
      <InputRow label="Date" value={date} onChange={setDate} icon="calendar-outline" />
      <InputRow label="Departure" value={departure} onChange={setDeparture} />
      <InputRow label="Destination" value={destination} onChange={setDestination} />
      <InputRow label="Aircraft" value={aircraftValue} onPress={() => aircraft.length > 0 && setPickerVisible(true)} />
      {aircraft.length === 0 && <Text style={styles.aircraftHint}>Create an aircraft in Aircrafts before saving a flight.</Text>}
      <InputRow label="Flight Duration" value={duration} onChange={setDuration} suffix="hrs" />
      <View style={styles.row}><Text style={styles.label}>Day / Night</Text><View style={[styles.flex, styles.periods]}>{["Day", "Night"].map((item) => <TouchableOpacity key={item} style={[styles.period, period === item && styles.periodActive]} onPress={() => setPeriod(item)}><Ionicons name={item === "Day" ? "sunny" : "moon"} size={13} color={NAVY} /><Text style={styles.periodText}>{item}</Text></TouchableOpacity>)}</View></View>
      <InputRow label="Instructor" value={instructor} onChange={setInstructor} />
      <InputRow label="Landings" value={landings} onChange={setLandings} />
      <View style={[styles.row, styles.remarksRow]}><Text style={styles.label}>Remarks</Text><TextInput value={remarks} onChangeText={setRemarks} multiline textAlignVertical="top" style={styles.remarks} /></View>
      <View style={styles.info}><Ionicons name="information-circle-outline" size={19} color={NAVY} /><Text style={styles.infoText}>A single flight may count in multiple categories:{"\n"}Student + Multi-Engine + Instrument</Text></View>
      <TouchableOpacity style={[styles.saveButton, !selectedAircraft && styles.disabledButton]} onPress={saveFlight} disabled={!selectedAircraft}><Text style={styles.saveButtonText}>Save Flight</Text></TouchableOpacity>
    </ScrollView>
    <FiveIconNav active="flights" />
    <Modal visible={pickerVisible} transparent animationType="fade" onRequestClose={() => setPickerVisible(false)}><TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setPickerVisible(false)}><View style={styles.picker}><Text style={styles.pickerTitle}>Select Aircraft</Text>{aircraft.map((item) => <TouchableOpacity key={item.id} style={styles.pickerItem} onPress={() => { setSelectedAircraftId(item.id); setPickerVisible(false); }}><Ionicons name="airplane-outline" size={20} color={NAVY} /><View><Text style={styles.pickerRegistration}>{item.registration}</Text><Text style={styles.pickerModel}>{item.makeModelVariant}</Text></View></TouchableOpacity>)}</View></TouchableOpacity></Modal>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" }, content: { paddingHorizontal: 15, paddingBottom: 28, overflow: "hidden" }, map: { position: "absolute", width: "125%", height: 190, top: -54, right: -94, opacity: 0.055 }, header: { height: 104, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }, backButton: { width: 42, height: 42, justifyContent: "center" }, headerSpacer: { width: 42 }, title: { color: NAVY, fontSize: 27, fontWeight: "900" }, row: { flexDirection: "row", alignItems: "center", gap: 15, marginBottom: 10 }, label: { width: 66, color: NAVY, fontSize: 11, fontWeight: "800" }, flex: { flex: 1 }, inputBox: { height: 28, borderWidth: 1.5, borderColor: "#BFC1C6", borderRadius: 5, flexDirection: "row", alignItems: "center", paddingHorizontal: 9, gap: 8 }, input: { flex: 1, fontSize: 11, color: NAVY, fontWeight: "700", paddingVertical: 3 }, suffix: { color: NAVY, fontSize: 10 }, aircraftHint: { color: "#B25329", fontSize: 10, marginLeft: 81, marginTop: -4, marginBottom: 8 }, periods: { flexDirection: "row", gap: 16 }, period: { width: 98, height: 21, borderWidth: 1.5, borderColor: "#BFC1C6", borderRadius: 4, flexDirection: "row", alignItems: "center", paddingHorizontal: 8, gap: 13 }, periodActive: { backgroundColor: "#F5F7FA" }, periodText: { color: NAVY, fontSize: 8 }, remarksRow: { alignItems: "flex-start", marginTop: 7 }, remarks: { flex: 1, minHeight: 97, borderWidth: 1.5, borderColor: "#BFC1C6", borderRadius: 5, padding: 9, color: NAVY, fontSize: 10 }, info: { minHeight: 63, backgroundColor: "#CCF2F9", borderRadius: 5, paddingHorizontal: 29, flexDirection: "row", alignItems: "center", gap: 14, marginTop: 9 }, infoText: { flex: 1, color: NAVY, fontSize: 11, lineHeight: 14 }, saveButton: { alignSelf: "center", width: 100, height: 34, borderRadius: 11, borderWidth: 1.5, borderColor: "#2563FF", backgroundColor: AMBER, justifyContent: "center", alignItems: "center", marginTop: 24 }, disabledButton: { opacity: 0.45 }, saveButtonText: { color: NAVY, fontSize: 11, fontWeight: "900" }, backdrop: { flex: 1, justifyContent: "center", backgroundColor: "rgba(3, 36, 81, 0.65)", padding: 30 }, picker: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 20 }, pickerTitle: { color: NAVY, fontSize: 18, fontWeight: "900", marginBottom: 12 }, pickerItem: { flexDirection: "row", gap: 12, alignItems: "center", paddingVertical: 12, borderTopWidth: 1, borderColor: "#E4E6EB" }, pickerRegistration: { color: NAVY, fontSize: 14, fontWeight: "900" }, pickerModel: { color: "#65718A", fontSize: 11, marginTop: 2 },
});
