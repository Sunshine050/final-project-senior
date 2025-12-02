import { LoadingProvider } from "../src/context/LoadingContext";
import { AuthContext, AuthProvider } from "../hooks/useAuth";
import { ThemeProvider } from "../src/context/ThemeContext";
import { SettingsProvider } from "../src/context/SettingsContext";
import { Stack } from "expo-router";
import { useContext, useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import "../src/i18n";

function InitialLayout() {
  const authContext = useContext(AuthContext);
  const status = authContext?.status || "checking";
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (status === "checking") {
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";

    if (status === "unauthenticated" && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (status === "authenticated" && inAuthGroup) {
      router.replace("/(main)/home");
    }
  }, [status, segments, router, authContext]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(main)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen
        name="EmergencyDetail"
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen name="account" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="policy" />
      <Stack.Screen name="help" />
      <Stack.Screen name="language-selector" />
      <Stack.Screen name="user-guide" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SettingsProvider>
      <ThemeProvider>
        <LoadingProvider>
          <AuthProvider>
            <InitialLayout />
          </AuthProvider>
        </LoadingProvider>
      </ThemeProvider>
    </SettingsProvider>
  );
}
