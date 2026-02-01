'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useCanvasState } from '@/hooks/useCanvasState';
import { useI18n } from '@/lib/i18n';
import { DEFAULT_OVERLAY_SIZE } from '@/lib/constants';
import type { OverlayImage } from '@/lib/types';

// Dynamically import emoji picker to avoid SSR issues
const Picker = dynamic(
  () => import('@emoji-mart/react').then((mod) => mod.default),
  { ssr: false, loading: () => <div className="flex h-[300px] items-center justify-center text-zinc-400">Loading...</div> }
);

interface EmojiData {
  native: string;
  unified: string;
}

export function OverlayImageUploader() {
  const { state, dispatch } = useCanvasState();
  const { t, locale } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const createOverlayFromImage = useCallback(
    (img: HTMLImageElement) => {
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      const width = DEFAULT_OVERLAY_SIZE;
      const height = DEFAULT_OVERLAY_SIZE / aspectRatio;

      const overlay: OverlayImage = {
        id: `overlay-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
        element: img,
        x: 50,
        y: 50,
        width,
        height,
        aspectRatio,
        rotation: 0,
      };

      dispatch({ type: 'ADD_OVERLAY', payload: overlay });
    },
    [dispatch]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      Array.from(files).forEach((file) => {
        if (!file.type.startsWith('image/')) return;

        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
          createOverlayFromImage(img);
        };

        img.src = url;
      });

      if (inputRef.current) {
        inputRef.current.value = '';
      }
    },
    [createOverlayFromImage]
  );

  const handleEmojiSelect = useCallback(
    (emoji: EmojiData) => {
      // Create canvas to render emoji as image
      const canvas = document.createElement('canvas');
      const size = 128;
      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.font = `${size * 0.8}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji.native, size / 2, size / 2);

      const img = new Image();
      img.onload = () => {
        createOverlayFromImage(img);
      };
      img.src = canvas.toDataURL('image/png');
    },
    [createOverlayFromImage]
  );

  const handleRemove = useCallback(
    (id: string) => {
      dispatch({ type: 'REMOVE_OVERLAY', payload: id });
    },
    [dispatch]
  );

  const handleSelect = useCallback(
    (id: string) => {
      dispatch({
        type: 'SELECT_OVERLAY',
        payload: state.selectedOverlayId === id ? null : id,
      });
    },
    [dispatch, state.selectedOverlayId]
  );

  const handleMouseDown = useCallback((e: React.MouseEvent, index: number) => {
    e.preventDefault();
    const rect = itemRefs.current[index]?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setDragPosition({ x: e.clientX, y: e.clientY });
    }
    setDraggedIndex(index);
    setDragOverIndex(index);
  }, []);

  useEffect(() => {
    if (draggedIndex === null) return;

    const handleMouseMove = (e: MouseEvent) => {
      setDragPosition({ x: e.clientX, y: e.clientY });

      // Find which item we're hovering over
      const elements = itemRefs.current;
      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        if (el && i !== draggedIndex) {
          const rect = el.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          if (e.clientX >= rect.left && e.clientX <= rect.right) {
            // Determine if we're on the left or right side
            if (e.clientX < centerX) {
              setDragOverIndex(i);
            } else {
              setDragOverIndex(i + 1 > draggedIndex ? i : i + 1);
            }
            break;
          }
        }
      }
    };

    const handleMouseUp = () => {
      if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
        const toIndex = dragOverIndex > draggedIndex ? dragOverIndex - 1 : dragOverIndex;
        if (toIndex !== draggedIndex) {
          dispatch({
            type: 'REORDER_OVERLAY',
            payload: { fromIndex: draggedIndex, toIndex },
          });
        }
      }
      setDraggedIndex(null);
      setDragOverIndex(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggedIndex, dragOverIndex, dispatch]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline gap-2">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {t('addImage')}
        </label>
        <span className="text-xs text-zinc-400 dark:text-zinc-500">
          {t('addImageHint')}
        </span>
      </div>

      {/* Two column layout - horizontal split */}
      <div className="grid grid-cols-2 gap-3">
        {/* Left: Image Upload */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {t('uploadIcon')}
          </span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
            id="overlay-upload"
          />
          <label
            htmlFor="overlay-upload"
            className="flex h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 text-sm text-zinc-600 transition-colors hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-blue-500 dark:hover:bg-zinc-700 dark:hover:text-blue-400"
          >
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-xs">Click or Drop</span>
          </label>
        </div>

        {/* Right: Emoji Button */}
        <div className="relative flex flex-col gap-2">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {t('addEmoji')}
          </span>
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`flex h-24 flex-col items-center justify-center gap-2 rounded-lg border-2 text-sm transition-colors ${
              showEmojiPicker
                ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                : 'border-zinc-300 bg-zinc-50 text-zinc-600 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-blue-500 dark:hover:bg-zinc-700 dark:hover:text-blue-400'
            }`}
          >
            <span className="text-3xl">😀</span>
            <span className="text-xs">{showEmojiPicker ? 'Close' : 'Open Picker'}</span>
          </button>

          {/* Emoji Picker Popup */}
          {showEmojiPicker && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowEmojiPicker(false)}
              />
              {/* Picker */}
              <div className="absolute right-0 top-full z-50 mt-2 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
                <Picker
                  data={async () => {
                    const response = await import('@emoji-mart/data');
                    return response.default;
                  }}
                  onEmojiSelect={(emoji: EmojiData) => {
                    handleEmojiSelect(emoji);
                    setShowEmojiPicker(false);
                  }}
                  theme="auto"
                  locale={locale}
                  previewPosition="none"
                  skinTonePosition="search"
                  maxFrequentRows={2}
                  perLine={9}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Overlay Images List */}
      {state.overlayImages.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {state.overlayImages.map((overlay, index) => {
            const isSelected = state.selectedOverlayId === overlay.id;
            const isDragging = draggedIndex === index;

            // Calculate if this item should shift
            let shouldShift = false;
            let shiftDirection = 0;
            if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
              if (draggedIndex < dragOverIndex) {
                // Dragging right: items between draggedIndex and dragOverIndex shift left
                if (index > draggedIndex && index < dragOverIndex) {
                  shouldShift = true;
                  shiftDirection = -1;
                }
              } else {
                // Dragging left: items between dragOverIndex and draggedIndex shift right
                if (index >= dragOverIndex && index < draggedIndex) {
                  shouldShift = true;
                  shiftDirection = 1;
                }
              }
            }

            return (
              <div
                key={overlay.id}
                ref={(el) => { itemRefs.current[index] = el; }}
                onMouseDown={(e) => handleMouseDown(e, index)}
                style={{
                  transform: shouldShift
                    ? `translateX(${shiftDirection * 62}px)`
                    : 'none',
                  opacity: isDragging ? 0.3 : 1,
                }}
                className={`group relative cursor-grab rounded-lg border-2 p-1 transition-all duration-200 ease-out select-none ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600'
                }`}
              >
                {/* Layer index badge */}
                <span className="absolute -left-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-600 text-[10px] font-medium text-white dark:bg-zinc-500">
                  {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleSelect(overlay.id)}
                  className="block"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={overlay.element.src}
                    alt="Overlay"
                    className="pointer-events-none h-12 w-12 object-contain"
                    draggable={false}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(overlay.id)}
                  className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            );
          })}

          {/* Floating dragged item */}
          {draggedIndex !== null && state.overlayImages[draggedIndex] && (
            <div
              style={{
                position: 'fixed',
                left: dragPosition.x - dragOffset.x,
                top: dragPosition.y - dragOffset.y,
                zIndex: 9999,
                pointerEvents: 'none',
              }}
              className="rounded-lg border-2 border-blue-500 bg-blue-50 p-1 shadow-xl dark:bg-blue-900/80"
            >
              <span className="absolute -left-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-medium text-white">
                {draggedIndex + 1}
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={state.overlayImages[draggedIndex].element.src}
                alt="Dragging"
                className="h-12 w-12 object-contain"
                draggable={false}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
