import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Fonts } from "@/constants/theme";

const COUNTRY1 = require("../../assets/images/country1.png");
const COUNTRY2 = require("../../assets/images/country2.png");
const COUNTRY3 = require("../../assets/images/country3.png");

const SCREEN_HEIGHT = Dimensions.get("window").height;
const HERO_HEIGHT = Math.round(SCREEN_HEIGHT * 0.5);

interface FlightForm {
  departureDateTime: string;
  departureLocation: string;
  arrivalDateTime: string;
  arrivalLocation: string;
  aircraftRegistration: string;
  singlePilotTime: string;
  pilotInCommand: string;
  includeSelf: boolean;
  dayTakeoffs: string;
  nightTakeoffs: string;
  dayLandings: string;
  nightLandings: string;
  nightTime: string;
  ifrTime: string;
  picTime: string;
  coPilotTime: string;
  dualTime: string;
  instructorName: string;
  notes: string;
}

function WorldMapBackdrop() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Image fadeDuration={0} resizeMode="contain" source={COUNTRY1} style={[styles.mapBase, styles.mapAmericas]} />
      <Image fadeDuration={0} resizeMode="contain" source={COUNTRY2} style={[styles.mapBase, styles.mapEuraf]} />
      <Image fadeDuration={0} resizeMode="contain" source={COUNTRY3} style={[styles.mapBase, styles.mapAustralia]} />
    </View>
  );
}

type HeroLineFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
};

function HeroLineField({ label, value, onChangeText }: HeroLineFieldProps) {
  return (
    <View style={styles.heroFieldRow}>
      <Text style={styles.heroFieldLabel}>{label}</Text>
      <TextInput
        style={styles.heroLineInput}
        value={value}
        onChangeText={onChangeText}
        placeholder=""
        placeholderTextColor="rgba(255,255,255,0.38)"
      />
    </View>
  );
}

type InlineInputRowProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric" | "decimal-pad";
};

function InlineInputRow({
  label,
  value,
  onChangeText,
  placeholder = "Enter here..",
  keyboardType = "default",
}: InlineInputRowProps) {
  return (
    <View style={styles.inlineRow}>
      <Text style={styles.inlineLabel}>{label}</Text>
      <TextInput
        style={styles.inlineInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.placeholder}
        keyboardType={keyboardType}
      />
    </View>
  );
}

type DayNightRowProps = {
  label: string;
  dayValue: string;
  nightValue: string;
  onChangeDay: (value: string) => void;
  onChangeNight: (value: string) => void;
};

function DayNightRow({
  label,
  dayValue,
  nightValue,
  onChangeDay,
  onChangeNight,
}: DayNightRowProps) {
  return (
    <View style={styles.dayNightRow}>
      <Text style={styles.dayNightLabel}>{label}</Text>

      <TextInput
        style={styles.dayNightInput}
        value={dayValue}
        onChangeText={onChangeDay}
        placeholder="Enter here.."
        placeholderTextColor={COLORS.placeholder}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.dayNightInput}
        value={nightValue}
        onChangeText={onChangeNight}
        placeholder="Enter here.."
        placeholderTextColor={COLORS.placeholder}
        keyboardType="numeric"
      />
    </View>
  );
}

