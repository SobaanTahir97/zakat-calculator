import en from './translations/en';
import ar from './translations/ar';
import ur from './translations/ur';

export type Language = 'en' | 'ar' | 'ur';

// Use a deep string type so AR/UR translations aren't constrained to EN literal strings
type DeepStringRecord = { [key: string]: string | DeepStringRecord };

const translations: Record<Language, DeepStringRecord> = { en, ar, ur };

/**
 * Look up a translation by dot-separated key, with optional interpolation.
 * e.g. t('home.title', 'en') or t('home.goldHelper', 'ar', { unit: 'g' })
 */
export function t(
  key: string,
  language: Language,
  params?: Record<string, string | number>,
): string {
  const keys = key.split('.');
  let value: unknown = translations[language];
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = (value as Record<string, unknown>)[k];
    } else {
      break;
    }
  }

  // Fallback to English if key missing in target language
  if (typeof value !== 'string') {
    value = translations.en;
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = (value as Record<string, unknown>)[k];
      } else {
        break;
      }
    }
  }

  if (typeof value !== 'string') return key;

  if (params) {
    return value.replace(/\{\{(\w+)\}\}/g, (_, k) =>
      params[k] !== undefined ? String(params[k]) : `{{${k}}}`,
    );
  }

  return value;
}

export const RTL_LANGUAGES: Language[] = ['ar', 'ur'];

export function isRTLLanguage(lang: Language): boolean {
  return RTL_LANGUAGES.includes(lang);
}

export const LANGUAGE_OPTIONS: { value: Language; label: string; nativeName: string }[] = [
  { value: 'en', label: 'EN', nativeName: 'English' },
  { value: 'ar', label: 'عر', nativeName: 'العربية' },
  { value: 'ur', label: 'اردو', nativeName: 'اردو' },
];
