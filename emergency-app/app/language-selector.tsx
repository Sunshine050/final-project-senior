import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSettings } from "@/src/context/SettingsContext";

export default function LanguageSelectorScreen() {
  const router = useRouter();
  const { language, setLanguage, triggerHaptic } = useSettings();

  const languages = [
    { code: "th" as const, name: "ไทย", flag: "🇹🇭" },
    { code: "en" as const, name: "English", flag: "🇺🇸" },
  ];

  const handleSelect = async (lang: "th" | "en") => {
    await triggerHaptic();
    setLanguage(lang);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>เลือกภาษา</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.languageItem,
              language === lang.code && styles.languageItemActive,
            ]}
            onPress={() => handleSelect(lang.code)}
          >
            <Text style={styles.flag}>{lang.flag}</Text>
            <Text
              style={[
                styles.languageName,
                language === lang.code && styles.languageNameActive,
              ]}
            >
              {lang.name}
            </Text>
            {language === lang.code && (
              <MaterialIcons name="check" size={24} color="#DC2626" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  languageItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    marginTop: 1,
    borderLeftWidth: 4,
    borderLeftColor: "transparent",
  },
  languageItemActive: {
    borderLeftColor: "#DC2626",
    backgroundColor: "#FEE2E2",
  },
  flag: {
    fontSize: 32,
    marginRight: 16,
  },
  languageName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },
  languageNameActive: {
    fontWeight: "600",
    color: "#DC2626",
  },
});

