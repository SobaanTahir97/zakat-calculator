import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { I18nManager, TextStyle } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';
import { t as translate, isRTLLanguage, LANGUAGE_OPTIONS, type Language } from '../i18n';

const LANGUAGE_KEY = 'zakat_app_language';

const RTL_TEXT_STYLE: TextStyle = { writingDirection: 'rtl' };
const validLanguages = LANGUAGE_OPTIONS.map((o) => o.value);

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isRTL: boolean;
  textDir: TextStyle | undefined;
  languageLoaded: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [languageLoaded, setLanguageLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_KEY).then((saved) => {
      if (saved && validLanguages.includes(saved as Language)) {
        const lang = saved as Language;
        setLanguageState(lang);
        const shouldBeRTL = isRTLLanguage(lang);
        if (I18nManager.isRTL !== shouldBeRTL) {
          I18nManager.forceRTL(shouldBeRTL);
        }
      }
      setLanguageLoaded(true);
    });
  }, []);

  const setLanguage = useCallback(async (lang: Language) => {
    // Persist first so the reloaded app picks up the new language
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);
    setLanguageState(lang);

    const shouldBeRTL = isRTLLanguage(lang);
    if (I18nManager.isRTL !== shouldBeRTL) {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(shouldBeRTL);
      Updates.reloadAsync();
    }
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => translate(key, language, params),
    [language],
  );

  const isRTL = isRTLLanguage(language);
  const textDir = isRTL ? RTL_TEXT_STYLE : undefined;

  const contextValue = useMemo(
    () => ({ language, setLanguage, t, isRTL, textDir, languageLoaded }),
    [language, setLanguage, t, isRTL, textDir, languageLoaded],
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
