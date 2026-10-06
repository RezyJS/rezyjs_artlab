'use client';

import { useState } from 'react';
import { ArrowRight, Check, Download, Info, LoaderCircle, RotateCcw, Trash2, Upload } from 'lucide-react';
import { useAppearance } from '@/shared/ui/appearance-provider';
import { notify } from '@/shared/ui/sonner';
import { Button, type ButtonProps } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Input } from '@/shared/ui/input';
import { NativeSelect } from '@/shared/ui/native-select';
import { Slider } from '@/shared/ui/slider';
import { Checkbox } from '@/shared/ui/checkbox';
import { Skeleton } from '@/shared/ui/skeleton';
import { Alert } from '@/shared/ui/alert';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/shared/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';

export function ExportExample({ label, filename = 'image.webp', variant = 'default' }: { label?: string; filename?: string; variant?: ButtonProps['variant'] }) {
  const { tr } = useAppearance();
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState('webp');
  const [quality, setQuality] = useState(95);
  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild><Button variant={variant}><Download size={16} />{label ?? tr('Скачать', 'Download')}</Button></DialogTrigger>
    <DialogContent>
      <Badge variant="outline" className="w-fit">{tr('Пример диалога', 'Dialog example')}</Badge>
      <DialogTitle>{tr('Сохранить изображение', 'Save image')}</DialogTitle>
      <DialogDescription>{tr('Выберите формат и качество для ', 'Choose format and quality for ')}{filename}.</DialogDescription>
      <label className="block space-y-2 text-xs"><span className="block">{tr('Формат', 'Format')}</span><NativeSelect aria-label={tr('Формат в примере экспорта', 'Preview export format')} value={format} onChange={event => setFormat(event.target.value)}><option value="webp">{tr('WebP — для интернета', 'WebP — for the web')}</option><option value="png">{tr('PNG — с прозрачностью', 'PNG — with transparency')}</option><option value="jpeg">{tr('JPEG — для фотографии', 'JPEG — for photos')}</option></NativeSelect></label>
      {format !== 'png' && <div className="space-y-3"><label className="kit-setting-label" htmlFor="demo-quality">{tr('Качество', 'Quality')}<span>{quality}%</span></label><Slider id="demo-quality" aria-label={tr('Качество в примере экспорта', 'Preview export quality')} min={1} max={100} value={[quality]} onValueChange={values => setQuality(values[0])} /></div>}
      <Alert className="flex items-start gap-2"><Info size={16} className="shrink-0" /><p>{tr('Это визуальный пример окна. Реальный экспорт доступен в редакторе.', 'This is a dialog preview. Actual export is available in the working editor.')}</p></Alert>
      <DialogFooter className="mt-2 gap-3 sm:gap-0"><DialogClose asChild><Button variant="outline">{tr('Отмена', 'Cancel')}</Button></DialogClose><Button onClick={() => { setOpen(false); notify.success(tr('Настройки экспорта выбраны', 'Export settings selected'), { description: format.toUpperCase() + (format !== 'png' ? ' · ' + quality + '%' : '') }); }}><Check size={16} />{tr('Готово', 'Done')}</Button></DialogFooter>
    </DialogContent>
  </Dialog>;
}

