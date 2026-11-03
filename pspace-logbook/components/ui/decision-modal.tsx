import { Ionicons } from "@expo/vector-icons";
import React, { ReactNode } from "react";
import { Modal, ScrollView, StyleSheet, Text, View } from "react-native";
import { AppButton } from "@/components/ui/app-ui";
import { palette, type } from "@/constants/ui";

type Props = {
  visible: boolean; title: string; description?: string; children?: ReactNode;
  icon?: keyof typeof Ionicons.glyphMap; illustration?: ReactNode; tone?: "neutral" | "success" | "warning";
  primaryLabel: string; onPrimary: () => void; secondaryLabel?: string; onSecondary?: () => void;
  loading?: boolean; error?: string | null; onDismiss?: () => void;
};
export function DecisionModal({ visible, title, description, children, icon = "airplane-outline", illustration, tone = "neutral", primaryLabel, onPrimary, secondaryLabel, onSecondary, loading, error, onDismiss }: Props) {
  return <Modal visible={visible} transparent animationType="fade" onRequestClose={() => { if (!loading) (onDismiss ?? onSecondary)?.(); }}>
    <View style={styles.overlay}><View accessibilityViewIsModal style={styles.modal}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.circle, tone === "warning" && styles.warning, tone === "success" && styles.success]}>
          {illustration ?? <Ionicons name={icon} size={52} color={tone === "success" ? palette.success : palette.navy} />}
          <Text style={styles.title}>{title}</Text>
          {children}
          {description && <Text style={styles.description}>{description}</Text>}
        </View>
        {error && <Text style={styles.error} accessibilityRole="alert">{error}</Text>}
        <View style={styles.actions}><AppButton pill variant="secondary" label={primaryLabel} onPress={onPrimary} loading={loading} />{secondaryLabel && <AppButton pill variant="outline" label={secondaryLabel} onPress={() => onSecondary?.()} disabled={loading} />}</View>
      </ScrollView>
    </View></View>
  </Modal>;
}
const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(3,36,65,0.78)", padding: 24 },
  modal: { width: "100%", maxWidth: 360, maxHeight: "90%", backgroundColor: palette.surface, borderRadius: 22, overflow: "hidden" },
  content: { paddingHorizontal: 20, paddingVertical: 32, alignItems: "center", gap: 24 },
  circle: { backgroundColor: palette.soft, width: "100%", maxWidth: 280, minHeight: 260, borderRadius: 160, alignItems: "center", justifyContent: "center", padding: 22, gap: 10 },
  warning: { backgroundColor: "#FFF0D7" }, success: { backgroundColor: palette.soft },
  title: { ...type.heading, fontSize: 18, lineHeight: 24, textAlign: "center" }, description: { ...type.caption, textAlign: "center" }, actions: { alignSelf: "stretch", gap: 12 }, error: { ...type.body, color: palette.danger },
});
