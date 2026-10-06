'use client';

import { useId, useState, useSyncExternalStore } from 'react';
import { Download, LoaderCircle } from 'lucide-react';
import { FileElement } from '@/entities/image';
import type { ImageFormat } from '@/shared/lib/image-processing';
import { useAppearance } from '@/shared/ui/appearance-provider';
import { notify } from '@/shared/ui/sonner';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { NativeSelect } from '@/shared/ui/native-select';
import { Slider } from '@/shared/ui/slider';
import { imageBaseName, isValidImageName } from '@/shared/lib/image-name';
import { ParameterHelp } from '@/shared/ui/parameter-help';
import { useExportPreview } from '../model/use-export-preview';

export function ExportButton({ file, compact = true }: { file: FileElement; compact?: boolean }) {
  const { appearance, tr } = useAppearance();
  useSyncExternalStore(file.subscribe, file.getSnapshot, file.getServerSnapshot);
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<ImageFormat>('webp');
  const [quality, setQuality] = useState(95);
  const [name, setName] = useState('');
  const nameId = useId();
  const validName = isValidImageName(imageBaseName(name));
  const validQuality = format === 'png' || (Number.isInteger(quality) && quality >= 1 && quality <= 100);
  const image = file.getCurrentPhoto();
  const prepared = useExportPreview(image, open && validQuality, format, format === 'png' ? 1 : quality / 100);
  const fileSize = prepared.blob ? (prepared.blob.size / (prepared.blob.size >= 1024 * 1024 ? 1024 * 1024 : 1024)).toLocaleString(appearance.locale, { maximumFractionDigits: 2 }) + (prepared.blob.size >= 1024 * 1024 ? tr(' МБ', ' MB') : tr(' КБ', ' KB')) : '';
  const download = async () => {
    const image = file.getCurrentPhoto();
    if (!image || file.isProcessing || !validName || !validQuality || !prepared.blob) return;
    const blob = prepared.blob;
    try {
      await file.runProcessing(async () => {
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = imageBaseName(name) + '.' + (format === 'jpeg' ? 'jpg' : format);
        document.body.append(link); link.click(); link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 5000);
      });
      setOpen(false);
      notify.success(tr('Изображение сохранено', 'Image saved'), { description: format.toUpperCase() });
    } catch (error) { notify.error(tr('Не удалось сохранить изображение', 'Export failed'), { description: error instanceof Error ? error.message : tr('Попробуйте ещё раз.', 'Please try again.') }); }
  };
  return <Dialog open={open} onOpenChange={next => { if (next) setName(file.displayName); setOpen(next); }}>
    <DialogTrigger asChild><Button variant={compact ? 'outline' : 'default'} className="editor-export-trigger" disabled={file.isEmpty() || file.isProcessing} aria-label={tr('Экспорт изображения', 'Export image')}><Download aria-hidden="true" />{!compact && <span>{tr('Скачать', 'Download')}</span>}</Button></DialogTrigger>
    <DialogContent onKeyDownCapture={event => {
      if (event.target instanceof HTMLElement && event.target.closest('input, textarea, [contenteditable="true"]')) return;
      if ((event.ctrlKey || event.metaKey) && ['z', 'y', 'x', 'm', '1', '2', '3'].includes(event.key.toLowerCase())) { event.preventDefault(); event.stopPropagation(); }
    }}>
      <DialogTitle>{tr('Сохранить изображение', 'Export image')}</DialogTitle>
      <DialogDescription className="sr-only">{tr('Выберите формат изображения', 'Choose an image format')}</DialogDescription>
      <div><label htmlFor={nameId} className="kit-setting-label">{tr('Имя файла', 'File name')}</label><Input id={nameId} value={name} maxLength={125} aria-invalid={!validName} aria-describedby={nameId + '-hint'} onChange={event => setName(event.target.value)} /><p id={nameId + '-hint'} className="text-xs text-muted-foreground mt-2">{tr('1–120 символов, без < > : " / \\ | ? *. Расширение добавляется автоматически.', '1–120 characters, without < > : " / \\ | ? *. The extension is added automatically.')}</p></div>
      <label className="block space-y-2 text-xs"><span className="block">{tr('Формат', 'Format')}</span><NativeSelect aria-label={tr('Формат экспорта', 'Export format')} value={format} onChange={event => setFormat(event.target.value as ImageFormat)}><option value="webp">WebP</option><option value="png">PNG</option><option value="jpeg">JPEG</option></NativeSelect></label>
      {format !== 'png' && <div className="space-y-4"><div className="flex items-center justify-between gap-4 text-xs"><label htmlFor={nameId + '-quality'}>{tr('Качество (%)', 'Quality (%)')}</label><ParameterHelp label={tr('Качество', 'Quality')}>{tr('Целое число от 1 до 100. Выше качество — больше размер файла.', 'An integer from 1 to 100. Higher quality means a larger file.')}</ParameterHelp><Input id={nameId + '-quality'} aria-label={tr('Качество экспорта', 'Export quality')} type="number" min={1} max={100} step={1} className="w-24" value={Number.isFinite(quality) ? quality : ''} onChange={event => setQuality(event.target.value === '' ? NaN : +event.target.value)} /></div><Slider aria-label={tr('Качество изображения', 'Image quality')} min={1} max={100} value={[Number.isFinite(quality) ? quality : 95]} onValueChange={values => setQuality(values[0])} /></div>}
      {format === 'jpeg' && <p className="text-xs text-muted-foreground">{tr('Прозрачные области будут заполнены белым.', 'Transparent areas will have a white background.')}</p>}
      <div className="editor-export-size" aria-live="polite">{!validQuality ? tr('Качество: целое число от 1 до 100.', 'Quality: an integer from 1 to 100.') : prepared.blob ? <span>{tr('Размер файла: ', 'File size: ')}<strong>{fileSize}</strong></span> : prepared.error ? <><span>{tr('Не удалось подготовить файл.', 'Could not prepare the file.')}</span><Button variant="outline" size="sm" onClick={prepared.retry}>{tr('Повторить', 'Retry')}</Button></> : <><LoaderCircle className="animate-spin motion-reduce:animate-none" size={16} /><span>{tr('Расчёт размера…', 'Calculating size…')}</span></>}</div>
      <DialogFooter className="mt-2 gap-3 sm:gap-0"><DialogClose asChild><Button variant="outline">{tr('Отмена', 'Cancel')}</Button></DialogClose><Button onClick={download} disabled={!prepared.blob || !validName || !validQuality || file.isEmpty() || file.isProcessing}><Download />{tr('Скачать', 'Download')}</Button></DialogFooter>
    </DialogContent>
  </Dialog>;
}
