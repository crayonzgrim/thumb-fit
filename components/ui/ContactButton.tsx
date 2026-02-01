'use client';

import { useState, useCallback } from 'react';
import { useI18n } from '@/lib/i18n';

const EMAIL = 'crayonzgrim@gmail.com';

export function ContactButton() {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = EMAIL;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleCopy}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="flex items-center gap-1.5 rounded-lg bg-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-300 hover:text-zinc-900 dark:bg-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-600 dark:hover:text-white"
        aria-label={t('contact')}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
        <span className="hidden sm:inline">{t('contact')}</span>
      </button>

      {/* Tooltip */}
      {(showTooltip || copied) && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg bg-zinc-900 px-3 py-2 text-xs text-white shadow-lg dark:bg-zinc-100 dark:text-zinc-900">
          {copied ? (
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-400 dark:text-green-600"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              <span>{t('emailCopied')}</span>
            </div>
          ) : (
            <>
              <p className="mb-1.5">{t('contactTooltip')}</p>
              <p className="font-mono text-zinc-400 dark:text-zinc-600">
                {EMAIL}
              </p>
            </>
          )}
          {/* Arrow */}
          <div className="absolute -top-1 right-4 h-2 w-2 rotate-45 bg-zinc-900 dark:bg-zinc-100" />
        </div>
      )}
    </div>
  );
}
