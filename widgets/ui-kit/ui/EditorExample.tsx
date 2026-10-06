/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowDownUp, BarChart3, Binary, ChevronDown, Contrast, Diamond, Droplet, Grid3X3, ImageIcon, Layers, Link as LinkIcon, List, LoaderCircle, MoveRight, Palette, Plus, RotateCcw, SlidersHorizontal, Sparkles, Square, Sun, Triangle, Undo2, Redo2, Upload, Waves, Trash2, type LucideIcon } from 'lucide-react';
import { filterGroups, localizeFilter } from '@/features/image-filters';
import { useAppearance } from '@/shared/ui/appearance-provider';
import { notify } from '@/shared/ui/sonner';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Skeleton } from '@/shared/ui/skeleton';
import { Input } from '@/shared/ui/input';
import { InteractionLockProvider } from '@/shared/ui/interaction-lock';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/shared/ui/dialog';
import { ExportExample } from './ComponentGallery';
import { FilterSettings } from './FilterSettings';
import { HistogramPreview } from './HistogramPreview';

const icons: Record<string, LucideIcon> = { contrast: Contrast, sun: Sun, invert: ArrowDownUp, binary: Binary, sliders: SlidersHorizontal, chart: BarChart3, curve: Waves, grid: Grid3X3, palette: Palette, sparkles: Sparkles, drop: Droplet, triangle: Triangle, shift: MoveRight, cross: Plus, square: Square, lines: SlidersHorizontal, layers: Layers, diamond: Diamond };
const filters = filterGroups.flatMap(group => group.filters);

