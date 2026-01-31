'use client';

import { useRef, useCallback } from 'react';
import { CanvasProvider } from '@/hooks/useCanvasState';
import { I18nProvider, useI18n } from '@/lib/i18n';
import { useExport } from '@/hooks/useExport';
import { CanvasPreview, CanvasPreviewHandle } from './CanvasPreview';
import { RatioSelector } from './RatioSelector';
import { ImageUploader } from './ImageUploader';
import { TextControls } from './TextControls';
import { TemplateSelector } from './TemplateSelector';
import { OverlayImageUploader } from './OverlayImageUploader';
import { ExportButton } from './ExportButton';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

function EditorContent() {
  const canvasPreviewRef = useRef<CanvasPreviewHandle>(null);
  const { t } = useI18n();

  const getCanvas = useCallback(() => {
    return canvasPreviewRef.current?.getCanvas() ?? null;
  }, []);

  const { exportImage } = useExport({ getCanvas });

  return (
    <div className="flex h-full flex-col lg:flex-row">
      {/* Left Panel - Preview (Desktop: 60%, Mobile: 40vh) */}
      <div className="flex h-[40dvh] flex-col gap-4 overflow-hidden p-4 lg:h-full lg:w-3/5 lg:p-6">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 lg:text-2xl dark:text-white">
              {t('title')}
            </h1>
            <p className="mt-1 text-xs text-zinc-500 lg:text-sm dark:text-zinc-400">
              {t('subtitle')}
            </p>
          </div>
          <LanguageSwitcher />
        </div>

        {/* Canvas Preview */}
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <CanvasPreview ref={canvasPreviewRef} />
        </div>

        {/* Export Controls */}
        <div className="shrink-0">
          <ExportButton onExport={exportImage} />
        </div>
      </div>

      {/* Right Panel - Controls (Desktop: 40%, Mobile: 60vh) */}
      <div className="h-[60dvh] overflow-y-auto border-t border-zinc-200 bg-white p-4 lg:h-full lg:w-2/5 lg:border-l lg:border-t-0 lg:p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex flex-col gap-6">
          <ImageUploader />
          <div className="h-px bg-zinc-200 dark:bg-zinc-700" />
          <TemplateSelector />
          <div className="h-px bg-zinc-200 dark:bg-zinc-700" />
          <OverlayImageUploader />
          <div className="h-px bg-zinc-200 dark:bg-zinc-700" />
          <RatioSelector />
          <TextControls />
        </div>
      </div>
    </div>
  );
}

export function ThumbnailEditor() {
  return (
    <I18nProvider>
      <CanvasProvider>
        <EditorContent />
      </CanvasProvider>
    </I18nProvider>
  );
}
