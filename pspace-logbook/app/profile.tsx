import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Ellipse, Path } from "react-native-svg";

import { AppButton, AppScreen, FormField, InfoBox } from "@/components/ui/app-ui";
import { palette, surfaces, type } from "@/constants/ui";
import { useFlights } from "@/context/flight-context";
import { useProfile } from "@/context/profile-context";
import { useAuth } from "@/context/auth-context";
import { DecisionModal } from "@/components/ui/decision-modal";
import { DateField } from "@/components/ui/date-field";
import type { LocalProfile } from "@/types/records";

function CadetAvatar({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Circle cx="50" cy="50" r="50" fill={palette.soft} />
      <Ellipse cx="50" cy="58" rx="26" ry="28" fill="#F0B088" />
      <Path d="M22 46 C22 20, 78 20, 78 46 C78 32, 66 24, 50 24 C34 24, 22 32, 22 46 Z" fill="#2B2118" />
      <Path d="M24 44 C20 54, 22 66, 30 72 C26 62, 27 50, 30 44 Z" fill="#2B2118" />
      <Path d="M76 44 C80 54, 78 66, 70 72 C74 62, 73 50, 70 44 Z" fill="#2B2118" />
      <Path d="M34 74 C40 82, 60 82, 66 74 C64 66, 58 62, 50 62 C42 62, 36 66, 34 74 Z" fill="#8B5A2B" />
    </Svg>
  );
}

