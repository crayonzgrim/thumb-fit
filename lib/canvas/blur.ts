import { BLUR_AMOUNT } from '@/lib/constants';

export function drawBlurBackground(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number
) {
  ctx.save();

  // Calculate cover dimensions
  const imgRatio = img.width / img.height;
  const canvasRatio = canvasWidth / canvasHeight;

  let drawWidth: number;
  let drawHeight: number;
  let drawX: number;
  let drawY: number;

  if (imgRatio > canvasRatio) {
    // Image is wider - fit height
    drawHeight = canvasHeight;
    drawWidth = drawHeight * imgRatio;
    drawX = (canvasWidth - drawWidth) / 2;
    drawY = 0;
  } else {
    // Image is taller - fit width
    drawWidth = canvasWidth;
    drawHeight = drawWidth / imgRatio;
    drawX = 0;
    drawY = (canvasHeight - drawHeight) / 2;
  }

  // Apply blur filter
  ctx.filter = `blur(${BLUR_AMOUNT}px)`;

  // Scale up slightly to avoid blur edges showing
  const scale = 1.1;
  const scaledWidth = drawWidth * scale;
  const scaledHeight = drawHeight * scale;
  const scaledX = drawX - (scaledWidth - drawWidth) / 2;
  const scaledY = drawY - (scaledHeight - drawHeight) / 2;

  ctx.drawImage(img, scaledX, scaledY, scaledWidth, scaledHeight);

  ctx.filter = 'none';
  ctx.restore();
}
