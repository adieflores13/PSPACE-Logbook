import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  visible: boolean;
  variant: "confirm" | "success";
  registration: string;
  aircraftType: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onViewRegistration?: () => void;
};

export default function RegistrationStatusModal({
  visible,
  variant,
  registration,
  aircraftType,
  onConfirm,
  onCancel,
  onViewRegistration,
}: Props) {
  const isConfirmation = variant === "confirm";

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.modal}>
          <View style={styles.illustration}>
            {isConfirmation ? (
              <Ionicons name="airplane" size={66} color={NAVY} />
            ) : (
              <View style={styles.successIcon}>
                <Ionicons name="checkmark" size={47} color="#0A8B22" />
              </View>
            )}
            {isConfirmation ? (
              <>
                <Text style={styles.title}>Confirm aircraft{"\n"}registration?</Text>
                <Text style={styles.registration}>{registration || "N1234AB"}</Text>
                <Text style={styles.aircraftType}>{aircraftType || "Aircraft details"}</Text>
                <Text style={styles.homeBase}>Home Base: KAPA - Centennial</Text>
              </>
            ) : (
              <Text style={styles.title}>Aircraft successfully{"\n"}registered</Text>
            )}
          </View>

          {isConfirmation ? (
            <>
              <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={onConfirm}>
                <Text style={styles.primaryText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} activeOpacity={0.85} onPress={onCancel}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={onViewRegistration}>
              <Text style={styles.primaryText}>View Registration</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const NAVY = "#032451";

const styles = StyleSheet.create({
  backdrop: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(3, 36, 81, 0.78)", padding: 42 },
  modal: { width: "100%", maxWidth: 308, borderRadius: 22, backgroundColor: "#FFFFFF", paddingHorizontal: 19, paddingTop: 30, paddingBottom: 40, alignItems: "center" },
  illustration: { width: "100%", minHeight: 245, borderRadius: 132, backgroundColor: "#F3F6FA", alignItems: "center", justifyContent: "center", paddingHorizontal: 18, paddingTop: 26, marginBottom: 22 },
  successIcon: { width: 57, height: 57, borderRadius: 29, borderWidth: 4, borderColor: "#0A8B22", alignItems: "center", justifyContent: "center", marginBottom: 18 },
  title: { color: NAVY, fontSize: 17, lineHeight: 20, fontWeight: "900", textAlign: "center", marginTop: 12 },
  registration: { color: NAVY, fontSize: 13, fontWeight: "900", marginTop: 7 },
  aircraftType: { color: NAVY, fontSize: 12, fontWeight: "800", marginTop: 3 },
  homeBase: { color: "#778195", fontSize: 9, marginTop: 5 },
  primaryButton: { width: "100%", height: 37, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: NAVY },
  primaryText: { color: "#FFFFFF", fontSize: 12, fontWeight: "800" },
  cancelButton: { width: "100%", height: 37, borderRadius: 20, borderWidth: 1.5, borderColor: NAVY, alignItems: "center", justifyContent: "center", marginTop: 13 },
  cancelText: { color: NAVY, fontSize: 12, fontWeight: "800" },
});
