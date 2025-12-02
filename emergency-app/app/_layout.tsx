import { useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  ColorSchemeName,
  useColorScheme,
  View,
} from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

import { AuthProvider, useAuth } from "../hooks/useAuth";

const lightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#dc2626",
    background: "#f8fafc",
    card: "#ffffff",
    text: "#0f172a",
    border: "#e2e8f0",
    notification: "#ef4444",
  },
};

const darkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#f97066",
    background: "#050b18",
    card: "#0f172a",
    text: "#f8fafc",
    border: "#1e293b",
    notification: "#f97316",
  },
};

function Navigator({ colorScheme }: { colorScheme: ColorSchemeName }) {
  const { status } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (status === "checking") {
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";

    if (status === "unauthenticated" && !inAuthGroup) {
      router.replace("/(auth)/login");
    }

    if (status === "authenticated" && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [segments, status, router]);

  if (status === "checking") {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colorScheme === "dark" ? "#050b18" : "#f8fafc",
        }}
      >
        <ActivityIndicator size="large" color="#ef4444" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false, animation: "fade" }} />
    </>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = useMemo(
    () => (colorScheme === "dark" ? darkTheme : lightTheme),
    [colorScheme]
  );

  return (
    <AuthProvider>
      <ThemeProvider value={theme}>
        <Navigator colorScheme={colorScheme} />
      </ThemeProvider>
    </AuthProvider>
  );
}
