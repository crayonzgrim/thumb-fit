import type { TextSettings } from '@/lib/types';

export function drawText(
  ctx: CanvasRenderingContext2D,
  text: TextSettings,
  canvasWidth: number,
  canvasHeight: number
) {
  if (!text.content.trim()) return;

  // Split text into lines for multi-line support
  const lines = text.content.split('\n');
  const lineHeight = text.fontSize * 1.2;

  // Calculate position - center by default, offset moves from center
  const baseX = canvasWidth / 2;
  const baseY = canvasHeight / 2;
  const offsetX = (text.positionOffsetX / 100) * canvasWidth;
  const offsetY = (text.positionOffsetY / 100) * canvasHeight;
  const x = baseX + offsetX;
  const totalHeight = lines.length * lineHeight;

  // Center the text block vertically around the position
  const startY = baseY + offsetY - (totalHeight / 2) + (lineHeight / 2);

  ctx.save();

  // Apply rotation from center of text block
  if (text.rotation !== 0) {
    ctx.translate(x, baseY + offsetY);
    ctx.rotate((text.rotation * Math.PI) / 180);
    ctx.translate(-x, -(baseY + offsetY));
  }

  // Build font string based on style
  const fontWeight = text.style.bold ? 'bold' : 'normal';
  const fontStyle = text.style.italic ? 'italic' : 'normal';
  ctx.font = `${fontStyle} ${fontWeight} ${text.fontSize}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Calculate max text width for background
  let maxWidth = 0;
  for (const line of lines) {
    const metrics = ctx.measureText(line);
    maxWidth = Math.max(maxWidth, metrics.width);
  }
  // Draw background if enabled
  if (text.background.enabled) {
    ctx.fillStyle = text.background.color + 'cc'; // Add some transparency
    const bgPaddingX = text.background.paddingX;
    const bgPaddingY = text.background.paddingY;
    const bgStartY = startY - lineHeight / 2 - bgPaddingY;
    const bgHeight = totalHeight + bgPaddingY * 2;
    ctx.fillRect(
      x - maxWidth / 2 - bgPaddingX,
      bgStartY,
      maxWidth + bgPaddingX * 2,
      bgHeight
    );
  }

  // Apply shadow if enabled
  if (text.shadow.enabled) {
    ctx.shadowColor = text.shadow.color;
    ctx.shadowBlur = text.shadow.blur;
    ctx.shadowOffsetX = text.shadow.offsetX;
    ctx.shadowOffsetY = text.shadow.offsetY;
  } else {
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }

  // Draw each line
  ctx.fillStyle = text.color;
  lines.forEach((line, index) => {
    const y = startY + index * lineHeight;
    ctx.fillText(line, x, y);

    // Draw underline and strikethrough decorations
    if (text.style.underline || text.style.strikethrough) {
      const metrics = ctx.measureText(line);
      const lineWidth = metrics.width;
      const lineThickness = Math.max(2, text.fontSize / 20);

      ctx.save();
      ctx.strokeStyle = text.color;
      ctx.lineWidth = lineThickness;

      // Underline
      if (text.style.underline) {
        const underlineY = y + text.fontSize * 0.35;
        ctx.beginPath();
        ctx.moveTo(x - lineWidth / 2, underlineY);
        ctx.lineTo(x + lineWidth / 2, underlineY);
        ctx.stroke();
      }

      // Strikethrough
      if (text.style.strikethrough) {
        const strikeY = y;
        ctx.beginPath();
        ctx.moveTo(x - lineWidth / 2, strikeY);
        ctx.lineTo(x + lineWidth / 2, strikeY);
        ctx.stroke();
      }

      ctx.restore();
    }
  });

  ctx.restore();
}
