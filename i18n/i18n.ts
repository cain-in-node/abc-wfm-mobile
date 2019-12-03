import I18n from 'react-native-i18n';
// import RNRestart from "react-native-restart";
import { SaveStore, LoadStore } from '../asyncStorage/methods';
import { ENKS } from '../src/enums/EStorage';

// locales
import ru from './locales/ru-RU.json';
import en from './locales/en-EN.json';
export enum ELocales {en = 'en-EN', ru = 'ru-RU'}

export function initLocale(locale: ELocales) {
    LoadStore({ key: ENKS.locale }).then(response => {
        I18n.locale = String(response);
    }).catch(() => {
        SaveStore(ENKS.locale, locale);
        I18n.locale = locale;
    });
}

export function changeLocale(locale: ELocales) {
    SaveStore(ENKS.locale, locale);
    setTimeout(()=> {
        // RNRestart.Restart();
    });
}

I18n.fallbacks = true;

I18n.translations = {en,ru};

initLocale(ELocales.ru);

export function strings(name: string, params = {}) {
    return I18n.t(name, params);
};

export default I18n;
