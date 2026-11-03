import { StyleSheet } from "react-native";

export const palette = {
  navy: "#032451", amber: "#FFBB57", background: "#F6F8FA", surface: "#FFFFFF",
  text: "#032451", muted: "#697481", border: "#BFC4CA", soft: "#F3F5F8",
  info: "#D1F4FA", success: "#24734B", danger: "#AF3737", accent: "#5067DB",
};

export const font = {
  regular: "Montserrat_400Regular",
  medium: "Montserrat_500Medium",
  semibold: "Montserrat_600SemiBold",
  bold: "Montserrat_700Bold",
};

export const type = StyleSheet.create({
  title: { fontFamily: font.semibold, fontSize: 26, lineHeight: 34, color: palette.navy, letterSpacing: -0.6 },
  heading: { fontFamily: font.semibold, fontSize: 18, lineHeight: 26, color: palette.navy },
  body: { fontFamily: font.regular, fontSize: 15, lineHeight: 23, color: palette.navy },
  label: { fontFamily: font.semibold, fontSize: 13, lineHeight: 20, color: palette.navy },
  caption: { fontFamily: font.regular, fontSize: 12, lineHeight: 18, color: palette.muted },
});
export const surfaces = StyleSheet.create({
  card: { padding: 16, borderRadius: 9, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.border },
});
