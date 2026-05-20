// C:\nginx\html\pspace-logbook\pspace-logbook\app\auth\signup.tsx
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
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import ScreenLayout from "@/components/layout/screen-layout";
import { Fonts } from "@/constants/theme";

export default function SignUpScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState("");

  const btnScale = useRef(new Animated.Value(1)).current;

  const animateBtn = (toValue: number) =>
    Animated.spring(btnScale, { toValue, useNativeDriver: true, friction: 5 }).start();

  // ── Date picker handlers ──────────────────────────────────────────────
  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    // Android closes itself; iOS stays open inside the modal until user dismisses
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (event.type === "set" && selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  // Compute age from a Date
  const getAge = (date: Date) => {
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const m = today.getMonth() - date.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
      age--;
    }
    return age;
  };

  // Sensible defaults for the picker
  const today = new Date();
  const maxDate = today; // can't be born in the future
  const minDate = new Date(1900, 0, 1);
  const initialPickerDate =
    dateOfBirth ?? new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

  const handleSignUp = () => {
    setError("");

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      shakeBtn();
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      shakeBtn();
      return;
    }
    if (!dateOfBirth) {
      setError("Please select your date of birth.");
      shakeBtn();
      return;
    }
    if (getAge(dateOfBirth) < 13) {
      setError("You must be at least 13 years old to sign up.");
      shakeBtn();
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      shakeBtn();
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      shakeBtn();
      return;
    }
    if (!agreeToTerms) {
      setError("Please agree to the Terms and Conditions.");
      shakeBtn();
      return;
    }

    // ✅ Success — navigate to dashboard (adjust as needed)
    router.replace("/dashboardscreen/dashboard");
  };

  const shakeBtn = () => {
    Animated.sequence([
      Animated.timing(btnScale, {
        toValue: 0.96,
        duration: 60,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
      Animated.spring(btnScale, { toValue: 1, useNativeDriver: true, friction: 5 }),
    ]).start();
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
            <Text style={styles.signUpTitle}>Create Account</Text>

            {/* Illustration */}
            <View style={styles.illustrationWrap}>
              <View style={styles.illustBg}>
                <View style={styles.userBody}>
                  <View style={styles.userHead} />
                  <View style={styles.userShoulders} />
                </View>
                <View style={styles.plusBadge}>
                  <View style={styles.plusHorizontal} />
                  <View style={styles.plusVertical} />
                </View>
                <View style={[styles.gear, { top: 8, right: 18 }]} />
                <View style={[styles.gear, { top: 28, right: 6, width: 14, height: 14 }]} />
                <View style={[styles.gear, { bottom: 14, left: 14, width: 16, height: 16 }]} />
              </View>
            </View>

            {/* ── Form card ── */}
            <View style={styles.formCard}>
              {/* Full Name */}
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.input}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Full Name"
                  placeholderTextColor="#9AA3B8"
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>

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

              {/* Date of Birth */}
              <TouchableOpacity
                style={[styles.inputWrap, styles.inputWrapRow]}
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.input,
                    { flex: 1 },
                    !dateOfBirth && styles.placeholderText,
                  ]}
                >
                  {dateOfBirth ? formatDate(dateOfBirth) : "Date of Birth"}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#9AA3B8" />
              </TouchableOpacity>

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

              {/* Confirm Password */}
              <View style={[styles.inputWrap, styles.inputWrapRow]}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm Password"
                  placeholderTextColor="#9AA3B8"
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword((v) => !v)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="#9AA3B8"
                  />
                </TouchableOpacity>
              </View>

              {/* Agree to terms */}
              <TouchableOpacity
                style={styles.termsRow}
                onPress={() => setAgreeToTerms((v) => !v)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, agreeToTerms && styles.checkboxActive]}>
                  {agreeToTerms && <Ionicons name="checkmark" size={11} color="#FFFFFF" />}
                </View>
                <Text style={styles.termsText}>
                  I agree to the{" "}
                  <Text style={styles.termsLink}>Terms</Text> and{" "}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </TouchableOpacity>

              {!!error && <Text style={styles.errorText}>{error}</Text>}

              {/* Sign Up button */}
              <Animated.View style={{ transform: [{ scale: btnScale }] }}>
                <Pressable
                  style={styles.signUpBtn}
                  onPressIn={() => animateBtn(0.97)}
                  onPressOut={() => animateBtn(1)}
                  onPress={handleSignUp}
                >
                  <Text style={styles.signUpBtnText}>Sign Up</Text>
                </Pressable>
              </Animated.View>

              {/* Already have account */}
              <View style={styles.loginRow}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => router.replace("/auth/login")}
                >
                  <Text style={styles.loginLink}>Sign In.</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Date Picker ────────────────────────────────────────────────── */}
      {showDatePicker && Platform.OS === "android" && (
        <DateTimePicker
          value={initialPickerDate}
          mode="date"
          display="default"
          maximumDate={maxDate}
          minimumDate={minDate}
          onChange={onDateChange}
        />
      )}

      {/* iOS uses a modal overlay so the spinner looks consistent */}
      {showDatePicker && Platform.OS === "ios" && (
        <View style={styles.iosPickerOverlay}>
          <View style={styles.iosPickerSheet}>
            <View style={styles.iosPickerHeader}>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <Text style={styles.iosPickerCancel}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.iosPickerTitle}>Date of Birth</Text>
              <TouchableOpacity
                onPress={() => {
                  if (!dateOfBirth) setDateOfBirth(initialPickerDate);
                  setShowDatePicker(false);
                }}
              >
                <Text style={styles.iosPickerDone}>Done</Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={initialPickerDate}
              mode="date"
              display="spinner"
              maximumDate={maxDate}
              minimumDate={minDate}
              onChange={onDateChange}
              textColor={NAVY}
            />
          </View>
        </View>
      )}
    </ScreenLayout>
  );
}

