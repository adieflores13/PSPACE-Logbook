import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ScreenLayout from "@/components/layout/screen-layout";
import { Fonts } from "@/constants/theme";

const LOGO_WITH_MAP = require("../assets/images/logo-with-map.png");

type LogbookEntry = {
  id: string;
  from: string;
  to: string;
  offBlock: string;
  onBlock: string;
  date: string;
};

const SAMPLE_LOGS: LogbookEntry[] = [
  { id: "1", from: "EGGP", to: "HRF", offBlock: "0912", onBlock: "1333", date: "26 March 2026" },
  { id: "2", from: "LSGG", to: "EGLL", offBlock: "1259", onBlock: "1426", date: "24 March 2026" },
  { id: "3", from: "EGLL", to: "LSGG", offBlock: "0943", onBlock: "1154", date: "23 March 2026" },
];

function LogbookCard({ item }: { item: LogbookEntry }) {
  return (
    <View style={styles.card}>
      <View style={styles.routeRow}>
        <View style={styles.airportBlock}>
          <Text adjustsFontSizeToFit minimumFontScale={0.82} numberOfLines={1} style={styles.airportCode}>
            {item.from}
          </Text>
          <Text adjustsFontSizeToFit minimumFontScale={0.9} numberOfLines={1} style={styles.timeText}>
            {item.offBlock}
          </Text>
        </View>

        <Ionicons color={COLORS.navy} name="arrow-forward" size={36} />

        <View style={styles.airportBlock}>
          <Text adjustsFontSizeToFit minimumFontScale={0.82} numberOfLines={1} style={styles.airportCode}>
            {item.to}
          </Text>
          <Text adjustsFontSizeToFit minimumFontScale={0.9} numberOfLines={1} style={styles.timeText}>
            {item.onBlock}
          </Text>
        </View>
      </View>

      <Text adjustsFontSizeToFit minimumFontScale={0.9} numberOfLines={1} style={styles.dateText}>
        {item.date}
      </Text>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => Alert.alert("Flight Details", "Detailed log view will be added next.")}
        style={styles.detailsButton}>
        <Text style={styles.detailsButtonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function LogbookScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScreenLayout>
      <View style={styles.screen}>
        <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />

        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 16) + 20 }]}>
          <View style={[styles.topPanel, { paddingTop: insets.top + 8 }]}>
            <Image source={LOGO_WITH_MAP} style={styles.logo} />
          </View>

          <View style={styles.heroPanel}>
            <View style={styles.welcomeRow}>
              <View style={styles.avatarWrap}>
                <Ionicons color="#F8E7CF" name="person" size={30} />
              </View>

              <Text style={styles.welcomeText}>
                Welcome,{"\n"}(Cadet Name)!
              </Text>

              <View style={styles.notificationWrap}>
                <Ionicons color={COLORS.white} name="notifications" size={24} />
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>3</Text>
                </View>
              </View>
            </View>

            <Text style={styles.logbookTitle}>LOGBOOK</Text>
            <Text style={styles.logbookSubtitle}>Log hours, monitor progress, and stay organized</Text>
          </View>

          <View style={styles.cardsSection}>
            {SAMPLE_LOGS.map((item) => (
              <LogbookCard item={item} key={item.id} />
            ))}
          </View>
        </ScrollView>
      </View>
    </ScreenLayout>
  );
}

const COLORS = {
  page: "#D8DADD",
  topPanel: "#E5E7EA",
  navy: "#032451",
  white: "#FFFFFF",
  gold: "#FFBB57",
  muted: "#72767D",
  card: "#F1F2F4",
  cardShadow: "#2A2A2A",
  buttonBlue: "#022F73",
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.page,
  },
  scrollContent: {
    backgroundColor: COLORS.page,
  },
  topPanel: {
    height: 176,
    backgroundColor: COLORS.topPanel,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 126,
    height: 86,
    resizeMode: "contain",
    marginTop: 12,
  },
  heroPanel: {
    backgroundColor: COLORS.navy,
    paddingHorizontal: 28,
    paddingTop: 18,
    paddingBottom: 28,
  },
  welcomeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#6B826F",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  welcomeText: {
    color: COLORS.white,
    fontFamily: Fonts.rounded,
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 23,
    flex: 1,
  },
  notificationWrap: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    right: -3,
    top: -1,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.gold,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: COLORS.navy,
    fontSize: 12,
    fontWeight: "800",
    fontFamily: Fonts.rounded,
    lineHeight: 14,
  },
  logbookTitle: {
    color: COLORS.gold,
    fontFamily: Fonts.rounded,
    fontSize: 34,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 36,
    letterSpacing: 0.7,
  },
  logbookSubtitle: {
    textAlign: "center",
    color: "#CFD8E6",
    fontFamily: Fonts.rounded,
    fontSize: 13,
    marginTop: 6,
    marginBottom: 4,
  },
  cardsSection: {
    paddingTop: 24,
    paddingHorizontal: 18,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    marginBottom: 20,
    paddingHorizontal: 24,
    paddingVertical: 22,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 4,
  },
  routeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  airportBlock: {
    alignItems: "center",
    width: "33%",
  },
  airportCode: {
    color: COLORS.navy,
    fontFamily: Fonts.rounded,
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  timeText: {
    color: COLORS.navy,
    fontFamily: Fonts.rounded,
    fontSize: 18,
    marginTop: 6,
  },
  dateText: {
    textAlign: "center",
    color: COLORS.muted,
    fontFamily: Fonts.rounded,
    fontSize: 17,
    marginTop: 8,
    marginBottom: 12,
  },
  detailsButton: {
    alignSelf: "center",
    backgroundColor: COLORS.buttonBlue,
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderWidth: 1.3,
    borderColor: "#2450BD",
  },
  detailsButtonText: {
    color: COLORS.white,
    fontFamily: Fonts.rounded,
    fontSize: 14,
    fontWeight: "700",
  },
});
