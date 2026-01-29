'use client';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  // Convert rgba to hex for the color input if needed
  const displayValue = value.startsWith('rgba') ? '#000000' : value;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {label}
        </label>
      )}
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={displayValue}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-16 cursor-pointer rounded-lg border border-zinc-300 bg-transparent p-1 dark:border-zinc-600"
        />
        <span className="text-sm font-mono text-zinc-500 dark:text-zinc-400">
          {displayValue.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
