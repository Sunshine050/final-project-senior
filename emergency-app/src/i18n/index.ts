import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { th } from './locales/th';
import { en } from './locales/en';

const LANGUAGE_KEY = '@app/settings';

// Load saved language from settings
const loadLanguage = async (): Promise<string> => {
  try {
    const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (saved) {
      const settings = JSON.parse(saved);
      return settings.language || 'th';
    }
    return 'th';
  } catch {
    return 'th';
  }
};

// Initialize i18n
const initI18n = async () => {
  const savedLanguage = await loadLanguage();

  i18n
    .use(initReactI18next)
    .init({
      compatibilityJSON: 'v3',
      resources: {
        th: { translation: th },
        en: { translation: en },
      },
      lng: savedLanguage,
      fallbackLng: 'th',
      interpolation: {
        escapeValue: false,
      },
    });
};

// Change language (SettingsContext will handle saving)
export const changeLanguage = async (lang: 'th' | 'en') => {
  await i18n.changeLanguage(lang);
};

// Initialize immediately
initI18n();

export default i18n;

