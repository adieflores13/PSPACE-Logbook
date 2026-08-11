import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Modal, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import FiveIconNav from "@/components/layout/five-icon-nav";
import { Flight, useFlights } from "@/context/flight-context";

const NAVY = "#032451";
const AMBER = "#FFBB57";

function FlightCard({ flight, onPress }: { flight: Flight; onPress: () => void }) {
  return <TouchableOpacity style={styles.flightCard} activeOpacity={0.8} onPress={onPress}>
    <View style={styles.cardHeader}><View style={styles.dateWrap}><Ionicons name="calendar-outline" size={14} color={NAVY} /><Text style={styles.date}>{flight.date}</Text></View><View style={styles.duration}><Text style={styles.durationText}>{flight.duration} hrs</Text></View></View>
    <View style={styles.cardBody}>
      <View style={styles.aircraftLine}><Text style={styles.aircraftType}>{flight.aircraftType.toUpperCase()}</Text><Text style={styles.aircraftRegistration}>{flight.aircraftRegistration}</Text></View>
      <View style={styles.routeLine}><Text style={styles.route}><Ionicons name="airplane-outline" size={13} color={NAVY} /> {flight.departure} <Text style={styles.arrow}>→</Text> {flight.destination}</Text><Text style={styles.landings}>{flight.landings} Landings</Text><Ionicons name="chevron-forward" size={19} color="#202A38" /></View>
    </View>
    <View style={styles.cardFooter}><Text style={styles.instructor}>Instructor: {flight.instructor}</Text><View style={styles.recordBadge}><Text style={styles.recordBadgeText}>View Record</Text></View></View>
  </TouchableOpacity>;
}

function FlightDetailsModal({ flight, onClose }: { flight: Flight | null; onClose: () => void }) {
  if (!flight) return null;
  const detailRows = [
    ["time-outline", "Block Off: 08:15"],
    ["time-outline", "Block On: 10:45"],
    ["time-outline", `Duration: ${flight.duration} hrs`],
    ["airplane-outline", `Landings: ${flight.landings}`],
    ["person-outline", `Instructor: ${flight.instructor}`],
    ["ribbon-outline", "PIC / Dual: PIC"],
    ["cloud-outline", "Weather: Scattered Clouds"],
    ["reorder-three-outline", "Remarks: VFR training flight.\nPracticed steep turns and normal landings."],
  ] as const;

  return <Modal visible transparent animationType="fade" onRequestClose={onClose}>
    <View style={modalStyles.backdrop}>
      <View style={modalStyles.modal}>
        <View style={modalStyles.modalHeader}>
          <View style={modalStyles.dateWrap}><Ionicons name="calendar-outline" size={14} color={NAVY} /><Text style={modalStyles.date}>{flight.date}</Text></View>
          <TouchableOpacity onPress={onClose} style={modalStyles.collapse}><Text style={modalStyles.collapseText}>Collapse</Text><Ionicons name="chevron-down" size={14} color="#68717E" /></TouchableOpacity>
        </View>
        <View style={modalStyles.summary}>
          <View style={modalStyles.aircraftLine}><Text style={modalStyles.aircraftType}><Ionicons name="airplane-outline" size={14} color={AMBER} /> {flight.aircraftType}</Text><Text style={modalStyles.registration}>{flight.aircraftRegistration}</Text><View style={modalStyles.duration}><Text style={modalStyles.durationText}>{flight.duration} hrs</Text></View></View>
          <Text style={modalStyles.route}><Ionicons name="location-outline" size={15} color={AMBER} /> {flight.departure} (APA) <Text style={modalStyles.arrow}>→</Text> <Ionicons name="location-outline" size={15} color={AMBER} /> {flight.destination} (DEN)</Text>
        </View>
        <View style={modalStyles.rule} />
        <View style={modalStyles.detailsGrid}>{detailRows.map(([icon, text], index) => <View key={text} style={modalStyles.detailItem}><Ionicons name={icon} size={15} color="#FFFFFF" /><Text style={modalStyles.detailText}>{text}</Text></View>)}</View>
        <TouchableOpacity style={modalStyles.closeButton} onPress={onClose}><Text style={modalStyles.closeButtonText}>Close</Text></TouchableOpacity>
      </View>
    </View>
  </Modal>;
}

