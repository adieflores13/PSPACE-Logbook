import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FiveIconNav from "@/components/layout/five-icon-nav";
import { useAircraft } from "@/context/aircraft-context";

const NAVY = "#032451";
const AMBER = "#FFBB57";
const MUTED = "#65718A";

export default function AircraftsScreen() {
  const router = useRouter();
  const { aircraft } = useAircraft();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <View style={styles.header}>
        <Image source={require("@/assets/images/country2.png")} style={styles.map} resizeMode="cover" />
        <View style={styles.topRow}>
          <Text style={styles.title}>Aircrafts</Text>
          <Ionicons name="airplane-outline" size={28} color={NAVY} />
        </View>
        <Text style={styles.subtitle}>Manage your aircraft registrations and details.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {aircraft.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}><Ionicons name="airplane-outline" size={30} color={NAVY} /></View>
            <Text style={styles.emptyTitle}>No aircraft added yet</Text>
            <Text style={styles.emptyText}>Add an aircraft registration to start building your fleet.</Text>
          </View>
        ) : (
          aircraft.map((item) => (
            <View key={item.id} style={styles.aircraftCard}>
              <View style={styles.cardAccent} />
              <View style={styles.cardMain}>
                <Text style={styles.registration}>{item.registration}</Text>
                <Text style={styles.model}>{item.makeModelVariant}</Text>
              </View>
              <View style={styles.hours}>
                <Text style={styles.hoursValue}>{item.hours}</Text>
                <Text style={styles.hoursLabel}>Hours</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.actionArea}>
        <TouchableOpacity style={styles.addButton} activeOpacity={0.85} onPress={() => router.push("/aircraft_registration" as never)}>
          <Ionicons name="add" size={22} color={NAVY} />
          <Text style={styles.addButtonText}>Add Aircraft</Text>
        </TouchableOpacity>
      </View>
      <FiveIconNav active="aircrafts" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  header: { height: 172, paddingHorizontal: 25, paddingTop: 20, overflow: "hidden", justifyContent: "center", backgroundColor: "#F8F9FB" },
  map: { position: "absolute", width: "125%", height: "145%", right: -100, top: -76, opacity: 0.06 },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { fontSize: 34, fontWeight: "900", color: NAVY, letterSpacing: -0.7 },
  subtitle: { color: MUTED, fontSize: 14, marginTop: 7, maxWidth: 280 },
  content: { padding: 20, paddingBottom: 28, gap: 14 },
  aircraftCard: { minHeight: 104, flexDirection: "row", alignItems: "center", borderWidth: 1.5, borderColor: "#C9CBD0", borderRadius: 12, backgroundColor: "#FFFFFF", overflow: "hidden", shadowColor: NAVY, shadowOpacity: 0.1, shadowRadius: 9, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  cardAccent: { width: 7, alignSelf: "stretch", backgroundColor: AMBER },
  cardMain: { flex: 1, paddingHorizontal: 18 },
  registration: { color: NAVY, fontSize: 23, fontWeight: "900", letterSpacing: 0.2 },
  model: { color: MUTED, fontSize: 13, fontWeight: "600", marginTop: 6 },
  hours: { minWidth: 72, alignItems: "center", paddingRight: 14 },
  hoursValue: { fontSize: 24, fontWeight: "900", color: NAVY },
  hoursLabel: { fontSize: 11, fontWeight: "700", color: MUTED, marginTop: 2 },
  emptyCard: { alignItems: "center", borderWidth: 1.5, borderColor: "#C9CBD0", borderRadius: 13, paddingHorizontal: 30, paddingVertical: 34, backgroundColor: "#FFFFFF" },
  emptyIcon: { width: 58, height: 58, borderRadius: 29, backgroundColor: "#EAF0F8", alignItems: "center", justifyContent: "center", marginBottom: 14 },
  emptyTitle: { fontSize: 18, fontWeight: "900", color: NAVY },
  emptyText: { fontSize: 13, color: MUTED, textAlign: "center", lineHeight: 19, marginTop: 8 },
  actionArea: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 14, backgroundColor: "#FFFFFF" },
  addButton: { alignSelf: "center", minWidth: 190, height: 50, paddingHorizontal: 24, borderRadius: 13, borderWidth: 1.5, borderColor: "#2563FF", backgroundColor: AMBER, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7 },
  addButtonText: { fontSize: 17, fontWeight: "900", color: NAVY },
});
