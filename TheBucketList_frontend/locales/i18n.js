import ReactNative from 'react-native';
import I18n from 'react-native-i18n';

import en from './en.json';
import sl from './sl.json';

I18n.fallbacks = true;

I18n.translations = {
  en,
  sl
};

const currentLocale = I18n.currentLocale();

export function strings(name, params = {}) {
  return I18n.t(name, params);
};

export default I18n;