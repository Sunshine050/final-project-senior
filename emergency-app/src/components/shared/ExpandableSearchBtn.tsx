import { useTheme } from '../../hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface ExpandableSearchBtnProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  onExpandChange?: (expanded: boolean) => void;
}

const ExpandableSearchBtn: React.FC<ExpandableSearchBtnProps> = ({
  onSearch,
  placeholder,
  onExpandChange,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchText, setSearchText] = useState('');
  const inputRef = useRef<TextInput>(null);
  const flexVal = useSharedValue(0);
  const opacity = useSharedValue(0);
  const expandDuration = 200;

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      flexGrow: flexVal.value,
    };
  });

  const animatedInputStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    onExpandChange?.(isExpanded);
    if (isExpanded) {
      flexVal.value = withTiming(1, { duration: expandDuration });
      opacity.value = withTiming(1, { duration: expandDuration });
      setTimeout(() => inputRef.current?.focus(), expandDuration);
    } else {
      flexVal.value = withTiming(0, { duration: expandDuration });
      opacity.value = withTiming(0, { duration: expandDuration });
      Keyboard.dismiss();
    }
  }, [isExpanded, flexVal, opacity]);

  const handleSearch = () => {
    if (isExpanded) {
      onSearch(searchText);
    } else {
      setIsExpanded(true);
    }
  };

  const handleClose = () => {
    setIsExpanded(false);
    setSearchText('');
    onSearch('');
  };

  const styles = StyleSheet.create({
    container: {
      height: 40,
      borderRadius: theme.spacing.m,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.s,
      overflow: 'hidden',
    },
    input: {
      flex: 1,
      height: '100%',
      marginLeft: 10,
      color: theme.colors.text,
      fontSize: 16,
    },
    iconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      <TouchableOpacity onPress={handleSearch} style={styles.iconContainer}>
        <MaterialIcons name="search" size={24} color={theme.colors.text} />
      </TouchableOpacity>
      {isExpanded && (
        <Animated.View style={[styles.input, animatedInputStyle]}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder={placeholder || t('common.search')}
            placeholderTextColor={theme.colors.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={() => onSearch(searchText)}
            returnKeyType="search"
          />
        </Animated.View>
      )}
      {isExpanded && (
        <TouchableOpacity onPress={handleClose} style={styles.iconContainer}>
          <MaterialIcons name="close" size={20} color={theme.colors.text} />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

export default ExpandableSearchBtn;

