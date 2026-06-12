import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { Fonts } from "@/constants/theme";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type FlightSavedAlertProps = {
  visible: boolean;
  onDone: () => void;
};

// ---------------------------------------------------------------------------
// Notebook icon (drawn with RN primitives to match the design)
// ---------------------------------------------------------------------------

function NotebookIcon() {
  return (
    <View style={iconStyles.wrap}>
      {/* rings */}
      {[-24, -8, 8, 24].map((x) => (
        <View key={x} style={[iconStyles.ring, { left: "50%" as any, marginLeft: x - 6 }]} />
      ))}

      {/* body */}
      <View style={iconStyles.body}>
        {/* lines */}
        <View style={iconStyles.line} />
        <View style={iconStyles.line} />
        <View style={[iconStyles.line, { width: "60%" }]} />
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function FlightSavedAlert({ visible, onDone }: FlightSavedAlertProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDone}>
      {/* dim backdrop */}
      <TouchableWithoutFeedback onPress={onDone}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      {/* card */}
      <View style={styles.centeredView}>
        <View style={styles.card}>
          {/* icon circle */}
          <View style={styles.iconCircle}>
            <NotebookIcon />
          </View>

          {/* text */}
          <Text style={styles.title}>Flight Record</Text>
          <Text style={styles.subtitle}>Saved!</Text>

          {/* button */}
          <TouchableOpacity activeOpacity={0.85} style={styles.doneBtn} onPress={onDone}>
            <Text style={styles.doneBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Tokens
// ---------------------------------------------------------------------------

const C = {
  navy: "#001B3A",
  circleBg: "#F0F2F5",
  white: "#FFFFFF",
  overlay: "rgba(0,0,0,0.45)",
  subtitle: "#6B7280",
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: C.overlay,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  card: {
    width: "100%",
    backgroundColor: C.white,
    borderRadius: 28,
    paddingTop: 36,
    paddingBottom: 28,
    paddingHorizontal: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: C.circleBg,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 28,
  },
  title: {
    fontFamily: Fonts.rounded,
    fontWeight: "700",
    fontSize: 22,
    color: C.navy,
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: Fonts.rounded,
    fontWeight: "400",
    fontSize: 15,
    color: C.subtitle,
    marginBottom: 28,
    textAlign: "center",
  },
  doneBtn: {
    width: "100%",
    height: 54,
    borderRadius: 16,
    backgroundColor: C.navy,
    justifyContent: "center",
    alignItems: "center",
  },
  doneBtnText: {
    fontFamily: Fonts.rounded,
    fontWeight: "700",
    fontSize: 16,
    color: C.white,
    letterSpacing: 0.3,
  },
});

// ---------------------------------------------------------------------------
// Notebook icon styles
// ---------------------------------------------------------------------------

const iconStyles = StyleSheet.create({
  wrap: {
    width: 80,
    height: 88,
    alignItems: "center",
  },
  ring: {
    position: "absolute",
    top: -8,
    width: 12,
    height: 16,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: C.navy,
    backgroundColor: C.white,
    zIndex: 2,
  },
  body: {
    position: "absolute",
    top: 8,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 3,
    borderColor: C.navy,
    borderRadius: 10,
    backgroundColor: C.white,
    paddingHorizontal: 14,
    paddingTop: 20,
    justifyContent: "center",
    gap: 8,
  },
  line: {
    height: 3.5,
    width: "100%",
    backgroundColor: C.navy,
    borderRadius: 2,
  },
});