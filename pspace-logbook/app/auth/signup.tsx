import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AppButton, FormField, InfoBox } from "@/components/ui/app-ui";
import { AuthError, AuthScreen, authStyles, PasswordField } from "@/components/ui/auth-ui";
import { DateField } from "@/components/ui/date-field";
import { palette, type } from "@/constants/ui";
import { useAuth } from "@/context/auth-context";
import { platformUrl, post } from "@/services/auth-api";
import type { AccountRole } from "@/types/auth";
import { birthDateError, passwordError } from "@/utils/auth-validation";

export default function SignupScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDOB] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirm] = useState("");
  const [role, setRole] = useState<AccountRole>("student");
  const [terms, setTerms] = useState(false);
  const [step, setStep] = useState<"details" | "verify">("details");
  const [code, setCode] = useState("");
  const [proof, setProof] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { if (!cooldown) return; const timer = setTimeout(() => setCooldown((value) => Math.max(0, value - 1)), 1000); return () => clearTimeout(timer); }, [cooldown]);
  const validate = () => {
    if (!firstName.trim() || !lastName.trim()) return "Enter your first and last name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Enter a valid email address.";
    const invalid = birthDateError(dateOfBirth) || passwordError(password);
    if (invalid) return invalid;
    if (password !== confirmPassword) return "Your passwords do not match.";
    if (!terms) return "Please accept the PSPACE Terms and Privacy Policy.";
    return "";
  };
  const sendCode = async () => {
    if (busy || cooldown) return;
    const invalid = validate();
    if (invalid) { setError(invalid); return; }
    setBusy(true); setError("");
    try { await post("/auth/signup-code", { email: email.trim() }); setProof(""); setCode(""); setCooldown(60); setStep("verify"); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to send your code."); }
    finally { setBusy(false); }
  };
  const createAccount = async () => {
    if (busy) return;
    if (!proof && !/^\d{6}$/.test(code)) { setError("Enter the six-digit code from your email."); return; }
    setBusy(true); setError("");
    try {
      const token = proof || (await post<{ verificationToken: string }>("/auth/verify-signup", { email: email.trim(), code })).verificationToken;
      setProof(token);
      await register({ firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim(), dateOfBirth, password, role, acceptTerms: terms, verificationToken: token });
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to create your account. Try signing in if you already registered."); }
    finally { setBusy(false); }
  };
  const back = () => { if (busy) return; if (step === "verify") { setStep("details"); setProof(""); setError(""); } else router.back(); };
  return <AuthScreen title={step === "details" ? "Create your account" : "Verify your email"} subtitle={step === "details" ? "Create a PSPACE account to use Logbook and the PSPACE platform." : `We sent a six-digit code to ${email.trim()}. It expires in 5 minutes.`} onBack={busy ? undefined : back}>
    {step === "details" ? <>
      <FormField label="First Name" value={firstName} onChangeText={setFirstName} placeholder="First name" autoComplete="given-name" autoCapitalize="words" maxLength={100} editable={!busy} />
      <FormField label="Last Name" value={lastName} onChangeText={setLastName} placeholder="Last name" autoComplete="family-name" autoCapitalize="words" maxLength={100} editable={!busy} />
      <FormField label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" autoComplete="email" autoCapitalize="none" autoCorrect={false} editable={!busy} />
      <DateField label="Date of Birth" value={dateOfBirth} onChange={setDOB} maximumDate={new Date()} initialDate={new Date(2000, 0, 1)} disabled={busy} />
      <View style={{ gap: 8 }}><Text style={type.label}>Account Type</Text><View style={styles.roles}>{(["student", "instructor"] as const).map((value) => <TouchableOpacity key={value} disabled={busy} accessibilityRole="radio" accessibilityState={{ checked: role === value }} onPress={() => setRole(value)} style={[styles.role, role === value && styles.selected]}><Ionicons name={value === "student" ? "school-outline" : "person-outline"} size={22} color={role === value ? palette.surface : palette.navy} /><Text style={[type.label, role === value && { color: palette.surface }]}>{value === "student" ? "Student" : "Instructor"}</Text></TouchableOpacity>)}</View></View>
      <PasswordField value={password} onChangeText={setPassword} placeholder="Create a password" autoComplete="new-password" maxLength={1024} editable={!busy} />
      <Text style={type.caption}>At least 8 characters, including an uppercase letter, a number, and a special character.</Text>
      <PasswordField label="Confirm Password" value={confirmPassword} onChangeText={setConfirm} placeholder="Re-enter your password" autoComplete="new-password" editable={!busy} />
      <TouchableOpacity disabled={busy} accessibilityRole="checkbox" accessibilityState={{ checked: terms }} onPress={() => setTerms((value) => !value)} style={styles.terms}><Ionicons name={terms ? "checkbox" : "square-outline"} size={24} color={palette.navy} /><Text style={[type.caption, { flex: 1 }]}>I agree to the PSPACE Terms and Privacy Policy.</Text></TouchableOpacity>
      <TouchableOpacity accessibilityRole="link" style={authStyles.link} onPress={() => { if (!platformUrl) { setError("Configure the PSPACE server URL first."); return; } void Linking.openURL(`${platformUrl}/legal_information`).catch(() => setError("Unable to open PSPACE legal information.")); }}><Text style={authStyles.linkText}>Read Terms & Privacy Policy</Text></TouchableOpacity>
      <AuthError message={error} />
      <AppButton label={cooldown ? `Resend available in ${cooldown}s` : "Continue"} onPress={() => { void sendCode(); }} loading={busy} disabled={cooldown > 0} />
    </> : <>
      <InfoBox>This creates one account for PSPACE and Logbook, not a separate mobile-only account.</InfoBox>
      <FormField label="Verification Code" value={code} onChangeText={(value) => setCode(value.replace(/\D/g, ""))} placeholder="6-digit code" keyboardType="number-pad" textContentType="oneTimeCode" autoComplete="one-time-code" maxLength={6} editable={!busy && !proof} returnKeyType="done" onSubmitEditing={() => { void createAccount(); }} />
      <AuthError message={error} />
      <AppButton label="Verify & Create Account" onPress={() => { void createAccount(); }} loading={busy} />
      <AppButton label={cooldown ? `Resend Code (${cooldown}s)` : "Resend Code"} variant="outline" disabled={cooldown > 0 || busy} onPress={() => { void sendCode(); }} />
      <TouchableOpacity disabled={busy} accessibilityRole="button" style={authStyles.link} onPress={back}><Text style={[authStyles.linkText, { textAlign: "center" }]}>Change my details</Text></TouchableOpacity>
    </>}
    <View style={authStyles.row}><Text style={type.caption}>Already have a PSPACE account?</Text><TouchableOpacity disabled={busy} accessibilityRole="link" style={authStyles.link} onPress={() => router.replace("/auth/login")}><Text style={authStyles.linkText}>Sign In</Text></TouchableOpacity></View>
    <Text style={authStyles.note}>You can add your profile photo after signing up. Your aircraft and flights remain on this device.</Text>
  </AuthScreen>;
}
const styles = StyleSheet.create({ roles: { flexDirection: "row", gap: 10 }, role: { flex: 1, minHeight: 52, borderWidth: 1, borderColor: palette.border, borderRadius: 8, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8, flexWrap: "wrap", padding: 10 }, selected: { backgroundColor: palette.navy, borderColor: palette.navy }, terms: { minHeight: 48, flexDirection: "row", alignItems: "center", gap: 10 } });
