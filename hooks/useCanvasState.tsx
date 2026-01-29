'use client';

import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  Dispatch,
} from 'react';
import type { CanvasState, CanvasAction } from '@/lib/types';
import { INITIAL_STATE } from '@/lib/constants';

function canvasReducer(state: CanvasState, action: CanvasAction): CanvasState {
  switch (action.type) {
    case 'SET_RATIO':
      return { ...state, ratio: action.payload };
    case 'SET_IMAGE':
      return { ...state, image: { ...state.image, ...action.payload } };
    case 'SET_TEXT':
      return { ...state, text: { ...state.text, ...action.payload } };
    case 'SET_TEMPLATE':
      return { ...state, selectedTemplateId: action.payload };
    case 'ADD_OVERLAY':
      return { ...state, overlayImages: [...state.overlayImages, action.payload] };
    case 'UPDATE_OVERLAY':
      return {
        ...state,
        overlayImages: state.overlayImages.map((img) =>
          img.id === action.payload.id ? { ...img, ...action.payload.updates } : img
        ),
      };
    case 'REMOVE_OVERLAY':
      return {
        ...state,
        overlayImages: state.overlayImages.filter((img) => img.id !== action.payload),
        selectedOverlayId: state.selectedOverlayId === action.payload ? null : state.selectedOverlayId,
      };
    case 'SELECT_OVERLAY':
      return { ...state, selectedOverlayId: action.payload };
    case 'RESET':
      return INITIAL_STATE;
    default:
      return state;
  }
}

interface CanvasContextValue {
  state: CanvasState;
  dispatch: Dispatch<CanvasAction>;
}

const CanvasContext = createContext<CanvasContextValue | null>(null);

export function CanvasProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(canvasReducer, INITIAL_STATE);

  return (
    <CanvasContext.Provider value={{ state, dispatch }}>
      {children}
    </CanvasContext.Provider>
  );
}

export function useCanvasState() {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error('useCanvasState must be used within CanvasProvider');
  }
  return context;
}
