import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import FlightCard from "@/components/flight-card";
import FlightDetailsSheet from "@/components/flight-details-sheet";
import { AppButton, AppScreen, EmptyState, SelectField } from "@/components/ui/app-ui";
import { SelectionSheet } from "@/components/ui/selection-sheet";
import { surfaces, type } from "@/constants/ui";
import { useAircraft } from "@/context/aircraft-context";
import { Flight, getFlightTotals, useFlights } from "@/context/flight-context";
import { formatHours } from "@/utils/flight-format";

export default function LogbookScreen() {
  const router = useRouter();
  const { flights } = useFlights();
  const { aircraft } = useAircraft();
  const [month, setMonth] = useState("all");
  const [aircraftId, setAircraftId] = useState("all");
  const [filter, setFilter] = useState<"month" | "aircraft" | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const monthOptions = [{ value: "all", label: "All dates" }, ...Array.from(new Set(flights.map((flight) => flight.date.slice(0, 7)))).sort().reverse().map((value) => ({ value, label: new Date(value + "-15T12:00:00").toLocaleDateString("en-GB", { month: "long", year: "numeric" }) }))];
  const aircraftOptions = [{ value: "all", label: "All aircrafts" }, ...aircraft.map((item) => ({ value: item.id, label: item.registration, description: item.makeModelVariant.replaceAll(" / ", " ") }))];
  const entries = useMemo(() => flights.filter((flight) => (month === "all" || flight.date.startsWith(month)) && (aircraftId === "all" || flight.aircraftId === aircraftId)).sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt)), [flights, month, aircraftId]);
  const totals = getFlightTotals(entries);
  const metrics = [{ label: "Total hours", value: formatHours(totals.minutes) }, { label: "Day hours", value: formatHours(totals.dayMinutes) }, { label: "Night hours", value: formatHours(totals.nightMinutes) }, { label: "Landings", value: String(totals.landings) }];
  return <AppScreen title="Logbook" subtitle="Your flight journal, totals and flying history." tab="logbook">
    <View style={styles.metrics}>{metrics.map((metric) => <View key={metric.label} style={[surfaces.card, styles.metric]}><Text style={styles.metricValue}>{metric.value}</Text><Text style={type.caption}>{metric.label}</Text></View>)}</View>
    <View style={styles.filters}><View style={styles.flex}><SelectField label="Date" value={monthOptions.find((item) => item.value === month)?.label ?? "All dates"} onPress={() => setFilter("month")} /></View><View style={styles.flex}><SelectField label="Aircraft" value={aircraftOptions.find((item) => item.value === aircraftId)?.label ?? "All aircrafts"} onPress={() => setFilter("aircraft")} /></View></View>
    <View style={styles.sectionHeader}><Text style={type.heading}>Flight journal</Text><Text style={type.caption}>{entries.length} {entries.length === 1 ? "entry" : "entries"}</Text></View>
    {entries.length === 0 ? <><EmptyState title={flights.length ? "No flights in this view" : "Your logbook is ready"} message={flights.length ? "Choose another date or aircraft to see your flights." : "Save your first flight in Flights. It will appear here with your totals automatically."} />{flights.length === 0 && <AppButton compact label="Add a Flight" onPress={() => router.push("/add_flight_entry")} />}</> : entries.map((flight) => <FlightCard flight={flight} key={flight.id} onPress={() => setSelectedFlight(flight)} />)}
    <SelectionSheet visible={filter !== null} title={filter === "month" ? "Filter by month" : "Filter by aircraft"} options={filter === "month" ? monthOptions : aircraftOptions} selected={filter === "month" ? month : aircraftId} onSelect={filter === "month" ? setMonth : setAircraftId} onClose={() => setFilter(null)} />
    <FlightDetailsSheet flight={selectedFlight} onClose={() => setSelectedFlight(null)} />
  </AppScreen>;
}
const styles = StyleSheet.create({
  metrics: { flexDirection: "row", flexWrap: "wrap", gap: 10 }, metric: { width: "48%", flexGrow: 1, gap: 3, paddingVertical: 10 }, metricValue: { ...type.title, fontSize: 23, lineHeight: 30 },
  filters: { flexDirection: "row", gap: 12 }, flex: { flex: 1 }, sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
});
