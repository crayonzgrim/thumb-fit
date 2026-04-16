export type CanvasRatio = '16:9' | '9:16' | '1:1';

export interface RatioConfig {
  label: string;
  width: number;
  height: number;
  platform: string;
}

export interface ImageState {
  file: File | null;
  element: HTMLImageElement | null;
  isLoading: boolean;
  error: string | null;
  backgroundMode: 'blur' | 'ai';
}

export interface TextShadow {
  enabled: boolean;
  color: string;
  blur: number;
  offsetX: number;
  offsetY: number;
}

export interface TextBackground {
  enabled: boolean;
  color: string;
  paddingX: number; // Horizontal padding
  paddingY: number; // Vertical padding
}

export interface TextStyle {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
}

export interface TextSettings {
  content: string;
  fontSize: number;
  color: string;
  style: TextStyle;
  positionOffsetX: number; // Horizontal position (-50 to 50)
  positionOffsetY: number; // Vertical position (-50 to 50)
  rotation: number; // Text rotation in degrees (-180 to 180)
  background: TextBackground;
  shadow: TextShadow;
}

export interface Template {
  id: string;
  name: string;
  nameKo: string;
  thumbnail: string;
  text: Partial<TextSettings>;
  ratio?: CanvasRatio;
}

export interface OverlayText {
  content: string;
  fontSize: number;
  color: string;
}

export interface OverlayImage {
  id: string;
  element: HTMLImageElement;
  x: number; // position as percentage (0-100)
  y: number;
  width: number; // size in pixels
  height: number;
  aspectRatio: number;
  rotation: number; // rotation in degrees
  text?: OverlayText;
}

export interface CanvasState {
  ratio: CanvasRatio;
  image: ImageState;
  text: TextSettings;
  selectedTemplateId: string | null;
  overlayImages: OverlayImage[];
  selectedOverlayId: string | null;
}

export type CanvasAction =
  | { type: 'SET_RATIO'; payload: CanvasRatio }
  | { type: 'SET_IMAGE'; payload: Partial<ImageState> }
  | { type: 'SET_TEXT'; payload: Partial<TextSettings> }
  | { type: 'SET_TEMPLATE'; payload: string | null }
  | { type: 'ADD_OVERLAY'; payload: OverlayImage }
  | { type: 'UPDATE_OVERLAY'; payload: { id: string; updates: Partial<OverlayImage> } }
  | { type: 'REMOVE_OVERLAY'; payload: string }
  | { type: 'REORDER_OVERLAY'; payload: { fromIndex: number; toIndex: number } }
  | { type: 'SELECT_OVERLAY'; payload: string | null }
  | { type: 'RESET' };

export type ExportFormat = 'png' | 'jpeg';
