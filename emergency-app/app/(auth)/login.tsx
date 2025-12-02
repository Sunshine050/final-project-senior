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
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useAuth } from "../../hooks/useAuth";

const colors = {
  primary: "#1A73E8",
  primaryLight: "#4D9AFF",
  accentGreen: "#4CAF50",
  background: "#F7FAFC",
  card: "#FFFFFF",
  border: "#E2E8F0",
  text: "#1A1A1A",
  muted: "#6B7280",
};

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
      console.log("Attempting login with email:", email);
      await loginWithEmail({ email, password });
      console.log("Login successful, navigating...");
      router.replace("/(main)/home" as any);
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        (error as Error).message || "ไม่สามารถเข้าสู่ระบบได้";
      Alert.alert("เข้าสู่ระบบไม่สำเร็จ", errorMessage);
    }
  };

  const handleOAuth = async (provider: "google" | "facebook") => {
    try {
      if (provider === "google") await loginWithGoogle();
      else await loginWithFacebook();
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("ไม่สามารถเข้าสู่ระบบได้", (error as Error).message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.iconWrapper}>
            <LinearGradient
              colors={[colors.primary, colors.accentGreen]}
              style={styles.iconGradient}
            >
              <MaterialCommunityIcons
                name="hospital-box"
                size={38}
                color="#fff"
              />
            </LinearGradient>
          </View>

          <Text style={styles.title}>Emergency SOS</Text>
          <Text style={styles.subtitle}>
            ระบบแจ้งเหตุฉุกเฉินสำหรับโรงพยาบาล
          </Text>
        </View>

        {/* FORM */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <MaterialCommunityIcons
              name="email-outline"
              size={20}
              color={colors.muted}
            />
            <TextInput
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="อีเมล"
              placeholderTextColor={colors.muted}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <MaterialCommunityIcons
              name="lock-outline"
              size={20}
              color={colors.muted}
            />
            <TextInput
              style={styles.input}
              secureTextEntry
              placeholder="รหัสผ่าน"
              placeholderTextColor={colors.muted}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <Text style={styles.helper}>
            * ข้อมูลของท่านจะถูกเก็บรักษาอย่างปลอดภัย
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleLogin}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryLight]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>
                {isSubmitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
              </Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            style={{ alignSelf: "flex-end" }}
            onPress={() =>
              Alert.alert("ลืมรหัสผ่าน", "โปรดติดต่อเจ้าหน้าที่เพื่อรีเซ็ต")
            }
          >
            <Text style={styles.forgotText}>ลืมรหัสผ่าน?</Text>
          </Pressable>
        </View>

        {/* SOCIAL */}
        <View style={styles.dividerRow}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>หรือ</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.socialRow}>
          <Pressable
            style={styles.socialButton}
            onPress={() => handleOAuth("google")}
          >
            <MaterialCommunityIcons name="google" size={20} color="#DB4437" />
            <Text style={styles.socialText}>Google</Text>
          </Pressable>

          <Pressable
            style={styles.socialButton}
            onPress={() => handleOAuth("facebook")}
          >
            <MaterialCommunityIcons name="facebook" size={20} color="#1877F2" />
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
    padding: 24,
    minHeight: "100%",
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  iconWrapper: {
    width: 90,
    height: 90,
    borderRadius: 20,
    backgroundColor: "#fff",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  iconGradient: {
    flex: 1,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    color: colors.text,
    fontWeight: "800",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 15,
    color: colors.muted,
    marginTop: 6,
  },
  form: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 22,
    gap: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    marginTop: 10,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  helper: {
    color: colors.muted,
    fontSize: 12,
    textAlign: "center",
  },
  button: {
    borderRadius: 12,
    overflow: "hidden",
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  buttonPressed: {
    opacity: 0.9,
  },
  forgotText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 14,
    marginTop: 4,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    gap: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    color: colors.muted,
  },
  socialRow: {
    flexDirection: "row",
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 14,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  socialText: {
    color: colors.text,
    fontWeight: "700",
  },
  footer: {
    textAlign: "center",
    color: colors.muted,
    marginTop: 20,
  },
  link: {
    color: colors.primary,
    marginLeft: 6,
    fontWeight: "700",
  },
});

export default LoginScreen;
