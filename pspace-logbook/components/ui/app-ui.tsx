import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { ReactNode, useState } from "react";
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView, StyleProp, StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, useWindowDimensions, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import FiveIconNav, { ActiveTab } from "@/components/layout/five-icon-nav";
import Sidebar from "@/components/layout/sidebar";
import { font, palette, surfaces, type } from "@/constants/ui";

export function AppScreen({ title, subtitle, tab, children, scroll = true, onBack, brand = false, muted = false, scrollHeader = false, contentStyle }: { title: string; subtitle?: string; tab?: ActiveTab; children: ReactNode; scroll?: boolean; onBack?: () => void; brand?: boolean; muted?: boolean; scrollHeader?: boolean; contentStyle?: StyleProp<ViewStyle> }) {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const header = <View style={[styles.header, brand && styles.brandHeader]}>
    <View style={styles.headerRow}>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel={tab ? "Open menu" : "Go back"} style={styles.headerButton} onPress={tab ? () => setMenuVisible(true) : onBack ?? (() => router.canGoBack() ? router.back() : router.replace("/dashboardscreen/dashboard"))}>
        <Ionicons name={tab ? "menu-outline" : "arrow-back"} size={24} color={palette.navy} />
      </TouchableOpacity>
      {brand ? <Image accessibilityLabel="PSPACE Logbook" source={require("@/assets/images/logo-with-map.png")} resizeMode="contain" style={styles.logo} /> : <Text style={[type.title, styles.title]}>{title}</Text>}
      <View style={styles.headerButton} />
    </View>
    {brand && <Text style={styles.brandTitle}>{title.toUpperCase()}</Text>}
    {subtitle && <Text style={[type.caption, styles.subtitle]}>{subtitle}</Text>}
  </View>;
  const headerInScroll = scroll && scrollHeader;
  return (
    <View style={[styles.screen, muted && styles.muted]}>
      {!brand && <View pointerEvents="none" style={styles.mapBackdrop}><Image source={require("@/assets/images/country1.png")} resizeMode="contain" style={styles.mapAmericas} /><Image source={require("@/assets/images/country2.png")} resizeMode="contain" style={styles.mapWorld} /></View>}
      <SafeAreaView edges={["top", "left", "right"]} style={styles.flex}>
        <StatusBar style="dark" />
        {!headerInScroll && header}
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.viewport}>
          {scroll ? <ScrollView style={styles.viewport} contentContainerStyle={headerInScroll ? styles.scrollContent : [styles.content, muted && styles.muted, contentStyle]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {headerInScroll ? <>{header}<View style={[styles.content, muted && styles.muted, contentStyle]}>{children}</View></> : children}
          </ScrollView> : <View style={styles.flex}>{children}</View>}
        </KeyboardAvoidingView>
        {tab && <FiveIconNav active={tab} />}
        <Sidebar visible={menuVisible} onClose={() => setMenuVisible(false)} />
      </SafeAreaView>
    </View>
  );
}

export function AppButton({ label, onPress, variant = "primary", icon, disabled, loading, compact = false, pill = false }: { label: string; onPress: () => void; variant?: "primary" | "secondary" | "outline"; icon?: keyof typeof Ionicons.glyphMap; disabled?: boolean; loading?: boolean; compact?: boolean; pill?: boolean }) {
  const foreground = variant === "secondary" ? palette.surface : palette.navy;
  return <TouchableOpacity accessibilityRole="button" accessibilityState={{ disabled: !!disabled || !!loading }} activeOpacity={0.8} disabled={disabled || loading} onPress={onPress} style={[styles.button, variant === "primary" ? styles.primary : variant === "secondary" ? styles.secondary : styles.outline, compact && styles.compact, pill && { borderRadius: 24 }, (disabled || loading) && styles.disabled]}>
    {loading ? <ActivityIndicator color={foreground} /> : icon && <Ionicons name={icon} size={20} color={foreground} />}
    <Text style={[type.label, { color: foreground, fontSize: 14 }]}>{label}</Text>
  </TouchableOpacity>;
}

export function FormRow({ label, children }: { label: string; children: ReactNode }) {
  const { width, fontScale } = useWindowDimensions();
  const stacked = width < 350 || fontScale > 1.25;
  return <View style={[styles.formRow, stacked && styles.stacked]}><Text style={[type.label, !stacked && styles.rowLabel]}>{label}</Text><View style={styles.flex}>{children}</View></View>;
}

export function FormField({ label, error, layout = "stacked", ...props }: TextInputProps & { label: string; error?: string; layout?: "stacked" | "row" }) {
  const input = <View style={styles.flex}><TextInput accessibilityLabel={label} placeholderTextColor={palette.muted} {...props} style={[styles.input, props.multiline && styles.multiline, props.style]} />{error && <Text style={styles.error}>{error}</Text>}</View>;
  return layout === "row" ? <FormRow label={label}>{input}</FormRow> : <View style={styles.field}><Text style={type.label}>{label}</Text>{input}</View>;
}

