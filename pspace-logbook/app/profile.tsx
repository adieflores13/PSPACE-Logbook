import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import ScreenLayout from "@/components/layout/screen-layout";

export default function ProfileScreen() {
  return (
    <ScreenLayout>
      <View style={styles.screen}>
        <View style={styles.card}>
          <Ionicons color="#1A2340" name="person-circle-outline" size={56} />
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.body}>Profile screen is ready for your details setup.</Text>
        </View>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
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
  title: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: "800",
    color: "#1A2340",
  },
  body: {
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
    color: "#5E6983",
  },
});
