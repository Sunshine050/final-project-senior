import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function MainLayout() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E5E7EB",
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: "#B8A4F5",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "หน่วยฉุกเฉิน",
          tabBarIcon: ({ color, focused, size }) => (
            <MaterialIcons 
              name="emergency" 
              size={focused ? 28 : 24} 
              color={focused ? "#B8A4F5" : "#9CA3AF"} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="nearby"
        options={{
          title: "โรงพยาบาล",
          tabBarIcon: ({ color, focused, size }) => (
            <MaterialIcons 
              name="local-hospital" 
              size={focused ? 28 : 24} 
              color={focused ? "#FF6B9D" : "#9CA3AF"} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="sos"
        options={{
          title: "SOS",
          tabBarIcon: ({ color, focused, size }) => (
            <MaterialIcons 
              name="emergency" 
              size={focused ? 32 : 26} 
              color={focused ? "#DC2626" : "#9CA3AF"} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "โปรไฟล์",
          tabBarIcon: ({ color, focused, size }) => (
            <MaterialIcons 
              name={focused ? "person" : "person-outline"} 
              size={focused ? 28 : 24} 
              color={focused ? "#6366F1" : "#9CA3AF"} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
