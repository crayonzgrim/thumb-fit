# State Management Pattern

## useReducer Pattern

```typescript
// hooks/useCanvasState.ts
import { useReducer, createContext, useContext, ReactNode } from 'react';

// Types
type CanvasRatio = '16:9' | '9:16' | '1:1';

interface CanvasState {
  ratio: CanvasRatio;
  image: {
    file: File | null;
    element: HTMLImageElement | null;
    isLoading: boolean;
    error: string | null;
  };
  text: {
    content: string;
    fontSize: number;
    color: string;
    position: 'top' | 'center' | 'bottom';
    backgroundColor: string | null;
  };
}

// Actions
type Action =
  | { type: 'SET_RATIO'; payload: CanvasRatio }
  | { type: 'SET_IMAGE'; payload: Partial<CanvasState['image']> }
  | { type: 'SET_TEXT'; payload: Partial<CanvasState['text']> }
  | { type: 'RESET' };

// Initial State
const initialState: CanvasState = {
  ratio: '16:9',
  image: {
    file: null,
    element: null,
    isLoading: false,
    error: null,
  },
  text: {
    content: '',
    fontSize: 48,
    color: '#ffffff',
    position: 'center',
    backgroundColor: null,
  },
};

// Reducer
function canvasReducer(state: CanvasState, action: Action): CanvasState {
  switch (action.type) {
    case 'SET_RATIO':
      return { ...state, ratio: action.payload };
    case 'SET_IMAGE':
      return { ...state, image: { ...state.image, ...action.payload } };
    case 'SET_TEXT':
      return { ...state, text: { ...state.text, ...action.payload } };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}
```

## Context Pattern

```typescript
// Context
interface CanvasContextValue {
  state: CanvasState;
  dispatch: React.Dispatch<Action>;
}

const CanvasContext = createContext<CanvasContextValue | null>(null);

// Provider
export function CanvasProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(canvasReducer, initialState);

  return (
    <CanvasContext.Provider value={{ state, dispatch }}>
      {children}
    </CanvasContext.Provider>
  );
}

// Hook
export function useCanvasState() {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error('useCanvasState must be used within CanvasProvider');
  }
  return context;
}
```

## Usage in Components

```typescript
// In component
function RatioSelector() {
  const { state, dispatch } = useCanvasState();

  return (
    <div>
      {(['16:9', '9:16', '1:1'] as const).map((ratio) => (
        <button
          key={ratio}
          onClick={() => dispatch({ type: 'SET_RATIO', payload: ratio })}
          className={state.ratio === ratio ? 'active' : ''}
        >
          {ratio}
        </button>
      ))}
    </div>
  );
}
```
