import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { AppButton, AppScreen, EmptyState, SectionHeading, appStyles } from "@/components/ui/app-ui";
import { palette, surfaces, type } from "@/constants/ui";
import { useAircraft } from "@/context/aircraft-context";
import { useFlights } from "@/context/flight-context";
import { aircraftName, aircraftValue, getAircraftFlightSummary } from "@/utils/aircraft-details";

export default function AircraftsScreen() {
  const router = useRouter();
  const { aircraft, isLoading, error, reload } = useAircraft();
  const { flights, isLoading: flightsLoading, error: flightsError, reload: reloadFlights } = useFlights();

  return (
    <AppScreen title="Aircrafts" tab="aircrafts">
      <SectionHeading title="Your aircrafts" />
      {isLoading ? (
        <View style={styles.loading} accessibilityLiveRegion="polite">
          <ActivityIndicator color={palette.navy} />
          <Text style={type.body}>Loading saved aircraft...</Text>
        </View>
      ) : error ? (
        <View style={appStyles.section}>
          <EmptyState title="Aircraft unavailable" message={error} icon="cloud-offline-outline" />
          <AppButton label="Try Again" variant="outline" onPress={() => { void reload(); }} />
        </View>
      ) : (
        <>
          {flightsError && (
            <View style={[surfaces.card, appStyles.section]}>
              <Text style={[type.body, styles.error]}>{flightsError} Logged hours are unavailable.</Text>
              <AppButton label="Retry Flight Hours" variant="outline" onPress={() => { void reloadFlights(); }} />
            </View>
          )}
          {aircraft.length === 0 ? (
            <EmptyState title="No aircraft added yet" message="Add the registration, manufacturer and model of your aircraft to start your local logbook." icon="airplane-outline" />
          ) : (
            <View style={appStyles.section}>
              <Text style={styles.count}>{aircraft.length} saved aircraft</Text>
              {aircraft.map((item) => {
                const { durationMinutes } = getAircraftFlightSummary(item.id, flights);
                return (
                  <TouchableOpacity
                    key={item.id}
                    accessibilityRole="button"
                    accessibilityLabel={`View aircraft ${aircraftValue(item.registration)}`}
                    activeOpacity={0.8}
                    style={styles.aircraftCard}
                    onPress={() => router.push({ pathname: "/aircraft_details", params: { id: item.id } })}
                  >
                    <View style={styles.cardHeading}>
                      <View style={styles.icon}><Ionicons name="airplane-outline" size={24} color={palette.navy} /></View>
                      <View style={appStyles.flex}>
                        <Text style={type.heading}>{aircraftValue(item.registration)}</Text>
                        <Text style={styles.model}>{aircraftName(item)}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={22} color={palette.navy} />
                    </View>
                    <View style={styles.cardFooter}>
                      <Text style={styles.hoursLabel}>Logged hours</Text>
                      <Text style={styles.hoursValue}>{flightsLoading ? "Loading..." : flightsError ? "Unavailable" : `${(durationMinutes / 60).toFixed(2)} h`}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </>
      )}
      <View style={styles.action}><AppButton compact label="Add Aircraft" onPress={() => router.push("/aircraft_registration")} disabled={isLoading || !!error} /></View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  loading: { alignItems: "center", justifyContent: "center", gap: 12, paddingVertical: 40 },
  count: { ...type.label, color: palette.muted },
  action: { marginTop: 8 },
  aircraftCard: { ...surfaces.card, borderWidth: 1.5, padding: 0, overflow: "hidden" },
  cardHeading: { flexDirection: "row", alignItems: "center", gap: 12, padding: 18 },
  icon: { width: 46, height: 46, borderRadius: 23, borderWidth: 1, borderColor: palette.navy, alignItems: "center", justifyContent: "center" },
  model: { ...type.body, color: palette.muted, marginTop: 3 },
  cardFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, paddingHorizontal: 18, paddingVertical: 12, borderTopWidth: 1, borderTopColor: palette.border },
  hoursLabel: { ...type.label, color: palette.muted },
  hoursValue: { ...type.body, fontWeight: "700" },
  error: { color: palette.danger },
});
