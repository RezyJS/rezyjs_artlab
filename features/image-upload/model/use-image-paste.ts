'use client';

import { useEffect } from 'react';
import { FileElement } from '@/entities/image';
import { useAppearance } from '@/shared/ui/appearance-provider';
import { notify } from '@/shared/ui/sonner';
import { importPhoto } from '../lib/import-photo';

/** Use the user-initiated paste event; never request general clipboard access. */
export function useImagePaste(file: FileElement) {
  const { tr } = useAppearance();
  useEffect(() => {
    const paste = (event: ClipboardEvent) => {
      const target = event.target instanceof Element ? event.target : document.activeElement;
      if (event.defaultPrevented || file.isProcessing || target?.closest('input, textarea, [contenteditable]:not([contenteditable="false"]), [role="textbox"]') || document.querySelector('[role="dialog"][data-state="open"]')) return;
      const items = Array.from(event.clipboardData?.items ?? []);
      const image = items.find(item => item.kind === 'file' && item.type.startsWith('image/'))?.getAsFile()
        ?? Array.from(event.clipboardData?.files ?? []).find(item => item.type.startsWith('image/') || /\.(heic|heif)$/i.test(item.name));
      if (!image) return;
      event.preventDefault();
      void importPhoto(image, file).then(loaded => { if (loaded) notify.success(tr('Изображение вставлено', 'Image pasted')); });
    };
    document.addEventListener('paste', paste);
    return () => document.removeEventListener('paste', paste);
  }, [file, tr]);
}
