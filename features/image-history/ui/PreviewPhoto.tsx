'use client';

import { useSyncExternalStore } from 'react';
import { Eye } from 'lucide-react';
import { FileElement } from '@/entities/image';
import { useAppearance } from '@/shared/ui/appearance-provider';
import { ActionHint } from '@/shared/ui/action-hint';
import { Button } from '@/shared/ui/button';

export function PreviewPhoto({ file }: { file: FileElement }) {
  const { tr } = useAppearance();
  useSyncExternalStore(file.subscribe, file.getSnapshot, file.getServerSnapshot);
  const label = file.isPreviewing ? tr('Вернуться к результату', 'Return to result') : tr('Предпросмотр оригинала', 'Preview original');
  return <ActionHint label={label}><Button variant="outline" size="icon" className="editor-preview-toggle" aria-label={label} aria-pressed={file.isPreviewing} disabled={file.isEmpty() || file.isOriginal || file.isProcessing} onClick={() => void file.togglePreview()}><Eye /><span className="editor-mobile-action-label">{file.isPreviewing ? tr('Результат', 'Result') : tr('Оригинал', 'Original')}</span></Button></ActionHint>;
}
