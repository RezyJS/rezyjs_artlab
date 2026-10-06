'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Check, Info, LoaderCircle, Undo2 } from 'lucide-react';
import { useAppearance } from '@/shared/ui/appearance-provider';
import { notify } from '@/shared/ui/sonner';
import { Button, type ButtonProps } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Input } from '@/shared/ui/input';
import { NativeSelect } from '@/shared/ui/native-select';
import { Slider } from '@/shared/ui/slider';
import { Checkbox } from '@/shared/ui/checkbox';
import { Skeleton } from '@/shared/ui/skeleton';
import { Alert } from '@/shared/ui/alert';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/shared/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { CollapsibleSection } from '@/shared/ui/collapsible-section';
import { ActionHint } from '@/shared/ui/action-hint';
import { ParameterHelp } from '@/shared/ui/parameter-help';
import { Kbd } from '@/shared/ui/kbd';
import { InteractionLockProvider } from '@/shared/ui/interaction-lock';

const variants: Array<ButtonProps['variant']> = ['default', 'outline', 'secondary', 'ghost', 'link', 'destructive'];

export function ComponentGallery() {
  const { tr } = useAppearance();
  const id = useId();
  const [clicks, setClicks] = useState(0);
  const [selected, setSelected] = useState(false);
  const [windowSize, setWindowSize] = useState('0');
  const [quality, setQuality] = useState(64);
  const [checked, setChecked] = useState(true);
  const [mixed, setMixed] = useState<boolean | 'indeterminate'>('indeterminate');
  const [openSection, setOpenSection] = useState<number | null>(1);
  const [processing, setProcessing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const loadingToast = useRef<string | number | null>(null);
  const numericWindow = Number(windowSize);
  const validWindow = windowSize !== '' && Number.isInteger(numericWindow) && numericWindow >= 1 && numericWindow <= 50;
  useEffect(() => () => { if (loadingToast.current !== null) notify.dismiss(loadingToast.current); }, []);
  const count = () => setClicks(value => value + 1);
  const startToast = () => {
    if (loadingToast.current !== null) return;
    loadingToast.current = notify.loading(tr('Загрузка…', 'Loading…'), { onDismiss: () => { loadingToast.current = null; setLoading(false); } });
    setLoading(true);
  };
  const finishToast = () => {
    if (loadingToast.current === null) return;
    notify.success(tr('Готово', 'Done'), { id: loadingToast.current });
    loadingToast.current = null;
    setLoading(false);
  };

  return <div className="kit-gallery">
    <Card id="kit-buttons"><CardHeader><CardTitle>{tr('Кнопки', 'Buttons')}</CardTitle></CardHeader><CardContent className="space-y-5">
      <div className="flex flex-wrap gap-3">{variants.map(variant => <Button key={variant} variant={variant} onClick={count}>{variant}</Button>)}</div>
      <div className="flex flex-wrap items-center gap-3">{(['sm', 'default', 'lg'] as const).map(size => <Button key={size} size={size} variant="outline" onClick={count}>{size}</Button>)}</div>
      <div className="flex flex-wrap gap-3"><Button variant="nav" aria-pressed={selected} onClick={() => setSelected(value => !value)}>{tr('Выбран', 'Selected')}</Button><Button disabled>{tr('Недоступно', 'Disabled')}</Button><Button disabled><LoaderCircle className="animate-spin motion-reduce:animate-none" />{tr('Обработка', 'Processing')}</Button></div>
      <div className="flex flex-wrap gap-3">{[
        ['lift', tr('Подъём', 'Lift')], ['tilt', tr('Наклон', 'Tilt')], ['scale', tr('Масштаб', 'Scale')],
      ].map(([motion, label]) => <Button key={motion} variant="outline" data-motion={motion} onClick={count}>{label}</Button>)}</div>
      <output className="kit-test-output" aria-live="polite">{tr('Нажатий: ', 'Clicks: ')}{clicks}</output>
    </CardContent></Card>

    <Card id="kit-inputs"><CardHeader><CardTitle>{tr('Поля', 'Inputs')}</CardTitle></CardHeader><CardContent className="space-y-4">
      <label className="block"><span className="kit-setting-label">{tr('Имя файла', 'File name')}</span><Input defaultValue="image.webp" /></label>
      <label className="block"><span className="kit-setting-label">{tr('Формат', 'Format')}</span><NativeSelect defaultValue="webp"><option value="webp">WebP</option><option value="png">PNG</option><option value="jpeg">JPEG</option></NativeSelect></label>
      <label className="block"><span className="kit-setting-label">{tr('Размер окна', 'Window size')}</span><Input type="number" min={1} max={50} step={1} value={windowSize} onChange={event => setWindowSize(event.target.value)} aria-invalid={!validWindow} aria-describedby={id + '-input-hint'} /><span id={id + '-input-hint'} className={'mt-1.5 block text-xs ' + (validWindow ? 'text-muted-foreground' : 'text-destructive')}>{tr('Целое число от 1 до 50.', 'An integer from 1 to 50.')}</span></label>
      <label className="block"><span className="kit-setting-label">disabled</span><Input defaultValue={tr('Недоступно', 'Disabled')} disabled /></label>
      <label className="block"><span className="kit-setting-label">readOnly</span><Input value="image.webp" readOnly /></label>
    </CardContent></Card>

    <Card id="kit-controls"><CardHeader><CardTitle>{tr('Выбор', 'Controls')}</CardTitle></CardHeader><CardContent className="space-y-6">
      <div><label className="kit-setting-label" htmlFor={id + '-quality'}>{tr('Качество', 'Quality')}<output>{quality}%</output></label><Slider id={id + '-quality'} aria-label={tr('Качество', 'Quality')} min={1} max={100} value={[quality]} onValueChange={values => setQuality(values[0])} /></div>
      <label className="flex items-center gap-2 text-xs"><Checkbox checked={checked} onCheckedChange={value => setChecked(value === true)} />{tr('Включено', 'Enabled')}</label>
      <label className="flex items-center gap-2 text-xs"><Checkbox checked={mixed} onCheckedChange={setMixed} />{tr('Частичный выбор', 'Indeterminate')}</label>
      <label className="flex items-center gap-2 text-xs text-muted-foreground"><Checkbox disabled />disabled</label>
      <Slider aria-label={tr('Недоступный слайдер', 'Disabled slider')} disabled value={[50]} />
    </CardContent></Card>

    <Card id="kit-collapses"><CardHeader><CardTitle>{tr('Коллапсы', 'Collapses')}</CardTitle></CardHeader><CardContent>
      {[1, 2, 3].map(section => <CollapsibleSection key={section} className="kit-test-collapse" title={tr('Раздел ', 'Section ') + section} open={openSection === section} onToggle={() => setOpenSection(previous => previous === section ? null : section)}>
        <label className="block"><span className="kit-setting-label">{tr('Поле ', 'Input ') + section}</span><Input defaultValue={String(section)} /></label>
      </CollapsibleSection>)}
    </CardContent></Card>

    <Card id="kit-loading"><CardHeader><CardTitle>{tr('Загрузка', 'Loading')}</CardTitle></CardHeader><CardContent className="space-y-4">
      <Button variant="outline" aria-pressed={processing} onClick={() => setProcessing(value => !value)}>{processing ? tr('Остановить', 'Stop') : tr('Запустить', 'Start')}</Button>
      <div className="kit-test-preview" aria-busy={processing}>
        <div className="kit-test-preview-shapes" aria-hidden="true"><span /><span /><span /></div>
        {processing && <div className="image-processing-overlay" role="status"><LoaderCircle className="image-processing-spinner animate-spin motion-reduce:animate-none" /><span className="sr-only">{tr('Обработка…', 'Processing…')}</span></div>}
      </div>
      <InteractionLockProvider value={processing}><div className="flex items-center gap-3"><Input aria-label={tr('Поле при обработке', 'Input while processing')} defaultValue="image.webp" /><Button onClick={count}>{tr('Применить', 'Apply')}</Button></div></InteractionLockProvider>
      <div className="space-y-2"><span className="kit-setting-label">Skeleton</span><Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-1/2" /></div>
    </CardContent></Card>

    <Card id="kit-status"><CardHeader><CardTitle>{tr('Статусы', 'Status')}</CardTitle></CardHeader><CardContent className="space-y-4">
      <div className="flex flex-wrap gap-2"><Badge>default</Badge><Badge variant="secondary">secondary</Badge><Badge variant="outline">outline</Badge><Badge variant="success"><Check size={11} />{tr('Готово', 'Ready')}</Badge><Badge variant="warning">{tr('Обработка', 'Processing')}</Badge><Badge variant="destructive">{tr('Ошибка', 'Error')}</Badge></div>
      <Alert className="flex items-start gap-2"><Info size={16} className="shrink-0" /><span>{tr('Информация', 'Information')}</span></Alert>
      <Alert variant="destructive">{tr('Не удалось загрузить файл.', 'Could not load the file.')}</Alert>
    </CardContent></Card>

    <Card id="kit-tokens" className="kit-gallery-wide"><CardHeader><CardTitle>{tr('Палитра и текст', 'Palette and text')}</CardTitle></CardHeader><CardContent>
      <div className="kit-palette">{[
        { token: 'card', value: 'hsl(var(--card))' }, { token: 'primary', value: 'hsl(var(--primary))' },
        { token: 'shadow', value: 'var(--kit-shadow-color)' }, { token: 'destructive', value: 'hsl(var(--destructive))' },
      ].map(swatch => <div key={swatch.token}><div className="kit-swatch" style={{ background: swatch.value }} /><p className="mt-2 text-xs">{swatch.token}</p></div>)}</div>
      <div className="mt-6 space-y-2"><p className="text-2xl font-semibold">{tr('Заголовок', 'Heading')}</p><p>{tr('Обычный текст', 'Body text')}</p><p className="text-xs text-muted-foreground">{tr('Подпись', 'Caption')}</p><Kbd>Ctrl + Z</Kbd></div>
    </CardContent></Card>

    <Card id="kit-dialogs" className="kit-gallery-wide"><CardHeader><CardTitle>{tr('Диалоги и подсказки', 'Dialogs and hints')}</CardTitle></CardHeader><CardContent>
      <div className="kit-test-hints">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}><DialogTrigger asChild><Button variant="outline">{tr('Открыть диалог', 'Open dialog')}</Button></DialogTrigger><DialogContent>
          <DialogTitle>{tr('Диалог', 'Dialog')}</DialogTitle><DialogDescription>Tab — {tr('фокус', 'focus')}, Esc — {tr('закрыть', 'close')}.</DialogDescription>
          <label><span className="kit-setting-label">{tr('Название', 'Name')}</span><Input defaultValue="image" /></label>
          <DialogFooter className="gap-3"><DialogClose asChild><Button variant="outline">{tr('Отмена', 'Cancel')}</Button></DialogClose><Button onClick={() => { setDialogOpen(false); notify.info(tr('Подтверждено', 'Confirmed')); }}>{tr('Подтвердить', 'Confirm')}</Button></DialogFooter>
        </DialogContent></Dialog>
        <Popover><PopoverTrigger asChild><Button variant="secondary">Popover</Button></PopoverTrigger><PopoverContent><label><span className="kit-setting-label">{tr('Значение', 'Value')}</span><Input defaultValue="5" /></label></PopoverContent></Popover>
        <ActionHint label={tr('Отменить', 'Undo')} shortcut="Ctrl+Z"><Button variant="outline" size="icon" aria-label={tr('Отменить', 'Undo')} onClick={count}><Undo2 /></Button></ActionHint>
        <div className="flex items-center gap-2"><span className="text-xs">{tr('Размер окна', 'Window size')}</span><ParameterHelp label={tr('Размер окна', 'Window size')}>{tr('Целое число от 1 до 50.', 'An integer from 1 to 50.')}</ParameterHelp></div>
      </div>
    </CardContent></Card>

    <Card id="kit-toasts" className="kit-gallery-wide"><CardHeader><CardTitle>Sonner</CardTitle></CardHeader><CardContent className="flex flex-wrap gap-3">
      <Button variant="outline" onClick={() => notify.success(tr('Успех', 'Success'))}>{tr('Успех', 'Success')}</Button>
      <Button variant="outline" onClick={() => notify.error(tr('Ошибка', 'Error'))}>{tr('Ошибка', 'Error')}</Button>
      <Button variant="outline" onClick={() => notify.info(tr('Информация', 'Information'))}>{tr('Информация', 'Information')}</Button>
      <Button variant="outline" onClick={() => notify.info(tr('С действием', 'With action'), { action: { label: tr('Отменить', 'Undo'), onClick: () => notify.success(tr('Отменено', 'Undone')) } })}>{tr('С действием', 'With action')}</Button>
      <Button variant="outline" disabled={loading} onClick={startToast}>{tr('Загрузка', 'Loading')}</Button>
      <Button variant="outline" disabled={!loading} onClick={finishToast}>{tr('Завершить', 'Finish')}</Button>
      <Button variant="ghost" onClick={() => { loadingToast.current = null; setLoading(false); notify.dismiss(); }}>{tr('Закрыть все', 'Dismiss all')}</Button>
    </CardContent></Card>
  </div>;
}
