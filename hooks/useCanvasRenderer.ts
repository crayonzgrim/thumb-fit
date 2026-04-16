'use client';

import { useEffect, RefObject } from 'react';
import type { CanvasState, OverlayImage } from '@/lib/types';
import { CANVAS_RATIOS } from '@/lib/constants';
import { drawBlurBackground } from '@/lib/canvas/blur';
import { drawMainImage, clearCanvas } from '@/lib/canvas/draw';
import { drawText } from '@/lib/canvas/text';

interface UseCanvasRendererOptions {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  state: CanvasState;
}

function drawOverlayImage(
  ctx: CanvasRenderingContext2D,
  overlay: OverlayImage,
  canvasWidth: number,
  canvasHeight: number
) {
  // Convert percentage position to canvas pixels
  const centerX = (overlay.x / 100) * canvasWidth;
  const centerY = (overlay.y / 100) * canvasHeight;

  // Save context state
  ctx.save();

  // Move to center, rotate, then draw
  ctx.translate(centerX, centerY);
  ctx.rotate((overlay.rotation * Math.PI) / 180);

  // Draw image centered at origin (after translation)
  ctx.drawImage(
    overlay.element,
    -overlay.width / 2,
    -overlay.height / 2,
    overlay.width,
    overlay.height
  );

  // Draw text if exists
  if (overlay.text?.content) {
    const fontSize = Math.max(12, Math.min(overlay.width, overlay.height) * 0.15);

    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
    ctx.fillStyle = overlay.text.color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Text shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;

    ctx.fillText(overlay.text.content, 0, 0);

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }

  // Restore context state
  ctx.restore();
}

export function useCanvasRenderer({ canvasRef, state }: UseCanvasRendererOptions) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const config = CANVAS_RATIOS[state.ratio];

    // Set canvas resolution
    canvas.width = config.width;
    canvas.height = config.height;

    // Clear canvas (transparent background)
    clearCanvas(ctx, config.width, config.height);

    // Draw image layers if image is loaded
    if (state.image.element) {
      if (state.image.backgroundMode === 'blur') {
        drawBlurBackground(ctx, state.image.element, config.width, config.height);
      }
      drawMainImage(ctx, state.image.element, config.width, config.height);
    }

    // Draw overlay images
    state.overlayImages.forEach((overlay) => {
      drawOverlayImage(ctx, overlay, config.width, config.height);
    });

    // Draw text overlay (on top of everything)
    drawText(ctx, state.text, config.width, config.height);
  }, [canvasRef, state]);
}
