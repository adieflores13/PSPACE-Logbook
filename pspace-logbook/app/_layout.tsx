import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useFonts, Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold } from "@expo-google-fonts/montserrat";
import { ActivityIndicator, View } from "react-native";

import LocalDataGate from "@/components/local-data-gate";
import { AircraftProvider } from "@/context/aircraft-context";
import { FlightProvider } from "@/context/flight-context";
import { ProfileProvider } from "@/context/profile-context";
import { AuthProvider, useAuth } from "@/context/auth-context";

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({ Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold });
  if (!fontsLoaded && !fontError) return <View style={{ flex: 1, backgroundColor: "#FFFFFF", justifyContent: "center" }}><ActivityIndicator color="#032451" /></View>;
  return <AuthProvider><AuthenticatedRouter /></AuthProvider>;
}

function AuthenticatedRouter() {
  const { session, ready } = useAuth();
  if (!ready) return <View style={{ flex: 1, backgroundColor: "#FFFFFF", justifyContent: "center" }}><ActivityIndicator color="#032451" /></View>;
  return (
    <AircraftProvider key={session?.accountKey ?? "signed-out"}>
      <FlightProvider>
        <ProfileProvider>
          <ThemeProvider value={DefaultTheme}>
            <LocalDataGate>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Protected guard={!session}>
                <Stack.Screen name="auth/login" />
                <Stack.Screen name="auth/signup" />
                </Stack.Protected>
                <Stack.Protected guard={!!session}>
                <Stack.Screen name="dashboardscreen/dashboard" />
                <Stack.Screen name="aircrafts" />
                <Stack.Screen name="aircraft_registration" />
                <Stack.Screen name="aircraft_details" />
                <Stack.Screen name="flights" />
                <Stack.Screen name="add_flight_entry" />
                <Stack.Screen name="logbook" />
                <Stack.Screen name="profile" />
                </Stack.Protected>
              </Stack>
            </LocalDataGate>
            <StatusBar style="dark" />
          </ThemeProvider>
        </ProfileProvider>
      </FlightProvider>
    </AircraftProvider>
  );
}
