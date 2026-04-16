'use client';

import {
  createContext,
  useContext,
  useCallback,
  ReactNode,
  useSyncExternalStore,
} from 'react';
import { translations, Locale, TranslationKey } from './translations';

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = 'thumbfit-locale';
const listeners = new Set<() => void>();

function getServerSnapshot(): Locale {
  return 'en';
}

function getSnapshot(): Locale {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'en' || stored === 'ko') {
    return stored;
  }

  return navigator.language.toLowerCase().startsWith('ko') ? 'ko' : 'en';
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLocale = useCallback((newLocale: Locale) => {
    if (typeof window === 'undefined') {
      return;
    }

    localStorage.setItem(STORAGE_KEY, newLocale);
    listeners.forEach((listener) => listener());
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      return translations[locale][key] || translations.en[key] || key;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