const NAVY = "#032451";
const AMBER = "#FFBB57";
const WHITE = "#FFFFFF";
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

  signUpTitle: {
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

  userBody: {
    alignItems: "center",
  },

  userHead: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AMBER,
    marginBottom: 4,
  },

  userShoulders: {
    width: 60,
    height: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: AMBER,
  },

  plusBadge: {
    position: "absolute",
    right: 50,
    bottom: 22,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: AMBER,
    alignItems: "center",
    justifyContent: "center",
  },

  plusHorizontal: {
    position: "absolute",
    width: 14,
    height: 3,
    backgroundColor: NAVY,
    borderRadius: 2,
  },

  plusVertical: {
    position: "absolute",
    width: 3,
    height: 14,
    backgroundColor: NAVY,
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
    marginBottom: 30,
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

  placeholderText: {
    color: "#9AA3B8",
  },

  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    paddingRight: 4,
  },

  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: MUTED,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },

  checkboxActive: {
    backgroundColor: AMBER,
    borderColor: AMBER,
  },

  termsText: {
    flex: 1,
    fontSize: 13,
    color: MUTED,
    fontFamily: Fonts.rounded,
    lineHeight: 18,
  },

  termsLink: {
    color: NAVY,
    fontWeight: "700",
  },

  errorText: {
    fontSize: 12,
    color: "#E8232A",
    textAlign: "center",
  },

  signUpBtn: {
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

  signUpBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: NAVY,
    letterSpacing: 0.5,
    fontFamily: Fonts.rounded,
  },

  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  loginText: { fontSize: 13, color: MUTED, fontFamily: Fonts.rounded },

  loginLink: {
    fontSize: 13,
    fontWeight: "700",
    color: NAVY,
    fontFamily: Fonts.rounded,
  },

  // ── iOS date picker overlay ─────────────────────────────────────────
  iosPickerOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },

  iosPickerSheet: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },

  iosPickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },

  iosPickerTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: NAVY,
    fontFamily: Fonts.rounded,
  },

  iosPickerCancel: {
    fontSize: 15,
    color: MUTED,
    fontFamily: Fonts.rounded,
  },

  iosPickerDone: {
    fontSize: 15,
    fontWeight: "700",
    color: NAVY,
    fontFamily: Fonts.rounded,
  },
});