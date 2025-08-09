import { createContext, useContext } from 'react';

export type Language = 'tr' | 'en';

export interface Translation {
  [key: string]: string | Translation;
}

export interface Translations {
  tr: Translation;
  en: Translation;
}

export interface I18nContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

export const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

export const getNestedTranslation = (obj: Translation, path: string): string => {
  const result = path.split('.').reduce((current: unknown, key: string): unknown => {
    return current && typeof current === 'object' && current !== null && key in current 
      ? (current as Record<string, unknown>)[key] 
      : path;
  }, obj as unknown);
  
  return typeof result === 'string' ? result : path;
};