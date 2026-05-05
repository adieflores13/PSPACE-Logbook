import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Image,
  Dimensions,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/colors";
import { useAircraft } from "@/context/aircraft-context";

// ─── Assets ───────────────────────────────────────────────────────────────────

const LOGO_WITH_MAP = require("../../assets/images/logo-with-map.png");
const COUNTRY1 = require("../../assets/images/country1.png");
const COUNTRY2 = require("../../assets/images/country2.png");
const COUNTRY3 = require("../../assets/images/country3.png");

// ─── Constants ────────────────────────────────────────────────────────────────

const SCREEN_HEIGHT = Dimensions.get("window").height;
const HERO_HEIGHT = Math.round(SCREEN_HEIGHT * 0.38);

// ─── World Map Backdrop ───────────────────────────────────────────────────────

function WorldMapBackdrop() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Image fadeDuration={0} resizeMode="contain" source={COUNTRY1} style={[styles.countryBase, styles.countryAmericas]} />
      <Image fadeDuration={0} resizeMode="contain" source={COUNTRY2} style={[styles.countryBase, styles.countryEuraf]} />
      <Image fadeDuration={0} resizeMode="contain" source={COUNTRY3} style={[styles.countryBase, styles.countryAustralia]} />
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function AddAircraftScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addAircraft } = useAircraft();

  const [registration, setRegistration] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [variant, setVariant] = useState("");
  const [numberOfEngines, setNumberOfEngines] = useState<"single" | "multi">("multi");
  const [engineType, setEngineType] = useState<"Pistol" | "Turboprop" | "Turbofan" | "Other">("Turboprop");
  const [mtow, setMtow] = useState("");

  const engineOptions: ("Pistol" | "Turboprop" | "Turbofan" | "Other")[] = [
    "Pistol", "Turboprop", "Turbofan", "Other",
  ];

  const handleAddAircraft = () => {
    addAircraft({ registration, make, model, variant });
    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.screen}>
        <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />

        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Hero ── */}
          <View style={[styles.hero, { height: HERO_HEIGHT + insets.top, paddingTop: insets.top + 10 }]}>

            <WorldMapBackdrop />

            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={25} color={Colors.primaryDark} />
            </TouchableOpacity>

            <Image
              source={LOGO_WITH_MAP}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text style={styles.title}>Add Aircraft</Text>
          </View>

          {/* ── Body ── */}
          <View style={[styles.body, { paddingBottom: Math.max(insets.bottom, 16) + 24 }]}>
            <View style={styles.cardsWrap}>

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

            </View>{/* end cardsWrap */}

            {/* Action Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.addButton} onPress={handleAddAircraft}>
                <Text style={styles.addButtonText}>Add Aircraft</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </View>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
    width: "100%",
  },
  scrollContent: {
    paddingBottom: 0,
    flexGrow: 1,
  },

  // ── Hero ──
  hero: {
    backgroundColor: "#FFBB57",
    paddingHorizontal: 24,
    paddingBottom: 80,
    overflow: "hidden",
    alignItems: "center",
  },

  // ── World Map ──
  countryBase: {
    position: "absolute",
    opacity: 0.96,
  },
  countryAmericas: {
    left: -56,
    top: -2,
    width: 194,
    height: 356,
    opacity: 0.96,
  },
  countryEuraf: {
    right: -54,
    top: -8,
    width: 372,
    height: 264,
    opacity: 0.94,
  },
  countryAustralia: {
    right: 24,
    top: 206,
    width: 60,
    height: 50,
    opacity: 0.96,
  },

  // ── Back Button ──
  backButton: {
    alignSelf: "flex-start",
    width: 34,
    height: 34,
    justifyContent: "center",
    marginBottom: 4,
  },
  logo: {
    width: 110,
    height: 110,
    marginBottom: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.primaryDark ?? "#15355E",
    letterSpacing: 0.3,
    marginBottom: 4,
  },

  // ── Body ──
  body: {
    backgroundColor: Colors.background,
    paddingHorizontal: 0,
    paddingTop: 0,
    marginTop: 0,
  },

  // ── Cards Wrap (negative margin creates the overlap effect) ──
  cardsWrap: {
    paddingHorizontal: 16,
    marginTop: -120,
  },

  // ── Card ──
  card: {
    backgroundColor: Colors.cardBackground ?? "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 14,
    marginHorizontal: 12,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
  },

  // ── Input Row ──
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textPrimary,
    width: 110,
    flexShrink: 0,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },

  // ── Engine Row ──
  engineRow: {
    paddingVertical: 12,
  },
  toggleGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    gap: 6,
  },
  toggleButton: {
    paddingHorizontal: 12,
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

  // ── MTOW ──
  mtowInput: {
    fontSize: 13,
    color: Colors.textPrimary,
    marginTop: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },

  // ── Buttons ──
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginTop: 8,
    paddingHorizontal: 12,
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