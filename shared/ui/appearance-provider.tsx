'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { appearanceCookie, type Appearance } from '@/shared/lib/appearance';
import { ArtlabTheme } from './artlab-theme';
import { ArtlabToaster } from './sonner';

type Settings = { appearance: Appearance; update: (patch: Partial<Appearance>) => void; tr: (ru: string, en: string) => string };
const SettingsContext = createContext<Settings | null>(null);
export function useAppearance() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('AppearanceProvider is required');
  return context;
}

export function AppearanceProvider({ initial, children }: { initial: Appearance; children: ReactNode }) {
  const [appearance, setAppearance] = useState(initial);
  useEffect(() => { document.documentElement.lang = appearance.locale; }, [appearance.locale]);
  const update = (patch: Partial<Appearance>) => {
    const next = { ...appearance, ...patch };
    document.cookie = `${appearanceCookie}=${encodeURIComponent(JSON.stringify(next))}; Path=/; Max-Age=31536000; SameSite=Lax`;
    setAppearance(next);
  };
  const tr = (ru: string, en: string) => appearance.locale === 'ru' ? ru : en;
  return <SettingsContext.Provider value={{ appearance, update, tr }}>
    <ArtlabTheme mode={appearance.theme} character={95} accent={appearance.accent} locale={appearance.locale} lang={appearance.locale}>
      {children}<ArtlabToaster theme={appearance.theme} locale={appearance.locale} />
    </ArtlabTheme>
  </SettingsContext.Provider>;
}