export default function AddFlightScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [form, setForm] = useState<FlightForm>({
    departureDateTime: "",
    departureLocation: "",
    arrivalDateTime: "",
    arrivalLocation: "",
    aircraftRegistration: "",
    singlePilotTime: "",
    pilotInCommand: "",
    includeSelf: true,
    dayTakeoffs: "",
    nightTakeoffs: "",
    dayLandings: "",
    nightLandings: "",
    nightTime: "",
    ifrTime: "",
    picTime: "",
    coPilotTime: "",
    dualTime: "",
    instructorName: "",
    notes: "",
  });

  const setField = <K extends keyof FlightForm>(key: K, value: FlightForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleAdd = () => {
    if (
      !form.departureDateTime.trim() ||
      !form.departureLocation.trim() ||
      !form.arrivalDateTime.trim() ||
      !form.arrivalLocation.trim()
    ) {
      Alert.alert(
        "Incomplete Form",
        "Please fill in Departure and Arrival Date/Time and Location.",
      );
      return;
    }

    Alert.alert(
      "Flight Added",
      `Flight from ${form.departureLocation} to ${form.arrivalLocation} logged.`,
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.screen}>
        <StatusBar backgroundColor="transparent" barStyle="light-content" translucent />

        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 16) + 24 },
          ]}>
          <View
            style={[
              styles.hero,
              {
                minHeight: HERO_HEIGHT + insets.top,
                paddingTop: insets.top + 8,
              },
            ]}>
            <WorldMapBackdrop />

            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons color={COLORS.white} name="arrow-back" size={25} />
            </TouchableOpacity>

            <Text style={styles.title}>Add Flight</Text>

            <View style={styles.sectionBlock}>
              <Text style={styles.sectionLabel}>Departure</Text>
              <View style={styles.airportRow}>
                <View style={styles.iconCircle}>
                  <MaterialCommunityIcons color={COLORS.hero} name="airplane-takeoff" size={24} />
                </View>
                <View style={styles.heroFieldsWrap}>
                  <HeroLineField
                    label="Date/Time:"
                    value={form.departureDateTime}
                    onChangeText={(value) => setField("departureDateTime", value)}
                  />
                  <HeroLineField
                    label="Location:"
                    value={form.departureLocation}
                    onChangeText={(value) => setField("departureLocation", value)}
                  />
                </View>
              </View>
            </View>

            <View style={styles.sectionBlock}>
              <Text style={styles.sectionLabel}>Arrival</Text>
              <View style={styles.airportRow}>
                <View style={styles.iconCircle}>
                  <MaterialCommunityIcons color={COLORS.hero} name="airplane-landing" size={24} />
                </View>
                <View style={styles.heroFieldsWrap}>
                  <HeroLineField
                    label="Date/Time:"
                    value={form.arrivalDateTime}
                    onChangeText={(value) => setField("arrivalDateTime", value)}
                  />
                  <HeroLineField
                    label="Location:"
                    value={form.arrivalLocation}
                    onChangeText={(value) => setField("arrivalLocation", value)}
                  />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.body}>
            <View style={styles.cardsWrap}>
              <View style={styles.card}>
                <InlineInputRow
                  label="Aircraft Registration:"
                  value={form.aircraftRegistration}
                  onChangeText={(value) => setField("aircraftRegistration", value)}
                  placeholder="Registration...."
                />
                <InlineInputRow
                  label="Single Pilot Time:"
                  value={form.singlePilotTime}
                  onChangeText={(value) => setField("singlePilotTime", value)}
                  placeholder="Make...."
                  keyboardType="decimal-pad"
                />
                <InlineInputRow
                  label="Pilot in Command:"
                  value={form.pilotInCommand}
                  onChangeText={(value) => setField("pilotInCommand", value)}
                  placeholder="Make...."
                />

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setField("includeSelf", !form.includeSelf)}
                  style={styles.checkboxRow}>
                  <View style={styles.checkboxBox}>
                    {form.includeSelf ? (
                      <Ionicons color={COLORS.textPrimary} name="checkmark" size={16} />
                    ) : null}
                  </View>
                  <Text style={styles.checkboxLabel}>Include self</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.card}>
                <View style={styles.dayNightHeader}>
                  <View style={styles.dayNightLabelSpacer} />
                  <Text style={styles.dayNightHeaderText}>Day</Text>
                  <Text style={styles.dayNightHeaderText}>Night</Text>
                </View>

                <DayNightRow
                  label="Takeoffs:"
                  dayValue={form.dayTakeoffs}
                  nightValue={form.nightTakeoffs}
                  onChangeDay={(value) => setField("dayTakeoffs", value)}
                  onChangeNight={(value) => setField("nightTakeoffs", value)}
                />
                <DayNightRow
                  label="Landings:"
                  dayValue={form.dayLandings}
                  nightValue={form.nightLandings}
                  onChangeDay={(value) => setField("dayLandings", value)}
                  onChangeNight={(value) => setField("nightLandings", value)}
                />
              </View>

              <View style={styles.card}>
                <InlineInputRow
                  label="Night Time:"
                  value={form.nightTime}
                  onChangeText={(value) => setField("nightTime", value)}
                  keyboardType="decimal-pad"
                />
                <InlineInputRow
                  label="IFR Time:"
                  value={form.ifrTime}
                  onChangeText={(value) => setField("ifrTime", value)}
                  keyboardType="decimal-pad"
                />
                <InlineInputRow
                  label="PIC Time:"
                  value={form.picTime}
                  onChangeText={(value) => setField("picTime", value)}
                  keyboardType="decimal-pad"
                />
                <InlineInputRow
                  label="Co-Pilot Time:"
                  value={form.coPilotTime}
                  onChangeText={(value) => setField("coPilotTime", value)}
                  keyboardType="decimal-pad"
                />
                <InlineInputRow
                  label="Dual Time:"
                  value={form.dualTime}
                  onChangeText={(value) => setField("dualTime", value)}
                  keyboardType="decimal-pad"
                />
                <InlineInputRow
                  label="Instructor Name:"
                  value={form.instructorName}
                  onChangeText={(value) => setField("instructorName", value)}
                />
                <InlineInputRow
                  label="Notes:"
                  value={form.notes}
                  onChangeText={(value) => setField("notes", value)}
                />
              </View>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity activeOpacity={0.88} onPress={handleAdd} style={styles.addButton}>
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.88}
                onPress={() => router.back()}
                style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const COLORS = {
  bodyBackground: "#DEDEDF",
  hero: "#032451",
  heroMap: "#3A5E83",
  white: "#F5F6F8",
  yellow: "#F8BD53",
  card: "#E8E8E9",
  border: "#8A8C91",
  textPrimary: "#0E284B",
  textLight: "#F1F5FB",
  placeholder: "#B7B9BD",
  blueStroke: "#2A65FF",
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bodyBackground,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: COLORS.bodyBackground,
  },

  hero: {
    paddingHorizontal: 18,
    paddingBottom: 112,
    backgroundColor: COLORS.hero,
    overflow: "hidden",
  },
  mapBase: {
    position: "absolute",
    tintColor: COLORS.heroMap,
    opacity: 0.72,
  },
  mapAmericas: {
    left: -84,
    top: -44,
    width: 228,
    height: 418,
  },
  mapEuraf: {
    right: -54,
    top: -30,
    width: 378,
    height: 288,
  },
  mapAustralia: {
    right: 56,
    top: 224,
    width: 56,
    height: 46,
    opacity: 0.42,
  },
  backButton: {
    width: 34,
    height: 34,
    justifyContent: "center",
  },
  title: {
    color: COLORS.textLight,
    fontSize: 28,
    fontFamily: Fonts.rounded,
    fontWeight: "800",
    lineHeight: 34,
    marginTop: 12,
    marginBottom: 10,
  },
  sectionBlock: {
    marginTop: 2,
  },
  sectionLabel: {
    color: COLORS.yellow,
    fontFamily: Fonts.rounded,
    fontSize: 17,
    fontWeight: "500",
    marginLeft: 68,
    marginBottom: 6,
  },
  airportRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 2,
  },
  heroFieldsWrap: {
    flex: 1,
  },
  heroFieldRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  heroFieldLabel: {
    minWidth: 84,
    color: COLORS.white,
    fontFamily: Fonts.rounded,
    fontSize: 17,
    fontWeight: "700",
  },
  heroLineInput: {
    flex: 1,
    borderBottomWidth: 1.4,
    borderBottomColor: COLORS.white,
    color: COLORS.white,
    fontFamily: Fonts.rounded,
    fontSize: 16,
    paddingBottom: 3,
    paddingTop: 0,
  },

  body: {
    marginTop: 0,
    backgroundColor: COLORS.bodyBackground,
  },
  cardsWrap: {
    paddingHorizontal: 8,
    marginTop: -66,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 5,
  },
  inlineRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  inlineLabel: {
    width: "34%",
    color: COLORS.textPrimary,
    fontFamily: Fonts.rounded,
    fontSize: 13,
    fontWeight: "700",
    paddingRight: 8,
  },
  inlineInput: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1.6,
    borderColor: COLORS.border,
    backgroundColor: "#ECECED",
    paddingHorizontal: 12,
    color: COLORS.textPrimary,
    fontFamily: Fonts.rounded,
    fontSize: 13,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginLeft: 40,
  },
  checkboxBox: {
    width: 21,
    height: 21,
    borderWidth: 1.8,
    borderColor: COLORS.border,
    borderRadius: 4,
    backgroundColor: "#DDDEE0",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxLabel: {
    marginLeft: 8,
    color: COLORS.textPrimary,
    fontFamily: Fonts.rounded,
    fontWeight: "700",
    fontSize: 14,
  },

  dayNightHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  dayNightLabelSpacer: {
    width: "24%",
  },
  dayNightHeaderText: {
    flex: 1,
    textAlign: "center",
    color: COLORS.textPrimary,
    fontFamily: Fonts.rounded,
    fontSize: 14,
    fontWeight: "700",
  },
  dayNightRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  dayNightLabel: {
    width: "24%",
    color: COLORS.textPrimary,
    fontFamily: Fonts.rounded,
    fontSize: 14,
    fontWeight: "700",
  },
  dayNightInput: {
    flex: 1,
    height: 38,
    borderRadius: 10,
    borderWidth: 1.4,
    borderColor: COLORS.border,
    backgroundColor: "#ECECED",
    paddingHorizontal: 12,
    color: COLORS.textPrimary,
    fontFamily: Fonts.rounded,
    fontSize: 12,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 22,
    marginTop: 10,
    paddingHorizontal: 20,
  },
  addButton: {
    flex: 1,
    maxWidth: 160,
    height: 62,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: COLORS.blueStroke,
    backgroundColor: COLORS.yellow,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: COLORS.textPrimary,
    fontFamily: Fonts.rounded,
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  cancelButton: {
    flex: 1,
    maxWidth: 160,
    height: 62,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: COLORS.blueStroke,
    backgroundColor: "#092B52",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    color: COLORS.white,
    fontFamily: Fonts.rounded,
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
});
