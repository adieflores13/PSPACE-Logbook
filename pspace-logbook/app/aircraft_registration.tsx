import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Keyboard, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import RegistrationStatusModal from "@/components/registration-status-modal";
import { AppButton, AppScreen, FormField, InfoBox, SectionHeading } from "@/components/ui/app-ui";
import { DecisionModal } from "@/components/ui/decision-modal";
import { palette, type } from "@/constants/ui";
import { useAircraft } from "@/context/aircraft-context";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import type { AddAircraftInput, Aircraft } from "@/types/records";
import { type AircraftFormErrors, aircraftName, validateAircraftInput } from "@/utils/aircraft-details";

const engines = ["Single-Engine", "Multi-Engine", "Jet", "Turboprop", "Simulator", "Other"];
export default function AircraftRegistrationScreen() {
  const router = useRouter();
  const { aircraft, addAircraft } = useAircraft();
  const [form, setForm] = useState<AddAircraftInput>({ registration: "", make: "", model: "", variant: "" });
  const [fieldErrors, setFieldErrors] = useState<AircraftFormErrors>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [modalState, setModalState] = useState<"confirm" | "success" | null>(null);
  const [saving, setSaving] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [savedAircraft, setSavedAircraft] = useState<Aircraft | null>(null);
  const saveInProgress = useRef(false);
  const guard = useUnsavedChanges(!savedAircraft && Object.values(form).some((value) => !!value?.length), saving);
  const updateField = (field: keyof AddAircraftInput, value: string) => { setForm((current) => ({ ...current, [field]: value })); setFieldErrors((current) => ({ ...current, [field]: undefined })); setSaveError(null); };
  const leave = () => router.canGoBack() ? router.back() : router.replace("/aircrafts");
  const review = () => { Keyboard.dismiss(); const errors = validateAircraftInput(form, aircraft); setFieldErrors(errors); setSaveError(null); if (!Object.keys(errors).length) setModalState("confirm"); };
  const save = async () => {
    if (saveInProgress.current || savedAircraft) return;
    saveInProgress.current = true; setSaving(true); setSaveError(null);
    try { const result = await addAircraft(form); setSavedAircraft(result); setModalState("success"); }
    catch (cause) { setSaveError(cause instanceof Error ? cause.message : "Unable to save this aircraft."); }
    finally { saveInProgress.current = false; setSaving(false); }
  };
  const field = (key: keyof AddAircraftInput) => ({ value: form[key] ?? "", onChangeText: (value: string) => updateField(key, value), error: fieldErrors[key], editable: !saving && !savedAircraft });
  return <AppScreen title="Registration" onBack={leave}>
    <SectionHeading title="Aircraft Registration" />
    <Text style={type.caption}>Registration, manufacturer and model are required.</Text>
    <View style={styles.form}>
      <FormField layout="row" label="Registration *" placeholder="e.g. N123AB" autoCapitalize="characters" autoCorrect={false} {...field("registration")} />
      <FormField layout="row" label="Manufacturer *" placeholder="e.g. Cessna" {...field("make")} />
      <FormField layout="row" label="Model *" placeholder="e.g. 172S" {...field("model")} />
      <FormField layout="row" label="Variant" placeholder="Optional" {...field("variant")} />
      <FormField layout="row" label="Aircraft type" placeholder="e.g. Airplane" {...field("category")} />
      <FormField layout="row" label="Home base" placeholder="Airport or location" {...field("homeBase")} />
    </View>
    <Text style={type.heading}>Aircraft / Engine Category</Text>
    <View style={styles.categories}>{engines.map((engine) => <TouchableOpacity disabled={saving || !!savedAircraft} key={engine} accessibilityRole="radio" accessibilityState={{ checked: form.engineCategory === engine }} style={[styles.category, form.engineCategory === engine && styles.selected]} onPress={() => updateField("engineCategory", engine)}><Ionicons name={engine === "Jet" ? "paper-plane-outline" : engine === "Simulator" ? "disc-outline" : engine === "Other" ? "ellipsis-horizontal" : "airplane-outline"} size={23} color={form.engineCategory === engine ? palette.surface : palette.navy} /><Text style={[styles.categoryLabel, form.engineCategory === engine && styles.selectedText]}>{engine}</Text></TouchableOpacity>)}</View>
    <TouchableOpacity style={styles.more} accessibilityRole="button" accessibilityState={{ expanded: showMore }} onPress={() => setShowMore(!showMore)}><Text style={type.label}>Additional aircraft details</Text><Ionicons name={showMore ? "chevron-up" : "chevron-down"} size={18} color={palette.navy} /></TouchableOpacity>
    {showMore && <View style={styles.form}><FormField layout="row" label="Serial number" placeholder="Optional" {...field("serialNumber")} /><FormField layout="row" label="Year model" placeholder="YYYY" keyboardType="number-pad" maxLength={4} {...field("yearModel")} /><FormField layout="row" label="Occupants" placeholder="Optional" keyboardType="number-pad" {...field("maxOccupants")} /><FormField layout="row" label="Fuel type" placeholder="Optional" {...field("fuelType")} /><FormField layout="row" label="Registration date" placeholder="YYYY-MM-DD" maxLength={10} {...field("registrationDate")} /><FormField layout="row" label="Expiry date" placeholder="YYYY-MM-DD" maxLength={10} {...field("expiryDate")} /></View>}
    <InfoBox>Save this aircraft to select it when adding flights. Unknown details can be left blank.</InfoBox>
    {Object.values(fieldErrors).some(Boolean) && <Text accessibilityRole="alert" style={styles.error}>Review the highlighted fields.</Text>}
    <View style={styles.actions}><AppButton compact label="Proceed" onPress={review} loading={saving} disabled={!!savedAircraft} /><AppButton compact label="Cancel" variant="outline" onPress={leave} disabled={saving} /></View>
    <RegistrationStatusModal visible={modalState !== null} variant={modalState ?? "confirm"} registration={savedAircraft?.registration ?? form.registration.trim().toUpperCase()} aircraftType={aircraftName(savedAircraft ?? form)} homeBase={savedAircraft?.homeBase ?? form.homeBase} loading={saving} error={saveError} onConfirm={() => { void save(); }} onCancel={() => { if (!saving) { if (savedAircraft) guard.allowExit(() => router.dismissTo("/aircrafts")); else setModalState(null); } }} onViewRegistration={() => { if (savedAircraft) router.replace({ pathname: "/aircraft_details", params: { id: savedAircraft.id } }); }} />
    <DecisionModal visible={guard.visible} title="Discard unsaved changes?" description="Your aircraft details have not been saved." icon="warning-outline" tone="warning" primaryLabel="Keep Editing" onPrimary={guard.keepEditing} secondaryLabel="Discard Changes" onSecondary={guard.discard} onDismiss={guard.keepEditing} />
  </AppScreen>;
}
const styles = StyleSheet.create({ form: { gap: 12 }, categories: { flexDirection: "row", flexWrap: "wrap", gap: 10 }, category: { minHeight: 54, width: "48%", flexGrow: 1, borderWidth: 1.5, borderColor: palette.border, borderRadius: 5, paddingHorizontal: 12, paddingVertical: 10, flexDirection: "row", alignItems: "center", gap: 10 }, categoryLabel: { ...type.label, fontSize: 11, flex: 1 }, selected: { backgroundColor: palette.navy }, selectedText: { color: palette.surface }, more: { minHeight: 44, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: palette.border }, actions: { gap: 12, marginTop: 6 }, error: { ...type.body, color: palette.danger } });
