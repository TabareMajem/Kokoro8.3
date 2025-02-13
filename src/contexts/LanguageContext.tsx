import React, { createContext, useContext, useState, useEffect } from 'react';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import translations, { languages } from '../locales';
import type { Language } from '../types/language';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  languages: typeof languages;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Initialize i18next
i18next
  .use(initReactI18next)
  .init({
    resources: translations,
    fallbackLng: 'en',
    supportedLngs: Object.keys(languages),
    interpolation: {
      escapeValue: false
    }
  });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang && Object.keys(languages).includes(savedLang)) {
      setLanguage(savedLang as Language);
      i18next.changeLanguage(savedLang);
    } else {
      const browserLang = navigator.language.split('-')[0];
      const defaultLang = browserLang === 'ja' ? 'ja' : 'en';
      setLanguage(defaultLang);
      i18next.changeLanguage(defaultLang);
    }
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    i18next.changeLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    return i18next.t(key, { lng: language }) || key;
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage: handleLanguageChange, 
      t,
      languages
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}