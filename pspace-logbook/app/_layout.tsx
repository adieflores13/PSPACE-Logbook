// C:\nginx\html\pspace-logbook\pspace-logbook\app\_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AircraftProvider } from '@/context/aircraft-context';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AircraftProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          {/* Entry & auth */}
          <Stack.Screen name="index"                              options={{ headerShown: false }} />
          <Stack.Screen name="auth/login"                         options={{ headerShown: false }} />

          {/* Main app screens */}
          <Stack.Screen name="dashboardscreen/dashboard"          options={{ headerShown: false }} />
          <Stack.Screen name="flightscreen/flight_list"           options={{ headerShown: false }} />
          <Stack.Screen name="flightscreen/add_flight"            options={{ headerShown: false }} />
          <Stack.Screen name="logbook"                            options={{ headerShown: false }} />
          <Stack.Screen name="profile"                            options={{ headerShown: false }} />

          {/* Legacy tabs (keep if still needed) */}
          <Stack.Screen name="(tabs)"                             options={{ headerShown: false }} />

          <Stack.Screen name="modal"                              options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AircraftProvider>
  );
}