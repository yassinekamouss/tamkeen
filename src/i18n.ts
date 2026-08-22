
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fr from './locales/fr/translation.json';
import ar from './locales/ar/translation.json';

const savedLanguage = localStorage.getItem('appLanguage') || 'fr';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr: {
        translation: fr,
      },
      ar: {
        translation: ar,
      },
    },
    lng: savedLanguage,
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
