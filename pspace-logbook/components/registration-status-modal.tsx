import React from "react";
import { StyleSheet, Text } from "react-native";
import { DecisionModal } from "@/components/ui/decision-modal";
import { AircraftIllustration } from "@/components/ui/aircraft-illustration";
import { palette, type } from "@/constants/ui";
import { aircraftValue } from "@/utils/aircraft-details";

type Props = { visible: boolean; variant: "confirm" | "success"; registration: string; aircraftType: string; homeBase?: string; loading?: boolean; error?: string | null; onConfirm?: () => void; onCancel?: () => void; onViewRegistration?: () => void };
export default function RegistrationStatusModal({ visible, variant, registration, aircraftType, homeBase, loading, error, onConfirm, onCancel, onViewRegistration }: Props) {
  const confirm = variant === "confirm";
  return <DecisionModal visible={visible} title={confirm ? "Confirm aircraft details?" : "Aircraft successfully saved"} illustration={confirm ? <AircraftIllustration /> : undefined} icon={confirm ? "airplane-outline" : "checkmark-circle-outline"} tone={confirm ? "neutral" : "success"} primaryLabel={confirm ? "Confirm" : "View Registration"} onPrimary={() => confirm ? onConfirm?.() : onViewRegistration?.()} secondaryLabel={confirm ? "Cancel" : undefined} onSecondary={onCancel} loading={loading} error={error}>
    {confirm && <><Text style={styles.identity}>{aircraftValue(registration)}</Text><Text style={styles.model}>{aircraftValue(aircraftType)}</Text>{homeBase?.trim() ? <Text style={styles.caption}>Home base: {homeBase}</Text> : null}</>}
  </DecisionModal>;
}
const styles = StyleSheet.create({ identity: { ...type.label }, model: { ...type.body, fontSize: 13, textAlign: "center" }, caption: { ...type.caption, fontSize: 11, textAlign: "center", color: palette.muted } });
