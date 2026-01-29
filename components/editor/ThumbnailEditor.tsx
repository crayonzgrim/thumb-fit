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
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            {t('title')}
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {t('subtitle')}
          </p>
        </div>
        <LanguageSwitcher />
      </div>

      {/* Canvas Preview */}
      <CanvasPreview ref={canvasPreviewRef} />

      {/* Image Controls */}
      <ImageUploader />

      {/* Controls */}
      <div className="flex flex-col gap-6 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
        <TemplateSelector />
        <div className="h-px bg-zinc-200 dark:bg-zinc-700" />
        <OverlayImageUploader />
        <div className="h-px bg-zinc-200 dark:bg-zinc-700" />
        <RatioSelector />
        <TextControls />
        <ExportButton onExport={exportImage} />
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
