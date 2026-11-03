import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { palette, type } from "@/constants/ui";
import type { Flight } from "@/types/records";
import { formatFlightDate, formatHours } from "@/utils/flight-format";

export default function FlightCard({ flight, onPress }: { flight: Flight; onPress: () => void }) {
  return <TouchableOpacity accessibilityRole="button" accessibilityLabel={`View flight ${flight.departure} to ${flight.destination} on ${formatFlightDate(flight.date)}`} activeOpacity={0.8} onPress={onPress} style={styles.card}>
    <View style={styles.top}><View style={styles.date}><Ionicons name="calendar-outline" size={16} color={palette.navy} /><Text style={styles.dateText}>{formatFlightDate(flight.date)}</Text></View><View style={styles.duration}><Text style={type.label}>{formatHours(flight.durationMinutes)} hrs</Text></View></View>
    <View style={styles.body}>
      <View style={styles.aircraftRow}><Text style={[type.label, styles.flex]}>{flight.aircraftType}</Text><Text style={type.label}>{flight.aircraftRegistration}</Text></View>
      <View style={styles.route}><Ionicons name="airplane-outline" size={17} color={palette.navy} /><Text style={[styles.routeText, styles.flex]}>{flight.departure.split(" - ")[0]} → {flight.destination.split(" - ")[0]}</Text><Text style={type.caption}>{flight.landings} landings</Text><Ionicons name="chevron-forward" size={20} color={palette.navy} /></View>
    </View>
    <View style={styles.bottom}><Text style={[type.caption, styles.flex]}>{flight.instructor ? "Instructor: " + flight.instructor : flight.period + " flight"}</Text><View style={styles.badge}><Text style={styles.badgeText}>View Record</Text></View></View>
  </TouchableOpacity>;
}
const styles = StyleSheet.create({
  card: { borderRadius: 6, borderWidth: 1.5, borderColor: palette.border, backgroundColor: palette.surface, overflow: "hidden" },
  top: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8, borderBottomWidth: 1, borderBottomColor: palette.border, paddingVertical: 7, paddingHorizontal: 10 },
  date: { flexDirection: "row", gap: 7, alignItems: "center", flex: 1 }, dateText: { ...type.label, fontSize: 12 },
  duration: { borderRadius: 5, borderWidth: 1, borderColor: palette.border, paddingVertical: 3, paddingHorizontal: 12 },
  body: { padding: 10, gap: 12 }, aircraftRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 }, route: { flexDirection: "row", alignItems: "center", gap: 7 },
  routeText: { ...type.label, fontSize: 14 }, flex: { flex: 1 },
  bottom: { minHeight: 36, marginHorizontal: 10, paddingVertical: 6, borderTopWidth: 1, borderTopColor: palette.border, flexDirection: "row", alignItems: "center", gap: 10 },
  badge: { backgroundColor: palette.amber, borderRadius: 4, paddingVertical: 5, paddingHorizontal: 8 }, badgeText: { ...type.label, fontSize: 10, lineHeight: 14 },
});
