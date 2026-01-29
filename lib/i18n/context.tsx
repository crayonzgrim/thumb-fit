'use client';

import {
  createContext,
  useContext,
  useState,
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

// Store for useSyncExternalStore
let currentLocale: Locale = 'en';
const listeners = new Set<() => void>();

function getSnapshot(): Locale {
  return currentLocale;
}

function getServerSnapshot(): Locale {
  return 'en';
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function initializeLocale() {
  if (typeof window === 'undefined') return;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'en' || stored === 'ko') {
    currentLocale = stored;
  } else {
    const browserLang = navigator.language.toLowerCase();
    currentLocale = browserLang.startsWith('ko') ? 'ko' : 'en';
  }
  listeners.forEach((listener) => listener());
}

// Initialize on module load (client-side only)
if (typeof window !== 'undefined') {
  initializeLocale();
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [, forceUpdate] = useState(0);

  const setLocale = useCallback((newLocale: Locale) => {
    currentLocale = newLocale;
    localStorage.setItem(STORAGE_KEY, newLocale);
    listeners.forEach((listener) => listener());
    forceUpdate((n) => n + 1);
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
