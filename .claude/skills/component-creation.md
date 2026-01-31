# Component Creation Pattern

## Basic Component Structure

```typescript
interface ComponentProps {
  // Props 정의
}

export function Component({ prop1, prop2 }: ComponentProps) {
  // Hooks
  // Event handlers
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

## UI Component Pattern

```typescript
// components/ui/Button.tsx
import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-zinc-200 text-zinc-900 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-white',
    ghost: 'hover:bg-zinc-100 dark:hover:bg-zinc-800',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

## Editor Component Pattern

```typescript
// components/editor/FeatureComponent.tsx
'use client';

import { useCanvasState } from '@/hooks/useCanvasState';

export function FeatureComponent() {
  const { state, dispatch } = useCanvasState();

  const handleChange = (value: string) => {
    dispatch({ type: 'SET_SOMETHING', payload: value });
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
    </div>
  );
}
```

## File Naming

- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Utils: `camelCase.ts`
- Types: `types.ts` (모듈별)