export function EditorExample() {
  const { appearance, tr } = useAppearance();
  const [selected, setSelected] = useState('medianFilter');
  const [openGroup, setOpenGroup] = useState<string | null>('noise');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [previewState, setPreviewState] = useState<'image' | 'loading' | 'empty'>('empty');
  const [photo, setPhoto] = useState({ src: '', name: '' });
  const [imageError, setImageError] = useState(false);
  const [url, setUrl] = useState('');
  const [urlOpen, setUrlOpen] = useState(false);
  const [urlError, setUrlError] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const applyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingToast = useRef<string | number | undefined>(undefined);
  const filter = localizeFilter(filters.find(item => item.id === selected)!, appearance.locale);
  const busy = previewState === 'loading';

  useEffect(() => () => { if (photo.src.startsWith('blob:')) URL.revokeObjectURL(photo.src); }, [photo.src]);
  useEffect(() => () => { if (applyTimer.current) clearTimeout(applyTimer.current); if (pendingToast.current) notify.dismiss(pendingToast.current); }, []);

  const choose = (id: string) => { setSelected(id); setOpenGroup(filterGroups.find(group => group.filters.some(item => item.id === id))!.id); };
  const setPreview = (state: typeof previewState) => {
    if (applyTimer.current) clearTimeout(applyTimer.current);
    if (pendingToast.current) notify.dismiss(pendingToast.current);
    pendingToast.current = undefined;
    setPreviewState(state === 'image' && !photo.src ? 'empty' : state);
  };
  const apply = () => {
    if (busy || previewState === 'empty' || imageError) return;
    setPreview('loading');
    pendingToast.current = notify.loading(tr('Обработка изображения…', 'Processing image…'));
    applyTimer.current = setTimeout(() => {
      setPreviewState('image');
      notify.success(tr('Превью готово', 'Preview ready'), { id: pendingToast.current, description: tr('Демонстрация состояния обработки завершена.', 'The processing state demonstration is complete.') });
      pendingToast.current = undefined;
    }, 1400);
  };
  const loadUrl = () => {
    try {
      const source = new URL(url);
      if (!['https:', 'http:'].includes(source.protocol)) throw new Error();
      setPhoto({ src: source.href, name: source.pathname.split('/').pop() || 'image' });
      setImageError(false); setPreview('image'); setUrlOpen(false); setUrlError(false);
    } catch { setUrlError(true); notify.error(tr('Проверьте ссылку', 'Check the link'), { description: tr('Нужна ссылка HTTP или HTTPS.', 'Enter an HTTP or HTTPS URL.') }); }
  };
  const previewFilter = selected === 'grayScale' ? 'grayscale(1)' : selected === 'negative' ? 'invert(1)' : selected === 'contrast' ? 'contrast(1.3)' : undefined;

  return <section aria-label={tr('Пример интерфейса', 'Interface example')}>
    <div className="kit-example-caption"><span>{tr('20 функций · 3 группы', '20 functions · 3 groups')}</span><Badge variant="outline">{tr('Визуальный прототип', 'Visual prototype')}</Badge></div>
    <div className="kit-editor"><InteractionLockProvider value={busy}>
      <div className="kit-editor-toolbar"><div className="flex min-w-0 items-center gap-2"><ImageIcon size={16} className="shrink-0 text-primary" /><span className="kit-filename">{photo.name}</span><Badge variant="secondary">WebP</Badge></div><div className="kit-toolbar-actions">
        <Button variant="outline" size="sm" onClick={() => input.current?.click()}><Upload />{tr('Загрузить', 'Upload')}</Button>
        <Dialog open={urlOpen} onOpenChange={setUrlOpen}><DialogTrigger asChild><Button variant="ghost" size="sm"><LinkIcon />{tr('По ссылке', 'From URL')}</Button></DialogTrigger><DialogContent><DialogTitle>{tr('Изображение по ссылке', 'Image from URL')}</DialogTitle><DialogDescription>{tr('Подставьте своё фото, чтобы оценить оформление.', 'Use your own photo to explore the design.')}</DialogDescription><Input aria-label={tr('Ссылка на изображение', 'Image URL')} placeholder="https://…" value={url} aria-invalid={urlError} onChange={event => { setUrl(event.target.value); setUrlError(false); }} onKeyDown={event => { if (event.key === 'Enter') loadUrl(); }} /><Button onClick={loadUrl}>{tr('Показать изображение', 'Show image')}</Button>{urlError && <p className="text-xs text-destructive">{tr('Введите ссылку HTTP или HTTPS.', 'Enter an HTTP or HTTPS URL.')}</p>}</DialogContent></Dialog>
        <ExportExample filename={photo.name || 'image.webp'} />
      </div></div>
      <div className="kit-editor-grid">
        <aside className="kit-sidebar" aria-label={tr('Каталог фильтров', 'Filter catalogue')}>
          <label className="kit-upload"><Upload size={23} /><span className="font-medium">{tr('Своя картинка — свой эксперимент', 'Your image, your experiment')}</span><span className="text-[10px] text-muted-foreground">{tr('Выберите изображение для примера', 'Choose an image for the preview')}</span><input ref={input} type="file" aria-label={tr('Загрузить файл для примера', 'Upload a preview file')} accept="image/*" disabled={busy} className="sr-only" onChange={event => { const file = event.target.files?.[0]; if (file) { setPhoto({ src: URL.createObjectURL(file), name: file.name }); setImageError(false); setPreview('image'); notify.success(tr('Фото загружено', 'Photo uploaded')); } event.target.value = ''; }} /></label>
          <div className="kit-catalog-heading"><span>{tr('Функции', 'Functions')}</span><div className="kit-segment"><Button variant="ghost" size="icon" aria-label={tr('Сетка функций', 'Function grid')} aria-pressed={layout === 'grid'} onClick={() => setLayout('grid')}><Grid3X3 /></Button><Button variant="ghost" size="icon" aria-label={tr('Список функций', 'Function list')} aria-pressed={layout === 'list'} onClick={() => setLayout('list')}><List /></Button></div></div>
          {filterGroups.map(group => <details key={group.id} open={openGroup === group.id} className="kit-filter-group"><summary onClick={event => { event.preventDefault(); setOpenGroup(openGroup === group.id ? null : group.id); }}><span>{appearance.locale === 'ru' ? group.label : ({ color: 'Colour', noise: 'Noise', edges: 'Edges' })[group.id]}<span className="ml-2 opacity-60">· {group.filters.length}</span></span><ChevronDown size={14} /></summary><div className={'kit-filter-list' + (layout === 'grid' ? ' kit-filter-grid' : '')}>{group.filters.map(item => { const Icon = icons[item.icon]; const localized = localizeFilter(item, appearance.locale); const label = layout === 'grid' && item.id === 'lowFreq' ? tr('Низкие частоты', 'Low-pass') : layout === 'grid' && item.id === 'highFreq' ? tr('Высокие частоты', 'High-pass') : localized.label; return <Button key={item.id} variant="nav" aria-label={localized.label} aria-pressed={selected === item.id} onClick={() => choose(item.id)}><Icon /><span>{label}</span></Button>; })}</div></details>)}
        </aside>
        <div className="kit-preview">
          <div className="kit-image-heading"><span>{tr('Изображение', 'Image')}</span><span className="text-[10px] font-normal text-muted-foreground">{busy ? tr('В процессе', 'Processing') : tr('Превью', 'Preview')}</span></div>
          <div className="kit-image-surface" aria-busy={busy}>
            {previewState === 'image' && photo.src && !imageError && <><img className="kit-photo" src={photo.src} alt={tr('Изображение для визуального теста', 'Visual preview image')} style={{ filter: previewFilter }} onError={() => { setImageError(true); notify.error(tr('Изображение не загрузилось', 'Could not load the image'), { description: tr('Проверьте ссылку или выберите другой файл.', 'Check the URL or choose a different file.') }); }} /><span className="kit-image-label">{filter.label} · {tr('пример', 'example')}</span></>}
            {busy && <><Skeleton className="absolute inset-0" /><div role="status" className="relative flex flex-col items-center gap-3"><ImageIcon size={42} strokeWidth={1} className="text-muted-foreground" /><div className="flex items-center gap-2 text-xs"><LoaderCircle size={16} className="animate-spin motion-reduce:animate-none" />{tr('Обработка изображения', 'Processing image')}</div></div></>}
            {(previewState === 'empty' || imageError) && <div className="kit-empty"><div className="kit-mark mb-1"><ImageIcon /></div><p className="text-sm font-medium">{imageError ? tr('Изображение не загрузилось', 'Could not load the image') : tr('Начнём с вашей картинки', 'Start with your image')}</p><p className="text-xs text-muted-foreground">{imageError ? tr('Проверьте ссылку или выберите другой файл.', 'Check the URL or choose another file.') : tr('Выберите фото и попробуйте оформление.', 'Choose a photo and explore the design.')}</p><Button size="sm" onClick={() => input.current?.click()}><Upload />{tr('Выбрать файл', 'Choose file')}</Button></div>}
          </div>
          <div className="kit-history"><Button variant="outline" size="icon" aria-label={tr('Отменить в примере', 'Undo in preview')} onClick={() => { choose('grayScale'); notify.info(tr('Предыдущее состояние', 'Previous state')); }} disabled={previewState === 'empty'}><Undo2 /></Button><Button variant="outline" size="icon" aria-label={tr('Повторить в примере', 'Redo in preview')} disabled><Redo2 /></Button><Button variant="ghost" size="sm" onClick={() => { choose('medianFilter'); setImageError(false); setPreview(photo.src ? 'image' : 'empty'); notify.info(tr('Пример сброшен', 'Preview reset')); }}><RotateCcw />{tr('Сбросить', 'Reset')}</Button><Button variant="destructive" size="icon" aria-label={tr('Удалить в примере', 'Remove in preview')} onClick={() => { setPreview('empty'); notify.info(tr('Фото убрано из примера', 'Photo removed from preview'), { action: { label: tr('Вернуть', 'Restore'), onClick: () => setPreview('image') } }); }} disabled={previewState === 'empty'}><Trash2 /></Button></div>
          <div className="kit-presets">{['medianFilter', 'grayScale', 'contrast', 'sobel'].map(id => <Button key={id} variant="secondary" size="sm" aria-pressed={selected === id} onClick={() => choose(id)}>{localizeFilter(filters.find(item => item.id === id)!, appearance.locale).label}</Button>)}</div>
        </div>
        <aside className="kit-settings" aria-label={tr('Настройки выбранного фильтра', 'Selected filter settings')}><FilterSettings key={selected} filter={filter} onApply={apply} disabled={previewState === 'empty' || imageError} /><Card data-elevation="flat"><CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 size={16} className="text-primary" />{tr('Гистограмма', 'Histogram')}</CardTitle><CardDescription>{tr('Пример распределения RGB', 'Sample RGB distribution')}</CardDescription></CardHeader><CardContent><HistogramPreview /></CardContent></Card></aside>
      </div>
    </InteractionLockProvider></div>
    <div className="kit-preview-controls"><span className="text-xs text-muted-foreground">{tr('Состояние превью', 'Preview state')}</span><div className="kit-segment">{(['image', 'loading', 'empty'] as const).map(state => <Button key={state} variant="ghost" size="sm" aria-pressed={previewState === state} onClick={() => setPreview(state)}>{state === 'image' ? tr('Фото', 'Photo') : state === 'loading' ? tr('Загрузка', 'Loading') : tr('Пусто', 'Empty')}</Button>)}</div></div>
    <p className="kit-prototype-note">{tr('Здесь проверяем оформление. Эффекты, обработка и гистограмма показаны для примера; реальные фильтры доступны в рабочем редакторе.', 'This page previews the design. Effects, processing and the histogram are demonstrations; use the working editor for actual filters.')}</p>
  </section>;
}
