'use client';

import { useCallback, useRef } from 'react';
import { useCanvasState } from '@/hooks/useCanvasState';
import { useImageLoader } from '@/hooks/useImageLoader';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';

function BlurBackgroundToggle() {
  const { state, dispatch } = useCanvasState();
  const { t } = useI18n();

  if (!state.image.element) return null;

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {t('blurBackground')}
      </label>
      <input
        type="checkbox"
        checked={state.image.blurBackground}
        onChange={(e) =>
          dispatch({
            type: 'SET_IMAGE',
            payload: { blurBackground: e.target.checked },
          })
        }
        className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
      />
    </div>
  );
}

export function ImageUploader() {
  const { state } = useCanvasState();
  const { loadImage, clearImage } = useImageLoader();
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) {
        return;
      }
      loadImage(file);
    },
    [loadImage]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleClick = () => {
    inputRef.current?.click();
  };

  // 이미지가 없으면 아무것도 표시하지 않음 (캔버스에서 업로드 UI 표시)
  if (!state.image.element) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {t('uploadImage')}
        </label>
        <div className="flex items-center gap-3">
          <span className="flex-1 truncate text-sm text-zinc-600 dark:text-zinc-400">
            {state.image.file?.name || 'Image loaded'}
          </span>
          <Button variant="secondary" size="sm" onClick={clearImage}>
            {t('removeImage')}
          </Button>
          <Button variant="secondary" size="sm" onClick={handleClick}>
            {t('changeImage')}
          </Button>
        </div>
      </div>
      <BlurBackgroundToggle />
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
