import { useTheme } from '../../hooks/useTheme';
import { Text, TextInput, View, ViewStyle } from 'react-native';

interface InputProps {
  placeholder: string;
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: object;
  labelStyle?: object;
  editable?: boolean;
}

export default function CustomInput({
  placeholder, value, onChangeText, secureTextEntry = false, label = "", containerStyle, inputStyle, labelStyle, editable = true
}: InputProps) {
  const { theme } = useTheme();

  const styles = {
    container: {
      marginBottom: theme.spacing.s,
    },
    inputStyle: {
      borderWidth: 1,
      padding: theme.spacing.s,
      borderRadius: 8,
      borderColor: theme.colors.primary,
      placeholderTextColor: theme.colors.secondary,
    },
    label: {
      color: theme.colors.primary,
      marginBottom: 8,
      fontSize: 14,
      fontWeight: 'bold' as const,
    },
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        style={[styles.inputStyle, inputStyle]}
        editable={editable}
      />
    </View>
  );
}

