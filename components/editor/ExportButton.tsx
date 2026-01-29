'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';
import type { ExportFormat } from '@/lib/types';

interface ExportButtonProps {
  onExport: (format: ExportFormat) => void;
}

export function ExportButton({ onExport }: ExportButtonProps) {
  const [format, setFormat] = useState<ExportFormat>('png');
  const { t } = useI18n();

  return (
    <div className="flex items-center gap-3">
      <select
        value={format}
        onChange={(e) => setFormat(e.target.value as ExportFormat)}
        className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
      >
        <option value="png">{t('png')}</option>
        <option value="jpeg">{t('jpeg')}</option>
      </select>
      <Button onClick={() => onExport(format)} className="flex-1">
        {t('download')}
      </Button>
    </div>
  );
}
