'use client';

import { useState } from 'react';
import { Checkbox } from '@/shared/ui/checkbox';
import { useAppearance } from '@/shared/ui/appearance-provider';

const channels = [{ id: 'red', label: 'R', color: '#ee8d9f' }, { id: 'green', label: 'G', color: '#92d4ad' }, { id: 'blue', label: 'B', color: '#a994f5' }] as const;

export function HistogramPreview() {
  const { tr } = useAppearance();
  const [visible, setVisible] = useState<Record<string, boolean>>({ red: true, green: true, blue: true });
  return (
    <div>
      <svg viewBox="0 0 260 110" role="img" aria-label={tr('Пример RGB-гистограммы', 'Sample RGB histogram')} className="mt-2 w-full">
        {[25, 50, 75, 100].map(y => <line key={y} x1="0" x2="260" y1={y} y2={y} stroke="currentColor" opacity=".07" />)}
        {channels.map((channel, index) => {
          const points = Array.from({ length: 65 }, (_, i) => {
            const x = i * 4;
            const peak = 20 + index * 17;
            const height = 12 + 52 * Math.exp(-((i - peak) ** 2) / 115) + 16 * Math.exp(-((i - peak + 15) ** 2) / 20) + Math.sin(i * 2.3 + index) * 6;
            return `${x},${100 - height}`;
          }).join(' ');
          return visible[channel.id] && <g key={channel.id}><polygon points={`0,100 ${points} 256,100`} fill={channel.color} opacity=".12" /><polyline points={points} fill="none" stroke={channel.color} strokeWidth="1.5" /></g>;
        })}
        <text x="0" y="109" fontSize="8" fill="currentColor" opacity=".5">0</text>
        <text x="242" y="109" fontSize="8" fill="currentColor" opacity=".5">255</text>
      </svg>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">{tr('Цветовые каналы', 'Colour channels')}</span>
        <div className="flex gap-3">
          {channels.map(channel => (
            <label key={channel.id} className="flex items-center gap-1.5 text-xs" style={{ color: channel.color }}>
              <Checkbox aria-label={tr('Канал ', 'Channel ') + channel.label} checked={visible[channel.id]} onCheckedChange={checked => setVisible(previous => ({ ...previous, [channel.id]: checked === true }))} />{channel.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