type MenuItem = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { flights } = useFlights();
  const { profile, isLoading, error, reload, updateProfile } = useProfile();
  const { signOut } = useAuth();
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [logoutBusy, setLogoutBusy] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const totalMinutes = flights.reduce((total, flight) => total + flight.durationMinutes, 0);
  const hours = `${Math.floor(totalMinutes / 60)}:${String(totalMinutes % 60).padStart(2, "0")}`;

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPickingImage, setIsPickingImage] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [editForm, setEditForm] = useState<LocalProfile>(profile);

  const openEditModal = () => {
    if (isLoading) return;
    setEditForm(profile);
    setSaveError("");
    setIsEditing(true);
  };

  const closeEditModal = () => {
    if (!isSaving && !isPickingImage) setIsEditing(false);
  };

  const handleSave = async () => {
    if (isSaving || isPickingImage || isLoading) return;
    setSaveError("");
    if (!editForm.firstName?.trim() || !editForm.lastName?.trim()) {
      setSaveError("First and last name are required.");
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile(editForm);
      setIsEditing(false);
    } catch (cause) {
      setSaveError(cause instanceof Error ? cause.message : "Your profile could not be saved to PSPACE. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const pickImage = async () => {
    if (isSaving || isPickingImage) return;
    setIsPickingImage(true);
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission Required", "Please allow access to your photos to update your profile picture.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: Platform.OS === "web",
      });
      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];
        const uri = Platform.OS === "web" && asset.base64
          ? `data:${asset.mimeType || "image/jpeg"};base64,${asset.base64}`
          : asset.uri;
        setEditForm((current) => ({ ...current, profileImage: uri }));
      }
    } catch {
      Alert.alert("Photo Unavailable", "We couldn't open your photo library. Please try again.");
    } finally {
      setIsPickingImage(false);
    }
  };

  const menuItems: MenuItem[] = [
    { label: "Personal Information", icon: "person-outline", onPress: openEditModal },
    { label: "Documents & Certificates", icon: "clipboard-outline" },
    { label: "Schools & Instructors", icon: "school-outline" },
    { label: "Flight Preference", icon: "layers-outline" },
    { label: "Notifications", icon: "notifications-outline" },
    { label: "Security & Privacy", icon: "shield-checkmark-outline" },
  ];

  return (
    <AppScreen title="Profile" tab="profile" muted>
      {!!error && !isEditing && (
        <View style={styles.menuList}>
          <InfoBox>{error}</InfoBox>
          <AppButton label="Retry" variant="outline" onPress={() => { void reload(); }} loading={isLoading} />
        </View>
      )}
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Edit your profile"
        accessibilityState={{ disabled: isLoading }}
        disabled={isLoading}
        style={styles.profileCard}
        activeOpacity={0.8}
        onPress={openEditModal}
      >
        {profile.profileImage ? (
          <Image source={{ uri: profile.profileImage }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarClip}><CadetAvatar size={56} /></View>
        )}
        <View style={styles.flex}>
          <Text style={type.heading}>{profile.fullName}</Text>
          {!!profile.email && <Text style={type.caption}>{profile.email}</Text>}
          <Text style={type.caption}>{profile.role === "instructor" ? "Instructor" : "Student"}</Text>
          {!!profile.studentId && <Text style={type.caption}>Student ID: {profile.studentId}</Text>}
          {!!profile.academy && <Text style={type.caption}>{profile.academy}</Text>}
        </View>
        <Ionicons color={palette.muted} name="chevron-forward" size={20} />
      </TouchableOpacity>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{hours}</Text>
          <Text style={type.caption}>Hours</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{flights.length}</Text>
          <Text style={type.caption}>Flights</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{Math.min(100, Math.round(totalMinutes / (45 * 60) * 100))}%</Text>
          <Text style={type.caption}>PPL goal</Text>
        </View>
      </View>

      <View style={styles.menuList}>
        {menuItems.map((item) => {
          const enabled = !!item.onPress && !isLoading;
          return (
            <TouchableOpacity
              key={item.label}
              accessibilityRole="button"
              accessibilityState={{ disabled: !enabled }}
              style={styles.menuRow}
              activeOpacity={0.7}
              disabled={!enabled}
              onPress={item.onPress}
            >
              <Ionicons color={enabled ? palette.navy : palette.muted} name={item.icon} size={22} />
              <View style={styles.flex}>
                <Text style={[type.label, !enabled && styles.muted]}>{item.label}</Text>
                {!item.onPress && <Text style={type.caption}>Coming soon</Text>}
              </View>
              {enabled && <Ionicons color={palette.muted} name="chevron-forward" size={20} />}
            </TouchableOpacity>
          );
        })}
      </View>

      <AppButton label="Sign Out" variant="outline" icon="log-out-outline" onPress={() => { setLogoutError(""); setLogoutVisible(true); }} />
      <DecisionModal visible={logoutVisible} title="Sign out of Logbook?" description="Your aircraft and flights stay on this device, separate from other PSPACE accounts." icon="log-out-outline" primaryLabel="Sign Out" onPrimary={() => { setLogoutBusy(true); void signOut().catch((cause) => setLogoutError(cause.message)).finally(() => setLogoutBusy(false)); }} secondaryLabel="Cancel" onSecondary={() => setLogoutVisible(false)} loading={logoutBusy} error={logoutError} />

      <Modal animationType="slide" transparent visible={isEditing} onRequestClose={closeEditModal}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent} accessibilityViewIsModal>
            <ScrollView
              contentContainerStyle={[styles.modalScroll, { paddingBottom: Math.max(insets.bottom, 20) }]}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.modalHeader}>
                <Text style={[type.heading, styles.flex]}>Edit Profile</Text>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel="Close profile editor"
                  accessibilityState={{ disabled: isSaving || isPickingImage }}
                  disabled={isSaving || isPickingImage}
                  style={styles.iconButton}
                  onPress={closeEditModal}
                >
                  <Ionicons color={palette.navy} name="close" size={26} />
                </TouchableOpacity>
              </View>

              <View style={styles.photoSection}>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel="Change profile photo"
                  accessibilityState={{ disabled: isSaving || isPickingImage }}
                  disabled={isSaving || isPickingImage}
                  style={styles.imagePicker}
                  onPress={pickImage}
                >
                  {editForm.profileImage ? (
                    <Image source={{ uri: editForm.profileImage }} style={styles.avatarEdit} />
                  ) : <CadetAvatar size={100} />}
                  <View style={styles.cameraBadge}>
                    <Ionicons color={palette.surface} name="camera" size={18} />
                  </View>
                </TouchableOpacity>
                <Text style={type.caption}>{isPickingImage ? "Opening photos..." : "Tap to change photo"}</Text>
              </View>

              <FormField
                label="First Name"
                value={editForm.firstName ?? ""}
                onChangeText={(firstName) => setEditForm((current) => ({ ...current, firstName }))}
                placeholder="First name"
                autoCapitalize="words"
                editable={!isSaving}
              />
              <FormField label="Last Name" value={editForm.lastName ?? ""} onChangeText={(lastName) => setEditForm((current) => ({ ...current, lastName }))} placeholder="Last name" autoCapitalize="words" editable={!isSaving} />
              <FormField
                label="Email"
                value={editForm.email}
                onChangeText={(email) => setEditForm((current) => ({ ...current, email }))}
                placeholder="Email (optional)"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={false}
              />
              <DateField label="Date of Birth" value={editForm.dateOfBirth} onChange={(dateOfBirth) => setEditForm((current) => ({ ...current, dateOfBirth }))} maximumDate={new Date()} disabled={isSaving} />
              <InfoBox>Your name, date of birth, and photo are shared with PSPACE. Email, account type, and school membership are managed by the platform.</InfoBox>

              {!!saveError && <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.error}>{saveError}</Text>}
              <View style={styles.buttonRow}>
                <View style={styles.flex}><AppButton label="Cancel" variant="outline" onPress={closeEditModal} disabled={isSaving || isPickingImage} /></View>
                <View style={styles.flex}><AppButton label="Save" onPress={handleSave} loading={isSaving} disabled={isPickingImage || isLoading} /></View>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  muted: { color: palette.muted },
  error: { ...type.caption, color: palette.danger },
  profileCard: { ...surfaces.card, flexDirection: "row", alignItems: "center", gap: 12, marginVertical: 8, minHeight: 90 },
  avatar: { width: 56, height: 56, borderRadius: 28, borderWidth: 2, borderColor: palette.border },
  avatarClip: { width: 56, height: 56, borderRadius: 28, overflow: "hidden" },
  statsRow: { flexDirection: "row", gap: 10 },
  statBox: { ...surfaces.card, flex: 1, minHeight: 90, paddingHorizontal: 6, alignItems: "center", justifyContent: "center", gap: 6 },
  statValue: { ...type.heading, fontSize: 20 },
  menuList: { gap: 10 },
  menuRow: { ...surfaces.card, borderColor: palette.navy, minHeight: 50, flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 12, paddingVertical: 8 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(3,36,81,0.45)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: palette.background, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: "90%" },
  modalScroll: { padding: 20, gap: 18 },
  modalHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconButton: { width: 48, height: 48, alignItems: "center", justifyContent: "center" },
  photoSection: { alignItems: "center", gap: 12 },
  imagePicker: { width: 100, height: 100 },
  avatarEdit: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: palette.border },
  cameraBadge: { position: "absolute", bottom: 0, right: 0, backgroundColor: palette.navy, width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: palette.surface },
  buttonRow: { flexDirection: "row", gap: 12 },
});
