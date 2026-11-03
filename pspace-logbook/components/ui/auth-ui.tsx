import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React, { ReactNode, useState } from "react";
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInputProps, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FormField } from "@/components/ui/app-ui";
import { font, palette, type } from "@/constants/ui";

export function AuthScreen({ title, subtitle, children, onBack }: { title: string; subtitle: string; children: ReactNode; onBack?: () => void }) {
  return <SafeAreaView style={styles.screen}><StatusBar style="dark" />
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll} bounces={false}>
        <View style={styles.content}>
          <View style={styles.brand}>
            <Image source={require("@/assets/images/country2.png")} resizeMode="contain" style={styles.map} accessible={false} />
            {onBack && <TouchableOpacity accessibilityRole="button" accessibilityLabel="Go back" onPress={onBack} style={styles.back}><Ionicons name="arrow-back" size={24} color={palette.navy} /></TouchableOpacity>}
            <Image source={require("@/assets/images/logo-with-map.png")} resizeMode="contain" accessibilityLabel="PSPACE Logbook" style={styles.logo} />
            <Text style={styles.brandName}>PSPACE LOGBOOK</Text>
          </View>
          <View style={styles.intro}><View style={styles.rule} /><Text accessibilityRole="header" style={styles.title}>{title}</Text><Text style={type.body}>{subtitle}</Text></View>
          <View style={styles.form}>{children}</View>
          <Text style={styles.footer}>One PSPACE account. Your flight journey, together.</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>;
}
export function PasswordField({ label = "Password", ...props }: TextInputProps & { label?: string }) {
  const [visible, setVisible] = useState(false);
  return <View><FormField label={label} secureTextEntry={!visible} autoCapitalize="none" autoCorrect={false} {...props} style={styles.password} /><TouchableOpacity accessibilityRole="button" accessibilityLabel={`${visible ? "Hide" : "Show"} ${label.toLowerCase()}`} onPress={() => setVisible((value) => !value)} style={styles.eye}><Ionicons name={visible ? "eye-off-outline" : "eye-outline"} size={22} color={palette.navy} /></TouchableOpacity></View>;
}
export function AuthError({ message }: { message: string }) {
  return message ? <View style={styles.error}><Ionicons name="alert-circle-outline" size={20} color={palette.danger} /><Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={[type.caption, styles.flex, { color: palette.danger }]}>{message}</Text></View> : null;
}
export const authStyles = StyleSheet.create({ link: { minHeight: 44, justifyContent: "center", paddingHorizontal: 2 }, linkText: { ...type.label, textDecorationLine: "underline" }, row: { flexDirection: "row", alignItems: "center", justifyContent: "center", flexWrap: "wrap", columnGap: 8 }, note: { ...type.caption, textAlign: "center" } });
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.surface }, flex: { flex: 1 }, scroll: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 24 }, content: { width: "100%", maxWidth: 440, alignSelf: "center" },
  brand: { minHeight: 155, alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 24 }, map: { position: "absolute", width: "100%", height: 170, opacity: 0.045, top: -12, right: -24 }, logo: { width: 116, height: 76 }, brandName: { ...type.label, fontSize: 12, letterSpacing: 2 }, back: { position: "absolute", left: -10, top: 10, width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  intro: { gap: 10, marginBottom: 26 }, rule: { width: 40, height: 4, borderRadius: 2, backgroundColor: palette.amber, marginBottom: 4 }, title: { ...type.title, fontFamily: font.bold, fontSize: 29, lineHeight: 38 }, form: { gap: 18 }, footer: { ...type.caption, textAlign: "center", marginTop: 30 }, password: { paddingRight: 54 }, eye: { position: "absolute", bottom: 1, right: 1, width: 48, height: 48, alignItems: "center", justifyContent: "center" }, error: { flexDirection: "row", alignItems: "flex-start", backgroundColor: "#FFF1F0", padding: 12, gap: 8, borderRadius: 8 },
});
