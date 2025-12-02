import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources: {
      th: {
        translation: {
          welcome: 'ยินดีต้อนรับ',
        },
      },
      en: {
        translation: {
          welcome: 'Welcome',
        },
      },
    },
    lng: 'th',
    fallbackLng: 'th',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

