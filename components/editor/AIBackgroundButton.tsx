'use client';

import { useState } from 'react';
import { useCanvasState } from '@/hooks/useCanvasState';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';
import {
  generateInpaintMask,
  canvasToDataUrl,
  getContainPlacement,
} from '@/lib/canvas/inpaint';
import { CANVAS_RATIOS } from '@/lib/constants';

const BACKGROUND_EXTENSION_PROMPT = [
  'Extend only the missing background outside the original image.',
  'Preserve the original image content exactly as-is.',
  'Do not crop, redraw, alter, or replace the main subject, people, objects, text, logos, or typography inside the original image.',
  'Fill only the masked empty area with a natural continuation of the existing background, matching lighting, perspective, texture, and colors.',
  'Keep the result seamless and photorealistic.',
].join(' ');

export function AIBackgroundButton() {
  const { state, dispatch } = useCanvasState();
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!state.image.element) return null;

  const handleGenerateBackground = async () => {
    if (!state.image.element) return;

    setIsLoading(true);
    setError(null);

    try {
      const config = CANVAS_RATIOS[state.ratio];

      // 마스크 이미지 생성 (배경만 흰색)
      const maskUrl = generateInpaintMask(
        state.image.element,
        config.width,
        config.height,
        'image/png'
      );

      // 현재 캔버스를 이미지로 변환 (원본 이미지만 포함)
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = config.width;
      tempCanvas.height = config.height;
      const ctx = tempCanvas.getContext('2d');

      if (!ctx) throw new Error('Failed to get canvas context');

      // 원본 내용이 잘리지 않도록 contain 기준으로 배치
      const { drawWidth, drawHeight, drawX, drawY } = getContainPlacement(
        state.image.element.width,
        state.image.element.height,
        config.width,
        config.height
      );

      ctx.drawImage(
        state.image.element,
        drawX,
        drawY,
        drawWidth,
        drawHeight
      );

      const imageUrl = canvasToDataUrl(tempCanvas, 'image/jpeg');

      // Replicate API 호출
      const response = await fetch('/api/generate-background', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl,
          maskUrl,
          prompt: BACKGROUND_EXTENSION_PROMPT,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        const errorMsg = data.error || data.detail || 'Failed to generate background';
        console.error('API Error Response:', data);
        throw new Error(errorMsg);
      }

      const data = await response.json();
      const generatedImageUrl = Array.isArray(data.imageUrl)
        ? data.imageUrl[0]
        : data.imageUrl;

      if (!generatedImageUrl) {
        throw new Error('No image returned from API');
      }

      // 생성된 이미지를 새로운 Image 객체로 로드
      const newImg = new Image();
      newImg.crossOrigin = 'anonymous';

      newImg.onload = () => {
        // 상태 업데이트: 새 이미지로 변경
        dispatch({
          type: 'SET_IMAGE',
          payload: {
            element: newImg,
          },
        });
      };

      newImg.onerror = () => {
        setError('Failed to load generated image');
      };

      newImg.src = generatedImageUrl;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('AI background generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleGenerateBackground}
        disabled={isLoading || !state.image.element}
        variant="primary"
        size="sm"
        className="w-full"
      >
        {isLoading ? `${t('loading')}...` : '✨ AI 배경 채우기'}
      </Button>
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
