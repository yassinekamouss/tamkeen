import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fr from './locales/fr/translation.json';
import ar from './locales/ar/translation.json';

const savedLanguage = (typeof localStorage !== 'undefined' ? localStorage.getItem('appLanguage') : null) || 'fr';

// Initialize document attributes
if (typeof document !== 'undefined') {
  document.documentElement.setAttribute('lang', savedLanguage);
  document.documentElement.setAttribute('dir', savedLanguage === 'ar' ? 'rtl' : 'ltr');
}

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

// Keep localStorage and document dir/lang attributes in sync with i18n
i18n.on('languageChanged', (lng) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('appLanguage', lng);
  }
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('lang', lng);
    document.documentElement.setAttribute('dir', lng === 'ar' ? 'rtl' : 'ltr');
  }
});

export default i18n;
