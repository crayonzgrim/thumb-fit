'use client';

import { InputHTMLAttributes } from 'react';

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  showValue?: boolean;
}

export function Slider({
  label,
  showValue = true,
  className = '',
  value,
  ...props
}: SliderProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {label}
            </label>
          )}
          {showValue && (
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {value}
            </span>
          )}
        </div>
      )}
      <input
        type="range"
        value={value}
        className={`h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-200 accent-blue-600 dark:bg-zinc-700 ${className}`}
        {...props}
      />
    </div>
  );
}
