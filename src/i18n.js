import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import en from '../src/translations/en.json';
import fi from '../src/translations/fi.json';
import sv from '../src/translations/sv.json';

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    lng: Localization.locale.startsWith('fi') ? 'fi' : 'en',
    fallbackLng: 'en',
    resources: {
      en: { translation: en },
      fi: { translation: fi },
      sv: { translation: sv },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
