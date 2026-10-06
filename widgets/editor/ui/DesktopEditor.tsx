'use client';

import { useId, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { ArrowDownUp, BarChart3, Binary, Contrast, Diamond, Droplet, Grid3X3, Info, Layers, List, MoveRight, Palette, Plus, Settings2, SlidersHorizontal, Sparkles, Square, Sun, Triangle, Waves, type LucideIcon } from 'lucide-react';
import { FileElement, ImageInfoCard } from '@/entities/image';
import { filterGroups, localizeFilter, FilterPanel, HistogramPanel } from '@/features/image-filters';
import ImageLoader, { UploadMenu } from '@/features/image-upload';
import { ExportButton } from '@/features/image-export';
import { ControlPhoto } from '@/features/image-history';
import { useAppearance } from '@/shared/ui/appearance-provider';
import { AppearanceControls } from '@/shared/ui/appearance-controls';
import { AppLogo } from '@/shared/ui/app-logo';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { CollapsibleSection } from '@/shared/ui/collapsible-section';
import { ActionHint } from '@/shared/ui/action-hint';
import { useIsMobile } from '@/shared/lib/use-mobile';

const icons: Record<string, LucideIcon> = { contrast: Contrast, sun: Sun, invert: ArrowDownUp, binary: Binary, sliders: SlidersHorizontal, chart: BarChart3, curve: Waves, grid: Grid3X3, palette: Palette, sparkles: Sparkles, drop: Droplet, triangle: Triangle, shift: MoveRight, cross: Plus, square: Square, lines: SlidersHorizontal, layers: Layers, diamond: Diamond };

export function DesktopEditor({ file }: { file: FileElement }) {
  const { appearance, tr, update } = useAppearance();
  const [selected, setSelected] = useState<string | null>(null);
  const [openGroup, setOpenGroup] = useState<string | null>('color');
  const layout = appearance.filterLayout;
  const [mobileTab, setMobileTab] = useState<'filters' | 'parameters' | 'info'>('filters');
  const isMobile = useIsMobile();
  const panelId = useId();
  const mobileTabs = useRef<HTMLElement>(null);
  const photoPanel = useRef<HTMLElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const selectedFilter = filterGroups.flatMap(group => group.filters).find(item => item.id === selected);
  const filter = selectedFilter ? localizeFilter(selectedFilter, appearance.locale) : null;
  const scrollTo = (element: HTMLElement | null) => {
    if (!isMobile) return;
    requestAnimationFrame(() => element?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }));
  };
  const tabs = [
    { id: 'filters' as const, label: tr('Функции', 'Functions'), icon: Grid3X3, disabled: false },
    { id: 'parameters' as const, label: tr('Параметры', 'Settings'), icon: SlidersHorizontal, disabled: !filter || filter.setting === 'histogram' },
    { id: 'info' as const, label: tr('Данные', 'Info'), icon: Info, disabled: false },
  ];
  const choose = (id: string) => {
    if (file.isProcessing) return;
    setSelected(id); setOpenGroup(filterGroups.find(group => group.filters.some(item => item.id === id))!.id);
    if (isMobile) {
      const tab = id === 'histogram' ? 'info' : 'parameters';
      setMobileTab(tab);
      requestAnimationFrame(() => document.getElementById(panelId + '-tab-' + tab)?.focus({ preventScroll: true }));
      scrollTo(mobileTabs.current);
    }
  };
  const openCategory = (id: string) => {
    if (file.isProcessing) return;
    setOpenGroup(id);
    if (isMobile) { setMobileTab('filters'); scrollTo(mobileTabs.current); }
  };
  const showResult = () => {
    if (!isMobile) return;
    const focused = document.activeElement;
    if (focused instanceof HTMLElement && focused.matches('input, textarea')) focused.blur();
    scrollTo(photoPanel.current);
  };
  useHotkeys('ctrl+1', () => openCategory('color'), { preventDefault: true }, [file, isMobile]);
  useHotkeys('ctrl+2', () => openCategory('noise'), { preventDefault: true }, [file, isMobile]);
  useHotkeys('ctrl+3', () => openCategory('edges'), { preventDefault: true }, [file, isMobile]);

  return <main className="editor-desktop">
    <header className="editor-topbar">
      <div className="kit-brand"><AppLogo className="app-logo" /><div><h1>ArtLab</h1></div></div>
      <div className="editor-toolbar-actions">
        <Popover><ActionHint label={tr('Тема, язык и акцент', 'Theme, language and accent')}><PopoverTrigger asChild><Button variant="ghost" size="icon" aria-label={tr('Оформление', 'Appearance')}><Settings2 /></Button></PopoverTrigger></ActionHint><PopoverContent className="editor-appearance-popover"><AppearanceControls compact /></PopoverContent></Popover>
        <UploadMenu file={file} inputRef={input} /><ExportButton file={file} compact={false} />
      </div>
    </header>
    <div className="editor-desktop-grid">
      <nav ref={mobileTabs} className="editor-mobile-tabs" role="tablist" aria-label={tr('Разделы редактора', 'Editor sections')} onKeyDown={event => {
        if (file.isProcessing || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const available = tabs.filter(tab => !tab.disabled);
        const index = available.findIndex(tab => tab.id === mobileTab);
        const next = event.key === 'Home' ? available[0] : event.key === 'End' ? available[available.length - 1] : available[(index + (event.key === 'ArrowRight' ? 1 : -1) + available.length) % available.length];
        setMobileTab(next.id);
        document.getElementById(panelId + '-tab-' + next.id)?.focus();
      }}>{tabs.map(tab => <Button key={tab.id} id={panelId + '-tab-' + tab.id} role="tab" variant="nav" data-motion="none" aria-selected={mobileTab === tab.id} aria-controls={panelId + '-' + tab.id} tabIndex={mobileTab === tab.id ? 0 : -1} disabled={tab.disabled} onClick={() => { setMobileTab(tab.id); scrollTo(mobileTabs.current); }}><tab.icon /><span>{tab.label}</span></Button>)}</nav>
      <aside className="editor-catalog-panel" id={panelId + '-filters'} role={isMobile ? 'tabpanel' : undefined} aria-labelledby={isMobile ? panelId + '-tab-filters' : undefined} data-mobile-active={mobileTab === 'filters'} inert={isMobile && mobileTab !== 'filters'} aria-label={tr('Каталог фильтров', 'Filter catalogue')}>
        <Card className="editor-catalog"><CardHeader><div className="editor-catalog-title"><CardTitle>{tr('Функции', 'Functions')}</CardTitle><div className="kit-segment"><Button variant="ghost" size="icon" aria-label={tr('Сетка функций', 'Function grid')} aria-pressed={layout === 'grid'} onClick={() => update({ filterLayout: 'grid' })}><Grid3X3 /></Button><Button variant="ghost" size="icon" aria-label={tr('Список функций', 'Function list')} aria-pressed={layout === 'list'} onClick={() => update({ filterLayout: 'list' })}><List /></Button></div></div></CardHeader><CardContent>
          {filterGroups.map((group, index) => <CollapsibleSection key={group.id} className="kit-filter-group" title={appearance.locale === 'ru' ? group.label : ['Colour', 'Noise', 'Edges'][index]} open={openGroup === group.id} shortcut={'Ctrl+' + (index + 1)} disabled={file.isProcessing} onToggle={() => setOpenGroup(openGroup === group.id ? null : group.id)}><div className={'kit-filter-list' + (layout === 'grid' ? ' kit-filter-grid' : '')}>{group.filters.map(item => {
            const localized = localizeFilter(item, appearance.locale), Icon = icons[item.icon];
            const label = layout === 'grid' && item.id === 'medianFilter' ? tr('Медиана', 'Median') : layout === 'grid' && item.id === 'lowFreq' ? tr('Низкие частоты', 'Low-pass') : layout === 'grid' && item.id === 'highFreq' ? tr('Высокие частоты', 'High-pass') : localized.label;
            return <Button key={item.id} variant="nav" aria-label={localized.label} aria-pressed={selected === item.id} title={localized.description} onClick={() => choose(item.id)}><Icon /><span>{label}</span></Button>;
          })}</div></CollapsibleSection>)}
        </CardContent></Card>
      </aside>
      <section ref={photoPanel} className="editor-preview" aria-label={tr('Изображение', 'Image')}>
        <Card><CardHeader><CardTitle>{tr('Изображение', 'Image')}</CardTitle></CardHeader><CardContent>
          <div className="editor-photo-surface"><ImageLoader file={file} desktop inputRef={input} /></div>
          <ControlPhoto file={file} transformations />
        </CardContent></Card>
      </section>
      <aside className="editor-settings" data-mobile-active={mobileTab !== 'filters'} aria-label={tr('Настройки и данные изображения', 'Image settings and information')}>
        <div className="editor-filter-settings" id={panelId + '-parameters'} role={isMobile ? 'tabpanel' : undefined} aria-labelledby={isMobile ? panelId + '-tab-parameters' : undefined} data-mobile-active={mobileTab === 'parameters'} inert={isMobile && mobileTab !== 'parameters'}>{filter && filter.setting !== 'histogram' && <FilterPanel key={selected} file={file} filter={filter} onApplied={showResult} />}</div>
        <div className="editor-image-details" id={panelId + '-info'} role={isMobile ? 'tabpanel' : undefined} aria-labelledby={isMobile ? panelId + '-tab-info' : undefined} data-mobile-active={mobileTab === 'info'} inert={isMobile && mobileTab !== 'info'}><HistogramPanel file={file} /><ImageInfoCard file={file} /></div>
      </aside>
    </div>
  </main>;
}
