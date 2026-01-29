'use client';

import { useCanvasState } from '@/hooks/useCanvasState';
import { useI18n } from '@/lib/i18n';
import { TEMPLATES, DEFAULT_SHADOW } from '@/lib/constants';
import type { Template } from '@/lib/types';

export function TemplateSelector() {
  const { state, dispatch } = useCanvasState();
  const { locale, t } = useI18n();

  const applyTemplate = (template: Template) => {
    // Set selected template
    dispatch({ type: 'SET_TEMPLATE', payload: template.id });

    // Apply text settings from template
    dispatch({
      type: 'SET_TEXT',
      payload: {
        ...template.text,
        shadow: template.text.shadow
          ? { ...DEFAULT_SHADOW, ...template.text.shadow }
          : { ...DEFAULT_SHADOW },
      },
    });

    // Apply ratio if specified
    if (template.ratio) {
      dispatch({ type: 'SET_RATIO', payload: template.ratio });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline gap-2">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {t('templates')}
        </label>
        <span className="text-xs text-zinc-400 dark:text-zinc-500">
          {t('templateHint')}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {TEMPLATES.map((template) => {
          const isSelected = state.selectedTemplateId === template.id;

          return (
            <button
              key={template.id}
              type="button"
              onClick={() => applyTemplate(template)}
              className={`flex flex-col items-center gap-1 rounded-lg border-2 p-2 text-center transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-zinc-200 bg-zinc-50 hover:border-blue-500 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-blue-500 dark:hover:bg-zinc-700'
              }`}
            >
              <span className="text-2xl">{template.thumbnail}</span>
              <span
                className={`text-xs font-medium ${
                  isSelected
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-zinc-700 dark:text-zinc-300'
                }`}
              >
                {locale === 'ko' ? template.nameKo : template.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
