import { usePathname } from "expo-router";
import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import FiveIconNav, { ActiveTab } from "@/components/layout/five-icon-nav";
import { palette } from "@/constants/ui";

export default function ScreenLayout({ children, hideFooter = false }: { children: ReactNode; hideFooter?: boolean }) {
  const pathname = usePathname();
  const active: ActiveTab = pathname === "/aircrafts" ? "aircrafts" : pathname === "/flights" ? "flights" : pathname === "/logbook" ? "logbook" : pathname === "/profile" ? "profile" : "dashboard";
  return <View style={styles.root}><View style={styles.content}>{children}</View>{!hideFooter && <FiveIconNav active={active} />}</View>;
}
const styles = StyleSheet.create({ root: { flex: 1, backgroundColor: palette.background }, content: { flex: 1 } });
