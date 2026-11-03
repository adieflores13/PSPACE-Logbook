import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Keyboard, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AppButton, AppScreen, FormField, FormRow, InfoBox, SelectField } from "@/components/ui/app-ui";
import { DecisionModal } from "@/components/ui/decision-modal";
import { DateField } from "@/components/ui/date-field";
import { SelectionSheet } from "@/components/ui/selection-sheet";
import { palette, type } from "@/constants/ui";
import { useAircraft } from "@/context/aircraft-context";
import { useFlights } from "@/context/flight-context";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { formatFlightDate, formatHours, parseDuration, todayISO } from "@/utils/flight-format";
import { validateFlightInput } from "@/utils/flight-validation";
import type { AddFlightInput } from "@/types/records";

export default function AddFlightEntryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ period?: string }>();
  const { aircraft } = useAircraft();
  const { addFlight } = useFlights();
  const initialDate = useRef(todayISO()).current;
  const initialPeriod = useRef<"Day" | "Night">(params.period === "Night" ? "Night" : "Day").current;
  const [date, setDate] = useState(initialDate);
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState("");
  const [landings, setLandings] = useState("0");
  const [instructor, setInstructor] = useState("");
  const [remarks, setRemarks] = useState("");
  const [period, setPeriod] = useState(initialPeriod);
  const [aircraftId, setAircraftId] = useState("");
  const [blockOff, setBlockOff] = useState("");
  const [blockOn, setBlockOn] = useState("");
  const [pilotRole, setPilotRole] = useState("");
  const [weather, setWeather] = useState("");
  const [picker, setPicker] = useState<"aircraft" | "role" | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);
  const [error, setError] = useState("");
  const selected = aircraft.find((item) => item.id === aircraftId);
  const dirty = date !== initialDate || period !== initialPeriod || landings !== "0" || [departure, destination, duration, instructor, remarks, aircraftId, blockOff, blockOn, pilotRole, weather].some((value) => value.length > 0);
  const guard = useUnsavedChanges(dirty, saving);
  const input: AddFlightInput = { date, departure, destination, duration, landings: landings.trim(), instructor, remarks, period, aircraftId, blockOff, blockOn, pilotRole, weather };
  const review = () => {
    Keyboard.dismiss();
    const message = validateFlightInput(input, aircraft);
    setError(message ?? "");
    if (!message) setReviewing(true);
  };
  async function save() {
    if (savingRef.current) return;
    savingRef.current = true; setSaving(true); setError("");
    try {
      await addFlight(input);
      setReviewing(false);
      guard.allowExit(() => router.dismissTo("/flights"));
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to save this flight."); }
    finally { savingRef.current = false; setSaving(false); }
  }
  return <AppScreen title="Add Flight Entry">
    <View style={styles.form}>
      <DateField layout="row" label="Date" value={date} onChange={setDate} />
      <FormField layout="row" label="Departure" value={departure} onChangeText={setDeparture} placeholder="Airport or code" autoCapitalize="characters" autoCorrect={false} editable={!saving} />
      <FormField layout="row" label="Destination" value={destination} onChangeText={setDestination} placeholder="Airport or code" autoCapitalize="characters" autoCorrect={false} editable={!saving} />
      <SelectField layout="row" label="Aircraft" value={selected ? selected.registration + " - " + selected.makeModelVariant.replaceAll(" / ", " ") : aircraft.length ? "Select an aircraft" : "No saved aircrafts"} onPress={() => setPicker("aircraft")} disabled={!aircraft.length || saving} />
      {!aircraft.length && <><InfoBox>Add an aircraft before recording a flight.</InfoBox><AppButton compact label="Add Aircraft" variant="outline" onPress={() => router.push("/aircraft_registration")} /></>}
      <FormField layout="row" label="Duration (hrs)" value={duration} onChangeText={setDuration} keyboardType="decimal-pad" placeholder="e.g. 1.5" editable={!saving} />
      <FormRow label="Day / Night"><View style={styles.periods}>{(["Day", "Night"] as const).map((item) => <TouchableOpacity disabled={saving} key={item} accessibilityRole="radio" accessibilityState={{ checked: period === item }} onPress={() => setPeriod(item)} style={[styles.period, period === item && styles.selectedPeriod]}><Ionicons name={item === "Day" ? "sunny" : "moon"} size={16} color={palette.navy} /><Text style={type.label}>{item}</Text>{period === item && <Ionicons name="checkmark" size={16} color={palette.navy} />}</TouchableOpacity>)}</View></FormRow>
      <FormField layout="row" label="Instructor" value={instructor} onChangeText={setInstructor} placeholder="Optional" editable={!saving} />
      <FormField layout="row" label="Landings" value={landings} onChangeText={setLandings} keyboardType="number-pad" editable={!saving} />
      <FormField layout="row" label="Remarks" value={remarks} onChangeText={setRemarks} placeholder="Training, manoeuvres and notes" multiline editable={!saving} />
      <TouchableOpacity style={styles.more} accessibilityRole="button" accessibilityState={{ expanded: showMore }} onPress={() => setShowMore(!showMore)}><Text style={type.label}>Additional flight details</Text><Ionicons name={showMore ? "chevron-up" : "chevron-down"} size={18} color={palette.navy} /></TouchableOpacity>
      {showMore && <><FormField layout="row" label="Block off" value={blockOff} onChangeText={setBlockOff} placeholder="HH:MM" keyboardType="numbers-and-punctuation" editable={!saving} /><FormField layout="row" label="Block on" value={blockOn} onChangeText={setBlockOn} placeholder="HH:MM" keyboardType="numbers-and-punctuation" editable={!saving} /><SelectField layout="row" label="PIC / Dual" value={pilotRole || "Select a role"} onPress={() => setPicker("role")} disabled={saving} /><FormField layout="row" label="Weather" value={weather} onChangeText={setWeather} placeholder="Conditions" editable={!saving} /></>}
    </View>
    <InfoBox>Saving adds this flight to your device and Logbook totals. Enter duration in decimal hours.</InfoBox>
    {error && !reviewing ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
    <View style={styles.actions}><AppButton compact label="Save Flight" disabled={!selected || saving} onPress={review} /><AppButton compact label="Cancel" variant="outline" disabled={saving} onPress={() => router.back()} /></View>
    <SelectionSheet visible={picker !== null} title={picker === "role" ? "Pilot role" : "Choose an aircraft"} selected={picker === "role" ? pilotRole : aircraftId} options={picker === "role" ? ["PIC", "Dual", "Co-pilot", "Instructor"].map((value) => ({ value, label: value })) : aircraft.map((item) => ({ value: item.id, label: item.registration, description: item.makeModelVariant.replaceAll(" / ", " ") }))} onSelect={picker === "role" ? setPilotRole : setAircraftId} onClose={() => setPicker(null)} />
    <DecisionModal visible={reviewing} title="Confirm Flight Entry?" icon="airplane-outline" primaryLabel="Confirm" onPrimary={() => { void save(); }} secondaryLabel="Cancel" onSecondary={() => setReviewing(false)} loading={saving} error={error}>
      <Text style={styles.confirmText}>{formatFlightDate(date)}</Text><Text style={styles.confirmText}>{selected?.registration} · {departure.split(" - ")[0]} → {destination.split(" - ")[0]}</Text><Text style={type.caption}>Total duration: {formatHours(parseDuration(duration) || 0)} hrs · {period}</Text>
    </DecisionModal>
    <DecisionModal visible={guard.visible} title="Discard unsaved changes?" description="Your flight entry has not been saved." tone="warning" icon="warning-outline" primaryLabel="Keep Editing" onPrimary={guard.keepEditing} secondaryLabel="Discard Changes" onSecondary={guard.discard} onDismiss={guard.keepEditing} />
  </AppScreen>;
}
const styles = StyleSheet.create({
  form: { gap: 12, paddingTop: 12 }, periods: { flexDirection: "row", gap: 10, flexWrap: "wrap" }, period: { flex: 1, minWidth: 80, minHeight: 46, borderWidth: 1, borderColor: palette.border, borderRadius: 5, justifyContent: "center", alignItems: "center", flexDirection: "row", gap: 7 }, selectedPeriod: { backgroundColor: palette.soft, borderColor: palette.navy },
  more: { minHeight: 44, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: palette.border }, actions: { gap: 12, marginTop: 8 }, error: { ...type.body, color: palette.danger }, confirmText: { ...type.label, textAlign: "center", fontSize: 12 },
});
