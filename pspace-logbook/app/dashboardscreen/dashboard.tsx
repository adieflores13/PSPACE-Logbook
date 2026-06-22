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
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Svg, { Circle } from "react-native-svg";
import ScreenLayout from "@/components/layout/screen-layout";

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
  percentage,
  current,
  required,
  unit,
}: {
  percentage: number;
  current: number;
  required: number;
  unit: string;
}) {
  const size = 160;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (percentage / 100) * circumference;

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
  onViewLogbook,
}: {
  item: Certification | null;
  visible: boolean;
  onClose: () => void;
  onViewLogbook: () => void;
}) {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1, duration: 250,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0, duration: 320,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      slideAnim.setValue(300);
      fadeAnim.setValue(0);
    }
  }, [visible]);

  if (!item) return null;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[modalStyles.backdrop, { opacity: fadeAnim }]} />
      </TouchableWithoutFeedback>

      {/* Sheet */}
      <Animated.View
        style={[
          modalStyles.sheet,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Drag handle */}
        <View style={modalStyles.handle} />

        {/* Circular progress */}
        <CircularProgress
          key={item.id + String(visible)}
          percentage={item.percentage}
          current={item.current}
          required={item.required}
          unit={item.unit}
        />

        {/* Stat boxes */}
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

        {/* Label */}
        <View style={modalStyles.labelRow}>
          <Ionicons name="checkmark-circle-outline" size={16} color={MUTED} />
          <Text style={modalStyles.labelText}>{item.fullName} progress</Text>
        </View>

        {/* Button */}
        <TouchableOpacity
          style={modalStyles.logbookBtn}
          activeOpacity={0.85}
          onPress={onViewLogbook}
        >
          <Text style={modalStyles.logbookBtnText}>View Logbook</Text>
        </TouchableOpacity>
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

// ─── Bottom Nav Item ──────────────────────────────────────────────────────────
function NavItem({
  icon, label, active = false, onPress,
}: {
  icon: string; label: string; active?: boolean; onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={onPress}>
      <Ionicons name={icon as any} size={22} color={active ? NAVY : MUTED} />
      <Text style={[styles.navLabel, active && styles.navLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [modalVisible, setModalVisible]  = useState(false);

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
    <ScreenLayout>
      <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7}>
            <Ionicons name="menu" size={26} color={NAVY} />
          </TouchableOpacity>
          <Image
            source={require("@/assets/images/logo-with-map.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={24} color={NAVY} />
            {NOTIFICATION_COUNT > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{NOTIFICATION_COUNT}</Text>
              </View>
            )}
          </TouchableOpacity>
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

      {/* ── Bottom Navigation ── */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom + 6 }]}>
        <NavItem icon="airplane"    label="Dashboard" active onPress={() => {}} />
        <NavItem icon="business"    label="Airports"  onPress={() => {}} />
        <NavItem icon="paper-plane" label="Flights"   onPress={() => router.push("/flightscreen/add_flight")} />
        <NavItem icon="book"        label="Logbook"   onPress={() => {}} />
        <NavItem icon="person"      label="Profile"   onPress={() => {}} />
      </View>

      {/* ── Detail Modal ── */}
      <CertModal
        item={selectedCert}
        visible={modalVisible}
        onClose={closeModal}
        onViewLogbook={() => {
          closeModal();
          router.push("/logbook");
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

  bottomNav: {
    flexDirection: "row",
    backgroundColor: WHITE,
    borderTopWidth: 1, borderTopColor: BORDER,
    paddingTop: 10,
  },
  navItem:       { flex: 1, alignItems: "center", gap: 3 },
  navLabel:      { fontSize: 10, color: MUTED, fontWeight: "500" },
  navLabelActive:{ color: NAVY, fontWeight: "700" },
});

// ─── Modal Styles ─────────────────────────────────────────────────────────────
const modalStyles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    position: "absolute",
    bottom: 0, left: 0, right: 0,
    backgroundColor: WHITE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 36,
    paddingTop: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 20,
  },
  handle: {
    width: 40, height: 4,
    backgroundColor: "#D0D3DC",
    borderRadius: 2,
    marginBottom: 24,
  },

  // Ring
  ringWrap: { width: 160, height: 160, alignItems: "center", justifyContent: "center", marginBottom: 28 },
  ringCenter: {
    position: "absolute",
    alignItems: "center",
  },
  ringMain: { fontSize: 24, fontWeight: "900", color: NAVY },
  ringUnit: { fontSize: 13, color: MUTED, marginTop: 2 },
  ringPct:  { fontSize: 11, color: MUTED, marginTop: 2 },

  // Stat boxes
  statRow: { flexDirection: "row", gap: 10, marginBottom: 20, width: "100%" },
  statBox: {
    flex: 1,
    backgroundColor: BG,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER,
  },
  statBoxLabel: { fontSize: 11, color: MUTED, fontWeight: "600", marginBottom: 6 },
  statBoxValue: { fontSize: 24, fontWeight: "900", color: NAVY },
  statBoxUnit:  { fontSize: 10, color: MUTED, marginTop: 4 },

  // Label
  labelRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 24 },
  labelText:{ fontSize: 12, color: MUTED },

  // Button
  logbookBtn: {
    width: "100%",
    backgroundColor: AMBER,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  logbookBtnText: { fontSize: 15, fontWeight: "800", color: NAVY },
});