export function ComponentGallery() {
  const { tr } = useAppearance();
  const [strength, setStrength] = useState(64);
  const [checked, setChecked] = useState(true);
  const feedback = () => notify.info(tr('Кнопка работает', 'The button works'), { description: tr('Так выглядит обратная связь в новом UI kit.', 'This is feedback in the new UI kit.') });
  const demoProcessing = () => {
    const id = notify.loading(tr('Обработка изображения…', 'Processing image…'));
    window.setTimeout(() => notify.success(tr('Изображение готово', 'Image ready'), { id, description: tr('Демонстрация уведомления завершена.', 'The notification demonstration is complete.') }), 1200);
  };
  return <div className="kit-gallery">
    <Card><CardHeader><CardTitle>{tr('Кнопки', 'Buttons')}</CardTitle><CardDescription>{tr('Один акцент для главного действия.', 'One accent for the main action.')}</CardDescription></CardHeader><CardContent className="space-y-5">
      <div className="flex flex-wrap gap-3"><Button onClick={feedback}>{tr('Применить', 'Apply')}<ArrowRight /></Button><Button variant="outline" onClick={feedback}><Upload />{tr('Загрузить', 'Upload')}</Button></div>
      <div className="flex flex-wrap gap-2"><Button variant="secondary" size="sm" onClick={feedback}>{tr('Вторичная', 'Secondary')}</Button><Button variant="ghost" size="sm" onClick={feedback}>{tr('Тихая', 'Ghost')}</Button><Button variant="link" size="sm" onClick={feedback}>{tr('Ссылка', 'Link')}</Button></div>
      <div className="flex flex-wrap gap-3"><Button variant="outline" size="icon" aria-label={tr('Пример сброса', 'Reset example')} onClick={feedback}><RotateCcw /></Button><Button variant="destructive" onClick={() => notify.info(tr('Пример удаления', 'Delete example'), { action: { label: tr('Отменить', 'Undo'), onClick: () => notify.success(tr('Действие отменено', 'Action undone')) } })}><Trash2 />{tr('Удалить', 'Delete')}</Button></div>
      <Button disabled>{tr('Недоступно', 'Disabled')}</Button>
      <p className="text-xs text-muted-foreground">{tr('Удаление выделено приглушённым красным. Остальные действия используют акцент и нейтральные цвета.', 'Delete uses a muted red. Other actions use the accent and neutral colours.')}</p>
    </CardContent></Card>
    <Card><CardHeader><CardTitle>{tr('Поля и выбор', 'Inputs & selects')}</CardTitle><CardDescription>{tr('Обычное поле, фокус и ошибка ввода.', 'Default, focused and invalid states.')}</CardDescription></CardHeader><CardContent className="space-y-4">
      <label className="block"><span className="kit-setting-label">{tr('Название файла', 'Filename')}</span><Input aria-label={tr('Пример названия файла', 'Filename example')} defaultValue="my-experiment.webp" /></label>
      <label className="block"><span className="kit-setting-label">{tr('Формат', 'Format')}</span><NativeSelect aria-label={tr('Пример выбора формата', 'Format selection example')}><option>WebP</option><option>PNG</option><option>JPEG</option></NativeSelect></label>
      <label className="block"><span className="kit-setting-label">{tr('Размер окна', 'Window size')}</span><Input aria-label={tr('Пример ошибки ввода', 'Invalid input example')} aria-invalid="true" aria-describedby="kit-input-error" defaultValue="0" /><span id="kit-input-error" className="mt-1.5 block text-xs text-destructive">{tr('Введите число от 1 до 50.', 'Enter a number between 1 and 50.')}</span></label>
      <Input aria-label={tr('Пример недоступного поля', 'Disabled input example')} value={tr('Недоступно при обработке', 'Disabled while processing')} disabled />
    </CardContent></Card>
    <Card><CardHeader><CardTitle>{tr('Настройки', 'Controls')}</CardTitle><CardDescription>{tr('Параметры, которые приятно менять.', 'Parameters you can interact with.')}</CardDescription></CardHeader><CardContent className="space-y-6">
      <div><label className="kit-setting-label" htmlFor="sample-strength">{tr('Значение', 'Value')}<span className="text-foreground">{strength}%</span></label><Slider id="sample-strength" aria-label={tr('Пример слайдера', 'Slider example')} max={100} value={[strength]} onValueChange={values => setStrength(values[0])} /></div>
      <div className="grid grid-cols-2 gap-3"><label><span className="kit-setting-label">{tr('Ширина', 'Width')}</span><Input aria-label={tr('Пример ширины', 'Width example')} type="number" defaultValue={5} min={1} max={50} /></label><label><span className="kit-setting-label">{tr('Высота', 'Height')}</span><Input aria-label={tr('Пример высоты', 'Height example')} type="number" defaultValue={5} min={1} max={50} /></label></div>
      <label className="flex items-center gap-2 text-xs"><Checkbox checked={checked} onCheckedChange={value => setChecked(value === true)} />{tr('Показывать гистограмму', 'Show histogram')}</label>
      <label className="flex items-center gap-2 text-xs text-muted-foreground"><Checkbox disabled />{tr('Недоступная настройка', 'Disabled control')}</label>
      <Button className="w-full" disabled><LoaderCircle className="animate-spin motion-reduce:animate-none" />{tr('Обработка', 'Processing')}</Button>
    </CardContent></Card>
    <Card><CardHeader><CardTitle>{tr('Статусы и загрузка', 'Status & loading')}</CardTitle><CardDescription>{tr('Обратная связь рядом с содержимым.', 'Feedback next to the content.')}</CardDescription></CardHeader><CardContent className="space-y-4">
      <div className="flex flex-wrap gap-2"><Badge variant="success"><Check size={11} />{tr('Готово', 'Ready')}</Badge><Badge variant="warning">{tr('В процессе', 'Processing')}</Badge><Badge variant="destructive">{tr('Ошибка', 'Error')}</Badge></div>
      <Alert className="flex items-start gap-2"><Info size={15} className="shrink-0" /><p>{tr('WebP подходит для публикации в интернете.', 'WebP is suitable for publishing on the web.')}</p></Alert>
      <Alert variant="destructive">{tr('Не удалось загрузить изображение. Попробуйте другой файл.', 'Could not load the image. Try a different file.')}</Alert>
      <div className="flex items-center gap-3"><Skeleton className="size-10 shrink-0" /><div className="w-full space-y-2"><Skeleton className="h-2 w-3/4" /><Skeleton className="h-2 w-1/2" /></div></div>
    </CardContent></Card>
    <Card className="kit-gallery-wide"><CardHeader><CardTitle>{tr('Палитра и типографика', 'Palette & typography')}</CardTitle><CardDescription>{tr('Нейтральная основа, выбранный акцент и смысловые цвета.', 'Neutral surfaces, your accent and semantic colours.')}</CardDescription></CardHeader><CardContent>
      <div className="kit-palette">{[{ label: tr('Основа', 'Surface'), value: 'hsl(var(--card))', token: 'Card' }, { label: tr('Акцент', 'Accent'), value: 'hsl(var(--primary))', token: 'Primary' }, { label: tr('Подложка', 'Shadow'), value: 'var(--kit-shadow-color)', token: 'Shadow' }, { label: tr('Удаление', 'Danger'), value: 'hsl(var(--destructive))', token: 'Destructive' }].map(swatch => <div key={swatch.token}><div className="kit-swatch" style={{ background: swatch.value }} /><p className="mt-2 text-xs">{swatch.label}</p><p className="mt-0.5 text-[10px] text-muted-foreground">{swatch.token}</p></div>)}</div>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2"><div><p className="text-2xl font-semibold tracking-tight">{tr('Маленькая лаборатория', 'A little laboratory')}</p><p className="mt-1 text-sm font-medium">{tr('Большие возможности', 'Lots to explore')}</p></div><p className="text-xs leading-6 text-muted-foreground">{tr('Ясные названия, короткие подсказки и достаточно воздуха. Тени и состояния выбора следуют за акцентным цветом.', 'Clear labels, short hints and room to breathe. Shadows and selected states follow your accent colour.')}</p></div>
    </CardContent></Card>
    <Card className="kit-gallery-wide"><CardHeader><CardTitle>{tr('Диалоги и подсказки', 'Dialogs & hints')}</CardTitle><CardDescription>{tr('Диалог появляется из центра с лёгким масштабированием.', 'Dialogs fade and scale in from the centre.')}</CardDescription></CardHeader><CardContent className="space-y-5">
      <div className="flex flex-wrap gap-4"><ExportExample label={tr('Открыть диалог', 'Open dialog')} variant="outline" /><Popover><PopoverTrigger asChild><Button variant="secondary"><Info size={16} />{tr('Показать подсказку', 'Show hint')}</Button></PopoverTrigger><PopoverContent><p className="mb-2 text-sm font-semibold">{tr('Медианный фильтр', 'Median filter')}</p><p className="text-xs leading-6 text-muted-foreground">{tr('Помогает удалить точечный шум. Чем больше окно, тем сильнее сглаживание мелких деталей.', 'Removes speckle noise. A larger window smooths small details more strongly.')}</p></PopoverContent></Popover></div>
      <p className="text-xs text-muted-foreground">{tr('Tab переключает фокус, Escape закрывает окно. Тема и акцент действуют и внутри диалога.', 'Tab moves focus, Escape closes the dialog. The theme and accent apply inside the dialog too.')}</p>
    </CardContent></Card>
    <Card className="kit-gallery-wide"><CardHeader><CardTitle>{tr('Уведомления Sonner', 'Sonner notifications')}</CardTitle><CardDescription>{tr('Успех, ошибка, информация и обработка. Можно закрыть или отменить действие.', 'Success, error, information and progress. Dismiss a toast or undo an action.')}</CardDescription></CardHeader><CardContent className="flex flex-wrap gap-3">
      <Button variant="outline" onClick={() => notify.success(tr('Изображение готово', 'Image ready'), { description: tr('Теперь можно сохранить результат.', 'You can now save the result.') })}>{tr('Успех', 'Success')}</Button>
      <Button variant="outline" onClick={() => notify.error(tr('Не удалось загрузить файл', 'Could not load the file'), { description: tr('Попробуйте другое изображение.', 'Try a different image.') })}>{tr('Ошибка', 'Error')}</Button>
      <Button variant="outline" onClick={() => notify.info(tr('Изменения сброшены', 'Changes reset'), { action: { label: tr('Отменить', 'Undo'), onClick: () => notify.success(tr('Изменения восстановлены', 'Changes restored')) } })}>{tr('С действием', 'With action')}</Button>
      <Button variant="outline" onClick={demoProcessing}>{tr('Обработка → готово', 'Processing → ready')}</Button>
    </CardContent></Card>
  </div>;
}
