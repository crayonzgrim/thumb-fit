import type { CanvasRatio, RatioConfig, CanvasState, Template } from './types';

export const CANVAS_RATIOS: Record<CanvasRatio, RatioConfig> = {
  '16:9': {
    label: 'YouTube',
    width: 1920,
    height: 1080,
    platform: 'YouTube Thumbnail',
  },
  '9:16': {
    label: 'Stories',
    width: 1080,
    height: 1920,
    platform: 'Instagram/TikTok Stories',
  },
  '1:1': {
    label: 'Square',
    width: 1080,
    height: 1080,
    platform: 'Instagram Post',
  },
};

export const DEFAULT_SHADOW = {
  enabled: true,
  color: 'rgba(0, 0, 0, 0.7)',
  blur: 8,
  offsetX: 2,
  offsetY: 2,
} as const;

export const DEFAULT_TEXT_BACKGROUND = {
  enabled: false,
  color: '#000000',
  paddingX: 20,
  paddingY: 10,
} as const;

export const DEFAULT_TEXT_STYLE = {
  bold: true,
  italic: false,
  underline: false,
  strikethrough: false,
} as const;

export const INITIAL_STATE: CanvasState = {
  ratio: '16:9',
  image: {
    file: null,
    element: null,
    isLoading: false,
    error: null,
    blurBackground: true,
  },
  text: {
    content: '',
    fontSize: 48,
    color: '#ffffff',
    style: { ...DEFAULT_TEXT_STYLE },
    positionOffsetX: 0,
    positionOffsetY: 0,
    rotation: 0,
    background: { ...DEFAULT_TEXT_BACKGROUND },
    shadow: { ...DEFAULT_SHADOW },
  },
  selectedTemplateId: null,
  overlayImages: [],
  selectedOverlayId: null,
};

export const DEFAULT_OVERLAY_SIZE = 150; // default overlay size in pixels

export const BLUR_AMOUNT = 30;

export const FONT_SIZE_RANGE = {
  min: 16,
  max: 256,
  step: 4,
} as const;

export const POSITION_OFFSET_X_RANGE = {
  min: -50,
  max: 50,
  step: 1,
} as const;

export const POSITION_OFFSET_Y_RANGE = {
  min: -50,
  max: 50,
  step: 1,
} as const;

export const TEXT_BG_PADDING_X_RANGE = {
  min: 0,
  max: 1000,
  step: 10,
} as const;

export const TEXT_BG_PADDING_Y_RANGE = {
  min: 0,
  max: 500,
  step: 10,
} as const;

export const SHADOW_BLUR_RANGE = {
  min: 0,
  max: 30,
  step: 1,
} as const;

export const ROTATION_RANGE = {
  min: -180,
  max: 180,
  step: 1,
} as const;

export const TEMPLATES: Template[] = [
  {
    id: 'bold-youtube',
    name: 'Bold YouTube',
    nameKo: '유튜브 볼드',
    thumbnail: '🎬',
    text: {
      fontSize: 72,
      color: '#ffffff',
      positionOffsetX: 0,
      positionOffsetY: 30,
      rotation: 0,
      background: { enabled: true, color: '#000000', paddingX: 30, paddingY: 15 },
      shadow: { enabled: true, color: '#000000', blur: 12, offsetX: 4, offsetY: 4 },
    },
    ratio: '16:9',
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    nameKo: '미니멀 클린',
    thumbnail: '✨',
    text: {
      fontSize: 48,
      color: '#ffffff',
      positionOffsetX: 0,
      positionOffsetY: 0,
      rotation: 0,
      background: { enabled: false, color: '#000000', paddingX: 20, paddingY: 10 },
      shadow: { enabled: true, color: 'rgba(0,0,0,0.5)', blur: 20, offsetX: 0, offsetY: 0 },
    },
  },
  {
    id: 'vibrant-stories',
    name: 'Vibrant Stories',
    nameKo: '바이브런트 스토리',
    thumbnail: '🌈',
    text: {
      fontSize: 56,
      color: '#f97316',
      positionOffsetX: 0,
      positionOffsetY: 25,
      rotation: 0,
      background: { enabled: true, color: '#000000', paddingX: 25, paddingY: 12 },
      shadow: { enabled: true, color: '#000000', blur: 6, offsetX: 2, offsetY: 2 },
    },
    ratio: '9:16',
  },
  {
    id: 'instagram-pop',
    name: 'Instagram Pop',
    nameKo: '인스타그램 팝',
    thumbnail: '📸',
    text: {
      fontSize: 64,
      color: '#ec4899',
      positionOffsetX: 0,
      positionOffsetY: -30,
      rotation: 0,
      background: { enabled: false, color: '#000000', paddingX: 20, paddingY: 10 },
      shadow: { enabled: true, color: '#000000', blur: 10, offsetX: 3, offsetY: 3 },
    },
    ratio: '1:1',
  },
  {
    id: 'gaming-style',
    name: 'Gaming Style',
    nameKo: '게이밍 스타일',
    thumbnail: '🎮',
    text: {
      fontSize: 80,
      color: '#22c55e',
      positionOffsetX: 0,
      positionOffsetY: 20,
      rotation: -5,
      background: { enabled: true, color: '#000000', paddingX: 40, paddingY: 20 },
      shadow: { enabled: true, color: '#22c55e', blur: 15, offsetX: 0, offsetY: 0 },
    },
    ratio: '16:9',
  },
  {
    id: 'elegant-dark',
    name: 'Elegant Dark',
    nameKo: '엘레강트 다크',
    thumbnail: '🌙',
    text: {
      fontSize: 52,
      color: '#f5f5f5',
      positionOffsetX: 0,
      positionOffsetY: 35,
      rotation: 0,
      background: { enabled: false, color: '#000000', paddingX: 20, paddingY: 10 },
      shadow: { enabled: true, color: 'rgba(0,0,0,0.9)', blur: 25, offsetX: 0, offsetY: 5 },
    },
  },
];
