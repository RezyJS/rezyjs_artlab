'use client';

import { useRef, useState, useSyncExternalStore } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { FileElement, imageOperation } from '@/entities/image';
import { useAppearance } from '@/shared/ui/appearance-provider';
import { Button } from '@/shared/ui/button';
import { ActionHint } from '@/shared/ui/action-hint';
import { HistoryDialog } from './HistoryDialog';
import { PreviewPhoto } from './PreviewPhoto';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/ui/dialog';
import { TrianglesCenterlineDashedHorizontal, TrianglesCenterlineDashedVertical, Redo2, RotateCcw, RotateCw, Trash2, Undo2 } from 'lucide-react';

export const ControlPhoto = ({ file, transformations = false }: { file: FileElement; transformations?: boolean }) => {
  const { tr } = useAppearance();
  useSyncExternalStore(file.subscribe, file.getSnapshot, file.getServerSnapshot);
  const [deleteTarget, setDeleteTarget] = useState<{ image: HTMLImageElement; epoch: number } | null>(null);
  const cancelButton = useRef<HTMLButtonElement>(null);
  const requestDelete = () => {
    const image = file.getCurrentPhoto();
    if (!image || file.isProcessing || document.querySelector('[role="dialog"][data-state="open"]')) return;
    setDeleteTarget({ image, epoch: file.epoch });
  };
  useHotkeys('ctrl+m', requestDelete, { preventDefault: true }, [file]);
  const canDelete = deleteTarget !== null && !file.isProcessing && file.epoch === deleteTarget.epoch && file.getCurrentPhoto() === deleteTarget.image;
  const confirmDelete = () => {
    if (!canDelete) return;
    file.newStack();
    setDeleteTarget(null);
  };
  const actions = [
    { label: tr('Отменить', 'Undo'), key: 'Ctrl+Z', icon: Undo2, disabled: file.isEmpty() || file.isFirst(), action: () => file.revert() },
    { label: tr('Повторить', 'Redo'), key: 'Ctrl+Y', icon: Redo2, disabled: file.isEmpty() || file.isLast(), action: () => file.undoRevert() },
    { label: tr('Сбросить', 'Reset'), key: 'Ctrl+X', icon: RotateCcw, disabled: file.isEmpty() || file.isFirst(), action: () => file.reset() },
  ];
  const transform = (operation: 'rotate' | 'flip', argument: number | string) => {
    const image = file.getCurrentPhoto();
    if (image && !file.isProcessing && !file.isPreviewing) void imageOperation(image, operation, file, argument);
  };
  const transforms = [
    { label: tr('Повернуть влево на 90°', 'Rotate left 90°'), shortLabel: '−90°', icon: RotateCcw, action: () => transform('rotate', -90) },
    { label: tr('Повернуть вправо на 90°', 'Rotate right 90°'), shortLabel: '+90°', icon: RotateCw, action: () => transform('rotate', 90) },
    { label: tr('Отразить по X (слева направо)', 'Flip X (left to right)'), shortLabel: tr('Отразить X', 'Flip X'), icon: TrianglesCenterlineDashedVertical, action: () => transform('flip', 'x') },
    { label: tr('Отразить по Y (сверху вниз)', 'Flip Y (top to bottom)'), shortLabel: tr('Отразить Y', 'Flip Y'), icon: TrianglesCenterlineDashedHorizontal, action: () => transform('flip', 'y') },
  ];
  return <Dialog open={deleteTarget !== null} onOpenChange={open => { if (open) requestDelete(); else setDeleteTarget(null); }}><div className="editor-history" role="toolbar" aria-label={tr('Действия с изображением', 'Image actions')}>
    <div className="editor-history-group" role="group" aria-label={tr('История', 'History')}>{actions.map(item =>
      <ActionHint key={item.key} label={item.label} shortcut={item.key}><Button variant="outline" disabled={item.disabled || file.isProcessing} onClick={item.action} aria-label={item.label}><item.icon /><span>{item.label}</span></Button></ActionHint>
    )}<HistoryDialog file={file} /></div>
    <div className="editor-history-group editor-transform-group" role="group" aria-label={tr('Изменение изображения', 'Image changes')}>
      <PreviewPhoto file={file} />
      {transformations && transforms.map(item => <ActionHint key={item.label} label={item.label}><Button variant="outline" size="icon" disabled={file.isEmpty() || file.isProcessing || file.isPreviewing} onClick={item.action} aria-label={item.label} data-motion="tilt"><item.icon /><span className="editor-mobile-action-label">{item.shortLabel}</span></Button></ActionHint>)}
      <ActionHint label={tr('Удалить', 'Delete')} shortcut="Ctrl+M"><DialogTrigger asChild><Button variant="destructive" size={transformations ? 'icon' : 'default'} disabled={file.isEmpty() || file.isProcessing} aria-label={tr('Удалить', 'Delete')}><Trash2 /><span className={transformations ? 'editor-mobile-action-label' : undefined}>{tr('Удалить', 'Delete')}</span></Button></DialogTrigger></ActionHint>
    </div>
  </div><DialogContent onOpenAutoFocus={event => { event.preventDefault(); cancelButton.current?.focus(); }} onKeyDownCapture={event => {
    if ((event.ctrlKey || event.metaKey) && ['z', 'y', 'x', 'm'].includes(event.key.toLowerCase())) { event.preventDefault(); event.stopPropagation(); }
  }}>
    <DialogHeader><DialogTitle>{tr('Удалить изображение?', 'Delete image?')}</DialogTitle><DialogDescription>{tr('Изображение и история изменений будут удалены из редактора.', 'The image and its edit history will be removed from the editor.')}</DialogDescription></DialogHeader>
    <DialogFooter className="gap-3"><DialogClose asChild><Button ref={cancelButton} variant="outline">{tr('Отмена', 'Cancel')}</Button></DialogClose><Button variant="destructive" disabled={!canDelete} onClick={confirmDelete}><Trash2 />{tr('Удалить', 'Delete')}</Button></DialogFooter>
  </DialogContent></Dialog>;
};