export function SelectField({ label, value, onPress, disabled, layout = "stacked" }: { label: string; value: string; onPress: () => void; disabled?: boolean; layout?: "stacked" | "row" }) {
  const select = <TouchableOpacity accessibilityRole="button" accessibilityLabel={label + ": " + value} style={[styles.input, styles.select, disabled && styles.disabled]} onPress={onPress} disabled={disabled}><Text style={[type.body, styles.flex]}>{value}</Text><Ionicons name="chevron-down" color={palette.navy} size={18} /></TouchableOpacity>;
  return layout === "row" ? <FormRow label={label}>{select}</FormRow> : <View style={styles.field}><Text style={type.label}>{label}</Text>{select}</View>;
}

export function SectionHeading({ title, icon = "airplane-outline" }: { title: string; icon?: keyof typeof Ionicons.glyphMap }) {
  return <View style={styles.sectionHeading}><View style={styles.sectionIcon}><Ionicons name={icon} size={27} color={palette.navy} /></View><Text style={type.heading}>{title}</Text></View>;
}
export function InfoBox({ children }: { children: ReactNode }) {
  return <View style={styles.info}><Ionicons name="information-circle-outline" size={20} color={palette.navy} /><Text style={[type.caption, styles.flex, { color: palette.navy }]}>{children}</Text></View>;
}
export function EmptyState({ title, message, icon = "reader-outline" }: { title: string; message: string; icon?: keyof typeof Ionicons.glyphMap }) {
  return <View style={[surfaces.card, styles.empty]}><Ionicons name={icon} size={32} color={palette.navy} /><Text style={type.heading}>{title}</Text><Text style={[type.body, styles.emptyText]}>{message}</Text></View>;
}
export const appStyles = StyleSheet.create({ row: { flexDirection: "row", gap: 12 }, flex: { flex: 1 }, section: { gap: 16 }, card: surfaces.card, error: { ...type.caption, color: palette.danger }, centeredAction: { alignSelf: "center", minWidth: 160, width: "65%", maxWidth: 300 } });

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.surface }, muted: { backgroundColor: palette.background }, flex: { flex: 1 },
  viewport: { flex: 1, minHeight: 0, overflow: "hidden" }, scrollContent: { flexGrow: 1 },
  mapBackdrop: { position: "absolute", left: 0, right: 0, top: 0, height: 190, overflow: "hidden" },
  mapAmericas: { position: "absolute", width: 155, height: 220, top: -90, left: -65, tintColor: palette.navy, opacity: 0.08 },
  mapWorld: { position: "absolute", width: 245, height: 170, top: -90, right: -100, tintColor: palette.navy, opacity: 0.045 },
  header: { paddingHorizontal: 10, paddingVertical: 8, minHeight: 76, justifyContent: "center" },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, title: { flex: 1, textAlign: "center" },
  headerButton: { width: 44, height: 44, alignItems: "center", justifyContent: "center" }, subtitle: { textAlign: "center", paddingHorizontal: 16, marginTop: 4 },
  brandHeader: { paddingTop: 0, paddingBottom: 8 }, logo: { width: 65, height: 53 }, brandTitle: { ...type.title, fontFamily: font.medium, fontSize: 28, textAlign: "center", marginTop: 2, letterSpacing: 0.2 },
  content: { flexGrow: 1, gap: 16, padding: 18, paddingTop: 14, paddingBottom: 32 },
  button: { minHeight: 46, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 22, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, borderWidth: 1 },
  compact: { alignSelf: "center", minWidth: 150, maxWidth: "100%" },
  primary: { backgroundColor: palette.amber, borderColor: palette.accent }, secondary: { backgroundColor: palette.navy, borderColor: palette.navy, borderRadius: 24 }, outline: { borderColor: palette.navy, backgroundColor: palette.surface },
  disabled: { opacity: 0.45 }, field: { gap: 7 },
  input: { ...type.body, fontSize: 14, backgroundColor: palette.surface, minHeight: 46, borderWidth: 1, borderColor: palette.border, borderRadius: 5, paddingHorizontal: 11, paddingVertical: 10 },
  multiline: { minHeight: 110, textAlignVertical: "top" }, error: { ...type.caption, color: palette.danger, marginTop: 5 },
  select: { flexDirection: "row", alignItems: "center", gap: 7 }, formRow: { flexDirection: "row", alignItems: "center", gap: 12 }, rowLabel: { width: 100, fontSize: 12, lineHeight: 18 }, stacked: { flexDirection: "column", gap: 7, alignItems: "stretch" },
  info: { backgroundColor: palette.info, borderRadius: 5, padding: 15, flexDirection: "row", gap: 12, alignItems: "flex-start" },
  empty: { alignItems: "center", paddingVertical: 30, gap: 14 }, emptyText: { color: palette.muted, textAlign: "center" },
  sectionHeading: { flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 3 }, sectionIcon: { borderBottomWidth: 1.5, borderBottomColor: palette.navy, paddingBottom: 3 },
});
