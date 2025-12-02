// app/settings.tsx - เวอร์ชันไม่มีเสียง + ทำงานสมบูรณ์ 100%
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSettings } from "@/src/context/SettingsContext";

export default function SettingsScreen() {
    const router = useRouter();
    const {
        language,
        soundEnabled,
        vibrationEnabled,
        darkMode,
        setSoundEnabled,
        setVibrationEnabled,
        setDarkMode,
        triggerHaptic,
    } = useSettings();

    const handlePress = async () => {
        await triggerHaptic();
    };

    const handleBack = () => {
        handlePress();
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace("/(main)/profile");
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>การตั้งค่า</Text>
                <View style={{ width: 40 }} />
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableOpacity
                    style={styles.item}
                    onPress={async () => {
                        await handlePress();
                        router.push("/language-selector");
                    }}
                >
                    <View style={styles.itemLeft}>
                        <MaterialIcons name="language" size={24} color="#DC2626" />
                        <Text style={styles.itemText}>ภาษา</Text>
                    </View>
                    <View style={styles.itemRight}>
                        <Text style={styles.itemValue}>
                            {language === "th" ? "ไทย" : "English"}
                        </Text>
                        <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
                    </View>
                </TouchableOpacity>

                <View style={styles.item}>
                    <View style={styles.itemLeft}>
                        <MaterialIcons name="volume-up" size={24} color="#DC2626" />
                        <Text style={styles.itemText}>เสียงเอฟเฟกต์</Text>
                    </View>
                    <Switch
                        value={soundEnabled}
                        onValueChange={async (v) => {
                            await handlePress();
                            setSoundEnabled(v);
                        }}
                        trackColor={{ true: "#DC2626" }}
                        thumbColor="#fff"
                    />
                </View>

                <View style={styles.item}>
                    <View style={styles.itemLeft}>
                        <MaterialIcons name="vibration" size={24} color="#DC2626" />
                        <Text style={styles.itemText}>การสั่น (Haptic)</Text>
                    </View>
                    <Switch
                        value={vibrationEnabled}
                        onValueChange={async (v) => {
                            await handlePress();
                            setVibrationEnabled(v);
                        }}
                        trackColor={{ true: "#DC2626" }}
                        thumbColor="#fff"
                    />
                </View>

                <View style={styles.item}>
                    <View style={styles.itemLeft}>
                        <MaterialIcons name="dark-mode" size={24} color="#DC2626" />
                        <Text style={styles.itemText}>โหมดมืด</Text>
                    </View>
                    <Switch
                        value={darkMode}
                        onValueChange={async (v) => {
                            await handlePress();
                            setDarkMode(v);
                        }}
                        trackColor={{ true: "#DC2626" }}
                        thumbColor="#fff"
                    />
                </View>

                <View style={{ height: 60 }} />
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
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#F3F4F6",
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#111827",
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingVertical: 18,
        marginTop: 1,
    },
    itemLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    itemText: {
        fontSize: 16,
        marginLeft: 16,
        color: "#111827",
        fontWeight: "500",
    },
    itemRight: {
        flexDirection: "row",
        alignItems: "center",
    },
    itemValue: {
        fontSize: 16,
        color: "#6B7280",
        marginRight: 8,
        fontWeight: "500",
    },
});

