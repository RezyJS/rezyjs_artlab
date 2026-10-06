'use client';

import { useState } from 'react';
import { Info } from 'lucide-react';
import { useAppearance } from '@/shared/ui/appearance-provider';
import type { FilterDefinition } from '@/features/image-filters';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { NativeSelect } from '@/shared/ui/native-select';
import { Slider } from '@/shared/ui/slider';
import { ColorPicker } from '@/shared/ui/color-picker';
import { HistogramPreview } from './HistogramPreview';

export function FilterSettings({ filter, onApply, disabled }: { filter: FilterDefinition; onApply: () => void; disabled?: boolean }) {
  const { tr } = useAppearance();
  const [value, setValue] = useState(filter.setting === 'gamma' ? 1 : 128);
  const [width, setWidth] = useState(5);
  const [height, setHeight] = useState(5);
  const [low, setLow] = useState(0);
  const [high, setHigh] = useState(255);
  const [color, setColor] = useState('#a18bff');
  const [mode, setMode] = useState('more');
  return (
    <Card>
      <CardHeader>
        <div className="kit-eyebrow mb-2">{tr("Параметры эффекта", "Effect settings")}</div>
        <CardTitle>{filter.label}{filter.setting === 'window' ? tr(' фильтр', ' filter') : ''}</CardTitle>
        <CardDescription>{filter.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {filter.setting === 'window' && <div className="grid grid-cols-2 gap-3">
          <label><span className="kit-setting-label">{tr("Ширина окна", "Window width")}</span><Input aria-label={tr("Ширина окна", "Window width")} type="number" min={1} max={50} value={width} onChange={event => setWidth(+event.target.value)} /></label>
          <label><span className="kit-setting-label">{tr("Высота окна", "Window height")}</span><Input aria-label={tr("Высота окна", "Window height")} type="number" min={1} max={50} value={height} onChange={event => setHeight(+event.target.value)} /></label>
        </div>}
        {['value', 'brightness', 'threshold'].includes(filter.setting) && <div>
          <label className="kit-setting-label" htmlFor="filter-value">{filter.setting === 'threshold' ? tr("Порог", "Threshold") : tr("Значение", "Value")}<span className="text-foreground">{value}</span></label>
          <Slider id="filter-value" aria-label={tr("Значение фильтра", "Filter value")} value={[value]} min={0} max={255} step={1} onValueChange={values => setValue(values[0])} />
        </div>}
        {['brightness', 'contrast'].includes(filter.setting) && <label>
          <span className="kit-setting-label">{tr("Действие", "Action")}</span>
          <NativeSelect aria-label={tr("Действие фильтра", "Filter action")} value={mode} onChange={event => setMode(event.target.value)}><option value="more">{filter.setting === 'brightness' ? tr("Светлее", "Lighter") : tr("Повысить", "Increase")}</option><option value="less">{filter.setting === 'brightness' ? tr("Темнее", "Darker") : tr("Понизить", "Decrease")}</option></NativeSelect>
        </label>}
        {filter.setting === 'contrast' && <div className="grid grid-cols-2 gap-3">
          <label><span className="kit-setting-label">{tr("Нижняя граница", "Lower bound")}</span><Input aria-label={tr("Нижняя граница", "Lower bound")} type="number" value={low} min={0} max={high - 1} onChange={event => setLow(+event.target.value)} /></label>
          <label><span className="kit-setting-label">{tr("Верхняя граница", "Upper bound")}</span><Input aria-label={tr("Верхняя граница", "Upper bound")} type="number" value={high} min={low + 1} max={255} onChange={event => setHigh(+event.target.value)} /></label>
        </div>}
        {['gamma', 'levels', 'coefficient'].includes(filter.setting) && <label className="block">
          <span className="kit-setting-label">{filter.setting === 'gamma' ? tr("Гамма", "Gamma") : filter.setting === 'levels' ? tr("Количество уровней", "Number of levels") : tr("Коэффициент", "Coefficient")}</span>
          <Input aria-label={tr("Параметр фильтра", "Filter parameter")} type="number" defaultValue={filter.setting === 'gamma' ? 1 : filter.setting === 'levels' ? 8 : 0.01568627} step={filter.setting === 'gamma' ? 0.1 : filter.setting === 'levels' ? 1 : 0.001} min={filter.setting === 'coefficient' ? 0 : 0.1} />
        </label>}
        {filter.setting === 'kernel' && <label className="block">
          <span className="kit-setting-label">{tr("Ядро свёртки", "Convolution kernel")}</span>
          <NativeSelect aria-label={tr("Ядро свёртки", "Convolution kernel")}><option>H1</option><option>H2</option><option>H3</option></NativeSelect>
        </label>}
        {filter.setting === 'direction' && <label className="block">
          <span className="kit-setting-label">{tr("Направление", "Direction")}</span>
          <NativeSelect aria-label={tr("Направление сдвига", "Shift direction")}><option>{tr("По горизонтали", "Horizontal")}</option><option>{tr("По вертикали", "Vertical")}</option><option>{tr("По диагонали", "Diagonal")}</option></NativeSelect>
        </label>}
        {filter.setting === 'palette' && <div className="space-y-3">
          <label className="block"><span className="kit-setting-label">{tr("Количество интервалов", "Number of intervals")}</span><Input type="number" min={1} max={255} defaultValue={3} aria-label={tr("Количество интервалов", "Number of intervals")} /></label>
          <div className="flex items-center justify-between text-xs text-muted-foreground">{tr("Цвет интервала", "Interval colour")}<ColorPicker aria-label={tr("Цвет интервала", "Interval colour")} value={color} onChange={setColor} /></div>
        </div>}
        {filter.setting === 'histogram' && <HistogramPreview />}
        {filter.setting === 'none' && <p className="text-xs text-muted-foreground">{tr("У этого фильтра нет дополнительных параметров.", "This filter has no additional settings.")}</p>}
        <div className="kit-info"><Info size={14} /><p>{filter.setting === 'window' ? (tr('Окно', 'Window') + ' ' + width + ' × ' + height + ' · ' + width * height + ' ' + tr('пикселей', 'pixels')) : tr("Проверьте, удобно ли выбирать эффект и менять его настройки.", "Try selecting an effect and adjusting its settings.")}</p></div>
        {filter.setting !== 'histogram' && <Button className="w-full" onClick={onApply} disabled={disabled || (filter.setting === 'window' && [width, height].some(size => !Number.isInteger(size) || size < 1 || size > 50))}>{tr("Применить эффект", "Apply effect")}</Button>}
      </CardContent>
    </Card>
  );
}
