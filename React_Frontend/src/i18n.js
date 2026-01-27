import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Custom Backend to fetch translations from the Spring Boot API
const BackendLoader = {
    type: 'backend',
    init: () => { },
    read: async (language, namespace, callback) => {
        try {
            const response = await fetch(`http://localhost:9001/api/v1/locales/${language}`);
            if (!response.ok) {
                return callback(`Failed to load translations: ${response.status}`, false);
            }
            const data = await response.json();
            callback(null, data);
        } catch (err) {
            callback(err, false);
        }
    }
};

i18n
    .use(BackendLoader)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage']
        },
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
