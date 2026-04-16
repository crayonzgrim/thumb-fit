export interface ImagePlacement {
  drawWidth: number;
  drawHeight: number;
  drawX: number;
  drawY: number;
}

export function getContainPlacement(
  imageWidth: number,
  imageHeight: number,
  canvasWidth: number,
  canvasHeight: number
): ImagePlacement {
  const scale = Math.min(canvasWidth / imageWidth, canvasHeight / imageHeight);

  return {
    drawWidth: imageWidth * scale,
    drawHeight: imageHeight * scale,
    drawX: (canvasWidth - imageWidth * scale) / 2,
    drawY: (canvasHeight - imageHeight * scale) / 2,
  };
}

/**
 * 배경 영역만 하얀색, 이미지 영역은 검은색인 마스크 생성
 */
export function generateInpaintMask(
  img: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number,
  format: 'image/png' | 'image/jpeg' = 'image/png'
): string {
  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = canvasWidth;
  maskCanvas.height = canvasHeight;

  const ctx = maskCanvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // 전체 배경을 흰색(255, 255, 255)으로 채우기
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  const { drawWidth, drawHeight, drawX, drawY } = getContainPlacement(
    img.width,
    img.height,
    canvasWidth,
    canvasHeight
  );

  // 이미지 영역을 검은색(0, 0, 0)으로 채우기
  ctx.fillStyle = '#000000';
  ctx.fillRect(drawX, drawY, drawWidth, drawHeight);

  return maskCanvas.toDataURL(format);
}

/**
 * 캔버스를 이미지 URL로 변환
 */
export function canvasToDataUrl(
  canvas: HTMLCanvasElement,
  format: 'image/png' | 'image/jpeg' = 'image/jpeg'
): string {
  return canvas.toDataURL(format, format === 'image/jpeg' ? 0.95 : 1);
}

/**
 * 이미지를 canvas에 그리기
 */
export function drawImageOnCanvas(
  ctx: CanvasRenderingContext2D,
  imageUrl: string,
  canvas: HTMLCanvasElement
): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve();
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = imageUrl;
  });
}
