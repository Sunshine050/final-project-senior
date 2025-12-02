import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { changeLanguage } from '../i18n';

interface SettingsContextValue {
  language: 'th' | 'en';
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  darkMode: boolean;
  setLanguage: (lang: 'th' | 'en') => void;
  setSoundEnabled: (enabled: boolean) => void;
  setVibrationEnabled: (enabled: boolean) => void;
  setDarkMode: (enabled: boolean) => void;
  triggerHaptic: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

const SETTINGS_KEY = '@app/settings';

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<'th' | 'en'>('th');
  const [soundEnabled, setSoundEnabledState] = useState(true);
  const [vibrationEnabled, setVibrationEnabledState] = useState(true);
  const [darkMode, setDarkModeState] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const saved = await AsyncStorage.getItem(SETTINGS_KEY);
        if (saved) {
          const settings = JSON.parse(saved);
          setLanguageState(settings.language || 'th');
          setSoundEnabledState(settings.soundEnabled !== false);
          setVibrationEnabledState(settings.vibrationEnabled !== false);
          setDarkModeState(settings.darkMode || false);
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };
    loadSettings();
  }, []);

  const saveSettings = async (updates: Partial<SettingsContextValue>) => {
    try {
      const current = {
        language,
        soundEnabled,
        vibrationEnabled,
        darkMode,
        ...updates,
      };
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(current));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const setLanguage = async (lang: 'th' | 'en') => {
    setLanguageState(lang);
    await changeLanguage(lang);
    saveSettings({ language: lang });
  };

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    saveSettings({ soundEnabled: enabled });
  };

  const setVibrationEnabled = (enabled: boolean) => {
    setVibrationEnabledState(enabled);
    saveSettings({ vibrationEnabled: enabled });
  };

  const setDarkMode = (enabled: boolean) => {
    setDarkModeState(enabled);
    saveSettings({ darkMode: enabled });
  };

  const triggerHaptic = async () => {
    if (vibrationEnabled) {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        // Haptics not available
      }
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        language,
        soundEnabled,
        vibrationEnabled,
        darkMode,
        setLanguage,
        setSoundEnabled,
        setVibrationEnabled,
        setDarkMode,
        triggerHaptic,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};

