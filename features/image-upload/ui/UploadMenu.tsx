'use client';

import { useState, type RefObject } from 'react';
import { ChevronDown, FolderOpen, Link, Upload } from 'lucide-react';
import { FileElement } from '@/entities/image';
import { useAppearance } from '@/shared/ui/appearance-provider';
import { Button } from '@/shared/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { UploadUrlDialog } from './UploadUrlDialog';

export function UploadMenu({ file, inputRef }: { file: FileElement; inputRef: RefObject<HTMLInputElement | null> }) {
  const { tr } = useAppearance();
  const [open, setOpen] = useState(false);
  const [urlOpen, setUrlOpen] = useState(false);
  return <>
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild><Button variant="outline" className="editor-upload-trigger" disabled={file.isProcessing}><Upload /><span>{tr('Загрузить файл', 'Upload file')}</span><ChevronDown /></Button></PopoverTrigger>
      <PopoverContent side="bottom" align="end" sideOffset={12} className="editor-upload-menu" aria-label={tr('Способ загрузки', 'Upload source')} onCloseAutoFocus={event => { if (urlOpen) event.preventDefault(); }}>
        <Button variant="outline" className="editor-upload-option" onClick={() => { setOpen(false); inputRef.current?.click(); }}><FolderOpen /><span>{tr('Из файлов', 'From files')}</span></Button>
        <Button variant="outline" className="editor-upload-option" onClick={() => { setOpen(false); setUrlOpen(true); }}><Link /><span>{tr('По ссылке', 'From URL')}</span></Button>
      </PopoverContent>
    </Popover>
    <UploadUrlDialog file={file} open={urlOpen} onOpenChange={setUrlOpen} hideTrigger />
  </>;
}
