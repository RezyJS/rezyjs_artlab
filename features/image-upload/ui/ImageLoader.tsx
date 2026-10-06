/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useSyncExternalStore, type CSSProperties, type RefObject } from 'react';
import { LoaderCircle, Upload } from 'lucide-react';
import { FileElement } from '@/entities/image';
import { useAppearance } from '@/shared/ui/appearance-provider';
import { notify } from '@/shared/ui/sonner';
import { Kbd } from '@/shared/ui/kbd';
import { importPhoto } from '../lib/import-photo';

export default function ImageLoader({ file, desktop = false, inputRef, imageStyle, interactive = false }: { file: FileElement; desktop?: boolean; inputRef?: RefObject<HTMLInputElement | null>; imageStyle?: CSSProperties; interactive?: boolean }) {
  const { tr } = useAppearance();
  const [dragging, setDragging] = useState(false);
  useSyncExternalStore(file.subscribe, file.getSnapshot, file.getServerSnapshot);
  const showProcessing = file.isProcessing;
  const image = file.getDisplayedPhoto();
  const upload = async (source: File | URL) => {
    if (await importPhoto(source, file)) notify.success(tr('Изображение загружено', 'Image uploaded'));
  };
  return <label className={desktop ? 'editor-image-loader' : 'h-full flex flex-col justify-center items-center gap-1 w-full p-4 cursor-pointer'}
    data-dragging={dragging && !file.isProcessing}
    onClick={event => { if (interactive && image && !(event.target instanceof HTMLInputElement)) event.preventDefault(); }}
    onDragEnter={event => { event.preventDefault(); if (!file.isProcessing) setDragging(true); }}
    onDragOver={event => event.preventDefault()}
    onDragLeave={event => { event.preventDefault(); if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false); }}
    onDrop={event => {
      event.preventDefault(); setDragging(false);
      if (file.isProcessing) return;
      const dropped = event.dataTransfer.files[0];
      if (dropped) { void upload(dropped); return; }
      const raw = event.dataTransfer.getData('URL') || event.dataTransfer.getData('text/uri-list');
      try { void upload(new URL(raw)); } catch { notify.error(tr('Перетащите файл изображения или ссылку', 'Drop an image file or URL')); }
    }}>
    {!desktop && file.isEmpty() && !showProcessing && <p className="text-center text-lg font-semibold">{tr('Нажмите, чтобы загрузить изображение', 'Click to load image')}</p>}
    <div aria-busy={file.isProcessing} className={desktop ? 'editor-photo-content' : 'relative flex min-h-0 w-full flex-1 items-center justify-center'}>
      {image && <img src={image.src} alt={file.isPreviewing ? tr('Оригинал', 'Original') : tr('Изображение', 'Image')}
        style={imageStyle} draggable={false}
        className={desktop ? 'editor-photo' : 'max-w-full max-h-full object-contain'} />}
      {file.isPreviewing && <span className="editor-preview-label">{tr('Оригинал', 'Original')}</span>}
      {desktop && file.isEmpty() && !showProcessing && <div className="editor-empty">
        <span className="kit-mark"><Upload size={22} /></span>
        <h2>{tr('Загрузить изображение', 'Upload image')}</h2>
        <Kbd>Ctrl+V</Kbd>
      </div>}
      {showProcessing && <div role="status" aria-live="polite" className="image-processing-overlay">
        <LoaderCircle aria-hidden="true" strokeWidth={1.8} className="image-processing-spinner animate-spin motion-reduce:animate-none" />
        <span className="sr-only">{tr('Обработка изображения…', 'Processing image...')}</span>
      </div>}
    </div>
    <input ref={inputRef} type="file" disabled={file.isProcessing} accept="image/*,.heic,.heif" name="input" className="hidden"
      onClick={event => { event.currentTarget.value = ''; }}
      onChange={event => { const photo = event.currentTarget.files?.[0]; if (photo) void upload(photo); }} />
  </label>;
}
