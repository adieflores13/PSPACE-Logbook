import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Linking, Text, TouchableOpacity, View } from "react-native";
import { AppButton, FormField, InfoBox } from "@/components/ui/app-ui";
import { AuthError, AuthScreen, authStyles, PasswordField } from "@/components/ui/auth-ui";
import { type } from "@/constants/ui";
import { useAuth } from "@/context/auth-context";
import { platformUrl } from "@/services/auth-api";

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, message } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const login = async () => {
    if (busy) return;
    setError("");
    if (!email.trim() || !password) { setError("Enter your PSPACE email and password."); return; }
    setBusy(true);
    try { await signIn(email, password); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Sign-in failed. Please try again."); }
    finally { setBusy(false); }
  };
  const recover = async () => {
    if (!platformUrl) { setError("Set EXPO_PUBLIC_PSPACE_URL to connect to PSPACE first."); return; }
    try { await Linking.openURL(`${platformUrl}/forgot_password`); }
    catch { setError("Unable to open PSPACE password recovery. Please try again."); }
  };
  return <AuthScreen title="Welcome back" subtitle="Sign in with your PSPACE account to open your logbook.">
    <FormField label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" autoComplete="email" autoCapitalize="none" autoCorrect={false} editable={!busy} />
    <PasswordField value={password} onChangeText={setPassword} placeholder="Enter your password" autoComplete="current-password" returnKeyType="go" onSubmitEditing={() => { void login(); }} editable={!busy} />
    <TouchableOpacity accessibilityRole="link" style={[authStyles.link, { alignSelf: "flex-end" }]} disabled={busy} onPress={() => { void recover(); }}><Text style={authStyles.linkText}>Forgot password?</Text></TouchableOpacity>
    <AuthError message={error || message} />
    <AppButton label="Sign In" onPress={() => { void login(); }} loading={busy} />
    <InfoBox>A PSPACE account is required to use Logbook. Already registered on PSPACE? Your existing account works here.</InfoBox>
    <View style={authStyles.row}><Text style={type.caption}>New to PSPACE?</Text><TouchableOpacity disabled={busy} accessibilityRole="link" style={authStyles.link} onPress={() => router.push("/auth/signup")}><Text style={authStyles.linkText}>Create an Account</Text></TouchableOpacity></View>
    <Text style={authStyles.note}>Aircraft and flights stay on this device. Your account and profile are managed by PSPACE.</Text>
  </AuthScreen>;
}
