'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { Maximize2 } from 'lucide-react';
import { FileElement } from '@/entities/image';
import { histogramImage, type Histogram } from '@/shared/lib/image-processing';
import { useAppearance } from '@/shared/ui/appearance-provider';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Checkbox } from '@/shared/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/ui/dialog';
import { Skeleton } from '@/shared/ui/skeleton';
import { HistogramChart, histogramChannels } from './HistogramChart';

export function HistogramPanel({ file }: { file: FileElement }) {
  const { tr } = useAppearance();
  useSyncExternalStore(file.subscribe, file.getSnapshot, file.getServerSnapshot);
  const image = file.getCurrentPhoto();
  const [result, setResult] = useState<{ image: HTMLImageElement; data: Histogram; error?: string } | null>(null);
  const [visible, setVisible] = useState({ red: true, green: true, blue: true });
  useEffect(() => {
    if (!image) return;
    let active = true;
    const timer = window.setTimeout(() => {
      histogramImage(image).then(data => { if (active) setResult({ image, data }); }).catch(error => { if (active) setResult({ image, data: [], error: String(error) }); });
    }, 100);
    return () => { active = false; window.clearTimeout(timer); };
  }, [image]);
  const current = result?.image === image ? result : null;
  const data = current && !current.error ? current.data : null;
  const channelControls = () => <div className="editor-histogram-channels">{histogramChannels.map(channel => <label key={channel.id} style={{ color: channel.color }}><Checkbox aria-label={channel.id === 'red' ? tr('Красный канал', 'Red channel') : channel.id === 'green' ? tr('Зелёный канал', 'Green channel') : tr('Синий канал', 'Blue channel')} checked={visible[channel.id]} disabled={!image} onCheckedChange={checked => setVisible(previous => ({ ...previous, [channel.id]: checked === true }))} />{channel.name}</label>)}</div>;
  const chart = (expanded = false) => current?.error ? <p role="alert" className="text-xs text-destructive">{current.error}</p> : data ? <HistogramChart key={image?.src} data={data} visible={visible} expanded={expanded} /> : image ? <Skeleton className="editor-histogram-plot" /> : <div className="editor-histogram-plot editor-histogram-empty" aria-hidden="true" />;
  return <Dialog><Card className="editor-histogram"><CardHeader><div className="editor-histogram-heading"><CardTitle>{tr('Гистограмма', 'Histogram')}</CardTitle><DialogTrigger asChild><Button variant="ghost" size="icon" disabled={!data} aria-label={tr('Увеличить гистограмму', 'Expand histogram')} title={tr('Увеличить гистограмму', 'Expand histogram')}><Maximize2 /></Button></DialogTrigger></div></CardHeader><CardContent>
    {chart()}{channelControls()}
  </CardContent></Card><DialogContent className="editor-histogram-dialog"><DialogHeader><DialogTitle>{tr('Гистограмма', 'Histogram')}</DialogTitle><DialogDescription className="sr-only">{tr('Распределение значений каналов RGB', 'RGB channel value distribution')}</DialogDescription></DialogHeader>{chart(true)}{channelControls()}</DialogContent></Dialog>;
}
