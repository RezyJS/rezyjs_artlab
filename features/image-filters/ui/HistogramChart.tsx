'use client';

import { useEffect, useRef, useState } from 'react';
import type { Histogram } from '@/shared/lib/image-processing';
import { useAppearance } from '@/shared/ui/appearance-provider';

export const histogramChannels = [{ id: 'red', name: 'R', color: '#db4b65' }, { id: 'green', name: 'G', color: '#25876b' }, { id: 'blue', name: 'B', color: '#6274e7' }] as const;
export type ChannelVisibility = Record<typeof histogramChannels[number]['id'], boolean>;

export function HistogramChart({ data, visible, expanded = false }: { data: Histogram; visible: ChannelVisibility; expanded?: boolean }) {
  const { appearance, tr } = useAppearance();
  const container = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 320, height: 280 });
  const [active, setActive] = useState<number | null>(null);
  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) setSize({ width, height });
    });
    if (container.current) observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  const channels = histogramChannels.filter(channel => visible[channel.id]);
  const maximum = Math.max(1, ...data.flatMap(bin => channels.map(channel => bin[channel.id])));
  const left = 48, top = 12, right = size.width - 12, bottom = size.height - 28;
  const x = (level: number) => left + level / 255 * (right - left);
  const y = (count: number) => bottom - count / maximum * (bottom - top);
  const bin = active === null ? undefined : data.find(bin => bin.pixel_id === active);
  const format = (value: number) => value.toLocaleString(appearance.locale);
  return <div ref={container} className={'editor-histogram-plot' + (expanded ? ' editor-histogram-plot-expanded' : '')}
    role="group" aria-label={tr('Интерактивная гистограмма', 'Interactive histogram')} tabIndex={0}
    onPointerMove={event => {
      const rect = event.currentTarget.getBoundingClientRect();
      setActive(Math.max(0, Math.min(255, Math.round((event.clientX - rect.left - left) / (right - left) * 255))));
    }} onPointerLeave={() => setActive(null)} onFocus={() => setActive(128)} onBlur={() => setActive(null)}
    onKeyDown={event => {
      if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
        event.preventDefault();
        setActive(event.key === 'Home' ? 0 : event.key === 'End' ? 255 : Math.max(0, Math.min(255, (active ?? 128) + (event.key === 'ArrowLeft' ? -1 : 1))));
      } else if (event.key === 'Escape') setActive(null);
    }}>
    <svg viewBox={`0 0 ${size.width} ${size.height}`} role="img" aria-label={tr('RGB-гистограмма изображения', 'Image RGB histogram')} className="editor-histogram-chart">
      {[0, .25, .5, .75, 1].map(fraction => <g key={fraction}>
        <line x1={left} x2={right} y1={y(maximum * fraction)} y2={y(maximum * fraction)} stroke="currentColor" opacity=".12" />
        <text x={left - 8} y={y(maximum * fraction) + 3} textAnchor="end" fontSize="10" fill="currentColor" opacity=".6">{Intl.NumberFormat(appearance.locale, { notation: 'compact', maximumFractionDigits: 1 }).format(Math.round(maximum * fraction))}</text>
      </g>)}
      {channels.map(channel => {
        const points = data.map(bin => x(bin.pixel_id).toFixed(2) + ',' + y(bin[channel.id]).toFixed(2)).join(' ');
        return <g key={channel.id}><polygon points={`${left},${bottom} ${points} ${right},${bottom}`} fill={channel.color} opacity=".13" /><polyline data-channel={channel.id} points={points} stroke={channel.color} strokeWidth="1.5" fill="none" /></g>;
      })}
      {[0, 64, 128, 192, 255].map(level => <text key={level} x={x(level)} y={size.height - 8} textAnchor="middle" fontSize="10" fill="currentColor" opacity=".6">{level}</text>)}
      {bin && <g><line x1={x(bin.pixel_id)} x2={x(bin.pixel_id)} y1={top} y2={bottom} stroke="currentColor" opacity=".5" strokeDasharray="3 3" />{channels.map(channel => <circle key={channel.id} cx={x(bin.pixel_id)} cy={y(bin[channel.id])} r="3" fill={channel.color} />)}</g>}
    </svg>
    {bin && <div role="tooltip" className="editor-histogram-tooltip" style={{ left: Math.max(0, Math.min(size.width - 148, x(bin.pixel_id) + 12)), top: 20 }}>
      <strong>{tr('Уровень: ', 'Level: ') + bin.pixel_id}</strong>
      {channels.map(channel => <div key={channel.id}><span style={{ color: channel.color }}>{channel.name}</span><span>{format(bin[channel.id])}</span></div>)}
    </div>}
  </div>;
}
