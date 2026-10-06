'use client';

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode, type PointerEvent } from 'react';
import { Copy, Expand, LoaderCircle, Minimize, Pipette, Scan, ZoomIn, ZoomOut } from 'lucide-react';
import { FileElement } from '@/entities/image';
import { sampleImageColor, type PixelColor } from '@/shared/lib/image-processing';
import { useAppearance } from '@/shared/ui/appearance-provider';
import { ActionHint } from '@/shared/ui/action-hint';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shared/ui/dialog';
import { InteractionLockProvider } from '@/shared/ui/interaction-lock';
import { constrain, fitScale, imagePoint, zoomAt, type Point, type Pose, type Size } from '../model/view';

type View = Pose & { src: string };
type Gesture = { pose: Pose; points: Point[] };
type Sample = { src: string; color?: PixelColor; loading?: boolean; error?: string };

function hex(color: PixelColor) {
  return '#' + [color.red, color.green, color.blue].map(value => value.toString(16).padStart(2, '0')).join('').toUpperCase();
}
const midpoint = (a: Point, b: Point): Point => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

export function ImageViewport({ file, children }: { file: FileElement; children: (style: CSSProperties | undefined) => ReactNode }) {
  const { tr } = useAppearance();
  useSyncExternalStore(file.subscribe, file.getSnapshot, file.getServerSnapshot);
  const image = file.getDisplayedPhoto();
  const src = image?.src ?? '';
  const width = image?.naturalWidth ?? 1, height = image?.naturalHeight ?? 1;
  const dimensions = useMemo(() => ({ width, height }), [width, height]);
  const [canvas, setCanvas] = useState<HTMLDivElement | null>(null);
  const [size, setSize] = useState<Size>({ width: 1, height: 1 });
  const [view, setView] = useState<View | null>(null);
  const [picking, setPicking] = useState(false);
  const [sample, setSample] = useState<Sample | null>(null);
  const [nativeFullscreen, setNativeFullscreen] = useState(false);
  const [fallbackFullscreen, setFallbackFullscreen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const fullscreenButton = useRef<HTMLButtonElement>(null);
  const points = useRef(new Map<number, Point>());
  const gesture = useRef<Gesture | null>(null);
  const sampleRequest = useRef(0);
  const fit = fitScale(dimensions, size);
  const minScale = Math.min(0.05, fit);
  const pose = constrain(view?.src === src ? view : { scale: fit, x: 0, y: 0 }, dimensions, size);
  const expanded = nativeFullscreen || fallbackFullscreen;
  const disabled = !image || file.isProcessing;
  const currentSample = sample?.src === src ? sample : null;

  useEffect(() => { points.current.clear(); gesture.current = null; }, [src]);

  useEffect(() => {
    if (!canvas) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setSize(previous => previous.width === width && previous.height === height ? previous : { width, height });
    });
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [canvas]);

  useEffect(() => {
    const change = () => setNativeFullscreen(document.fullscreenElement === root.current && !!root.current);
    document.addEventListener('fullscreenchange', change);
    return () => document.removeEventListener('fullscreenchange', change);
  }, []);

  useEffect(() => {
    if (!canvas || !src) return;
    const wheel = (event: WheelEvent) => {
      if (file.isProcessing) return;
      event.preventDefault();
      const bounds = canvas.getBoundingClientRect();
      const point = { x: event.clientX - bounds.left - bounds.width / 2, y: event.clientY - bounds.top - bounds.height / 2 };
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? bounds.height : 1);
      setView(previous => {
        const current = constrain(previous?.src === src ? previous : { scale: fit, x: 0, y: 0 }, dimensions, size);
        const scale = Math.max(minScale, Math.min(8, current.scale * Math.exp(-Math.max(-200, Math.min(200, delta)) * 0.002)));
        return { src, ...constrain(zoomAt(current, scale, point), dimensions, size) };
      });
    };
    canvas.addEventListener('wheel', wheel, { passive: false });
    return () => canvas.removeEventListener('wheel', wheel);
  }, [canvas, src, dimensions, fit, minScale, size, file]);

  const pointAt = (event: PointerEvent): Point => {
    const bounds = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - bounds.left - bounds.width / 2, y: event.clientY - bounds.top - bounds.height / 2 };
  };
  const restartGesture = (current: Pose) => { gesture.current = { pose: current, points: [...points.current.values()].slice(0, 2) }; };
  const setPose = (next: Pose) => setView({ src, ...constrain(next, dimensions, size) });
  const zoom = (factor: number) => setPose(zoomAt(pose, Math.max(minScale, Math.min(8, pose.scale * factor)), { x: 0, y: 0 }));
  const pick = async (point: Point) => {
    if (!image || file.isProcessing || currentSample?.loading) return;
    const pixel = imagePoint(point, pose, dimensions);
    if (!pixel) return;
    const request = ++sampleRequest.current;
    setSample({ src, loading: true });
    try {
      const color = await sampleImageColor(image, pixel.x, pixel.y);
      if (request === sampleRequest.current && file.getDisplayedPhoto()?.src === src) setSample({ src, color });
    } catch {
      if (request === sampleRequest.current) setSample({ src, error: tr('Не удалось считать цвет', 'Could not read colour') });
    }
  };
  const pointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled || (event.pointerType === 'mouse' && event.button !== 0)) return;
    if (picking) { void pick(pointAt(event)); return; }
    if (points.current.size >= 2) return;
    points.current.set(event.pointerId, pointAt(event));
    event.currentTarget.setPointerCapture(event.pointerId);
    restartGesture(pose);
  };
  const pointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled || picking || !points.current.has(event.pointerId) || !gesture.current) return;
    points.current.set(event.pointerId, pointAt(event));
    const next = [...points.current.values()].slice(0, 2), start = gesture.current;
    if (next.length === 2 && start.points.length === 2) {
      const from = midpoint(start.points[0], start.points[1]), to = midpoint(next[0], next[1]);
      const scale = Math.max(minScale, Math.min(8, start.pose.scale * distance(next[0], next[1]) / Math.max(1, distance(start.points[0], start.points[1]))));
      const zoomed = zoomAt(start.pose, scale, from);
      setPose({ ...zoomed, x: zoomed.x + to.x - from.x, y: zoomed.y + to.y - from.y });
    } else if (next.length === 1 && start.points.length === 1) {
      setPose({ ...start.pose, x: start.pose.x + next[0].x - start.points[0].x, y: start.pose.y + next[0].y - start.points[0].y });
    }
  };
  const pointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    points.current.delete(event.pointerId);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (points.current.size) restartGesture(pose); else gesture.current = null;
  };
  const toggleFullscreen = async () => {
    if (fallbackFullscreen) { setFallbackFullscreen(false); return; }
    if (document.fullscreenElement === root.current && document.fullscreenElement) { await document.exitFullscreen(); return; }
    try {
      if (!root.current?.requestFullscreen) throw new Error('Fullscreen unavailable');
      await root.current.requestFullscreen();
    } catch { setFallbackFullscreen(true); }
  };
  const color = currentSample?.color;
  const imageStyle: CSSProperties | undefined = image ? {
    width: dimensions.width * pose.scale, height: dimensions.height * pose.scale,
    left: '50%', top: '50%', right: 'auto', bottom: 'auto', maxWidth: 'none', maxHeight: 'none',
    transform: `translate(calc(-50% + ${pose.x}px), calc(-50% + ${pose.y}px))`,
  } : undefined;
  const content = <div ref={root} className={'editor-photo-surface editor-image-viewport' + (fallbackFullscreen ? ' editor-viewport-expanded' : '')} onKeyDownCapture={event => {
    if (expanded && (event.ctrlKey || event.metaKey) && ['z', 'y', 'x', 'm', '1', '2', '3'].includes(event.key.toLowerCase())) { event.preventDefault(); event.stopPropagation(); }
  }}>
    <div ref={setCanvas} className="editor-view-canvas" data-picking={picking && !!image} data-panning={!!image && pose.scale > fit + 0.001}
      style={{ touchAction: picking || pose.scale > fit + 0.001 ? 'none' : 'pan-y' }}
      onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerEnd} onPointerCancel={pointerEnd}
      onLostPointerCapture={event => { points.current.delete(event.pointerId); if (!points.current.size) gesture.current = null; }}
      onDoubleClick={() => { if (!disabled && !picking) setPose({ scale: Math.abs(pose.scale - fit) < 0.001 ? 1 : fit, x: 0, y: 0 }); }}>
      {children(imageStyle)}
    </div>
    {(image || expanded) && <div className="editor-view-toolbar">
      <div className="editor-view-tools">
        <ActionHint label={tr('Уменьшить', 'Zoom out')}><Button variant="ghost" size="icon" disabled={disabled || pose.scale <= minScale} onClick={() => zoom(1 / 1.25)} aria-label={tr('Уменьшить', 'Zoom out')}><ZoomOut /></Button></ActionHint>
        <ActionHint label={tr('Масштаб 100%', 'Actual size')}><Button className="editor-view-scale" variant="ghost" disabled={disabled} onClick={() => setPose({ scale: 1, x: 0, y: 0 })}>{Math.round(pose.scale * 100)}%</Button></ActionHint>
        <ActionHint label={tr('Увеличить', 'Zoom in')}><Button variant="ghost" size="icon" disabled={disabled || pose.scale >= 8} onClick={() => zoom(1.25)} aria-label={tr('Увеличить', 'Zoom in')}><ZoomIn /></Button></ActionHint>
        <ActionHint label={tr('Вписать в окно', 'Fit to view')}><Button variant="ghost" size="icon" disabled={disabled} onClick={() => { setView(null); points.current.clear(); gesture.current = null; }} aria-label={tr('Вписать в окно', 'Fit to view')}><Scan /></Button></ActionHint>
      </div>
      <div className="editor-view-tools">
        <ActionHint label={tr('Пипетка: нажмите на фото', 'Eyedropper: click the image')}><Button variant="ghost" size="icon" disabled={disabled} aria-pressed={picking} onClick={() => { setPicking(!picking); points.current.clear(); gesture.current = null; }} aria-label={tr('Пипетка', 'Eyedropper')}><Pipette /></Button></ActionHint>
        <InteractionLockProvider value={!expanded && file.isProcessing}><ActionHint label={expanded ? tr('Выйти из полного экрана', 'Exit fullscreen') : tr('На весь экран', 'Fullscreen')}><Button ref={fullscreenButton} variant="ghost" size="icon" disabled={!expanded && disabled} onClick={() => void toggleFullscreen()} aria-label={expanded ? tr('Выйти из полного экрана', 'Exit fullscreen') : tr('На весь экран', 'Fullscreen')}>{expanded ? <Minimize /> : <Expand />}</Button></ActionHint></InteractionLockProvider>
      </div>
      {(picking || currentSample) && <div className="editor-picked-color" role="status" aria-live="polite">
        {currentSample?.loading ? <LoaderCircle className="animate-spin motion-reduce:animate-none" size={16} /> : color ? <><span className="editor-color-swatch" style={{ background: `rgba(${color.red},${color.green},${color.blue},${color.alpha / 255})` }} /><span><strong>{hex(color)}</strong><small>{color.red}, {color.green}, {color.blue}{color.alpha < 255 ? ` · α ${Math.round(color.alpha / 255 * 100)}%` : ''}</small></span><ActionHint label={tr('Скопировать HEX', 'Copy HEX')}><Button variant="ghost" size="icon" aria-label={tr('Скопировать HEX', 'Copy HEX')} onClick={async () => {
          try { await navigator.clipboard.writeText(hex(color)); } catch { setSample({ src, color, error: tr('Не удалось скопировать', 'Could not copy') }); }
        }}><Copy /></Button></ActionHint></> : <span>{currentSample?.error ?? tr('Нажмите на фото', 'Click the image')}</span>}
        {color && currentSample?.error && <span>{currentSample.error}</span>}
      </div>}
    </div>}
  </div>;
  return <Dialog open={fallbackFullscreen} onOpenChange={setFallbackFullscreen}>
    {!fallbackFullscreen && content}
    {fallbackFullscreen && <DialogContent className="editor-view-fullscreen-dialog" onCloseAutoFocus={event => { event.preventDefault(); fullscreenButton.current?.focus(); }} onKeyDownCapture={event => {
      if ((event.ctrlKey || event.metaKey) && ['z', 'y', 'x', 'm', '1', '2', '3'].includes(event.key.toLowerCase())) { event.preventDefault(); event.stopPropagation(); }
    }}>
      <DialogTitle className="sr-only">{tr('Просмотр изображения', 'Image viewer')}</DialogTitle><DialogDescription className="sr-only">{tr('Масштаб, перемещение и пипетка. Esc — закрыть.', 'Zoom, pan and eyedropper. Esc to close.')}</DialogDescription>
      {content}
    </DialogContent>}
  </Dialog>;
}
