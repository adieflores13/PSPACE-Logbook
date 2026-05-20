import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import ScreenLayout from "@/components/layout/screen-layout";

type UserProfile = {
  profileImage: string | null;
  fullName: string;
  email: string;
  dateOfBirth: string;
};

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile>({
    profileImage: null,
    fullName: "John Doe",
    email: "john.doe@example.com",
    dateOfBirth: "1995-06-15",
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

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <ScreenLayout>
      <ScrollView
        contentContainerStyle={styles.screen}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          {/* Profile Image */}
          <View style={styles.avatarContainer}>
            {profile.profileImage ? (
              <Image source={{ uri: profile.profileImage }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons color="#1A2340" name="person" size={64} />
              </View>
            )}
          </View>

          <Text style={styles.title}>{profile.fullName}</Text>
          <Text style={styles.subtitle}>{profile.email}</Text>

          {/* Profile Details */}
          <View style={styles.detailsContainer}>
            <DetailRow
              icon="person-outline"
              label="Full Name"
              value={profile.fullName}
            />
            <DetailRow icon="mail-outline" label="Email" value={profile.email} />
            <DetailRow
              icon="calendar-outline"
              label="Date of Birth"
              value={formatDate(profile.dateOfBirth)}
            />
          </View>

          {/* Edit Button */}
          <TouchableOpacity style={styles.editButton} onPress={openEditModal}>
            <Ionicons color="#FFFFFF" name="create-outline" size={18} />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
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
                  <Ionicons color="#1A2340" name="close" size={26} />
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
                    <Ionicons color="#1A2340" name="person" size={50} />
                  </View>
                )}
                <View style={styles.cameraBadge}>
                  <Ionicons color="#FFFFFF" name="camera" size={16} />
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

// Sub-component for showing each detail row
function DetailRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailIcon}>
        <Ionicons color="#1A2340" name={icon} size={20} />
      </View>
      <View style={styles.detailTextContainer}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
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
  screen: {
    flexGrow: 1,
    backgroundColor: "#F7F8FC",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8ECF4",
    paddingVertical: 28,
    paddingHorizontal: 22,
    alignItems: "center",
    shadowColor: "#1A2340",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#E8ECF4",
  },
  avatarPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#E8ECF4",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginTop: 6,
    fontSize: 22,
    fontWeight: "800",
    color: "#1A2340",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#5E6983",
  },
  detailsContainer: {
    width: "100%",
    marginTop: 22,
    gap: 14,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F8FC",
    padding: 12,
    borderRadius: 12,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8ECF4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: "#5E6983",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A2340",
  },
  editButton: {
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1A2340",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    gap: 8,
    width: "100%",
  },
  editButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
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
    color: "#1A2340",
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
    borderColor: "#E8ECF4",
  },
  avatarPlaceholderEdit: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E8ECF4",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#1A2340",
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  changePhotoText: {
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 18,
    fontSize: 13,
    color: "#5E6983",
  },
  formField: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#5E6983",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E8ECF4",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#1A2340",
    backgroundColor: "#F7F8FC",
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
    backgroundColor: "#F7F8FC",
    borderWidth: 1,
    borderColor: "#E8ECF4",
  },
  cancelButtonText: {
    color: "#5E6983",
    fontWeight: "700",
    fontSize: 15,
  },
  saveButton: {
    backgroundColor: "#1A2340",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
});