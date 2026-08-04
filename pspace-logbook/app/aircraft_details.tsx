import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FiveIconNav from "@/components/layout/five-icon-nav";
import { useAircraft } from "@/context/aircraft-context";

const NAVY = "#032451";
const AMBER = "#FFBB57";

export default function AircraftDetailsScreen() {
  const router = useRouter();
  const { registration } = useLocalSearchParams<{ registration?: string }>();
  const { aircraft } = useAircraft();
  const item = aircraft.find((entry) => entry.registration === registration) ?? aircraft[0];
  const aircraftType = item?.makeModelVariant ?? "Cessna 172S";
  const aircraftRegistration = item?.registration ?? "N1234AB";
  const details = [
    ["Aircraft Type", aircraftType],
    ["Aircraft Category", "Airplane"],
    ["Aircraft Class", "Single-Engine Land"],
    ["Engine Category", "Single-Engine"],
    ["Aircraft Registration", aircraftRegistration],
    ["Serial Number", "172S12345"],
    ["Year Model", "2019"],
    ["Manufacturer", aircraftType.split(" /")[0] || "Cessna"],
    ["Model", aircraftType.split(" /").slice(1).join(" ") || "172 Skyhawk"],
    ["Home Base", "KAPA - Centennial"],
    ["Max Occupants", "4"],
    ["Fuel Type", "Avgas"],
    ["Registration Date", "July 20, 2026"],
    ["Expiry Date", "Aug 25, 2027"],
    ["Status", "Active"],
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Image source={require("@/assets/images/country2.png")} style={styles.map} resizeMode="cover" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={NAVY} /></TouchableOpacity>
          <Text style={styles.title}>Registration Details</Text>
          <View style={styles.spacer} />
        </View>

        <View style={styles.successBanner}>
          <View style={styles.bannerCheck}><Ionicons name="checkmark" size={34} color="#0A8B22" /></View>
          <View><Text style={styles.bannerTitle}>Successfully Registered</Text><Text style={styles.bannerText}>Here are the details of the aircraft.</Text></View>
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.summary}>
            <View style={styles.planeIcon}><Ionicons name="airplane-outline" size={43} color={NAVY} /></View>
            <View style={styles.summaryText}><Text style={styles.summaryLabel}>AIRCRAFT REGISTRATION</Text><Text style={styles.registration}>{aircraftRegistration}</Text><Text style={styles.activeAircraft}>Active Training Aircraft</Text></View>
            <View style={styles.registered}><Ionicons name="checkmark-circle" size={12} color={AMBER} /><Text style={styles.registeredText}>REGISTERED</Text></View>
          </View>
          <View style={styles.rule} />
          {details.map(([label, value]) => <View style={styles.detailRow} key={label}><Text style={styles.detailLabel}>{label}</Text><Text style={styles.detailValue}>{value}</Text></View>)}
        </View>

        <View style={styles.info}><Ionicons name="information-circle-outline" size={19} color={NAVY} /><Text style={styles.infoText}>Information is based on school and aircraft registry records.{"\n"}For discrepancies, please contact the flight operations office.</Text></View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.outlineButton}><Text style={styles.outlineText}>DOWNLOAD AS PDF</Text></TouchableOpacity>
          <TouchableOpacity style={styles.outlineButton}><Text style={styles.outlineText}>SHARE RESULTS</Text></TouchableOpacity>
          <TouchableOpacity style={styles.newSearchButton} onPress={() => router.replace("/aircrafts" as never)}><Text style={styles.newSearchText}>NEW SEARCH</Text></TouchableOpacity>
        </View>
      </ScrollView>
      <FiveIconNav active="aircrafts" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { paddingHorizontal: 18, paddingBottom: 27, overflow: "hidden" },
  map: { position: "absolute", width: "125%", height: 195, top: -47, right: -95, opacity: 0.055 },
  header: { height: 75, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backButton: { width: 42, height: 42, justifyContent: "center" }, spacer: { width: 42 },
  title: { color: NAVY, fontSize: 23, fontWeight: "900" },
  successBanner: { minHeight: 68, backgroundColor: "#F0F0F0", borderRadius: 12, marginTop: 10, paddingHorizontal: 21, flexDirection: "row", alignItems: "center", gap: 20, shadowColor: "#000", shadowOpacity: 0.13, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 3 },
  bannerCheck: { width: 48, height: 48, borderRadius: 24, borderWidth: 3.5, borderColor: "#0A8B22", alignItems: "center", justifyContent: "center" }, bannerTitle: { color: NAVY, fontSize: 12, fontWeight: "900" }, bannerText: { color: NAVY, fontSize: 9, marginTop: 2 },
  detailsCard: { marginTop: 27, borderWidth: 1.5, borderColor: "#B7B9BE", borderRadius: 6, padding: 10 },
  summary: { flexDirection: "row", alignItems: "center", paddingBottom: 10 }, planeIcon: { width: 57, height: 57, borderRadius: 29, borderWidth: 1.5, borderColor: NAVY, alignItems: "center", justifyContent: "center", marginRight: 9 }, summaryText: { flex: 1 }, summaryLabel: { color: NAVY, fontSize: 9, fontWeight: "900" }, registration: { color: NAVY, fontSize: 23, fontWeight: "900", lineHeight: 25 }, activeAircraft: { color: NAVY, fontSize: 10, fontWeight: "800" }, registered: { minWidth: 89, height: 20, borderRadius: 5, backgroundColor: NAVY, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 5 }, registeredText: { color: "#FFFFFF", fontSize: 7, fontWeight: "800" },
  rule: { height: 1, backgroundColor: "#CDD0D4" }, detailRow: { minHeight: 25, borderBottomWidth: 1, borderBottomColor: "#CDD0D4", flexDirection: "row", alignItems: "center" }, detailLabel: { width: "58%", color: NAVY, fontSize: 8, fontWeight: "900" }, detailValue: { flex: 1, color: NAVY, fontSize: 8 },
  info: { backgroundColor: "#CCF2F9", borderRadius: 5, marginTop: 15, padding: 13, flexDirection: "row", alignItems: "center", gap: 13 }, infoText: { flex: 1, color: NAVY, fontSize: 9, lineHeight: 13 },
  actions: { alignItems: "center", gap: 10, marginTop: 15 }, outlineButton: { width: 205, height: 29, borderRadius: 9, borderWidth: 1.5, borderColor: "#2563FF", alignItems: "center", justifyContent: "center" }, outlineText: { fontSize: 8, color: NAVY, fontWeight: "900" }, newSearchButton: { width: 205, height: 29, borderRadius: 9, borderWidth: 1.5, borderColor: "#2563FF", backgroundColor: AMBER, alignItems: "center", justifyContent: "center" }, newSearchText: { fontSize: 8, color: NAVY, fontWeight: "900" },
});
