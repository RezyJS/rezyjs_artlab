'use client';

import { useId, useState } from 'react';
import { Pencil } from 'lucide-react';
import { imageBaseName, isValidImageName } from '@/shared/lib/image-name';
import { useAppearance } from '@/shared/ui/appearance-provider';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/shared/ui/dialog';
import FileElement from '../model/history';

export function RenameImage({ file }: { file: FileElement }) {
  const { tr } = useAppearance();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const id = useId();
  const valid = isValidImageName(imageBaseName(name));
  return <Dialog open={open} onOpenChange={next => { if (next) setName(file.displayName); setOpen(next); }}>
    <DialogTrigger asChild><Button variant="ghost" className="editor-rename-name" disabled={file.isProcessing} aria-label={tr('Переименовать ', 'Rename ') + file.displayName}><span>{file.displayName}</span><Pencil /></Button></DialogTrigger>
    <DialogContent><DialogTitle>{tr('Переименовать изображение', 'Rename image')}</DialogTitle><DialogDescription className="sr-only">{tr('Новое имя будет использовано в редакторе и при скачивании.', 'Use the new name in the editor and for downloads.')}</DialogDescription>
      <form onSubmit={event => { event.preventDefault(); if (file.rename(name)) setOpen(false); }} className="space-y-4">
        <label htmlFor={id}>{tr('Имя без расширения', 'Name without extension')}</label>
        <Input id={id} value={name} maxLength={125} disabled={file.isProcessing} aria-invalid={!valid} aria-describedby={id + '-hint'} onChange={event => setName(event.target.value)} />
        <p id={id + '-hint'} className="text-xs text-muted-foreground">{tr('1–120 символов. Нельзя использовать: < > : " / \\ | ? *. Расширение добавится при скачивании.', '1–120 characters. These characters are not allowed: < > : " / \\ | ? *. The extension is added on download.')}</p>
        <DialogFooter className="gap-3"><DialogClose asChild><Button type="button" variant="outline">{tr('Отмена', 'Cancel')}</Button></DialogClose><Button type="submit" disabled={!valid || file.isProcessing}>{tr('Сохранить', 'Save')}</Button></DialogFooter>
      </form>
    </DialogContent>
  </Dialog>;
}
