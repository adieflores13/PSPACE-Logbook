// C:\nginx\html\pspace-logbook\pspace-logbook\app\dashboardscreen\dashboard.tsx
import React, { useRef, useEffect, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Svg, { Circle } from "react-native-svg";
import ScreenLayout from "@/components/layout/screen-layout";
import Sidebar from "@/components/layout/sidebar";
import FiveIconNav from "@/components/layout/five-icon-nav";

// ─── Mock data ────────────────────────────────────────────────────────────────
const CADET_NAME = "Cadet Name";
const NOTIFICATION_COUNT = 1;

type Certification = {
  id: string;
  title: string;
  fullName: string;
  required: number;
  requiredLabel: string;
  current: number;
  remaining: number;
  unit: string;
  percentage: number;
  progressLabel: string;
  actionLabel: string;
};

const CERTIFICATIONS: Certification[] = [
  {
    id: "ppl",
    title: "PPL(A)",
    fullName: "Private Pilot License",
    required: 45,
    requiredLabel: "Total Hours",
    current: 40,
    remaining: 5,
    unit: "Hours",
    percentage: 89,
    progressLabel: "Private Pilot License progress",
    actionLabel: "View Logbook",
  },
  {
    id: "night",
    title: "Night Rating",
    fullName: "Night Rating",
    required: 5,
    requiredLabel: "Night Hours",
    current: 3.5,
    remaining: 1.5,
    unit: "Hours",
    percentage: 70,
    progressLabel: "Night flying requirement",
    actionLabel: "Add Night Flight",
  },
  {
    id: "atpl",
    title: "ATPL (A)",
    fullName: "Airline Transport Pilot License",
    required: 1500,
    requiredLabel: "Total Hours",
    current: 980,
    remaining: 520,
    unit: "Hours",
    percentage: 65,
    progressLabel: "Airline Transport Pilot License progress",
    actionLabel: "View Logbook",
  },
];
// ─────────────────────────────────────────────────────────────────────────────

const NAVY  = "#032451";
const AMBER = "#FFBB57";
const WHITE = "#FFFFFF";
const BG    = "#F0F2F5";
const CARD  = "#FFFFFF";
const MUTED = "#8A8F9B";
const BORDER= "#E8EAF0";

// ─── Circular Progress Ring ───────────────────────────────────────────────────
function CircularProgress({
  id,
  percentage,
  current,
  required,
  unit,
}: {
  id: string;
  percentage: number;
  current: number;
  required: number;
  unit: string;
}) {
  const size = 190;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const animVal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animVal, {
      toValue: percentage / 100,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, []);

  // We use a static SVG and animate the strokeDashoffset via JS
  const [dashOffset, setDashOffset] = useState(circumference);

  useEffect(() => {
    const id = animVal.addListener(({ value }) => {
      setDashOffset(circumference - value * circumference);
    });
    return () => animVal.removeListener(id);
  }, []);

  return (
    <View style={modalStyles.ringWrap}>
      <Svg width={size} height={size}>
        {/* Track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E8EAF0"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={NAVY}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      {/* Center text */}
      <View style={modalStyles.ringCenter}>
        {id === "night" && (
          <MaterialCommunityIcons name="weather-night" size={32} color={NAVY} />
        )}
        <Text style={modalStyles.ringMain}>
          {current}/{required}
        </Text>
        <Text style={modalStyles.ringUnit}>{unit}</Text>
        <Text style={modalStyles.ringPct}>{percentage}% Complete</Text>
      </View>
    </View>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function CertModal({
  item,
  visible,
  onClose,
  onAction,
}: {
  item: Certification | null;
  visible: boolean;
  onClose: () => void;
  onAction: (item: Certification) => void;
}) {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(700)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      slideAnim.setValue(700);
    }
  }, [visible]);

  if (!item) return null;

  return (
    <Modal visible={visible} animationType="none" onRequestClose={onClose}>
      <StatusBar backgroundColor={WHITE} barStyle="dark-content" translucent={false} />
      <Animated.View
        style={[
          modalStyles.fullScreen,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={[modalStyles.modalHeader, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity onPress={onClose} style={modalStyles.backButton} hitSlop={10}>
            <Ionicons name="arrow-back" size={24} color={NAVY} />
          </TouchableOpacity>
          <Text style={modalStyles.modalTitle}>{item.title} Progress</Text>
          <View style={modalStyles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={modalStyles.modalContent}
          showsVerticalScrollIndicator={false}
        >
          <CircularProgress
            key={item.id + String(visible)}
            id={item.id}
            percentage={item.percentage}
            current={item.current}
            required={item.required}
            unit={item.unit}
          />

          <View style={modalStyles.statRow}>
            <View style={modalStyles.statBox}>
              <Text style={modalStyles.statBoxLabel}>Required</Text>
              <Text style={modalStyles.statBoxValue}>{item.required}</Text>
              <Text style={modalStyles.statBoxUnit}>{item.requiredLabel}</Text>
            </View>
            <View style={modalStyles.statBox}>
              <Text style={modalStyles.statBoxLabel}>Current</Text>
              <Text style={modalStyles.statBoxValue}>{item.current}</Text>
              <Text style={modalStyles.statBoxUnit}>{item.unit}</Text>
            </View>
            <View style={modalStyles.statBox}>
              <Text style={modalStyles.statBoxLabel}>Remaining</Text>
              <Text style={modalStyles.statBoxValue}>{item.remaining}</Text>
              <Text style={modalStyles.statBoxUnit}>{item.unit}</Text>
            </View>
          </View>

          <View style={modalStyles.labelRow}>
            <Ionicons name="checkmark-circle-outline" size={18} color={NAVY} />
            <Text style={modalStyles.labelText}>{item.progressLabel}</Text>
          </View>

          <TouchableOpacity
            style={modalStyles.logbookBtn}
            activeOpacity={0.85}
            onPress={() => onAction(item)}
          >
            <Text style={modalStyles.logbookBtnText}>{item.actionLabel}</Text>
          </TouchableOpacity>
        </ScrollView>

        <FiveIconNav active="dashboard" onBeforeNavigate={onClose} />
      </Animated.View>
    </Modal>
  );
}

// ─── Icon per certification ───────────────────────────────────────────────────
function CertIcon({ id }: { id: string }) {
  return (
    <View style={styles.certIconCircle}>
      {id === "ppl" ? (
        <FontAwesome5 name="user" size={26} color={WHITE} />
      ) : id === "night" ? (
        <MaterialCommunityIcons name="weather-night" size={30} color={WHITE} />
      ) : (
        <MaterialCommunityIcons name="airplane" size={30} color={WHITE} />
      )}
    </View>
  );
}

// ─── Certification Card ───────────────────────────────────────────────────────
function CertCard({
  item,
  delay = 0,
  onPress,
}: {
  item: Certification;
  delay?: number;
  onPress: () => void;
}) {
  const anim    = useRef(new Animated.Value(0)).current;
  const barAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(anim, {
        toValue: 1, duration: 420, delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(barAnim, {
        toValue: item.percentage / 100, duration: 800, delay: delay + 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <Animated.View
        style={[
          styles.certCard,
          {
            opacity: anim,
            transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
          },
        ]}
      >
        <View style={styles.certRow}>
          <CertIcon id={item.id} />

          <View style={styles.certInfo}>
            <Text style={styles.certTitle}>{item.title}</Text>
            <View style={styles.certDetails}>
              <View style={styles.certDetailRow}>
                <Text style={styles.certDetailLabel}>Required:</Text>
                <Text style={styles.certDetailValue}>{item.required} {item.requiredLabel}</Text>
              </View>
              <View style={styles.certDetailRow}>
                <Text style={styles.certDetailLabel}>Current:</Text>
                <Text style={styles.certDetailValue}>{item.current} {item.unit}</Text>
              </View>
              <View style={styles.certDetailRow}>
                <Text style={styles.certDetailLabel}>Remaining:</Text>
                <Text style={styles.certDetailValue}>{item.remaining} {item.unit}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.certPct}>{item.percentage}%</Text>
        </View>

        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: barAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [modalVisible, setModalVisible]  = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  function openModal(cert: Certification) {
    setSelectedCert(cert);
    setModalVisible(true);
  }

  function closeModal() {
    setModalVisible(false);
  }

  return (
    <ScreenLayout hideFooter>
      <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7} onPress={() => setSidebarVisible(true)}>
            <Ionicons name="menu" size={26} color={NAVY} />
          </TouchableOpacity>
          <Image
            source={require("@/assets/images/logo-with-map.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <View style={styles.headerBtn} />
        </View>

        {/* ── Dashboard Title ── */}
        <Animated.View style={[styles.titleBlock, { opacity: fadeAnim }]}>
          <Text style={styles.dashTitle}>DASHBOARD</Text>
          <Text style={styles.dashSubtitle}>
            View schedules, aircraft status, and live aviation data at a glance.
          </Text>
        </Animated.View>

        {/* ── Welcome Banner ── */}
        <Animated.View style={[styles.welcomeBanner, { opacity: fadeAnim }]}>
          <View style={styles.avatarCircle}>
            <FontAwesome5 name="user" size={18} color={NAVY} />
          </View>
          <Text style={styles.welcomeText}>
            Welcome, <Text style={styles.welcomeName}>({CADET_NAME})!</Text>
          </Text>
          <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={22} color={NAVY} />
            {NOTIFICATION_COUNT > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{NOTIFICATION_COUNT}</Text>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* ── Certification Cards ── */}
        <View style={styles.cardsWrap}>
          {CERTIFICATIONS.map((item, i) => (
            <CertCard
              key={item.id}
              item={item}
              delay={i * 100 + 100}
              onPress={() => openModal(item)}
            />
          ))}
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>

      <FiveIconNav active="dashboard" />

      {/* ── Sidebar ── */}
      <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />

      {/* ── Detail Modal ── */}
      <CertModal
        item={selectedCert}
        visible={modalVisible}
        onClose={closeModal}
        onAction={(item) => {
          closeModal();
          router.push(item.id === "night" ? "/add_flight_entry" : "/logbook");
        }}
      />
    </ScreenLayout>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  scroll:        { flex: 1, backgroundColor: BG },
  scrollContent: { paddingBottom: 8 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: WHITE,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  headerBtn: { padding: 4, position: "relative", width: 36, alignItems: "center" },
  logoImage:  { width: 80, height: 40 },
  badge: {
    position: "absolute", top: 0, right: 0,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: AMBER, alignItems: "center", justifyContent: "center",
  },
  badgeText: { fontSize: 8, fontWeight: "800", color: WHITE },

  titleBlock: {
    backgroundColor: WHITE,
    alignItems: "center",
    paddingTop: 20, paddingBottom: 14, paddingHorizontal: 20,
    borderBottomWidth: 1, borderBottomColor: BORDER,
  },
  dashTitle:    { fontSize: 30, fontWeight: "900", color: NAVY, letterSpacing: 4 },
  dashSubtitle: { fontSize: 11, color: MUTED, textAlign: "center", marginTop: 4 },

  welcomeBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    paddingHorizontal: 16, paddingVertical: 10,
    gap: 10,
    borderBottomWidth: 1, borderBottomColor: BORDER,
    marginBottom: 4,
  },
  avatarCircle: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: BG,
    borderWidth: 2, borderColor: BORDER,
    alignItems: "center", justifyContent: "center",
  },
  welcomeText: { flex: 1, fontSize: 13, color: MUTED, fontWeight: "500" },
  welcomeName: { color: NAVY, fontWeight: "700" },

  cardsWrap: { paddingHorizontal: 14, paddingTop: 10, gap: 10 },

  certCard: {
    backgroundColor: CARD,
    borderRadius: 16,
    paddingTop: 16, paddingHorizontal: 16, paddingBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 10, elevation: 3,
  },
  certRow:    { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 14 },
  certIconCircle: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: NAVY,
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  certInfo:   { flex: 1 },
  certTitle:  { fontSize: 15, fontWeight: "800", color: NAVY, marginBottom: 5 },
  certDetails:{ gap: 2 },
  certDetailRow: { flexDirection: "row", gap: 6 },
  certDetailLabel: { fontSize: 11, color: MUTED, width: 68 },
  certDetailValue: { fontSize: 11, color: NAVY, fontWeight: "600" },
  certPct:    { fontSize: 26, fontWeight: "900", color: NAVY, minWidth: 52, textAlign: "right", flexShrink: 0 },
  progressTrack: { height: 7, backgroundColor: "#D8DBE8", borderRadius: 4, overflow: "hidden" },
  progressFill:  { height: 7, borderRadius: 4, backgroundColor: NAVY },

});

// ─── Modal Styles ─────────────────────────────────────────────────────────────
const modalStyles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: WHITE,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  modalTitle: {
    color: NAVY,
    fontSize: 17,
    fontWeight: "800",
  },
  headerSpacer: {
    width: 36,
    height: 36,
  },
  modalContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 44,
    paddingBottom: 28,
  },

  // Ring
  ringWrap: { width: 190, height: 190, alignItems: "center", justifyContent: "center", marginBottom: 52 },
  ringCenter: {
    position: "absolute",
    alignItems: "center",
  },
  ringMain: { fontSize: 31, fontWeight: "900", color: "#08031C" },
  ringUnit: { fontSize: 15, color: "#08031C", fontWeight: "700", marginTop: 1 },
  ringPct:  { fontSize: 12, color: "#62636B", fontWeight: "600", letterSpacing: 0.3, marginTop: 6 },

  // Stat boxes
  statRow: { flexDirection: "row", gap: 8, marginBottom: 44, width: "100%" },
  statBox: {
    flex: 1,
    minHeight: 148,
    backgroundColor: WHITE,
    borderRadius: 11,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    borderColor: "#C7C8CC",
  },
  statBoxLabel: { fontSize: 12, color: NAVY, fontWeight: "700", marginBottom: 6 },
  statBoxValue: { fontSize: 40, fontWeight: "900", color: NAVY },
  statBoxUnit:  { fontSize: 12, color: NAVY, fontWeight: "600", marginTop: 4, textAlign: "center" },

  // Label
  labelRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 38, width: "100%", paddingHorizontal: 18 },
  labelText:{ fontSize: 12, color: NAVY, fontWeight: "500" },

  // Button
  logbookBtn: {
    width: 205,
    backgroundColor: AMBER,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#1F5BFF",
  },
  logbookBtnText: { fontSize: 14, fontWeight: "800", color: "#08031C" },
});
