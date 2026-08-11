// C:\nginx\html\pspace-logbook\pspace-logbook\app\_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AircraftProvider } from '@/context/aircraft-context';
import { FlightProvider } from '@/context/flight-context';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AircraftProvider>
      <FlightProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            {/* Entry & auth */}
            <Stack.Screen name="index"                              options={{ headerShown: false }} />
            <Stack.Screen name="auth/login"                         options={{ headerShown: false }} />
            <Stack.Screen name="auth/signup"                        options={{ headerShown: false }} />

            {/* Main app screens */}
            <Stack.Screen name="dashboardscreen/dashboard"          options={{ headerShown: false }} />
            <Stack.Screen name="aircrafts"                          options={{ headerShown: false }} />
            <Stack.Screen name="aircraft_registration"             options={{ headerShown: false }} />
            <Stack.Screen name="aircraft_details"                  options={{ headerShown: false }} />
            <Stack.Screen name="flights"                           options={{ headerShown: false }} />
            <Stack.Screen name="add_flight_entry"                  options={{ headerShown: false }} />
            <Stack.Screen name="aircraftscreen/aircraft_list"       options={{ headerShown: false }} />
            <Stack.Screen name="aircraftscreen/add_aircraft"        options={{ headerShown: false }} />
            <Stack.Screen name="flightscreen/flight_list"           options={{ headerShown: false }} />
            <Stack.Screen name="flightscreen/add_flight"            options={{ headerShown: false }} />
            <Stack.Screen name="aircraftrecordscreen/aircraft_record"            options={{ headerShown: false }} />
            <Stack.Screen name="logbook"                            options={{ headerShown: false }} />
            <Stack.Screen name="profile"                            options={{ headerShown: false }} />

            {/* Legacy tabs (keep if still needed) */}
            <Stack.Screen name="(tabs)"                             options={{ headerShown: false }} />

            <Stack.Screen name="modal"                              options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </FlightProvider>
    </AircraftProvider>
  );
}
