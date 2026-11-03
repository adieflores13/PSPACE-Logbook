import React, { useEffect, useRef, useState } from "react";
import { Animated, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { AppButton, AppScreen } from "@/components/ui/app-ui";
import FiveIconNav from "@/components/layout/five-icon-nav";
import { font, palette, type } from "@/constants/ui";
import { getFlightTotals, useFlights } from "@/context/flight-context";
import { useProfile } from "@/context/profile-context";
import { formatHours } from "@/utils/flight-format";

const GOALS = [
  { id: "ppl", title: "PPL(A)", fullName: "Private Pilot Licence", target: 45, action: "View Logbook" },
  { id: "night", title: "Night Rating", fullName: "Night flying", target: 5, action: "Add Night Flight" },
  { id: "atpl", title: "ATPL (A)", fullName: "Airline Transport Pilot Licence", target: 1500, action: "View Logbook" },
] as const;
type Goal = typeof GOALS[number] & { minutes: number; remaining: number; percentage: number };
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function GoalIcon({ id }: { id: Goal["id"] }) {
  if (id === "night") return <Ionicons name="moon" size={48} color={palette.navy} />;
  if (id === "atpl") return <Ionicons name="airplane-outline" size={50} color={palette.navy} style={{ transform: [{ rotate: "-90deg" }] }} />;
  return <View style={styles.pilot}><MaterialCommunityIcons name="account-tie-hat" size={34} color={palette.surface} /></View>;
}
function ProgressRing({ goal }: { goal: Goal }) {
  const progress = useRef(new Animated.Value(0)).current;
  const size = 196, stroke = 14, radius = (size - stroke) / 2, circumference = 2 * Math.PI * radius;
  useEffect(() => { const animation = Animated.timing(progress, { toValue: goal.percentage / 100, duration: 700, useNativeDriver: false }); animation.start(); return () => animation.stop(); }, [progress, goal.percentage]);
  return <View style={styles.ring} accessible accessibilityRole="progressbar" accessibilityLabel={goal.title + " progress"} accessibilityValue={{ min: 0, max: 100, now: goal.percentage }}>
    <Svg width={size} height={size}><Defs><LinearGradient id="ringGradient" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#98A4AE" /><Stop offset="0.8" stopColor={palette.navy} /></LinearGradient></Defs><Circle cx={size / 2} cy={size / 2} r={radius} stroke="#E8E8FF" strokeWidth={stroke} fill="none" /><AnimatedCircle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="url(#ringGradient)" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${circumference} ${circumference}`} strokeDashoffset={progress.interpolate({ inputRange: [0, 1], outputRange: [circumference, 0] })} rotation="-90" origin={`${size / 2}, ${size / 2}`} /></Svg>
    <View style={styles.ringCenter}>{goal.id === "night" && <Ionicons name="moon" size={26} color={palette.navy} />}<Text style={styles.ringValue} numberOfLines={1} adjustsFontSizeToFit>{formatHours(goal.minutes)}/{goal.target}</Text><Text style={styles.ringUnit}>Hours</Text><Text style={styles.ringPercent}>{goal.percentage}% Complete</Text></View>
  </View>;
}
function GoalProgress({ goal, onClose, onAction }: { goal: Goal | null; onClose: () => void; onAction: () => void }) {
  const insets = useSafeAreaInsets();
  if (!goal) return null;
  return <Modal visible animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}><View style={[styles.progressPage, { paddingTop: insets.top }]}>
    <View style={styles.progressHeader}><TouchableOpacity accessibilityRole="button" accessibilityLabel="Close progress" onPress={onClose} style={styles.close}><Ionicons name="arrow-back" size={24} color={palette.navy} /></TouchableOpacity><Text style={styles.progressTitle}>{goal.title} Progress</Text><View style={styles.close} /></View>
    <ScrollView contentContainerStyle={styles.progressContent} showsVerticalScrollIndicator={false}>
      <ProgressRing goal={goal} />
      <View style={styles.statRow}>{[{ label: "Target", value: String(goal.target), unit: goal.id === "night" ? "Night hours" : "Total hours" }, { label: "Current", value: formatHours(goal.minutes), unit: "Hours" }, { label: "Remaining", value: formatHours(goal.remaining), unit: "Hours" }].map((item) => <View style={styles.stat} key={item.label}><Text style={type.label}>{item.label}</Text><Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>{item.value}</Text><Text style={type.label}>{item.unit}</Text></View>)}</View>
      <View style={styles.goalCaption}><Ionicons name="checkmark-circle-outline" size={19} color={palette.navy} /><Text style={type.caption}>{goal.fullName} progress</Text></View>
      <AppButton compact label={goal.action} onPress={onAction} />
      <Text style={styles.reference}>Personal training target based on your saved flights.</Text>
    </ScrollView>
    <FiveIconNav active="dashboard" onBeforeNavigate={onClose} />
  </View></Modal>;
}
export default function DashboardScreen() {
  const router = useRouter();
  const { flights } = useFlights();
  const { profile } = useProfile();
  const totals = getFlightTotals(flights);
  const [selectedId, setSelectedId] = useState<Goal["id"] | null>(null);
  const goals: Goal[] = GOALS.map((goal) => { const minutes = goal.id === "night" ? totals.nightMinutes : totals.minutes; return { ...goal, minutes, remaining: Math.max(0, goal.target * 60 - minutes), percentage: Math.min(100, Math.round(minutes / (goal.target * 60) * 100)) }; });
  const selected = goals.find((goal) => goal.id === selectedId) ?? null;
  return <AppScreen title="Dashboard" brand subtitle="Your flight hours and training progress at a glance." tab="dashboard">
    <View style={styles.welcome}><View style={styles.avatar}>{profile.profileImage ? <Image source={{ uri: profile.profileImage }} style={styles.avatarImage} /> : <Ionicons name="person" size={21} color={palette.navy} />}</View><View style={styles.flex}><Text style={type.label}>Welcome,</Text><Text style={type.label}>{profile.fullName}!</Text></View><TouchableOpacity disabled accessibilityLabel="Notifications (coming soon)" accessibilityRole="button" style={styles.close}><Ionicons name="notifications-outline" size={24} color={palette.navy} /></TouchableOpacity></View>
    {goals.map((goal) => <TouchableOpacity accessibilityRole="button" accessibilityLabel={goal.title + " progress, " + goal.percentage + "%"} key={goal.id} style={styles.goalCard} onPress={() => setSelectedId(goal.id)} activeOpacity={0.8}>
      <View style={styles.cardRow}><View style={styles.icon}><GoalIcon id={goal.id} /></View><View style={styles.details}><Text style={styles.cardTitle}>{goal.title}</Text>{[["Target:", goal.target + (goal.id === "night" ? " night hrs" : " total hrs")], ["Current:", formatHours(goal.minutes) + " hrs"], ["Remaining:", formatHours(goal.remaining) + " hrs"]].map(([label, value]) => <View style={styles.dataRow} key={label}><Text style={styles.dataLabel}>{label}</Text><Text style={styles.dataValue}>{value}</Text></View>)}</View><Text style={styles.percentage}>{goal.percentage}%</Text></View>
      <View style={styles.track}><View style={[styles.fill, { width: goal.percentage + "%" as `${number}%` }]} /></View>
    </TouchableOpacity>)}
    <Text style={styles.reference}>Personal training targets · calculated from your saved flights</Text>
    <GoalProgress goal={selected} onClose={() => setSelectedId(null)} onAction={() => { setSelectedId(null); router.push(selected?.id === "night" ? "/add_flight_entry?period=Night" : "/logbook"); }} />
  </AppScreen>;
}
const styles = StyleSheet.create({
  flex: { flex: 1 }, welcome: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 2 }, avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: palette.soft, alignItems: "center", justifyContent: "center" }, avatarImage: { width: 36, height: 36, borderRadius: 18 },
  close: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  goalCard: { backgroundColor: palette.surface, borderWidth: 1, borderColor: "#DBDEE2", borderRadius: 9, padding: 15, gap: 19, shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 5, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  cardRow: { flexDirection: "row", alignItems: "center", gap: 12 }, icon: { width: 48, alignItems: "center" }, pilot: { width: 47, height: 47, borderRadius: 24, backgroundColor: palette.navy, justifyContent: "center", alignItems: "center" },
  details: { flex: 1, gap: 5 }, cardTitle: { ...type.heading, fontSize: 17, marginBottom: 10 }, dataRow: { flexDirection: "row", gap: 5, flexWrap: "wrap" }, dataLabel: { ...type.caption }, dataValue: { ...type.caption, fontFamily: font.medium },
  percentage: { ...type.title, fontSize: 24, alignSelf: "flex-end", marginBottom: 4 }, track: { height: 13, backgroundColor: "#CDCDCD", borderRadius: 8, overflow: "hidden" }, fill: { height: 13, backgroundColor: palette.navy, borderRadius: 8 },
  reference: { ...type.caption, fontSize: 11, textAlign: "center" }, progressPage: { flex: 1, backgroundColor: palette.surface },
  progressHeader: { flexDirection: "row", alignItems: "center", padding: 10 }, progressTitle: { ...type.label, fontSize: 15, flex: 1, textAlign: "center" },
  progressContent: { padding: 16, paddingTop: 30, gap: 32, flexGrow: 1, alignItems: "center" }, ring: { width: 196, height: 196, justifyContent: "center", alignItems: "center", marginBottom: 15 },
  ringCenter: { position: "absolute", width: 158, alignItems: "center", gap: 4 }, ringValue: { ...type.title, fontSize: 30 }, ringUnit: { ...type.label, letterSpacing: 1 }, ringPercent: { ...type.caption, marginTop: 4 },
  statRow: { flexDirection: "row", width: "100%", gap: 8 }, stat: { flex: 1, borderWidth: 1.5, borderColor: palette.border, borderRadius: 10, minHeight: 142, alignItems: "center", justifyContent: "space-between", paddingVertical: 16, paddingHorizontal: 4 }, statValue: { ...type.title, fontSize: 35, lineHeight: 44 }, goalCaption: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", gap: 10 },
});
