'use client';

import { useCallback } from 'react';
import type { ExportFormat } from '@/lib/types';

interface UseExportOptions {
  getCanvas: () => HTMLCanvasElement | null;
}

export function useExport({ getCanvas }: UseExportOptions) {
  const exportImage = useCallback(
    (format: ExportFormat = 'png', quality: number = 0.92) => {
      const canvas = getCanvas();
      if (!canvas) return;

      const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
      const extension = format === 'jpeg' ? 'jpg' : 'png';

      canvas.toBlob(
        (blob) => {
          if (!blob) return;

          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `thumbnail-${Date.now()}.${extension}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        },
        mimeType,
        quality
      );
    },
    [getCanvas]
  );

  return { exportImage };
}
