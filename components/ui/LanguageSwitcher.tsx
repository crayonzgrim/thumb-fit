'use client';

import { useI18n, Locale } from '@/lib/i18n';

const languages: { code: Locale; label: string; flag: string }[] = [
  { code: 'en', label: 'EN', flag: '🇺🇸' },
  { code: 'ko', label: 'KO', flag: '🇰🇷' },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="flex gap-1 rounded-lg bg-zinc-200 p-1 dark:bg-zinc-700">
      {languages.map(({ code, label, flag }) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          className={`flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium transition-colors ${
            locale === code
              ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-600 dark:text-white'
              : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
          }`}
        >
          <span>{flag}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
