'use client';

import { createContext, useContext, useState, type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '@/shared/lib/utils';
import { accentTokens } from '@/shared/lib/appearance';
import { useComicMotion } from '@/shared/lib/use-comic-motion';

const ThemePortal = createContext<HTMLElement | undefined>(undefined);
export const useArtlabPortal = () => useContext(ThemePortal);
const ThemeLocale = createContext<'ru' | 'en'>('en');
export const useArtlabLocale = () => useContext(ThemeLocale);

type ArtlabThemeProps = HTMLAttributes<HTMLDivElement> & {
  mode?: 'dark' | 'light';
  character?: number;
  accent?: string;
  locale?: 'ru' | 'en';
};

/** Theme tokens and portal scope shared by the editor and the visual lab. */
export function ArtlabTheme({ mode = 'light', character = 95, accent = '#7c3aed', locale = 'ru', className, style, children, ...props }: ArtlabThemeProps) {
  const [portal, setPortal] = useState<HTMLDivElement | null>(null);
  useComicMotion(portal);
  const amount = Math.max(0, Math.min(100, character));
  const tokens = {
    ...accentTokens(accent, mode),
    '--kit-offset': `${Math.round(amount * 0.06)}px`,
    '--radius': '0px',
    '--kit-border-width': amount > 65 ? '2px' : '1px',
    ...style,
  } as CSSProperties;
  return (
    <ThemeLocale.Provider value={locale}><ThemePortal.Provider value={portal ?? undefined}>
      <div ref={setPortal} data-artlab-theme={mode} className={cn('artlab-theme', className)} style={tokens} {...props}>
        {children}
      </div>
    </ThemePortal.Provider></ThemeLocale.Provider>
  );
}
