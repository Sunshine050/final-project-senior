import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useAuth } from "../../hooks/useAuth";
import { colors, radii, spacing } from "../../constants/theme";

const LoginScreen = () => {
  const router = useRouter();
  const { loginWithEmail, loginWithGoogle, loginWithFacebook, isSubmitting } =
    useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("กรอกข้อมูลให้ครบ", "กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }
    try {
      await loginWithEmail({ email, password });
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("เข้าสู่ระบบไม่สำเร็จ", (error as Error).message);
    }
  };

  const handleOAuth = async (provider: "google" | "facebook") => {
    try {
      if (provider === "google") {
        await loginWithGoogle();
      } else {
        await loginWithFacebook();
      }
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("ไม่สามารถเข้าสู่ระบบได้", (error as Error).message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.backgroundDark }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        <View style={styles.header}>
          <View style={styles.iconWrapper}>
            <MaterialCommunityIcons name="heart-pulse" size={34} color="#fff" />
          </View>
          <Text style={styles.title}>Emergency SOS</Text>
          <Text style={styles.subtitle}>
            ระบบแจ้งเหตุฉุกเฉิน ครอบคลุมทั่วไทย
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>อีเมล</Text>
          <TextInput
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            placeholder="example@email.com"
            placeholderTextColor={colors.muted}
          />

          <Text style={[styles.label, { marginTop: spacing.md }]}>
            รหัสผ่าน
          </Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor={colors.muted}
          />

          <Text style={styles.helper}>* ข้อมูลของคุณจะถูกเก็บอย่างปลอดภัย</Text>

          <View style={{ marginTop: spacing.lg }}>
            <Pressable
              style={styles.button}
              onPress={handleLogin}
              disabled={isSubmitting}
            >
              <Text style={styles.buttonText}>
                {isSubmitting ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ"}
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>หรือ</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.socialRow}>
          <Pressable
            style={[styles.socialButton, { backgroundColor: "#ffffff11" }]}
            onPress={() => handleOAuth("google")}
          >
            <MaterialCommunityIcons name="google" size={20} color="#fff" />
            <Text style={styles.socialText}>ใช้บัญชี Google</Text>
          </Pressable>
          <Pressable
            style={[styles.socialButton, { backgroundColor: "#1877f233" }]}
            onPress={() => handleOAuth("facebook")}
          >
            <MaterialCommunityIcons name="facebook" size={20} color="#fff" />
            <Text style={styles.socialText}>Facebook</Text>
          </Pressable>
        </View>

        <Text style={styles.footer}>
          ยังไม่มีบัญชี?
          <Link href="/(auth)/register" style={styles.link}>
            สร้างบัญชี
          </Link>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    minHeight: "100%",
    gap: spacing.lg,
  },
  header: {
    alignItems: "center",
    gap: spacing.sm,
  },
  iconWrapper: {
    width: 70,
    height: 70,
    borderRadius: radii.lg,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
  },
  form: {
    backgroundColor: colors.surfaceDark,
    borderRadius: radii.md,
    padding: spacing.lg,
  },
  label: {
    color: colors.muted,
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: "#0b1220",
    borderRadius: radii.md,
    padding: spacing.md,
    color: colors.textPrimary,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  helper: {
    color: colors.muted,
    fontSize: 12,
    marginTop: spacing.sm,
  },
  button: {
    textAlign: "center",
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: radii.md,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#1f2a37",
  },
  dividerText: {
    color: colors.muted,
  },
  socialRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  socialButton: {
    flex: 1,
    borderRadius: radii.md,
    paddingVertical: 14,
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  socialText: {
    color: "#fff",
    fontWeight: "600",
  },
  footer: {
    color: colors.muted,
    textAlign: "center",
  },
  link: {
    color: colors.accentBlue,
    marginLeft: 6,
  },
});

export default LoginScreen;
