// C:\nginx\html\pspace-logbook\pspace-logbook\app\(tabs)\_layout.tsx
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: "none" } }}>
      <Tabs.Screen name="index" />
    </Tabs>
  );
}