export default function FlightsScreen() {
  const router = useRouter();
  const { flights } = useFlights();
  const [query, setQuery] = useState("");
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const visibleFlights = flights.filter((flight) => [flight.departure, flight.destination, flight.aircraftRegistration, flight.aircraftType].join(" ").toLowerCase().includes(query.toLowerCase()));
  return <SafeAreaView style={styles.safeArea}>
    <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Image source={require("@/assets/images/country2.png")} style={styles.map} resizeMode="cover" />
      <View style={styles.header}><TouchableOpacity style={styles.backButton} onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={NAVY} /></TouchableOpacity><Text style={styles.title}>Flight List</Text><View style={styles.headerSpacer} /></View>
      <View style={styles.sectionTitle}><Ionicons name="airplane-outline" size={29} color={NAVY} /><Text style={styles.sectionTitleText}>Details</Text></View>
      <View style={styles.search}><Ionicons name="search-outline" size={21} color="#18263A" /><TextInput value={query} onChangeText={setQuery} placeholder="Search records..." placeholderTextColor="#637084" style={styles.searchInput} /></View>
      <View style={styles.list}>{visibleFlights.map((flight) => <FlightCard key={flight.id} flight={flight} onPress={() => setSelectedFlight(flight)} />)}</View>
      {visibleFlights.length === 0 && <Text style={styles.empty}>No flight records match your search.</Text>}
      <TouchableOpacity style={styles.addButton} onPress={() => router.push("/add_flight_entry" as never)}><Text style={styles.addButtonText}>Add Flight</Text></TouchableOpacity>
    </ScrollView>
    <FiveIconNav active="flights" />
    <FlightDetailsModal flight={selectedFlight} onClose={() => setSelectedFlight(null)} />
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" }, content: { paddingHorizontal: 18, paddingBottom: 28, overflow: "hidden" },
  map: { position: "absolute", width: "125%", height: 190, top: -54, right: -94, opacity: 0.055 }, header: { height: 76, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, backButton: { width: 42, height: 42, justifyContent: "center" }, headerSpacer: { width: 42 }, title: { color: NAVY, fontSize: 27, fontWeight: "900" },
  sectionTitle: { flexDirection: "row", alignItems: "center", gap: 24, marginTop: 19, marginBottom: 10 }, sectionTitleText: { color: NAVY, fontSize: 17, fontWeight: "900" },
  search: { height: 28, borderRadius: 5, borderWidth: 1.5, borderColor: "#BFC1C6", flexDirection: "row", alignItems: "center", paddingHorizontal: 10, gap: 28 }, searchInput: { flex: 1, fontSize: 10, color: NAVY, paddingVertical: 4 },
  list: { gap: 8, marginTop: 7 }, flightCard: { borderWidth: 1.5, borderColor: "#BFC1C6", borderRadius: 5, overflow: "hidden", backgroundColor: "#FFFFFF" }, cardHeader: { minHeight: 31, paddingHorizontal: 9, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1.5, borderBottomColor: "#BFC1C6" }, dateWrap: { flexDirection: "row", alignItems: "center", gap: 8 }, date: { fontSize: 11, color: NAVY, fontWeight: "900" }, duration: { width: 66, height: 22, borderRadius: 5, borderWidth: 1, borderColor: "#BFC1C6", alignItems: "center", justifyContent: "center" }, durationText: { fontSize: 10, color: NAVY, fontWeight: "900" }, cardBody: { paddingHorizontal: 9, paddingVertical: 8, gap: 8 }, aircraftLine: { flexDirection: "row", justifyContent: "space-between" }, aircraftType: { color: NAVY, fontSize: 10, fontWeight: "900" }, aircraftRegistration: { color: NAVY, fontSize: 10, fontWeight: "900", marginRight: 59 }, routeLine: { flexDirection: "row", alignItems: "center" }, route: { color: NAVY, fontSize: 11, fontWeight: "800", flex: 1 }, arrow: { fontSize: 16 }, landings: { fontSize: 9, color: "#5E6571", marginRight: 31 }, cardFooter: { height: 20, paddingHorizontal: 9, borderTopWidth: 1, borderTopColor: "#BFC1C6", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, instructor: { color: "#6C7480", fontSize: 8 }, recordBadge: { backgroundColor: AMBER, borderRadius: 3, paddingHorizontal: 4, paddingVertical: 2 }, recordBadgeText: { fontSize: 6, color: NAVY, fontWeight: "900" },
  addButton: { alignSelf: "center", minWidth: 145, height: 34, borderRadius: 11, borderWidth: 1.5, borderColor: "#2563FF", backgroundColor: AMBER, alignItems: "center", justifyContent: "center", marginTop: 19 }, addButtonText: { color: NAVY, fontSize: 14, fontWeight: "900" }, empty: { color: "#65718A", fontSize: 13, textAlign: "center", marginTop: 35 },
});

const modalStyles = StyleSheet.create({
  backdrop: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(3, 36, 81, 0.78)", paddingHorizontal: 18 },
  modal: { width: "100%", maxWidth: 360, borderRadius: 5, borderWidth: 2, borderColor: "#D1D3D6", overflow: "hidden", backgroundColor: NAVY },
  modalHeader: { height: 31, backgroundColor: "#FFFFFF", paddingHorizontal: 9, alignItems: "center", justifyContent: "space-between", flexDirection: "row" },
  dateWrap: { flexDirection: "row", alignItems: "center", gap: 8 }, date: { color: NAVY, fontSize: 11, fontWeight: "900" },
  collapse: { flexDirection: "row", alignItems: "center" }, collapseText: { color: "#68717E", fontSize: 8, marginRight: 2 },
  summary: { paddingHorizontal: 9, paddingTop: 10, paddingBottom: 8 }, aircraftLine: { flexDirection: "row", alignItems: "center" }, aircraftType: { color: AMBER, fontSize: 11, fontWeight: "900", flex: 1 }, registration: { color: "#FFFFFF", fontSize: 11, fontWeight: "900", marginRight: 17 }, duration: { width: 66, height: 22, backgroundColor: "#FFFFFF", borderRadius: 5, alignItems: "center", justifyContent: "center" }, durationText: { color: NAVY, fontSize: 10, fontWeight: "900" },
  route: { color: AMBER, fontSize: 11, fontWeight: "900", marginTop: 7 }, arrow: { color: "#FFFFFF", fontSize: 14 }, rule: { height: 1, backgroundColor: "#8091AA", marginHorizontal: 9 },
  detailsGrid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 38, paddingVertical: 24, rowGap: 10 }, detailItem: { width: "50%", minHeight: 14, flexDirection: "row", alignItems: "flex-start", gap: 8, paddingRight: 9 }, detailText: { color: "#FFFFFF", fontSize: 8, lineHeight: 10, flex: 1 },
  closeButton: { alignSelf: "center", width: 48, height: 17, borderRadius: 3, backgroundColor: AMBER, alignItems: "center", justifyContent: "center", marginBottom: 7 }, closeButtonText: { color: NAVY, fontSize: 7, fontWeight: "900" },
});
