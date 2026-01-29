export function drawMainImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number
) {
  // Calculate contain dimensions
  const scale = Math.min(canvasWidth / img.width, canvasHeight / img.height);
  const drawWidth = img.width * scale;
  const drawHeight = img.height * scale;
  const drawX = (canvasWidth - drawWidth) / 2;
  const drawY = (canvasHeight - drawHeight) / 2;

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
