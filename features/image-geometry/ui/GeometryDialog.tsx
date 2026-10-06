/* eslint-disable @next/next/no-img-element */
'use client';

import { useId, useRef, useState, useSyncExternalStore, type PointerEvent } from 'react';
import { Crop, Scaling } from 'lucide-react';
import { FileElement, imageOperation } from '@/entities/image';
import { validCrop, validResize, MAX_RESIZE_SIDE, type CropRect } from '@/shared/lib/image-processing';
import { useAppearance } from '@/shared/ui/appearance-provider';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import { Input } from '@/shared/ui/input';
import { NativeSelect } from '@/shared/ui/native-select';
import { ActionHint } from '@/shared/ui/action-hint';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/shared/ui/dialog';
import { centredCrop, clamp, cropFromPoints, type Point } from '../model/crop';

type Target = { image: HTMLImageElement; src: string; width: number; height: number; epoch: number };
type Drag = { pointer: number; start: Point; rect: CropRect; anchor?: Point; move: boolean };

export function GeometryDialog({ file }: { file: FileElement }) {
  const { tr } = useAppearance();
  useSyncExternalStore(file.subscribe, file.getSnapshot, file.getServerSnapshot);
  const id = useId();
  const [target, setTarget] = useState<Target | null>(null);
  const [mode, setMode] = useState<'resize' | 'crop'>('resize');
  const [width, setWidth] = useState(1), [height, setHeight] = useState(1);
  const [proportions, setProportions] = useState(true);
  const [ratio, setRatio] = useState('free');
  const [rect, setRect] = useState<CropRect>({ x: 0, y: 0, width: 1, height: 1 });
  const drag = useRef<Drag | null>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const sourceWidth = target?.width ?? 1, sourceHeight = target?.height ?? 1;
  const cropRatio = ratio === 'original' ? sourceWidth / sourceHeight : ratio === 'free' ? 0 : Number(ratio.split(':')[0]) / Number(ratio.split(':')[1]);
  const current = target !== null && file.epoch === target.epoch && file.getCurrentPhoto() === target.image;
  const valid = mode === 'resize' ? validResize(width, height) : validCrop(rect, sourceWidth, sourceHeight);
  const changed = mode === 'resize' ? width !== sourceWidth || height !== sourceHeight : rect.x !== 0 || rect.y !== 0 || rect.width !== sourceWidth || rect.height !== sourceHeight;
  const disabled = file.isEmpty() || file.isProcessing || file.isPreviewing;
  const readNumber = (value: string) => value === '' ? NaN : Number(value);
  const displayNumber = (value: number) => Number.isFinite(value) ? value : '';
  const changeSize = (axis: 'width' | 'height', value: number) => {
    if (axis === 'width') { setWidth(value); if (proportions) setHeight(Math.max(1, Math.round(value * sourceHeight / sourceWidth))); }
    else { setHeight(value); if (proportions) setWidth(Math.max(1, Math.round(value * sourceWidth / sourceHeight))); }
  };
  const changeRect = (key: keyof CropRect, value: number) => setRect(previous => {
    const next = { ...previous, [key]: value };
    if (cropRatio && key === 'width') next.height = Math.max(1, Math.round(value / cropRatio));
    if (cropRatio && key === 'height') next.width = Math.max(1, Math.round(value * cropRatio));
    return next;
  });
  const point = (event: PointerEvent<HTMLDivElement>): Point => {
    const bounds = event.currentTarget.getBoundingClientRect();
    return { x: clamp(Math.round((event.clientX - bounds.left) / bounds.width * sourceWidth), 0, sourceWidth), y: clamp(Math.round((event.clientY - bounds.top) / bounds.height * sourceHeight), 0, sourceHeight) };
  };
  const start = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || file.isProcessing || drag.current) return;
    event.preventDefault();
    const cursor = point(event);
    const handle = (event.target as HTMLElement).dataset.corner;
    const onSelection = (event.target as HTMLElement).closest('.editor-crop-selection');
    const goodRect = validCrop(rect, sourceWidth, sourceHeight);
    const anchor = handle && goodRect ? { x: handle.includes('w') ? rect.x + rect.width : rect.x, y: handle.includes('n') ? rect.y + rect.height : rect.y } : undefined;
    drag.current = { pointer: event.pointerId, start: cursor, rect, anchor, move: Boolean(onSelection && !handle && goodRect) };
    if (!onSelection || !goodRect) setRect(cropFromPoints(cursor, cursor, sourceWidth, sourceHeight, cropRatio));
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const move = (event: PointerEvent<HTMLDivElement>) => {
    const gesture = drag.current;
    if (!gesture || gesture.pointer !== event.pointerId) return;
    const cursor = point(event);
    setRect(gesture.move ? { ...gesture.rect, x: clamp(gesture.rect.x + cursor.x - gesture.start.x, 0, sourceWidth - gesture.rect.width), y: clamp(gesture.rect.y + cursor.y - gesture.start.y, 0, sourceHeight - gesture.rect.height) } : cropFromPoints(gesture.anchor ?? gesture.start, cursor, sourceWidth, sourceHeight, cropRatio));
  };
  const finish = (event: PointerEvent<HTMLDivElement>) => {
    if (drag.current?.pointer === event.pointerId) drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const apply = async () => {
    if (!target || !current || !valid || !changed || file.isProcessing) return;
    const args = mode === 'resize' ? [width, height] : [rect.x, rect.y, rect.width, rect.height];
    await imageOperation(target.image, mode, file, ...args);
    if (file.epoch === target.epoch && file.getCurrentPhoto() !== target.image) setTarget(null);
  };
  return <Dialog open={target !== null} onOpenChange={open => {
    if (!open) { setTarget(null); drag.current = null; return; }
    const image = file.getCurrentPhoto();
    if (!image || disabled) return;
    setTarget({ image, src: image.src, width: image.naturalWidth, height: image.naturalHeight, epoch: file.epoch });
    setWidth(image.naturalWidth); setHeight(image.naturalHeight); setProportions(true); setRatio('free');
    setRect({ x: 0, y: 0, width: image.naturalWidth, height: image.naturalHeight });
  }}>
    <div className="editor-geometry-triggers">
      {(['resize', 'crop'] as const).map(item => {
        const label = item === 'resize' ? tr('Размер', 'Resize') : tr('Обрезка', 'Crop'), Icon = item === 'resize' ? Scaling : Crop;
        return <ActionHint key={item} label={label}><DialogTrigger asChild><Button variant="outline" size="icon" disabled={disabled} aria-label={label} onClick={event => { setMode(item); lastTrigger.current = event.currentTarget; }}><Icon /></Button></DialogTrigger></ActionHint>;
      })}
    </div>
    <DialogContent className="editor-geometry-dialog" onCloseAutoFocus={event => { event.preventDefault(); lastTrigger.current?.focus(); }} onKeyDownCapture={event => {
      if (event.target instanceof HTMLElement && event.target.closest('input, textarea, [contenteditable="true"]')) return;
      if ((event.ctrlKey || event.metaKey) && ['z', 'y', 'x', 'm', '1', '2', '3'].includes(event.key.toLowerCase())) { event.preventDefault(); event.stopPropagation(); }
    }}>
      <DialogTitle>{mode === 'resize' ? tr('Размер изображения', 'Image size') : tr('Обрезка', 'Crop')}</DialogTitle>
      <DialogDescription className="sr-only">{tr('Изменения можно отменить в истории.', 'Changes can be undone in history.')}</DialogDescription>
      <div className="kit-segment editor-geometry-modes"><Button variant="ghost" aria-pressed={mode === 'resize'} onClick={() => setMode('resize')}><Scaling />{tr('Размер', 'Resize')}</Button><Button variant="ghost" aria-pressed={mode === 'crop'} onClick={() => setMode('crop')}><Crop />{tr('Обрезка', 'Crop')}</Button></div>
      {mode === 'resize' ? <>
        <div className="editor-geometry-fields">{(['width', 'height'] as const).map(axis => <label key={axis}><span className="kit-setting-label">{axis === 'width' ? tr('Ширина, px', 'Width, px') : tr('Высота, px', 'Height, px')}</span><Input type="number" min={1} max={MAX_RESIZE_SIDE} step={1} value={displayNumber(axis === 'width' ? width : height)} onChange={event => changeSize(axis, readNumber(event.target.value))} /></label>)}</div>
        <label className="editor-keep-proportions"><Checkbox checked={proportions} onCheckedChange={checked => { setProportions(checked === true); if (checked === true) setHeight(Math.max(1, Math.round(width * sourceHeight / sourceWidth))); }} />{tr('Сохранять пропорции', 'Keep aspect ratio')}</label>
        <p className="editor-geometry-hint">{tr('1–8192 px по стороне. Не больше 16 млн пикселей.', '1–8192 px per side. Up to 16 million pixels.')}</p>
      </> : <>
        <label><span className="kit-setting-label">{tr('Пропорции', 'Aspect ratio')}</span><NativeSelect value={ratio} onChange={event => {
          const next = event.target.value; setRatio(next);
          const value = next === 'free' ? 0 : next === 'original' ? sourceWidth / sourceHeight : Number(next.split(':')[0]) / Number(next.split(':')[1]);
          setRect(centredCrop(sourceWidth, sourceHeight, value));
        }}><option value="free">{tr('Свободно', 'Free')}</option><option value="original">{tr('Исходные', 'Original')}</option>{['1:1', '4:3', '3:4', '16:9', '9:16'].map(value => <option key={value}>{value}</option>)}</NativeSelect></label>
        <div className="editor-crop-preview"><div className="editor-crop-image" style={{ width: 'min(100%, calc(min(40dvh, 360px) * ' + sourceWidth / sourceHeight + '))', aspectRatio: sourceWidth / sourceHeight }} onPointerDown={start} onPointerMove={move} onPointerUp={finish} onPointerCancel={finish} onLostPointerCapture={() => { drag.current = null; }}>
          {target && <img src={target.src} alt={tr('Область обрезки', 'Crop area')} draggable={false} />}
          {validCrop(rect, sourceWidth, sourceHeight) && <div className="editor-crop-selection" style={{ left: rect.x / sourceWidth * 100 + '%', top: rect.y / sourceHeight * 100 + '%', width: rect.width / sourceWidth * 100 + '%', height: rect.height / sourceHeight * 100 + '%' }}>{['nw', 'ne', 'se', 'sw'].map(corner => <span key={corner} data-corner={corner} className={'editor-crop-handle editor-crop-' + corner} />)}</div>}
        </div></div>
        <p className="editor-geometry-hint">{tr('Тяните углы рамки или выделите новую область.', 'Drag the corners or draw a new selection.')}</p>
        <div className="editor-geometry-fields editor-crop-fields">{(['x', 'y', 'width', 'height'] as const).map(key => <label key={key} htmlFor={id + key}><span className="kit-setting-label">{key === 'width' ? tr('Ширина, px', 'Width, px') : key === 'height' ? tr('Высота, px', 'Height, px') : key === 'x' ? tr('Слева, px', 'Left, px') : tr('Сверху, px', 'Top, px')}</span><Input id={id + key} type="number" step={1} min={key === 'x' || key === 'y' ? 0 : 1} max={key === 'x' || key === 'width' ? sourceWidth : sourceHeight} value={displayNumber(rect[key])} onChange={event => changeRect(key, readNumber(event.target.value))} /></label>)}</div>
      </>}
      {!valid && <p role="alert" className="text-xs text-destructive">{mode === 'resize' ? tr('Размер выходит за допустимые пределы.', 'Size exceeds the allowed limits.') : tr('Рамка должна быть внутри изображения.', 'The crop must stay inside the image.')}</p>}
      <DialogFooter className="gap-3"><DialogClose asChild><Button variant="outline">{tr('Отмена', 'Cancel')}</Button></DialogClose><Button disabled={!valid || !changed || !current || file.isProcessing} onClick={() => void apply()}>{tr('Применить', 'Apply')}</Button></DialogFooter>
    </DialogContent>
  </Dialog>;
}
