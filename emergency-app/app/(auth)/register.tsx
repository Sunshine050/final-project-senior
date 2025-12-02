import { useState } from 'react';
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
} from 'react-native';
import { Link, useRouter } from 'expo-router';

import { useAuth } from '../../hooks/useAuth';
import { colors, radii, spacing } from '../../constants/theme';

const RegisterScreen = () => {
  const router = useRouter();
  const { registerWithEmail, isSubmitting } = useAuth();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
  });

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleRegister = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      Alert.alert('ต้องกรอกข้อมูลให้ครบ', 'ชื่อ นามสกุล อีเมล และรหัสผ่านเป็นข้อมูลจำเป็น');
      return;
    }

    try {
      await registerWithEmail(form);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('สมัครสมาชิกไม่สำเร็จ', (error as Error).message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.backgroundDark }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>สร้างบัญชีใช้งาน</Text>
        <Text style={styles.subtitle}>เพื่อให้เรารู้จักคุณและช่วยเหลือได้อย่างรวดเร็ว</Text>

        <View style={styles.form}>
          <Text style={styles.label}>ชื่อ</Text>
          <TextInput
            style={styles.input}
            value={form.firstName}
            onChangeText={(value) => updateField('firstName', value)}
            placeholder="ชื่อจริง"
            placeholderTextColor={colors.muted}
          />

          <Text style={[styles.label, { marginTop: spacing.md }]}>นามสกุล</Text>
          <TextInput
            style={styles.input}
            value={form.lastName}
            onChangeText={(value) => updateField('lastName', value)}
            placeholder="นามสกุล"
            placeholderTextColor={colors.muted}
          />

          <Text style={[styles.label, { marginTop: spacing.md }]}>เบอร์โทรศัพท์</Text>
          <TextInput
            style={styles.input}
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={(value) => updateField('phone', value)}
            placeholder="08x-xxx-xxxx"
            placeholderTextColor={colors.muted}
          />

          <Text style={[styles.label, { marginTop: spacing.md }]}>อีเมล</Text>
          <TextInput
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={(value) => updateField('email', value)}
            placeholder="example@email.com"
            placeholderTextColor={colors.muted}
          />

          <Text style={[styles.label, { marginTop: spacing.md }]}>รหัสผ่าน</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={form.password}
            onChangeText={(value) => updateField('password', value)}
            placeholder="ขั้นต่ำ 8 ตัวอักษร"
            placeholderTextColor={colors.muted}
          />

          <Pressable style={[styles.button, { marginTop: spacing.lg }]} onPress={handleRegister}>
            <Text style={styles.buttonText}>
              {isSubmitting ? 'กำลังสร้างบัญชี...' : 'สมัครสมาชิก'}
            </Text>
          </Pressable>
        </View>

        <Text style={styles.footer}>
          มีบัญชีอยู่แล้ว?
          <Link href="/(auth)/login" style={styles.link}>
            กลับไปเข้าสู่ระบบ
          </Link>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    gap: spacing.md,
    minHeight: '100%',
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
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
    backgroundColor: '#0b1220',
    borderRadius: radii.md,
    padding: spacing.md,
    color: colors.textPrimary,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    color: colors.muted,
    textAlign: 'center',
  },
  link: {
    color: colors.accentBlue,
    marginLeft: 6,
  },
});

export default RegisterScreen;

