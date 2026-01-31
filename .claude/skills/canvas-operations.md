# Canvas Operations Guide

## Canvas Context Setup

```typescript
const canvas = canvasRef.current;
const ctx = canvas.getContext('2d');
if (!ctx) return;

// Clear canvas
ctx.clearRect(0, 0, canvas.width, canvas.height);
```

## Drawing Pipeline

1. **Clear Canvas** - 이전 프레임 제거
2. **Draw Blur Background** - 블러 처리된 이미지를 배경으로
3. **Draw Main Image** - 원본 이미지를 중앙에 (contain 모드)
4. **Draw Text Overlay** - 텍스트 레이어 렌더링

## Blur Background Pattern

```typescript
// 임시 캔버스에서 블러 처리
ctx.filter = 'blur(30px)';
ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // cover 모드
ctx.filter = 'none';
```

## Image Contain Mode

```typescript
function drawContain(ctx, img, canvasW, canvasH) {
  const scale = Math.min(canvasW / img.width, canvasH / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  const x = (canvasW - w) / 2;
  const y = (canvasH - h) / 2;
  ctx.drawImage(img, x, y, w, h);
}
```

## Text Drawing

```typescript
ctx.font = `${fontSize}px sans-serif`;
ctx.fillStyle = color;
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

// Shadow for readability
ctx.shadowColor = 'rgba(0,0,0,0.5)';
ctx.shadowBlur = 4;
ctx.shadowOffsetX = 2;
ctx.shadowOffsetY = 2;

ctx.fillText(text, x, y);
```

## Export Pattern

```typescript
canvas.toBlob((blob) => {
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `thumbnail.${format}`;
  a.click();
  URL.revokeObjectURL(url);
}, `image/${format}`, quality);
```
