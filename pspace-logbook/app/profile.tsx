import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Ellipse, Path } from "react-native-svg";

import ScreenLayout from "@/components/layout/screen-layout";

// ─── Illustrated avatar (matches the cartoon-style placeholder in the design) ──
function CadetAvatar({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Circle cx="50" cy="50" r="50" fill="#DCE6F0" />
      <Ellipse cx="50" cy="58" rx="26" ry="28" fill="#F0B088" />
      <Path
        d="M22 46 C22 20, 78 20, 78 46 C78 32, 66 24, 50 24 C34 24, 22 32, 22 46 Z"
        fill="#2B2118"
      />
      <Path
        d="M24 44 C20 54, 22 66, 30 72 C26 62, 27 50, 30 44 Z"
        fill="#2B2118"
      />
      <Path
        d="M76 44 C80 54, 78 66, 70 72 C74 62, 73 50, 70 44 Z"
        fill="#2B2118"
      />
      <Path
        d="M34 74 C40 82, 60 82, 66 74 C64 66, 58 62, 50 62 C42 62, 36 66, 34 74 Z"
        fill="#8B5A2B"
      />
    </Svg>
  );
}

const NAVY     = "#1A2340";
const WHITE    = "#FFFFFF";
const BG       = "#F7F8FC";
const MUTED    = "#5E6983";
const BORDER   = "#E8ECF4";
const DISABLED = "#B7BECF";

type UserProfile = {
  profileImage: string | null;
  fullName: string;
  email: string;
  dateOfBirth: string;
  studentId: string;
  academy: string;
};

// Mock stats — matches the flight-hours mock data used elsewhere in the app.
const STATS = {
  hours: "68:25",
  flights: 42,
  rating: "89%",
  ratingLabel: "PPL",
};

