'use client';

import { useState } from 'react';
import { Link as LinkIcon } from 'lucide-react';
import { FileElement } from '@/entities/image';
import { useAppearance } from '@/shared/ui/appearance-provider';
import { notify } from '@/shared/ui/sonner';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/shared/ui/dialog';
import { importPhoto } from '../lib/import-photo';

export function UploadUrlDialog({ file, open: controlledOpen, onOpenChange, hideTrigger = false }: { file: FileElement; open?: boolean; onOpenChange?: (open: boolean) => void; hideTrigger?: boolean }) {
  const { tr } = useAppearance();
  const [localOpen, setLocalOpen] = useState(false);
  const open = controlledOpen ?? localOpen;
  const setOpen = onOpenChange ?? setLocalOpen;
  const [url, setUrl] = useState('');
  const [invalid, setInvalid] = useState(false);
  const upload = async () => {
    if (file.isProcessing) return;
    let source: URL;
    try { source = new URL(url); if (!['http:', 'https:'].includes(source.protocol)) throw new Error(); }
    catch { setInvalid(true); return; }
    if (await importPhoto(source, file)) { setOpen(false); notify.success(tr('Изображение загружено', 'Image uploaded')); }
  };
  return <Dialog open={open} onOpenChange={setOpen}>{!hideTrigger && <DialogTrigger asChild><Button variant="outline"><LinkIcon />{tr('По ссылке', 'From URL')}</Button></DialogTrigger>}<DialogContent>
    <DialogTitle>{tr('Загрузить по ссылке', 'Upload from URL')}</DialogTitle><DialogDescription className="sr-only">{tr('Введите прямую ссылку на изображение', 'Enter a direct image URL')}</DialogDescription>
    <form onSubmit={event => { event.preventDefault(); void upload(); }} className="space-y-4"><Input aria-label={tr('Ссылка на изображение', 'Image URL')} placeholder="https://…" value={url} aria-invalid={invalid} onChange={event => { setUrl(event.target.value); setInvalid(false); }} />{invalid && <p className="text-xs text-destructive">{tr('Введите ссылку HTTP или HTTPS.', 'Enter an HTTP or HTTPS URL.')}</p>}<Button className="w-full" type="submit" disabled={!url.trim()}>{tr('Загрузить изображение', 'Upload image')}</Button></form>
  </DialogContent></Dialog>;
}
