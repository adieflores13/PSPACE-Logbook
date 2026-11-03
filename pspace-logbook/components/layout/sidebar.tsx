import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { font, palette, type } from "@/constants/ui";
import { useProfile } from "@/context/profile-context";

type Item = { label: string; route?: string; icon: keyof typeof Ionicons.glyphMap };
const sections: { title: string; items: Item[] }[] = [
  { title: "MAIN", items: [
    { label: "Dashboard", route: "/dashboardscreen/dashboard", icon: "stats-chart-outline" },
    { label: "Flights", route: "/flights", icon: "paper-plane-outline" },
    { label: "Aircrafts", route: "/aircrafts", icon: "airplane-outline" },
    { label: "Logbook", route: "/logbook", icon: "reader-outline" },
    { label: "Analytics", icon: "analytics-outline" },
  ] },
  { title: "TRAINING", items: [
    { label: "Ratings & Requirements", icon: "trending-up-outline" },
    { label: "Currency Tracker", icon: "time-outline" },
    { label: "Endorsements", icon: "document-text-outline" },
    { label: "Training Schedule", icon: "calendar-outline" },
  ] },
  { title: "ACCOUNT", items: [
    { label: "Profile", route: "/profile", icon: "person-outline" },
    { label: "Settings", icon: "settings-outline" },
  ] },
];
export default function Sidebar({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const { profile } = useProfile();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const drawerWidth = Math.min(320, width * 0.85);
  const [mounted, setMounted] = useState(visible);
  const progress = useRef(new Animated.Value(0)).current;
  const presented = useRef(false);
  const latestVisible = useRef(visible);
  const pendingRoute = useRef<string | null>(null);
  latestVisible.current = visible;

  const openDrawer = () => {
    Animated.timing(progress, { toValue: 1, duration: 280, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  };

  useEffect(() => {
    if (visible) {
      pendingRoute.current = null;
      if (!mounted) {
        progress.setValue(0);
        setMounted(true);
        return;
      }
      if (presented.current) {
        Animated.timing(progress, { toValue: 1, duration: 280, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
      }
      return () => progress.stopAnimation();
    }
    if (!mounted) return;

    // Keep the modal mounted until the drawer has finished sliding off-screen.
    const animation = Animated.timing(progress, { toValue: 0, duration: 220, easing: Easing.in(Easing.cubic), useNativeDriver: true });
    animation.start(({ finished }) => {
      if (!finished || latestVisible.current) return;
      presented.current = false;
      setMounted(false);
      const route = pendingRoute.current;
      pendingRoute.current = null;
      if (route) router.navigate(route as never);
    });
    return () => animation.stop();
  }, [mounted, progress, router, visible]);

  const navigate = (route: string) => {
    pendingRoute.current = pathname !== route ? route : null;
    onClose();
  };
  return <Modal transparent visible={mounted} animationType="none" onRequestClose={onClose} onShow={() => { presented.current = true; if (latestVisible.current) openDrawer(); }}>
    <View style={styles.overlay} pointerEvents={visible ? "auto" : "none"}>
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.backdrop, { opacity: progress }]} />
      <Pressable accessibilityLabel="Close navigation menu" style={StyleSheet.absoluteFill} onPress={onClose} />
      <Animated.View accessibilityViewIsModal style={[styles.drawer, { width: drawerWidth, paddingTop: insets.top + 8, paddingBottom: Math.max(insets.bottom, 12), transform: [{ translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [-drawerWidth, 0] }) }] }]}>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="Close menu" style={styles.close} onPress={onClose}><Ionicons name="close" size={24} color={palette.navy} /></TouchableOpacity>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.brand}><Image source={require("@/assets/images/logo-with-map.png")} style={styles.logo} resizeMode="contain" /><Text style={styles.brandTitle}>PILOT LOGBOOK</Text></View>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Open profile" style={styles.profile} onPress={() => navigate("/profile")}><View style={styles.avatar}>{profile.profileImage ? <Image source={{ uri: profile.profileImage }} style={styles.avatar} /> : <Ionicons name="person" size={26} color={palette.navy} />}</View><View style={styles.flex}><Text style={type.label}>{profile.fullName}</Text><Text style={styles.meta}>{profile.role === "instructor" ? "Instructor" : "Student"}{profile.studentId ? " · " + profile.studentId : ""}</Text>{profile.academy && <Text style={styles.meta}>{profile.academy}</Text>}</View></TouchableOpacity>
        {sections.map((section) => <View style={styles.section} key={section.title}><Text style={styles.sectionTitle}>{section.title}</Text>{section.items.map((item) => { const active = item.route === pathname; return <TouchableOpacity key={item.label} accessibilityRole="button" accessibilityState={{ disabled: !item.route, selected: active }} disabled={!item.route} onPress={() => item.route && navigate(item.route)} style={[styles.item, active && styles.active]}><Ionicons name={item.icon} size={24} color={active ? palette.surface : item.route ? palette.navy : palette.muted} /><View style={styles.flex}><Text style={[styles.itemText, active && styles.activeText, !item.route && styles.disabledText]}>{item.label}</Text>{!item.route && <Text style={styles.soon}>Coming soon</Text>}</View></TouchableOpacity>; })}</View>)}
      </ScrollView>
    </Animated.View></View>
  </Modal>;
}
const styles = StyleSheet.create({
  overlay: { flex: 1 }, backdrop: { backgroundColor: "rgba(3,36,65,0.35)" }, drawer: { height: "100%", backgroundColor: palette.surface, borderTopRightRadius: 26, borderBottomRightRadius: 26, paddingHorizontal: 16, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 7, shadowOffset: { width: 2, height: 0 }, elevation: 10 },
  content: { paddingBottom: 12, gap: 18 }, close: { position: "absolute", right: 2, top: 4, width: 44, height: 44, alignItems: "center", justifyContent: "center", zIndex: 2 },
  brand: { alignItems: "center", gap: 8 }, logo: { width: 67, height: 55 }, brandTitle: { ...type.label, fontSize: 14 }, profile: { borderWidth: 1.5, borderColor: palette.border, borderRadius: 9, padding: 10, flexDirection: "row", alignItems: "center", gap: 10 }, avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: palette.soft, alignItems: "center", justifyContent: "center" }, meta: { ...type.caption, fontSize: 10, lineHeight: 15 }, flex: { flex: 1 },
  section: { gap: 4 }, sectionTitle: { ...type.label, fontFamily: font.medium, fontSize: 12, marginBottom: 3 }, item: { flexDirection: "row", alignItems: "center", gap: 16, minHeight: 48, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 9 }, active: { backgroundColor: palette.navy }, itemText: { ...type.label, fontSize: 13 }, activeText: { color: palette.surface }, disabledText: { color: palette.muted }, soon: { ...type.caption, fontSize: 10, lineHeight: 14 },
});
