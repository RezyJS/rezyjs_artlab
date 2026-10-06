'use client';

import { useId, useState, useSyncExternalStore } from 'react';
import { Check } from 'lucide-react';
import { FileElement, imageOperation } from '@/entities/image';
import type { Operation } from '@/shared/lib/image-processing';
import { useAppearance } from '@/shared/ui/appearance-provider';
import { notify } from '@/shared/ui/sonner';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { NativeSelect } from '@/shared/ui/native-select';
import { Slider } from '@/shared/ui/slider';
import { ColorPicker } from '@/shared/ui/color-picker';
import type { FilterDefinition } from '../model/catalog';
import { ParameterHelp } from '@/shared/ui/parameter-help';
import { kernelOptions, parameterHelp } from '../model/parameter-help';

const defaultColors = ['#7c3aed', '#315dcc', '#df7597'];

export function FilterPanel({ filter, file, onApplied }: { filter: FilterDefinition; file: FileElement; onApplied?: () => void }) {
  const { tr } = useAppearance();
  useSyncExternalStore(file.subscribe, file.getSnapshot, file.getServerSnapshot);
  const [value, setValue] = useState(filter.id === 'negative' ? 0 : filter.setting === 'brightness' ? 10 : 128);
  const [width, setWidth] = useState(5);
  const [height, setHeight] = useState(5);
  const [low, setLow] = useState(0);
  const [high, setHigh] = useState(255);
  const [scalar, setScalar] = useState(filter.setting === 'gamma' ? 1 : filter.setting === 'levels' ? 8 : 4 / 255);
  const [mode, setMode] = useState('more');
  const [kernel, setKernel] = useState('H1');
  const [direction, setDirection] = useState('horizontal');
  const [relief, setRelief] = useState('in');
  const [count, setCount] = useState(3);
  const [cuts, setCuts] = useState([85, 170]);
  const [colors, setColors] = useState(defaultColors);
  const boundaries = [0, ...cuts, 255];
  const id = useId();
  const help = parameterHelp(filter, tr);
  const kernels = kernelOptions(filter.id === 'lowFreq', tr);
  const numeric = (input: string) => input.trim() === '' ? NaN : Number(input);
  const inputValue = (input: number) => Number.isFinite(input) ? input : '';
  const label = (key: string, text: string, explanation: string) => <div className="kit-setting-label"><label htmlFor={id + key}>{text}</label><ParameterHelp label={text}>{explanation}</ParameterHelp></div>;
  const invalid = filter.setting === 'window' ? [width, height].some(n => !Number.isInteger(n) || n < 1 || n > 50)
    : filter.setting === 'contrast' ? !Number.isInteger(low) || !Number.isInteger(high) || low < 0 || high > 255 || low >= high
    : filter.setting === 'gamma' ? !Number.isFinite(scalar) || scalar <= 0
    : filter.setting === 'levels' ? !Number.isInteger(scalar) || scalar < 1 || scalar > 256
    : filter.setting === 'coefficient' ? !Number.isFinite(scalar)
    : filter.setting === 'palette' ? !Number.isInteger(count) || count < 1 || count > 255 || colors.length !== count || colors.some(color => !/^#[0-9a-f]{6}$/i.test(color)) || boundaries.some((n, i) => !Number.isInteger(n) || n < 0 || n > 255 || (i > 0 && n <= boundaries[i - 1]))
    : false;
  const validationMessage = filter.setting === 'window' ? tr('Размер окна: целые числа от 1 до 50.', 'Window size: integers from 1 to 50.')
    : filter.setting === 'contrast' ? tr('Границы: целые числа 0–255. Нижняя должна быть меньше верхней.', 'Bounds: integers from 0 to 255. The lower bound must be smaller.')
    : filter.setting === 'gamma' ? tr('Гамма должна быть больше 0.', 'Gamma must be greater than 0.')
    : filter.setting === 'levels' ? tr('Количество уровней: целое число от 1 до 256.', 'Levels: an integer from 1 to 256.')
    : filter.setting === 'palette' ? tr('Проверьте количество интервалов, порядок границ и цвета.', 'Check the interval count, bound order and colours.')
    : tr('Введите число.', 'Enter a number.');

  const apply = async () => {
    const image = file.getCurrentPhoto();
    if (!image || file.isProcessing || file.isPreviewing || invalid) return;
    const epoch = file.epoch;
    let operation = filter.id as Operation;
    let args: unknown[] = [];
    switch (filter.setting) {
      case 'value': case 'threshold': args = [value]; break;
      case 'brightness': args = [mode === 'more' ? value : -value]; break;
      case 'contrast': operation = mode === 'more' ? 'moreContrast' : 'lessContrast'; args = [low, high]; break;
      case 'gamma': case 'levels': case 'coefficient': args = [scalar]; break;
      case 'kernel': args = [image.width, image.height, kernel]; break;
      case 'window': args = [image.width, image.height, height, width]; break;
      case 'direction': args = [image.width, image.height, direction]; break;
      case 'palette': args = [boundaries, colors]; break;
      case 'none': args = filter.id === 'grayScale' ? [] : [image.width, image.height]; break;
    }
    if (filter.id === 'embossing') args = [image.width, image.height, relief];
    await imageOperation(image, operation, file, ...args);
    if (epoch === file.epoch && file.getCurrentPhoto() && file.getCurrentPhoto() !== image) {
      notify.success(tr('Эффект применён', 'Effect applied'), { id: 'image-filter-result', description: filter.label });
      onApplied?.();
    }
  };
  return <Card><CardHeader><CardTitle title={filter.description}>{filter.label}{filter.setting === 'window' ? tr(' фильтр', ' filter') : ''}</CardTitle></CardHeader><CardContent className="space-y-5">
    {filter.setting === 'window' && <div className="grid grid-cols-2 gap-3">
      <div>{label('width', tr('Ширина окна', 'Window width'), help.window)}<Input id={id + 'width'} type="number" min={1} max={50} step={1} value={inputValue(width)} onChange={event => setWidth(numeric(event.target.value))} /></div>
      <div>{label('height', tr('Высота окна', 'Window height'), help.window)}<Input id={id + 'height'} type="number" min={1} max={50} step={1} value={inputValue(height)} onChange={event => setHeight(numeric(event.target.value))} /></div>
    </div>}
    {['value', 'brightness', 'threshold'].includes(filter.setting) && <div>
      {label('value', (filter.setting === 'brightness' ? tr('Значение', 'Value') : tr('Порог', 'Threshold')) + ' · ' + value, help.value)}
      <Slider id={id + 'value'} aria-label={tr('Значение фильтра', 'Filter value')} min={0} max={255} step={1} value={[value]} onValueChange={values => setValue(values[0])} />
    </div>}
    {['brightness', 'contrast'].includes(filter.setting) && <div>
      {label('mode', tr('Действие', 'Action'), help.mode)}
      <NativeSelect id={id + 'mode'} value={mode} onChange={event => setMode(event.target.value)}><option value="more">{filter.setting === 'brightness' ? tr('Светлее', 'Lighter') : tr('Повысить', 'Increase')}</option><option value="less">{filter.setting === 'brightness' ? tr('Темнее', 'Darker') : tr('Понизить', 'Decrease')}</option></NativeSelect>
    </div>}
    {filter.setting === 'contrast' && <div className="grid grid-cols-2 gap-3">
      <div>{label('low', tr('Нижняя граница', 'Lower bound'), help.low)}<Input id={id + 'low'} type="number" min={0} max={254} step={1} value={inputValue(low)} onChange={event => setLow(numeric(event.target.value))} /></div>
      <div>{label('high', tr('Верхняя граница', 'Upper bound'), help.high)}<Input id={id + 'high'} type="number" min={1} max={255} step={1} value={inputValue(high)} onChange={event => setHigh(numeric(event.target.value))} /></div>
    </div>}
    {['gamma', 'levels', 'coefficient'].includes(filter.setting) && <div>
      {label('scalar', filter.setting === 'gamma' ? tr('Гамма', 'Gamma') : filter.setting === 'levels' ? tr('Количество уровней', 'Number of levels') : tr('Коэффициент', 'Coefficient'), help.scalar)}
      <Input id={id + 'scalar'} type="number" value={inputValue(scalar)} min={filter.setting === 'levels' ? 1 : filter.setting === 'gamma' ? 0 : undefined} max={filter.setting === 'levels' ? 256 : undefined} step={filter.setting === 'levels' ? 1 : 'any'} onChange={event => setScalar(numeric(event.target.value))} />
    </div>}
    {filter.setting === 'kernel' && <div>
      {label('kernel', tr('Ядро свёртки', 'Convolution kernel'), help.kernel)}
      <NativeSelect id={id + 'kernel'} value={kernel} onChange={event => setKernel(event.target.value)}>{kernels.map(item => <option key={item.id} value={item.id}>{item.id + ' · ' + item.name}</option>)}</NativeSelect>
    </div>}
    {filter.setting === 'direction' && <div>
      {label('direction', tr('Направление', 'Direction'), help.direction)}
      <NativeSelect id={id + 'direction'} value={direction} onChange={event => setDirection(event.target.value)}><option value="horizontal">{tr('По горизонтали', 'Horizontal')}</option><option value="vertical">{tr('По вертикали', 'Vertical')}</option><option value="diagonal">{tr('По диагонали', 'Diagonal')}</option></NativeSelect>
    </div>}
    {filter.id === 'embossing' && <div>
      {label('relief', tr('Рельеф', 'Relief'), help.relief)}
      <NativeSelect id={id + 'relief'} value={relief} onChange={event => setRelief(event.target.value)}><option value="in">{tr('Внутрь', 'Inward')}</option><option value="out">{tr('Наружу', 'Outward')}</option></NativeSelect>
    </div>}
    {filter.setting === 'palette' && <div className="space-y-4">
      <div>{label('count', tr('Количество интервалов', 'Number of intervals'), help.palette)}<Input id={id + 'count'} type="number" min={1} max={255} step={1} value={inputValue(count)} onChange={event => {
        const next = numeric(event.target.value); setCount(next);
        if (Number.isInteger(next) && next >= 1 && next <= 255) { setCuts(Array.from({ length: next - 1 }, (_, i) => Math.floor((i + 1) * 255 / next))); setColors(previous => Array.from({ length: next }, (_, i) => previous[i] ?? defaultColors[i % 3])); }
      }} /></div>
      <div className="editor-palette-intervals">{colors.map((color, index) => <div className="editor-palette-row" key={index}>
        <span>{inputValue(boundaries[index])} →</span>
        {index < cuts.length ? <Input aria-label={tr('Граница интервала ', 'Interval boundary ') + (index + 1)} title={tr('Целое число 1–254; границы строго по возрастанию', 'Integer 1–254; bounds must strictly increase')} type="number" min={1} max={254} step={1} value={inputValue(cuts[index])} onChange={event => setCuts(previous => previous.map((cut, i) => i === index ? numeric(event.target.value) : cut))} /> : <span>255</span>}
        <ColorPicker aria-label={tr('Цвет интервала ', 'Interval colour ') + (index + 1)} value={color} onChange={value => setColors(previous => previous.map((item, i) => i === index ? value : item))} />
      </div>)}</div>
    </div>}
    {filter.setting !== 'histogram' && <>
      {invalid && <p role="alert" className="text-xs text-destructive">{validationMessage}</p>}
      <Button className="w-full" onClick={() => void apply()} disabled={file.isEmpty() || file.isProcessing || file.isPreviewing || invalid}><Check />{tr('Применить', 'Apply')}</Button>
    </>}
  </CardContent></Card>;
}
