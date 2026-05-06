// C:\nginx\html\pspace-logbook\pspace-logbook\app\auth\login.tsx
import React, { useRef, useState } from "react";
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ScreenLayout from "@/components/layout/screen-layout";
import { Fonts } from "@/constants/theme";

// ─── Temporary test credentials ───────────────────────────────────────────────
const TEST_EMAIL    = "Loisbecket@gmail.com";
const TEST_PASSWORD = "password123";
// ─────────────────────────────────────────────────────────────────────────────

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail]               = useState(TEST_EMAIL);
  const [password, setPassword]         = useState(TEST_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe]     = useState(false);
  const [error, setError]               = useState("");

  const btnScale = useRef(new Animated.Value(1)).current;

  const animateBtn = (toValue: number) =>
    Animated.spring(btnScale, { toValue, useNativeDriver: true, friction: 5 }).start();

  const handleLogin = () => {
    setError("");
    if (email === TEST_EMAIL && password === TEST_PASSWORD) {
      // ✅ FIXED: was "../(tabs)" — relative paths break from inside /auth group.
      //    Use the absolute route to your dashboard instead.
      router.replace("/dashboardscreen/dashboard");
    } else {
      setError("Invalid email or password. Use the pre-filled credentials.");
      Animated.sequence([
        Animated.timing(btnScale, { toValue: 0.96, duration: 60, useNativeDriver: true, easing: Easing.linear }),
        Animated.spring(btnScale, { toValue: 1, useNativeDriver: true, friction: 5 }),
      ]).start();
    }
  };

  return (
    <ScreenLayout hideFooter>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {/* ── Top white header with logo ── */}
          <View style={styles.header}>
            <View style={styles.logoRow}>
              <Image
                source={require("@/assets/images/logo-with-map.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.brandText}>PSPACE LOGBOOK</Text>
          </View>

          {/* ── Navy card panel ── */}
          <View style={styles.card}>
            <Text style={styles.signInTitle}>Sign In</Text>

            {/* Illustration */}
            <View style={styles.illustrationWrap}>
              <View style={styles.illustBg}>
                <View style={styles.lockBody}>
                  <View style={styles.lockShackle} />
                  <View style={styles.lockFace}>
                    <View style={styles.lockHole} />
                  </View>
                </View>
                <View style={styles.keyWrap}>
                  <View style={styles.keyHead} />
                  <View style={styles.keyShaft} />
                  <View style={styles.keyTooth} />
                </View>
                <View style={[styles.gear, { top: 8, right: 18 }]} />
                <View style={[styles.gear, { top: 28, right: 6, width: 14, height: 14 }]} />
              </View>
            </View>

            {/* ── Form card ── */}
            <View style={styles.formCard}>
              {/* Email */}
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email"
                  placeholderTextColor="#9AA3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* Password */}
              <View style={[styles.inputWrap, styles.inputWrapRow]}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  placeholderTextColor="#9AA3B8"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((v) => !v)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="#9AA3B8"
                  />
                </TouchableOpacity>
              </View>

              {/* Remember me + Forgot password */}
              <View style={styles.rowBetween}>
                <TouchableOpacity
                  style={styles.rememberRow}
                  onPress={() => setRememberMe((v) => !v)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                    {rememberMe && <Ionicons name="checkmark" size={11} color="#FFFFFF" />}
                  </View>
                  <Text style={styles.rememberText}>Remember me</Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.7}>
                  <Text style={styles.forgotText}>Forgot Password ?</Text>
                </TouchableOpacity>
              </View>

              {!!error && <Text style={styles.errorText}>{error}</Text>}

              {/* Log In button */}
              <Animated.View style={{ transform: [{ scale: btnScale }] }}>
                <Pressable
                  style={styles.loginBtn}
                  onPressIn={() => animateBtn(0.97)}
                  onPressOut={() => animateBtn(1)}
                  onPress={handleLogin}
                >
                  <Text style={styles.loginBtnText}>Log In</Text>
                </Pressable>
              </Animated.View>

              {/* Create account */}
              <View style={styles.createRow}>
                <Text style={styles.createText}>New to PSPACE? </Text>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text style={styles.createLink}>Create an Account.</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
}

const NAVY   = "#032451";
const AMBER  = "#FFBB57";
const WHITE  = "#FFFFFF";
const BG = "#D8DADD";
const TOP_PANEL = "#E5E7EA";
const SURFACE = "#F1F2F4";
const BORDER = "#D2D6DC";
const MUTED = "#72767D";

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, backgroundColor: BG },

  header: {
    backgroundColor: TOP_PANEL,
    alignItems: "center",
    paddingVertical: 34,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 6,
  },

  logoImage: {
    width: 150,
    height: 80,
  },

  wingFeather: {
    height: 7,
    borderRadius: 3,
    backgroundColor: NAVY,
  },

  badge: {
    width: 52,
    height: 64,
    backgroundColor: NAVY,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },

  badgeLine: {
    height: 3,
    borderRadius: 2,
    backgroundColor: WHITE,
    opacity: 0.9,
  },

  redArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 0,
    borderBottomWidth: 12,
    borderStyle: "solid",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#E8232A",
    transform: [{ rotate: "30deg" }],
    marginVertical: 2,
  },

  globeTop: {
    position: "absolute",
    top: 18,
    width: 80,
    height: 38,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: NAVY,
    opacity: 0.14,
  },

  brandText: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 2.2,
    color: NAVY,
    fontFamily: Fonts.rounded,
  },

  card: {
    flex: 1,
    backgroundColor: NAVY,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 28,
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: "center",
  },

  signInTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: AMBER,
    alignSelf: "center",
    marginBottom: 20,
    fontFamily: Fonts.rounded,
  },

  illustrationWrap: {
    width: "100%",
    height: 130,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  illustBg: {
    width: 200,
    height: 120,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  lockBody: { alignItems: "center" },

  lockShackle: {
    width: 30,
    height: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderWidth: 5,
    borderColor: AMBER,
    borderBottomWidth: 0,
    marginBottom: -2,
  },

  lockFace: {
    width: 48,
    height: 40,
    backgroundColor: AMBER,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  lockHole: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: NAVY,
  },

  keyWrap: {
    position: "absolute",
    left: 20,
    bottom: 14,
    flexDirection: "row",
    alignItems: "center",
    transform: [{ rotate: "-30deg" }],
  },

  keyHead: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 5,
    borderColor: AMBER,
    backgroundColor: "transparent",
  },

  keyShaft: {
    width: 30,
    height: 7,
    backgroundColor: AMBER,
    borderRadius: 2,
  },

  keyTooth: {
    position: "absolute",
    right: 4,
    bottom: -4,
    width: 7,
    height: 9,
    backgroundColor: AMBER,
    borderRadius: 2,
  },

  gear: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.25)",
  },

  formCard: {
    width: "100%",
    backgroundColor: SURFACE,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    gap: 14,
  },

  inputWrap: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    backgroundColor: WHITE,
  },

  inputWrapRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  input: {
    fontSize: 15,
    color: NAVY,
    fontFamily: Fonts.rounded,
  },

  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: MUTED,
    alignItems: "center",
    justifyContent: "center",
  },

  checkboxActive: {
    backgroundColor: AMBER,
    borderColor: AMBER,
  },

  rememberText: { fontSize: 13, color: MUTED, fontFamily: Fonts.rounded },

  forgotText: {
    fontSize: 13,
    fontWeight: "700",
    color: NAVY,
    fontFamily: Fonts.rounded,
  },

  errorText: {
    fontSize: 12,
    color: "#E8232A",
    textAlign: "center",
  },

  loginBtn: {
    backgroundColor: AMBER,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    shadowColor: AMBER,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },

  loginBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: NAVY,
    letterSpacing: 0.5,
    fontFamily: Fonts.rounded,
  },

  createRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  createText: { fontSize: 13, color: MUTED, fontFamily: Fonts.rounded },

  createLink: {
    fontSize: 13,
    fontWeight: "700",
    color: NAVY,
    fontFamily: Fonts.rounded,
  },
});
