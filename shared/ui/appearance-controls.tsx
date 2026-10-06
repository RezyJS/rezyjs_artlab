'use client';

import { Check, Moon, Sun } from 'lucide-react';
import { useAppearance } from './appearance-provider';
import { Button } from './button';
import { NativeSelect } from './native-select';

const accents = [
  { color: '#7c3aed', ru: 'Фиолетовый', en: 'Violet' },
  { color: '#315dcc', ru: 'Синий', en: 'Blue' },
  { color: '#b83280', ru: 'Розовый', en: 'Pink' },
  { color: '#b74b32', ru: 'Терракота', en: 'Terracotta' },
  { color: '#177b69', ru: 'Изумрудный', en: 'Emerald' },
];

export function AppearanceControls({ compact = false }: { compact?: boolean }) {
  const { appearance, update, tr } = useAppearance();
  return (
    <div
      className={
        'kit-style-controls' + (compact ? ' kit-appearance-compact' : '')
      }
      aria-label={tr('Оформление', 'Appearance')}
    >
      <div>
        <span className='kit-control-label'>{tr('Тема', 'Theme')}</span>
        <div className='kit-segment'>
          <Button
            variant='ghost'
            size='sm'
            aria-pressed={appearance.theme === 'light'}
            onClick={() => update({ theme: 'light' })}
          >
            <Sun />
            {tr('Светлая', 'Light')}
          </Button>
          <Button
            variant='ghost'
            size='sm'
            aria-pressed={appearance.theme === 'dark'}
            onClick={() => update({ theme: 'dark' })}
          >
            <Moon />
            {tr('Тёмная', 'Dark')}
          </Button>
        </div>
      </div>
      <label>
        <span className='kit-control-label'>{tr('Язык', 'Language')}</span>
        <NativeSelect
          aria-label={tr('Язык интерфейса', 'Interface language')}
          value={appearance.locale}
          onChange={(event) =>
            update({ locale: event.target.value as 'ru' | 'en' })
          }
        >
          <option value='ru'>Русский</option>
          <option value='en'>English</option>
        </NativeSelect>
      </label>
      <div>
        <span className='kit-control-label'>
          {tr('Акцентный цвет', 'Accent colour')}
        </span>
        <div className='kit-accent-options'>
          {accents.map((item) => (
            <button
              key={item.color}
              className='kit-accent-swatch'
              style={{ background: item.color }}
              aria-label={tr(item.ru, item.en)}
              aria-pressed={appearance.accent.toLowerCase() === item.color}
              onClick={() => update({ accent: item.color })}
            >
              {appearance.accent.toLowerCase() === item.color && (
                <Check size={15} />
              )}
            </button>
          ))}
          <label
            className='kit-custom-accent'
            title={tr('Свой цвет', 'Custom colour')}
          >
            <span className='sr-only'>
              {tr('Свой акцентный цвет', 'Custom accent colour')}
            </span>
            <input
              type='color'
              value={appearance.accent}
              onChange={(event) => update({ accent: event.target.value })}
            />
            <span>+</span>
          </label>
        </div>
      </div>
    </div>
  );
}
