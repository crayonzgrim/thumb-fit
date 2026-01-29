'use client';

import { useRef, forwardRef, useImperativeHandle, useState, useCallback, useEffect } from 'react';
import { useCanvasState } from '@/hooks/useCanvasState';
import { useCanvasRenderer } from '@/hooks/useCanvasRenderer';
import { useImageLoader } from '@/hooks/useImageLoader';
import { useI18n } from '@/lib/i18n';
import { CANVAS_RATIOS } from '@/lib/constants';
import { OverlayImageEditor } from './OverlayImageEditor';

export interface CanvasPreviewHandle {
  getCanvas: () => HTMLCanvasElement | null;
}

export const CanvasPreview = forwardRef<CanvasPreviewHandle>(
  function CanvasPreview(_, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { state, dispatch } = useCanvasState();
    const { loadImage } = useImageLoader();
    const { t } = useI18n();
    const [isDragOver, setIsDragOver] = useState(false);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

    useCanvasRenderer({ canvasRef, state });

    // Track container size for overlay positioning
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const updateSize = () => {
        const canvas = container.querySelector('canvas');
        if (canvas) {
          setContainerSize({
            width: canvas.offsetWidth,
            height: canvas.offsetHeight,
          });
        }
      };

      updateSize();
      const resizeObserver = new ResizeObserver(updateSize);
      resizeObserver.observe(container);

      return () => resizeObserver.disconnect();
    }, [state.ratio]);

    // Deselect overlay when clicking outside
    const handleContainerClick = useCallback(() => {
      if (state.selectedOverlayId) {
        dispatch({ type: 'SELECT_OVERLAY', payload: null });
      }
    }, [state.selectedOverlayId, dispatch]);

    useImperativeHandle(ref, () => ({
      getCanvas: () => canvasRef.current,
    }));

    const handleFile = useCallback(
      (file: File) => {
        if (!file.type.startsWith('image/')) {
          return;
        }
        loadImage(file);
      },
      [loadImage]
    );

    const handleDrop = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) {
          handleFile(file);
        }
      },
      [handleFile]
    );

    const handleDragOver = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback(() => {
      setIsDragOver(false);
    }, []);

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

    const hasImage = !!state.image.element;
    const canvasConfig = CANVAS_RATIOS[state.ratio];

    return (
      <div
        ref={containerRef}
        className="canvas-container"
        data-ratio={state.ratio}
        onClick={handleContainerClick}
      >
        <canvas ref={canvasRef} />

        {/* Overlay Images */}
        {containerSize.width > 0 &&
          state.overlayImages.map((overlay) => (
            <OverlayImageEditor
              key={overlay.id}
              overlay={overlay}
              containerWidth={containerSize.width}
              containerHeight={containerSize.height}
              canvasWidth={canvasConfig.width}
              canvasHeight={canvasConfig.height}
            />
          ))}
        {!hasImage && (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleClick}
            className={`absolute inset-0 z-10 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed transition-colors ${
              isDragOver
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-zinc-300 hover:border-zinc-400 dark:border-zinc-600 dark:hover:border-zinc-500'
            }`}
          >
            <div className="rounded-lg bg-white/90 px-4 py-3 text-center dark:bg-zinc-800/90">
              <svg
                className="mx-auto mb-2 h-12 w-12 text-zinc-400 dark:text-zinc-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                {t('dragAndDrop')}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {t('orClickToUpload')}
              </p>
              <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
                {t('supportedFormats')}
              </p>
              {state.image.isLoading && (
                <p className="mt-2 text-sm text-blue-500">{t('loading')}</p>
              )}
              {state.image.error && (
                <p className="mt-2 text-sm text-red-500">{state.image.error}</p>
              )}
            </div>
          </div>
        )}
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
);
