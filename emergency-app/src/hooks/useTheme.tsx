import { useTheme as useThemeContext } from '../context/ThemeContext';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

export const useTheme = () => {
  const { theme } = useThemeContext();
  return { theme };
};

export const useThemedStyles = <T extends Record<string, ViewStyle | TextStyle>>(
  createStyles: (theme: ReturnType<typeof useTheme>['theme']) => T
): T => {
  const { theme } = useTheme();
  return createStyles(theme);
};

