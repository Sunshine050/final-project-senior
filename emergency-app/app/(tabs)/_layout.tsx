import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";

import { colors } from "../../constants/theme";

const TabLayout = () => {
  const scheme = useColorScheme();
  const isDark = scheme !== "light";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? "#0f172a" : "#ffffff",
          borderTopColor: isDark ? "#1f2937" : "#e2e8f0",
          height: 72,
          paddingBottom: 12,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "SOS",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="shield-cross"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="hospitals"
        options={{
          title: "โรงพยาบาลใกล้ฉัน",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="hospital-building"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="contacts"
        options={{
          title: "ติดต่อด่วน",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="phone-alert"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
