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
import { useAircraft } from "@/context/aircraft-context";

export default function AddAircraftScreen() {
  const router = useRouter();
  const { addAircraft } = useAircraft();

  const [registration, setRegistration] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [variant, setVariant] = useState("");
  const [numberOfEngines, setNumberOfEngines] = useState<"single" | "multi">("multi");
  const [engineType, setEngineType] = useState<"Pistol" | "Turboprop" | "Turbofan" | "Other">("Turboprop");
  const [mtow, setMtow] = useState("");

  const engineOptions: ("Pistol" | "Turboprop" | "Turbofan" | "Other")[] = [
    "Pistol",
    "Turboprop",
    "Turbofan",
    "Other",
  ];

  const handleAddAircraft = () => {
    addAircraft({ registration, make, model, variant });
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.cardBackground} />

      {/* HEADER SECTION */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Add Aircraft</Text>
      </View>

      {/* BODY SECTION */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
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
              placeholder="Make..."
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
                style={[styles.toggleButton, numberOfEngines === "single" && styles.toggleButtonActive]}
                onPress={() => setNumberOfEngines("single")}
              >
                <Text style={[styles.toggleText, numberOfEngines === "single" && styles.toggleTextActive]}>
                  Single Engine
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, numberOfEngines === "multi" && styles.toggleButtonActive]}
                onPress={() => setNumberOfEngines("multi")}
              >
                <Text style={[styles.toggleText, numberOfEngines === "multi" && styles.toggleTextActive]}>
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
                  style={[styles.toggleButton, engineType === option && styles.toggleButtonActive]}
                  onPress={() => setEngineType(option)}
                >
                  <Text style={[styles.toggleText, engineType === option && styles.toggleTextActive]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.divider} />

          {/* MTOW */}
          <View style={styles.engineRow}>
            <Text style={styles.label}>Maximum Takeoff Weight (M TOW):</Text>
            <TextInput
              style={styles.mtowInput}
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

  // HEADER
  header: {
    backgroundColor: Colors.cardBackground,
    paddingTop: 12,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 8,
    padding: 4,
  },
  backArrow: {
    fontSize: 22,
    color: Colors.textPrimary,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.textPrimary,
    letterSpacing: 0.3,
  },

  // SCROLL BODY
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },

  // CARD
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 14,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
  },

  // INPUT ROW
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textPrimary,
    width: 110,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },

  // ENGINE ROW
  engineRow: {
    paddingVertical: 12,
  },
  toggleGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    gap: 6,
  },
  toggleButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
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

  // MTOW
  mtowInput: {
    fontSize: 13,
    color: Colors.textPrimary,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },

  // BUTTONS
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginTop: 8,
  },
  addButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 36,
    borderRadius: 30,
    shadowColor: Colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  cancelButton: {
    backgroundColor: Colors.cancelButton,
    paddingVertical: 15,
    paddingHorizontal: 36,
    borderRadius: 30,
  },
  cancelButtonText: {
    color: Colors.cancelText,
    fontWeight: "600",
    fontSize: 15,
  },
});
