import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Modal, Platform, StyleSheet, View } from "react-native";
import { AppButton, FormField, SelectField } from "@/components/ui/app-ui";
import { palette } from "@/constants/ui";
import { formatFlightDate, isValidDate } from "@/utils/flight-format";

export function DateField({ label, value, onChange, layout = "stacked", maximumDate, initialDate, disabled }: { label: string; value: string; onChange: (value: string) => void; layout?: "stacked" | "row"; maximumDate?: Date; initialDate?: Date; disabled?: boolean }) {
  const [visible, setVisible] = useState(false);
  const toISO = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  if (Platform.OS === "web") return <FormField label={label} layout={layout} value={value} onChangeText={onChange} placeholder="YYYY-MM-DD" editable={!disabled} />;
  const selected = isValidDate(value) ? new Date(`${value}T12:00:00`) : initialDate ?? new Date();
  const picker = <DateTimePicker value={selected} maximumDate={maximumDate} mode="date" display={Platform.OS === "ios" ? "spinner" : "default"} themeVariant="light" onChange={(event, date) => { if (date && event.type !== "dismissed") onChange(toISO(date)); if (Platform.OS !== "ios") setVisible(false); }} />;
  return <><SelectField disabled={disabled} label={label} layout={layout} value={value ? formatFlightDate(value) : "Choose date"} onPress={() => setVisible(true)} />{visible && (Platform.OS === "ios" ? <Modal visible transparent animationType="slide" onRequestClose={() => setVisible(false)}><View style={styles.overlay}><View style={styles.panel}>{picker}<AppButton label="Done" onPress={() => { if (!value) onChange(toISO(selected)); setVisible(false); }} /></View></View></Modal> : picker)}</>;
}
const styles = StyleSheet.create({ overlay: { flex: 1, backgroundColor: "rgba(3,36,81,0.5)", justifyContent: "center", padding: 20 }, panel: { backgroundColor: palette.surface, borderRadius: 20, padding: 20 } });
