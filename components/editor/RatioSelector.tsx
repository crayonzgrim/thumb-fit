'use client';

import { useCanvasState } from '@/hooks/useCanvasState';
import { useI18n, TranslationKey } from '@/lib/i18n';
import type { CanvasRatio } from '@/lib/types';

interface RatioOption {
  value: CanvasRatio;
  labelKey: TranslationKey;
  platformKey: TranslationKey;
}

const ratioOptions: RatioOption[] = [
  { value: '16:9', labelKey: 'youtube', platformKey: 'youtubeThumbnail' },
  { value: '9:16', labelKey: 'stories', platformKey: 'instagramStories' },
  { value: '1:1', labelKey: 'square', platformKey: 'instagramPost' },
];

export function RatioSelector() {
  const { state, dispatch } = useCanvasState();
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {t('ratio')}
      </label>
      <div className="flex gap-2">
        {ratioOptions.map(({ value, labelKey }) => {
          const isSelected = state.ratio === value;

          return (
            <button
              key={value}
              type="button"
              onClick={() => dispatch({ type: 'SET_RATIO', payload: value })}
              className={`flex flex-1 flex-col items-center gap-1 rounded-lg border-2 px-3 py-2 transition-colors ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600'
              }`}
            >
              <span
                className={`text-sm font-semibold ${
                  isSelected
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-zinc-900 dark:text-white'
                }`}
              >
                {value}
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {t(labelKey)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
