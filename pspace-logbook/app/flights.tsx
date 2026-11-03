import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import FlightCard from "@/components/flight-card";
import FlightDetailsSheet from "@/components/flight-details-sheet";
import { AppButton, AppScreen, EmptyState, SectionHeading } from "@/components/ui/app-ui";
import { palette, type } from "@/constants/ui";
import { Flight, useFlights } from "@/context/flight-context";

export default function FlightsScreen() {
  const router = useRouter();
  const { flights } = useFlights();
  const [query, setQuery] = useState("");
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const visibleFlights = useMemo(() => [...flights].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt)).filter((flight) => [flight.date, flight.departure, flight.destination, flight.aircraftRegistration, flight.aircraftType, flight.instructor].join(" ").toLowerCase().includes(query.trim().toLowerCase())), [flights, query]);
  return <AppScreen title="Flight List" tab="flights">
    <SectionHeading title="Details" />
    <View style={styles.search}><Ionicons name="search-outline" size={22} color={palette.muted} /><TextInput accessibilityLabel="Search flights" value={query} onChangeText={setQuery} placeholder="Search route, aircraft or instructor" placeholderTextColor={palette.muted} style={styles.searchInput} />{query.length > 0 && <TouchableOpacity accessibilityRole="button" accessibilityLabel="Clear search" style={styles.clearSearch} onPress={() => setQuery("")}><Ionicons name="close-circle" size={22} color={palette.muted} /></TouchableOpacity>}</View>
    <Text style={type.caption}>{visibleFlights.length} {visibleFlights.length === 1 ? "flight" : "flights"}</Text>
    {visibleFlights.length === 0 ? <EmptyState icon="paper-plane-outline" title={query ? "No matching flights" : "Your first flight starts here"} message={query ? "Try another route, aircraft or instructor." : "Tap Add Flight to record a flight using one of your saved aircrafts."} /> : visibleFlights.map((flight) => <FlightCard key={flight.id} flight={flight} onPress={() => setSelectedFlight(flight)} />)}
    <View style={styles.action}><AppButton compact label="Add Flight" onPress={() => router.push("/add_flight_entry")} /></View>
    <FlightDetailsSheet flight={selectedFlight} onClose={() => setSelectedFlight(null)} />
  </AppScreen>;
}
const styles = StyleSheet.create({
  action: { marginTop: 8 },
  search: { flexDirection: "row", gap: 12, alignItems: "center", minHeight: 46, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.border, borderRadius: 5, paddingHorizontal: 12 },
  searchInput: { ...type.body, flex: 1, minHeight: 50, paddingVertical: 10 },
  clearSearch: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
});
