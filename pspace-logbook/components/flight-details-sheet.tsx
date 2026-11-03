import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppButton } from "@/components/ui/app-ui";
import { palette, type } from "@/constants/ui";
import type { Flight } from "@/types/records";
import { formatDuration, formatFlightDate, formatHours } from "@/utils/flight-format";

export default function FlightDetailsSheet({ flight, onClose }: { flight: Flight | null; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const { height, width, fontScale } = useWindowDimensions();
  if (!flight) return null;
  const details: [keyof typeof Ionicons.glyphMap, string, string][] = [
    ["time-outline", "Block off", flight.blockOff], ["time-outline", "Block on", flight.blockOn],
    ["time-outline", "Duration", formatDuration(flight.durationMinutes)], ["airplane-outline", "Landings", flight.landings],
    ["person-outline", "Instructor", flight.instructor], ["ribbon-outline", "PIC / Dual", flight.pilotRole],
    ["moon-outline", "Day / Night", flight.period], ["cloud-outline", "Weather", flight.weather],
    ["document-text-outline", "Remarks", flight.remarks],
  ];
  return <Modal visible transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
    <View style={styles.backdrop}><Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Dismiss flight details" />
      <View accessibilityViewIsModal style={[styles.sheet, { height: Math.min(760, height - insets.top - 20) }]}>
        <View style={styles.header}><View style={styles.date}><Ionicons name="calendar-outline" size={18} color={palette.navy} /><Text style={type.label}>{formatFlightDate(flight.date)}</Text></View><TouchableOpacity style={styles.close} accessibilityRole="button" accessibilityLabel="Close flight details" onPress={onClose}><Ionicons name="close" size={25} color={palette.navy} /></TouchableOpacity></View>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.summary}><Text style={styles.heading}>Selected Record</Text><View style={styles.aircraftRow}><Ionicons name="airplane-outline" size={22} color={palette.amber} /><View style={styles.flex}><Text style={styles.aircraftType}>{flight.aircraftType}</Text><Text style={styles.registration}>{flight.aircraftRegistration}</Text></View><View style={styles.hoursBadge}><Text style={type.label}>{formatHours(flight.durationMinutes)} hrs</Text></View></View><View style={styles.route}><Ionicons name="location-outline" size={21} color={palette.amber} /><Text style={styles.routeText}>{flight.departure}</Text><Ionicons name="arrow-forward" size={23} color={palette.surface} /><Text style={styles.routeText}>{flight.destination}</Text></View></View>
          <View style={styles.details}>{details.map(([icon, label, value]) => <View style={[styles.detail, width >= 440 && fontScale <= 1.2 && label !== "Remarks" && styles.half]} key={label}><Ionicons name={icon} size={22} color={palette.surface} /><View style={styles.flex}><Text style={styles.detailLabel}>{label}</Text><Text style={styles.detailValue}>{value || "Not provided"}</Text></View></View>)}</View>
        </ScrollView>
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}><AppButton compact label="Close" onPress={onClose} /></View>
      </View>
    </View>
  </Modal>;
}
const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(3,36,65,0.75)" },
  sheet: { backgroundColor: palette.navy, width: "100%", maxWidth: 620, alignSelf: "center", borderTopLeftRadius: 18, borderTopRightRadius: 18, overflow: "hidden", borderWidth: 1.5, borderColor: palette.border },
  header: { backgroundColor: palette.surface, paddingLeft: 16, paddingRight: 6, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, date: { flexDirection: "row", gap: 10, alignItems: "center" }, close: { width: 48, height: 48, justifyContent: "center", alignItems: "center" },
  content: { paddingHorizontal: 18, paddingBottom: 12 }, summary: { paddingVertical: 18, gap: 16, borderBottomWidth: 1, borderBottomColor: "#62758B" }, heading: { ...type.heading, color: palette.surface },
  aircraftRow: { flexDirection: "row", alignItems: "center", gap: 10 }, aircraftType: { ...type.label, color: palette.amber, fontSize: 15 }, registration: { ...type.body, color: palette.surface, fontSize: 14 },
  hoursBadge: { backgroundColor: palette.surface, borderRadius: 5, paddingHorizontal: 12, paddingVertical: 6 },
  route: { flexDirection: "row", gap: 8, alignItems: "center", flexWrap: "wrap" }, routeText: { ...type.label, color: palette.amber, fontSize: 15 },
  details: { flexDirection: "row", flexWrap: "wrap", gap: 4 }, detail: { width: "100%", flexDirection: "row", alignItems: "flex-start", gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#294362" }, half: { width: "49%" },
  detailLabel: { ...type.caption, color: "#C9D4DF" }, detailValue: { ...type.body, fontSize: 14, color: palette.surface }, flex: { flex: 1 }, footer: { backgroundColor: palette.navy, padding: 18, borderTopWidth: 1, borderTopColor: "#294362" },
});
