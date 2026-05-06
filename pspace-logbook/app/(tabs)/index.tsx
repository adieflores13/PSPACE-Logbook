// C:\nginx\html\pspace-logbook\pspace-logbook\app\(tabs)\index.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { useAircraft } from "@/context/aircraft-context";
import { Fonts } from "@/constants/theme";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const HERO_HEIGHT = Math.round(SCREEN_HEIGHT * 0.34);
const WHITE_SECTION_MIN_HEIGHT = Math.round(SCREEN_HEIGHT * 0.7);
const COUNTRY1 = require("../../assets/images/country1.png");
const COUNTRY2 = require("../../assets/images/country2.png");
const COUNTRY3 = require("../../assets/images/country3.png");

function DashedRule() {
  return (
    <View style={styles.rule}>
      {Array.from({ length: 26 }).map((_, index) => (
        <View key={index} style={styles.ruleDash} />
      ))}
    </View>
  );
}

function WorldMapBackdrop() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Image fadeDuration={0} resizeMode="contain" source={COUNTRY1} style={[styles.countryBase, styles.countryAmericas]} />
      <Image fadeDuration={0} resizeMode="contain" source={COUNTRY2} style={[styles.countryBase, styles.countryEuraf]} />
      <Image fadeDuration={0} resizeMode="contain" source={COUNTRY3} style={[styles.countryBase, styles.countryAustralia]} />
    </View>
  );
}

function AircraftCard({
  aircraft,
}: {
  aircraft: { registration: string; makeModelVariant: string; hours: number };
}) {
  return (
    <View style={styles.card}>
      <DashedRule />

      <View style={styles.cardContent}>
        <View style={styles.registrationColumn}>
          <Text adjustsFontSizeToFit minimumFontScale={0.92} numberOfLines={1} style={styles.cardLabel}>
            Registration:
          </Text>
          <Text adjustsFontSizeToFit minimumFontScale={0.86} numberOfLines={1} style={styles.cardValue}>
            {aircraft.registration}
          </Text>
        </View>

        <View style={styles.modelColumn}>
          <Text adjustsFontSizeToFit minimumFontScale={0.78} numberOfLines={1} style={styles.cardLabel}>
            Make/Mode/Variant
          </Text>
          <Text adjustsFontSizeToFit minimumFontScale={0.86} numberOfLines={1} style={styles.cardValue}>
            {aircraft.makeModelVariant}
          </Text>
        </View>

        <View style={styles.hoursColumn}>
          <Text adjustsFontSizeToFit minimumFontScale={0.9} numberOfLines={1} style={styles.cardLabel}>
            Hours
          </Text>
          <Text adjustsFontSizeToFit minimumFontScale={0.86} numberOfLines={1} style={styles.cardValue}>
            {aircraft.hours}
          </Text>
        </View>
      </View>

      <DashedRule />
    </View>
  );
}

export default function AircraftListScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { aircraft } = useAircraft();

  return (
    <View style={styles.screen}>
      <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />

      <ScrollView bounces={false} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, { height: HERO_HEIGHT + insets.top, paddingTop: insets.top + 10 }]}>
          <WorldMapBackdrop />

          <TouchableOpacity
            accessibilityLabel="Go back"
            activeOpacity={0.82}
            onPress={() => router.back()}
            style={styles.backButton}>
            <Ionicons color={Colors.primaryDark} name="arrow-back" size={25} />
          </TouchableOpacity>

          <Text style={styles.title}>Aircrafts</Text>
        </View>

        <View
          style={[
            styles.whiteSection,
            {
              minHeight: WHITE_SECTION_MIN_HEIGHT,
              paddingBottom: Math.max(insets.bottom, 16) + 18,
            },
          ]}>
          <View style={styles.cardsWrap}>
            {aircraft.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>No aircraft sddyet</Text>
                <Text style={styles.emptyBody}>Tap Add Aircraft to add your first aircraft.</Text>
              </View>
            ) : (
              aircraft.map((item) => <AircraftCard aircraft={item} key={item.id} />)
            )}
          </View>

          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => router.push("/aircraftscreen/add_aircraft")}
            style={styles.addButton}>
            <Text style={styles.addButtonText}>Add Aircraft</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 0,
  },
  hero: {
    backgroundColor: "#FFBB57",
    paddingHorizontal: 24,
    paddingBottom: 120,
    overflow: "hidden",
  },
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
  backButton: {
    alignSelf: "flex-start",
    width: 34,
    height: 34,
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    textAlign: "center",
    color: Colors.primaryDark,
    fontSize: 40,
    lineHeight: 46,
    fontWeight: "800",
    fontFamily: Fonts.sans,
    marginTop: 62,
    marginBottom: 64,
    paddingTop: 4,
  },
  whiteSection: {
    backgroundColor: "#FFFFFF",
    marginTop: 0,
  },
  cardsWrap: {
    paddingHorizontal: 24,
    marginTop: -40,
  },
  card: {
    backgroundColor: "#EEF2F8",
    borderRadius: 22,
    paddingHorizontal: 26,
    paddingVertical: 18,
    marginBottom: 20,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  emptyCard: {
    backgroundColor: "#EEF2F8",
    borderRadius: 22,
    paddingHorizontal: 22,
    paddingVertical: 26,
    marginBottom: 20,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.16,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
    alignItems: "center",
  },
  emptyTitle: {
    color: Colors.primaryDark,
    fontSize: 20,
    fontWeight: "800",
    fontFamily: Fonts.rounded,
    marginBottom: 6,
  },
  emptyBody: {
    color: "#244066",
    fontSize: 14,
    fontFamily: Fonts.rounded,
  },
  rule: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ruleDash: {
    width: 8,
    height: 2,
    borderRadius: 1,
    backgroundColor: Colors.primaryDark,
    opacity: 0.92,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 22,
    gap: 10,
  },
  registrationColumn: {
    flex: 1.06,
    gap: 10,
  },
  modelColumn: {
    flex: 1.14,
    alignItems: "center",
    gap: 10,
  },
  hoursColumn: {
    width: 58,
    alignItems: "flex-end",
    gap: 10,
  },
  cardLabel: {
    color: "#244066",
    fontSize: 14,
    fontFamily: Fonts.rounded,
  },
  cardValue: {
    color: Colors.primaryDark,
    fontSize: 18,
    fontWeight: "800",
    fontFamily: Fonts.rounded,
  },
  addButton: {
    alignSelf: "center",
    minWidth: 258,
    marginTop: 4,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#2E63FF",
    backgroundColor: "#F8BC59",
    paddingHorizontal: 30,
    paddingVertical: 14,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  addButtonText: {
    textAlign: "center",
    color: Colors.primaryDark,
    fontSize: 18,
    fontWeight: "700",
    fontFamily: Fonts.rounded,
  },
});
