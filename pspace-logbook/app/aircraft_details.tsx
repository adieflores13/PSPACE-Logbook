import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { AppButton, AppScreen, EmptyState, InfoBox } from "@/components/ui/app-ui";
import { palette, surfaces, type } from "@/constants/ui";
import { useAircraft } from "@/context/aircraft-context";
import { useFlights } from "@/context/flight-context";
import { shareAircraftPdf } from "@/services/aircraft-pdf";
import { aircraftName, findAircraft, getAircraftDetails, getAircraftFlightSummary } from "@/utils/aircraft-details";
import { formatHours } from "@/utils/flight-format";

export default function AircraftDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[]; registration?: string | string[] }>();
  const { aircraft } = useAircraft();
  const { flights } = useFlights();
  const { fontScale } = useWindowDimensions();
  const [exportAction, setExportAction] = useState<"pdf" | "share" | null>(null);
  const [error, setError] = useState("");
  const exporting = useRef(false);
  const item = findAircraft(aircraft, params);
  const back = () => router.dismissTo("/aircrafts");
  async function exportPdf(action: "pdf" | "share") {
    if (!item || exporting.current) return;
    exporting.current = true; setExportAction(action); setError("");
    try { await shareAircraftPdf(item, flights); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to export this record."); }
    finally { exporting.current = false; setExportAction(null); }
  }
  if (!item) return <AppScreen title="Registration Details" onBack={back}><EmptyState title="Aircraft unavailable" message="Choose an aircraft saved on this device." icon="airplane-outline" /><AppButton label="Back to Aircrafts" onPress={back} /></AppScreen>;
  const summary = getAircraftFlightSummary(item.id, flights);
  return <AppScreen title="Registration Details" onBack={back}>
    <View style={styles.status}><Ionicons name="checkmark-circle-outline" size={43} color={palette.success} /><View style={styles.flex}><Text style={type.label}>Saved on this device</Text><Text style={type.caption}>Here are the details of your aircraft.</Text></View></View>
    <View style={[surfaces.card, styles.record]}>
      <View style={styles.summary}><View style={styles.plane}><Ionicons name="airplane-outline" size={36} color={palette.navy} style={{ transform: [{ rotate: "-90deg" }] }} /></View><View style={styles.flex}><Text style={styles.eyebrow}>AIRCRAFT REGISTRATION</Text><Text style={styles.registration}>{item.registration}</Text><Text style={styles.model}>{aircraftName(item)}</Text></View></View>
      <View style={styles.badgeRow}><View style={styles.badge}><Ionicons name="checkmark-circle-outline" color={palette.amber} size={14} /><Text style={styles.badgeText}>LOCAL RECORD</Text></View><Text style={type.caption}>{formatHours(summary.durationMinutes)} logged hrs · {summary.flightCount} {summary.flightCount === 1 ? "flight" : "flights"}</Text></View>
      {getAircraftDetails(item).map(({ label, value }) => <View key={label} style={[styles.detailRow, fontScale > 1.25 && styles.stacked]}><Text style={[styles.detailLabel, fontScale > 1.25 && styles.full]}>{label}</Text><Text style={styles.detailValue} selectable>{value}</Text></View>)}
    </View>
    <InfoBox>Information is based on the details you entered. Export a PDF to save or share a copy of this local record.</InfoBox>
    {error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
    <View style={styles.actions}><AppButton label="Export as PDF" icon="document-text-outline" variant="outline" onPress={() => { void exportPdf("pdf"); }} loading={exportAction === "pdf"} disabled={!!exportAction} /><AppButton label="Share Results" icon="share-outline" variant="outline" onPress={() => { void exportPdf("share"); }} loading={exportAction === "share"} disabled={!!exportAction} /><AppButton label="Back to Aircrafts" onPress={back} disabled={!!exportAction} /></View>
  </AppScreen>;
}
const styles = StyleSheet.create({
  flex: { flex: 1 }, status: { flexDirection: "row", alignItems: "center", gap: 18, backgroundColor: "#F0F0F0", borderRadius: 9, padding: 14, marginBottom: 8 },
  record: { borderRadius: 6, padding: 10 }, summary: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 10 }, plane: { width: 52, height: 52, borderRadius: 26, borderWidth: 1, borderColor: palette.navy, alignItems: "center", justifyContent: "center" },
  eyebrow: { ...type.label, fontSize: 10, lineHeight: 16 }, registration: { ...type.title, fontSize: 25 }, model: { ...type.caption, color: palette.navy }, badgeRow: { gap: 8, paddingVertical: 12, alignItems: "flex-start" }, badge: { backgroundColor: palette.navy, borderRadius: 5, flexDirection: "row", alignItems: "center", gap: 7, paddingVertical: 5, paddingHorizontal: 10 }, badgeText: { ...type.label, color: palette.surface, fontSize: 10 },
  detailRow: { borderTopWidth: 1, borderTopColor: "#D5D6D8", minHeight: 40, paddingVertical: 10, flexDirection: "row", gap: 12 }, detailLabel: { ...type.label, width: "53%", fontSize: 12, lineHeight: 18 }, detailValue: { ...type.body, flex: 1, fontSize: 13, lineHeight: 19 }, stacked: { flexDirection: "column", gap: 4 }, full: { width: "100%" },
  actions: { alignSelf: "center", width: "78%", maxWidth: 320, gap: 10 }, error: { ...type.body, color: palette.danger },
});