type MenuItem = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
};

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [profile, setProfile] = useState<UserProfile>({
    profileImage: null,
    fullName: "Cadet Name",
    email: "john.doe@example.com",
    dateOfBirth: "1995-06-15",
    studentId: "CD-10284",
    academy: "Centennial Flight Academy",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile>(profile);

  const openEditModal = () => {
    setEditForm(profile);
    setIsEditing(true);
  };

  const closeEditModal = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    // Basic validation
    if (!editForm.fullName.trim()) {
      Alert.alert("Validation Error", "Full name cannot be empty.");
      return;
    }
    if (!editForm.email.trim() || !editForm.email.includes("@")) {
      Alert.alert("Validation Error", "Please enter a valid email address.");
      return;
    }
    if (!editForm.dateOfBirth.trim()) {
      Alert.alert("Validation Error", "Date of birth cannot be empty.");
      return;
    }

    setProfile(editForm);
    setIsEditing(false);
    Alert.alert("Success", "Profile updated successfully!");
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photos to update your profile picture."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setEditForm({ ...editForm, profileImage: result.assets[0].uri });
    }
  };

  const MENU_ITEMS: MenuItem[] = [
    { label: "Personal Information", icon: "person-outline", onPress: openEditModal },
    { label: "Documents & Certificates", icon: "clipboard-outline" },
    { label: "Schools & Instructors", icon: "person-outline" },
    { label: "Flight Preference", icon: "layers-outline" },
    { label: "Notifications", icon: "notifications-outline" },
    { label: "Security & Privacy", icon: "clipboard-outline" },
  ];

  return (
    <ScreenLayout>
      <StatusBar backgroundColor={WHITE} barStyle="dark-content" />

      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <Ionicons color={NAVY} name="chevron-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={styles.screen}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Profile card ── */}
        <TouchableOpacity style={styles.profileCard} activeOpacity={0.8} onPress={openEditModal}>
          {profile.profileImage ? (
            <Image source={{ uri: profile.profileImage }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarClip}>
              <CadetAvatar size={52} />
            </View>
          )}
          <View style={styles.profileInfo}>
            <Text style={styles.profileName} numberOfLines={1}>{profile.fullName}</Text>
            <Text style={styles.profileMeta} numberOfLines={1}>Student Pilot · {profile.studentId}</Text>
            <Text style={styles.profileMeta} numberOfLines={1}>{profile.academy}</Text>
          </View>
          <Ionicons color={MUTED} name="chevron-forward" size={20} />
        </TouchableOpacity>

        {/* ── Stats ── */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{STATS.hours}</Text>
            <Text style={styles.statLabel}>Hours</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{STATS.flights}</Text>
            <Text style={styles.statLabel}>Flights</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{STATS.rating}</Text>
            <Text style={styles.statLabel}>{STATS.ratingLabel}</Text>
          </View>
        </View>

        {/* ── Menu list ── */}
        <View style={styles.menuList}>
          {MENU_ITEMS.map((item) => {
            const enabled = !!item.onPress;
            return (
              <TouchableOpacity
                key={item.label}
                style={styles.menuRow}
                activeOpacity={enabled ? 0.7 : 1}
                disabled={!enabled}
                onPress={item.onPress}
              >
                <Ionicons color={enabled ? NAVY : DISABLED} name={item.icon} size={20} />
                <Text style={[styles.menuLabel, !enabled && styles.menuLabelDisabled]}>
                  {item.label}
                </Text>
                <Ionicons color={enabled ? MUTED : DISABLED} name="chevron-forward" size={18} />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={isEditing}
        onRequestClose={closeEditModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <ScrollView
              contentContainerStyle={styles.modalScroll}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Profile</Text>
                <Pressable onPress={closeEditModal} hitSlop={10}>
                  <Ionicons color={NAVY} name="close" size={26} />
                </Pressable>
              </View>

              {/* Image picker */}
              <TouchableOpacity
                style={styles.imagePickerContainer}
                onPress={pickImage}
              >
                {editForm.profileImage ? (
                  <Image
                    source={{ uri: editForm.profileImage }}
                    style={styles.avatarEdit}
                  />
                ) : (
                  <View style={styles.avatarPlaceholderEdit}>
                    <CadetAvatar size={100} />
                  </View>
                )}
                <View style={styles.cameraBadge}>
                  <Ionicons color={WHITE} name="camera" size={16} />
                </View>
              </TouchableOpacity>
              <Text style={styles.changePhotoText}>Tap to change photo</Text>

              {/* Form fields */}
              <FormField
                label="Full Name"
                value={editForm.fullName}
                onChangeText={(text) =>
                  setEditForm({ ...editForm, fullName: text })
                }
                placeholder="Enter your full name"
              />

              <FormField
                label="Email"
                value={editForm.email}
                onChangeText={(text) =>
                  setEditForm({ ...editForm, email: text })
                }
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <FormField
                label="Date of Birth"
                value={editForm.dateOfBirth}
                onChangeText={(text) =>
                  setEditForm({ ...editForm, dateOfBirth: text })
                }
                placeholder="YYYY-MM-DD"
              />

              {/* Action buttons */}
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={closeEditModal}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleSave}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScreenLayout>
  );
}

// Sub-component for form input fields
function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  autoCapitalize = "sentences",
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: "default" | "email-address";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}) {
  return (
    <View style={styles.formField}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A0A8BC"
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: WHITE,
    paddingHorizontal: 8,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  backBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, fontWeight: "800", color: NAVY },

  screen: {
    flexGrow: 1,
    backgroundColor: BG,
    padding: 16,
    paddingBottom: 24,
  },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: BORDER,
  },
  avatarClip: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: "hidden",
  },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 16, fontWeight: "800", color: NAVY, marginBottom: 2 },
  profileMeta: { fontSize: 12, color: MUTED },

  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  statBox: {
    flex: 1,
    backgroundColor: WHITE,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 14,
    alignItems: "center",
  },
  statValue: { fontSize: 18, fontWeight: "900", color: NAVY },
  statLabel: { fontSize: 11, color: MUTED, marginTop: 4 },

  menuList: {
    marginTop: 18,
    gap: 10,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: WHITE,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  menuLabel: { flex: 1, fontSize: 14, fontWeight: "600", color: NAVY },
  menuLabelDisabled: { color: DISABLED },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
  },
  modalScroll: {
    padding: 22,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: NAVY,
  },
  imagePickerContainer: {
    alignSelf: "center",
    marginBottom: 6,
    position: "relative",
  },
  avatarEdit: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: BORDER,
  },
  avatarPlaceholderEdit: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: BG,
    alignItems: "center",
    justifyContent: "center",
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: NAVY,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: WHITE,
  },
  changePhotoText: {
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 18,
    fontSize: 13,
    color: MUTED,
  },
  formField: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: MUTED,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: NAVY,
    backgroundColor: BG,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: BG,
    borderWidth: 1,
    borderColor: BORDER,
  },
  cancelButtonText: {
    color: MUTED,
    fontWeight: "700",
    fontSize: 15,
  },
  saveButton: {
    backgroundColor: NAVY,
  },
  saveButtonText: {
    color: WHITE,
    fontWeight: "700",
    fontSize: 15,
  },
});
