import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { palette, type } from "@/constants/ui";

export type SelectionOption = { value: string; label: string; description?: string };
export function SelectionSheet({ visible, title, options, selected, onSelect, onClose }: { visible: boolean; title: string; options: SelectionOption[]; selected: string; onSelect: (value: string) => void; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  return <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
    <View style={styles.backdrop}><Pressable accessibilityLabel="Dismiss selection" style={StyleSheet.absoluteFill} onPress={onClose} />
      <View accessibilityViewIsModal style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <View style={styles.header}><Text style={type.heading}>{title}</Text><TouchableOpacity accessibilityRole="button" accessibilityLabel="Close selection" onPress={onClose} style={styles.close}><Ionicons name="close" size={24} color={palette.navy} /></TouchableOpacity></View>
        <ScrollView keyboardShouldPersistTaps="handled">{options.map((option) => <TouchableOpacity accessibilityRole="radio" accessibilityState={{ checked: selected === option.value }} key={option.value} onPress={() => { onSelect(option.value); onClose(); }} style={styles.option}>
          <View style={styles.flex}><Text style={type.body}>{option.label}</Text>{option.description && <Text style={type.caption}>{option.description}</Text>}</View><Ionicons name={selected === option.value ? "checkmark-circle" : "ellipse-outline"} size={24} color={palette.navy} />
        </TouchableOpacity>)}</ScrollView>
      </View>
    </View>
  </Modal>;
}
const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(3,36,81,0.5)" },
  sheet: { backgroundColor: palette.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, maxHeight: "80%", width: "100%", maxWidth: 600, alignSelf: "center" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12 }, close: { width: 48, height: 48, alignItems: "center", justifyContent: "center" },
  option: { minHeight: 66, flexDirection: "row", alignItems: "center", paddingVertical: 14, borderTopWidth: 1, borderTopColor: palette.border, gap: 12 }, flex: { flex: 1 },
});
