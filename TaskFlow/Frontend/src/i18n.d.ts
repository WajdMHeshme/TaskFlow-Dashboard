import 'react-i18next';

declare module 'react-i18next' {
  interface Resources {
    translation: typeof import('./locales/en/translation.json');
  }
}
