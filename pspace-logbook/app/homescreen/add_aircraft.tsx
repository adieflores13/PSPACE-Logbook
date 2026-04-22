import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import Colors from "@/constants/colors";

export default function AddAircraftScreen() {
  const router = useRouter();

  const [registration, setRegistration] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [variant, setVariant] = useState("");
  const [numberOfEngines, setNumberOfEngines] = useState<"single" | "multi">("single");
  const [engineType, setEngineType] = useState<"Pistol" | "Turboprop" | "Turbofan" | "Other">("Pistol");
  const [mtow, setMtow] = useState("");

  const engineOptions: Array<"Pistol" | "Turboprop" | "Turbofan" | "Other"> = [
    "Pistol",
    "Turboprop",
    "Turbofan",
    "Other",
  ];

  const handleAddAircraft = () => {
    console.log({
      registration,
      make,
      model,
      variant,
      numberOfEngines,
      engineType,
      mtow,
    });
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.cardBackground} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back Button */}
        <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>⚙✈</Text>
          </View>
          <Text style={styles.title}>Add Aircraft</Text>
        </View>

        {/* Basic Info Card */}
        <View style={styles.card}>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Registration:</Text>
            <TextInput
              style={styles.input}
              placeholder="Registration..."
              placeholderTextColor={Colors.textPlaceholder}
              value={registration}
              onChangeText={setRegistration}
            />
          </View>
          <View style={styles.divider} />

          <View style={styles.inputRow}>
            <Text style={styles.label}>Make:</Text>
            <TextInput
              style={styles.input}
              placeholder="Make..."
              placeholderTextColor={Colors.textPlaceholder}
              value={make}
              onChangeText={setMake}
            />
          </View>
          <View style={styles.divider} />

          <View style={styles.inputRow}>
            <Text style={styles.label}>Model:</Text>
            <TextInput
              style={styles.input}
              placeholder="Model..."
              placeholderTextColor={Colors.textPlaceholder}
              value={model}
              onChangeText={setModel}
            />
          </View>
          <View style={styles.divider} />

          <View style={styles.inputRow}>
            <Text style={styles.label}>Variant:</Text>
            <TextInput
              style={styles.input}
              placeholder="Variant..."
              placeholderTextColor={Colors.textPlaceholder}
              value={variant}
              onChangeText={setVariant}
            />
          </View>
        </View>

        {/* Engine Info Card */}
        <View style={styles.card}>
          {/* Number of Engines */}
          <View style={styles.engineRow}>
            <Text style={styles.label}>Number of Engines:</Text>
            <View style={styles.toggleGroup}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  numberOfEngines === "single" && styles.toggleButtonActive,
                ]}
                onPress={() => setNumberOfEngines("single")}
              >
                <Text
                  style={[
                    styles.toggleText,
                    numberOfEngines === "single" && styles.toggleTextActive,
                  ]}
                >
                  Single Engine
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  numberOfEngines === "multi" && styles.toggleButtonActive,
                ]}
                onPress={() => setNumberOfEngines("multi")}
              >
                <Text
                  style={[
                    styles.toggleText,
                    numberOfEngines === "multi" && styles.toggleTextActive,
                  ]}
                >
                  Multi Engine
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Engine Type */}
          <View style={styles.engineRow}>
            <Text style={styles.label}>Engine Type:</Text>
            <View style={styles.toggleGroup}>
              {engineOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.toggleButton,
                    engineType === option && styles.toggleButtonActive,
                  ]}
                  onPress={() => setEngineType(option)}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      engineType === option && styles.toggleTextActive,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.divider} />

          {/* MTOW */}
          <View style={styles.inputRow}>
            <Text style={styles.label}>Maximum Takeoff Weight (M TOW):</Text>
            <TextInput
              style={[styles.input, styles.mtowInput]}
              placeholder="Input here..."
              placeholderTextColor={Colors.textPlaceholder}
              keyboardType="numeric"
              value={mtow}
              onChangeText={setMtow}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.addButton} onPress={handleAddAircraft}>
            <Text style={styles.addButtonText}>Add Aircraft</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  backButton: {
    marginTop: 12,
    marginBottom: 4,
    alignSelf: "flex-start",
    padding: 4,
  },
  backArrow: {
    fontSize: 22,
    color: Colors.textPrimary,
  },

  // Logo
  logoContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  logoIcon: {
    fontSize: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.textPrimary,
    letterSpacing: 0.3,
  },

  // Card
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 14,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: 2,
  },

  // Input Row
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    flexWrap: "wrap",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textPrimary,
    minWidth: 100,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
    paddingVertical: 2,
    paddingHorizontal: 4,
    minWidth: 100,
  },
  mtowInput: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: 4,
  },

  // Engine Row
  engineRow: {
    paddingVertical: 10,
  },
  toggleGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    gap: 6,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.toggleInactive,
  },
  toggleButtonActive: {
    backgroundColor: Colors.toggleActiveBackground,
  },
  toggleText: {
    fontSize: 12,
    color: Colors.toggleInactiveText,
    fontWeight: "500",
  },
  toggleTextActive: {
    color: Colors.toggleActiveText,
    fontWeight: "600",
  },

  // Buttons
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 14,
    marginTop: 8,
  },
  addButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    shadowColor: Colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  addButtonText: {
    color: Colors.toggleActiveText,
    fontWeight: "700",
    fontSize: 15,
  },
  cancelButton: {
    backgroundColor: Colors.cancelButton,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
  },
  cancelButtonText: {
    color: Colors.cancelText,
    fontWeight: "600",
    fontSize: 15,
  },
});