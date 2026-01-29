'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
import { useCanvasState } from '@/hooks/useCanvasState';
import { useI18n } from '@/lib/i18n';
import type { OverlayImage } from '@/lib/types';

interface OverlayImageEditorProps {
  overlay: OverlayImage;
  containerWidth: number;
  containerHeight: number;
  canvasWidth: number;
  canvasHeight: number;
}

export function OverlayImageEditor({
  overlay,
  containerWidth,
  containerHeight,
  canvasWidth,
  canvasHeight,
}: OverlayImageEditorProps) {
  const { state, dispatch } = useCanvasState();
  const { t } = useI18n();
  const elementRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isDragging = useRef(false);
  const isResizing = useRef(false);
  const isRotating = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const startOverlay = useRef({ x: 0, y: 0, width: 0, height: 0, rotation: 0 });

  const [isEditing, setIsEditing] = useState(false);
  const [textValue, setTextValue] = useState(overlay.text?.content || '');

  const isSelected = state.selectedOverlayId === overlay.id;

  // Scale factor between display and actual canvas
  const scaleX = containerWidth / canvasWidth;
  const scaleY = containerHeight / canvasHeight;

  // Convert percentage position to pixels
  const displayX = (overlay.x / 100) * containerWidth;
  const displayY = (overlay.y / 100) * containerHeight;
  const displayWidth = overlay.width * scaleX;
  const displayHeight = overlay.height * scaleY;

  // Sync text value when overlay changes
  useEffect(() => {
    setTextValue(overlay.text?.content || '');
  }, [overlay.text?.content]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSelect = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      dispatch({ type: 'SELECT_OVERLAY', payload: overlay.id });
    },
    [dispatch, overlay.id]
  );

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsEditing(true);
    },
    []
  );

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTextValue(e.target.value);
  }, []);

  const handleTextBlur = useCallback(() => {
    setIsEditing(false);
    dispatch({
      type: 'UPDATE_OVERLAY',
      payload: {
        id: overlay.id,
        updates: {
          text: textValue.trim()
            ? {
                content: textValue.trim(),
                fontSize: overlay.text?.fontSize || 16,
                color: overlay.text?.color || '#ffffff',
              }
            : undefined,
        },
      },
    });
  }, [dispatch, overlay.id, overlay.text?.fontSize, overlay.text?.color, textValue]);

  const handleTextKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleTextBlur();
      } else if (e.key === 'Escape') {
        setTextValue(overlay.text?.content || '');
        setIsEditing(false);
      }
      e.stopPropagation();
    },
    [handleTextBlur, overlay.text?.content]
  );

  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      if (isEditing) return;

      e.preventDefault();
      e.stopPropagation();
      dispatch({ type: 'SELECT_OVERLAY', payload: overlay.id });

      isDragging.current = true;
      startPos.current = { x: e.clientX, y: e.clientY };
      startOverlay.current = {
        x: overlay.x,
        y: overlay.y,
        width: overlay.width,
        height: overlay.height,
        rotation: overlay.rotation,
      };

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!isDragging.current) return;

        const deltaX = moveEvent.clientX - startPos.current.x;
        const deltaY = moveEvent.clientY - startPos.current.y;

        const newX = startOverlay.current.x + (deltaX / containerWidth) * 100;
        const newY = startOverlay.current.y + (deltaY / containerHeight) * 100;

        dispatch({
          type: 'UPDATE_OVERLAY',
          payload: {
            id: overlay.id,
            updates: {
              x: Math.max(0, Math.min(100, newX)),
              y: Math.max(0, Math.min(100, newY)),
            },
          },
        });
      };

      const handleMouseUp = () => {
        isDragging.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [dispatch, overlay.id, overlay.x, overlay.y, overlay.width, overlay.height, overlay.rotation, containerWidth, containerHeight, isEditing]
  );

  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      isResizing.current = true;
      startPos.current = { x: e.clientX, y: e.clientY };
      startOverlay.current = {
        x: overlay.x,
        y: overlay.y,
        width: overlay.width,
        height: overlay.height,
        rotation: overlay.rotation,
      };

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!isResizing.current) return;

        const deltaX = moveEvent.clientX - startPos.current.x;
        const deltaY = moveEvent.clientY - startPos.current.y;

        // Account for rotation when calculating resize
        const angle = (overlay.rotation * Math.PI) / 180;
        const rotatedDeltaX = deltaX * Math.cos(angle) + deltaY * Math.sin(angle);

        const scaledDelta = rotatedDeltaX / scaleX;
        const newWidth = Math.max(30, startOverlay.current.width + scaledDelta);
        const newHeight = newWidth / overlay.aspectRatio;

        dispatch({
          type: 'UPDATE_OVERLAY',
          payload: {
            id: overlay.id,
            updates: { width: newWidth, height: newHeight },
          },
        });
      };

      const handleMouseUp = () => {
        isResizing.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [dispatch, overlay.id, overlay.width, overlay.height, overlay.aspectRatio, overlay.rotation, scaleX]
  );

  const handleRotateStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      isRotating.current = true;
      startOverlay.current = {
        x: overlay.x,
        y: overlay.y,
        width: overlay.width,
        height: overlay.height,
        rotation: overlay.rotation,
      };

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!isRotating.current || !elementRef.current) return;

        const rect = elementRef.current.getBoundingClientRect();
        const elementCenterX = rect.left + rect.width / 2;
        const elementCenterY = rect.top + rect.height / 2;

        // Calculate angle from center to mouse
        const angle = Math.atan2(
          moveEvent.clientY - elementCenterY,
          moveEvent.clientX - elementCenterX
        );

        // Convert to degrees and add 90 (since handle is at top)
        let degrees = (angle * 180) / Math.PI + 90;

        // Snap to 15 degree increments when holding shift
        if (moveEvent.shiftKey) {
          degrees = Math.round(degrees / 15) * 15;
        }

        dispatch({
          type: 'UPDATE_OVERLAY',
          payload: {
            id: overlay.id,
            updates: { rotation: degrees },
          },
        });
      };

      const handleMouseUp = () => {
        isRotating.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [dispatch, overlay.id, overlay.x, overlay.y, overlay.width, overlay.height, overlay.rotation]
  );

  // Handle keyboard delete
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (isEditing) return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        dispatch({ type: 'REMOVE_OVERLAY', payload: overlay.id });
      }
    },
    [dispatch, overlay.id, isEditing]
  );

  // Calculate resize cursor based on rotation
  const getResizeCursor = () => {
    const angle = ((overlay.rotation % 360) + 360) % 360;
    if (angle >= 337.5 || angle < 22.5) return 'se-resize';
    if (angle >= 22.5 && angle < 67.5) return 's-resize';
    if (angle >= 67.5 && angle < 112.5) return 'sw-resize';
    if (angle >= 112.5 && angle < 157.5) return 'w-resize';
    if (angle >= 157.5 && angle < 202.5) return 'nw-resize';
    if (angle >= 202.5 && angle < 247.5) return 'n-resize';
    if (angle >= 247.5 && angle < 292.5) return 'ne-resize';
    return 'e-resize';
  };

  // Calculate font size based on overlay size
  const displayFontSize = Math.max(10, Math.min(displayWidth, displayHeight) * 0.15);

  return (
    <div
      ref={elementRef}
      tabIndex={0}
      onClick={handleSelect}
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleDragStart}
      onKeyDown={handleKeyDown}
      style={{
        position: 'absolute',
        left: displayX - displayWidth / 2,
        top: displayY - displayHeight / 2,
        width: displayWidth,
        height: displayHeight,
        transform: `rotate(${overlay.rotation}deg)`,
        transformOrigin: 'center center',
        cursor: isEditing ? 'text' : 'grab',
        outline: 'none',
      }}
      className={`${isSelected ? 'z-10' : 'z-0'}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={overlay.element.src}
        alt="Overlay"
        className="pointer-events-none h-full w-full select-none object-contain"
        draggable={false}
      />

      {/* Text overlay */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={textValue}
            onChange={handleTextChange}
            onBlur={handleTextBlur}
            onKeyDown={handleTextKeyDown}
            className="pointer-events-auto w-4/5 bg-transparent text-center font-bold text-white outline-none"
            style={{
              fontSize: displayFontSize,
              textShadow: '0 2px 4px rgba(0,0,0,0.8)',
            }}
            placeholder={t('enterText')}
          />
        ) : overlay.text?.content ? (
          <span
            className="select-none text-center font-bold"
            style={{
              fontSize: displayFontSize,
              color: overlay.text.color,
              textShadow: '0 2px 4px rgba(0,0,0,0.8)',
              maxWidth: '90%',
              wordBreak: 'break-word',
            }}
          >
            {overlay.text.content}
          </span>
        ) : null}
      </div>

      {/* Selection border and handles */}
      {isSelected && !isEditing && (
        <>
          <div className="pointer-events-none absolute inset-0 border-2 border-dashed border-blue-500" />

          {/* Rotation handle - top center */}
          <div
            className="absolute -top-8 left-1/2 flex -translate-x-1/2 flex-col items-center"
            style={{ pointerEvents: 'auto' }}
          >
            {/* Line connecting to element */}
            <div className="h-4 w-0.5 bg-blue-500" />
            {/* Rotation handle */}
            <div
              onMouseDown={handleRotateStart}
              className="flex h-5 w-5 cursor-grab items-center justify-center rounded-full border-2 border-blue-500 bg-white hover:bg-blue-100"
              title="Drag to rotate (Shift for 15° snap)"
            >
              <svg
                className="h-3 w-3 text-blue-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </div>

          {/* Resize handle - bottom right */}
          <div
            onMouseDown={handleResizeStart}
            className="absolute -bottom-2 -right-2 h-5 w-5 rounded-full border-2 border-blue-500 bg-white hover:bg-blue-100"
            style={{
              pointerEvents: 'auto',
              cursor: getResizeCursor(),
            }}
          />
        </>
      )}

      {/* Double-click hint when selected but no text */}
      {isSelected && !isEditing && !overlay.text?.content && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="text-xs text-white/50">{t('doubleClickToAddText')}</span>
        </div>
      )}
    </div>
  );
}
