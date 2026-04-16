import { getContainPlacement } from './inpaint';

export function drawMainImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number
) {
  const { drawWidth, drawHeight, drawX, drawY } = getContainPlacement(
    img.width,
    img.height,
    canvasWidth,
    canvasHeight
  );

  ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
}

export function clearCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  ctx.clearRect(0, 0, width, height);
}

export function fillBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string = '#ffffff'
) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
}
