import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useAuth } from "../../hooks/useAuth";

export default function RegisterScreen() {
  const router = useRouter();
  const auth = useAuth();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Safe access to auth methods
  const registerWithEmail = auth?.registerWithEmail;
  const isSubmitting = auth?.isSubmitting || isLoading;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.firstName.trim()) {
      newErrors.firstName = "กรุณากรอกชื่อ";
    }

    if (!form.lastName.trim()) {
      newErrors.lastName = "กรุณากรอกนามสกุล";
    }

    if (!form.email.trim()) {
      newErrors.email = "กรุณากรอกอีเมล";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "รูปแบบอีเมลไม่ถูกต้อง";
    }

    if (!form.password) {
      newErrors.password = "กรุณากรอกรหัสผ่าน";
    } else if (form.password.length < 6) {
      newErrors.password = "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!registerWithEmail) {
      Alert.alert("เกิดข้อผิดพลาด", "ระบบยังไม่พร้อม กรุณาลองใหม่อีกครั้ง");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      console.log("Attempting registration with email:", form.email);
      await registerWithEmail({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        phone: form.phone.trim() || undefined,
      });
      console.log("Registration successful, navigating...");
      Alert.alert("สำเร็จ", "สมัครสมาชิกสำเร็จ", [
        {
          text: "ตกลง",
          onPress: () => {
            router.replace("/(main)/home" as any);
          },
        },
      ]);
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage =
        (error as Error).message || "ไม่สามารถสมัครสมาชิกได้";
      Alert.alert("สมัครสมาชิกไม่สำเร็จ", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#F8FAFF", "#FFFFFF"]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo / Title */}
          <View style={styles.header}>
            <Text style={styles.title}>สร้างบัญชีใหม่</Text>
            <Text style={styles.subtitle}>มาร่วมเป็นส่วนหนึ่งของเรา 💙</Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            <Text style={styles.label}>ชื่อ</Text>
            <TextInput
              style={[styles.input, errors.firstName && styles.inputError]}
              placeholder="กรอกชื่อของคุณ"
              placeholderTextColor="#b0b0b0"
              value={form.firstName}
              onChangeText={(t) => {
                setForm({ ...form, firstName: t });
                if (errors.firstName) {
                  setErrors({ ...errors, firstName: "" });
                }
              }}
            />
            {errors.firstName && (
              <Text style={styles.errorText}>{errors.firstName}</Text>
            )}

            <Text style={styles.label}>นามสกุล</Text>
            <TextInput
              style={[styles.input, errors.lastName && styles.inputError]}
              placeholder="กรอกนามสกุลของคุณ"
              placeholderTextColor="#b0b0b0"
              value={form.lastName}
              onChangeText={(t) => {
                setForm({ ...form, lastName: t });
                if (errors.lastName) {
                  setErrors({ ...errors, lastName: "" });
                }
              }}
            />
            {errors.lastName && (
              <Text style={styles.errorText}>{errors.lastName}</Text>
            )}

            <Text style={styles.label}>อีเมล</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="example@mail.com"
              placeholderTextColor="#b0b0b0"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={(t) => {
                setForm({ ...form, email: t });
                if (errors.email) {
                  setErrors({ ...errors, email: "" });
                }
              }}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            <Text style={styles.label}>เบอร์โทรศัพท์ (ไม่บังคับ)</Text>
            <TextInput
              style={styles.input}
              placeholder="08X-XXX-XXXX"
              placeholderTextColor="#b0b0b0"
              keyboardType="phone-pad"
              value={form.phone}
              onChangeText={(t) => setForm({ ...form, phone: t })}
            />

            <Text style={styles.label}>รหัสผ่าน</Text>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="กรอกรหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
              secureTextEntry
              placeholderTextColor="#b0b0b0"
              value={form.password}
              onChangeText={(t) => {
                setForm({ ...form, password: t });
                if (errors.password) {
                  setErrors({ ...errors, password: "" });
                }
              }}
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            {/* Register Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.buttonWrapper}
              onPress={handleRegister}
              disabled={isSubmitting}
            >
              <LinearGradient
                colors={
                  isSubmitting ? ["#B0C4DE", "#8FA8D0"] : ["#7BA8F5", "#4F74D8"]
                }
                style={styles.button}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>สมัครสมาชิก</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Login Link */}
            <TouchableOpacity
              onPress={() => router.push("/(auth)/login")}
              style={{ marginTop: 18 }}
            >
              <Text style={styles.loginText}>
                มีบัญชีอยู่แล้ว ?{" "}
                <Text style={{ color: "#4F74D8", fontWeight: "600" }}>
                  เข้าสู่ระบบ
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2A2A2A",
  },
  subtitle: {
    fontSize: 15,
    marginTop: 6,
    color: "#7A7A7A",
  },
  card: {
    backgroundColor: "#fff",
    padding: 22,
    borderRadius: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 14,
    color: "#333",
  },
  input: {
    marginTop: 8,
    backgroundColor: "#F4F6FA",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    fontSize: 15,
    color: "#333",
    borderWidth: 1,
    borderColor: "transparent",
  },
  inputError: {
    borderColor: "#FF6B6B",
    backgroundColor: "#FFF5F5",
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  buttonWrapper: {
    marginTop: 26,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  loginText: {
    textAlign: "center",
    color: "#777",
  },
});
