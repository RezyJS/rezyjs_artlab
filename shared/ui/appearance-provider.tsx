'use client';

import { createContext, useContext, useState, useEffect, useSyncExternalStore, type ReactNode } from 'react';
import { appearanceCookie, parseAppearance, type Appearance } from '@/shared/lib/appearance';
import { ArtlabTheme } from './artlab-theme';
import { ArtlabToaster } from './sonner';

type Settings = { appearance: Appearance; update: (patch: Partial<Appearance>) => void; tr: (ru: string, en: string) => string };
const SettingsContext = createContext<Settings | null>(null);
export function useAppearance() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('AppearanceProvider is required');
  return context;
}

const subscribeToCookie = () => () => {};
const serverCookie = () => undefined;
const readAppearanceCookie = () => document.cookie.split('; ').find(cookie => cookie.startsWith(`${appearanceCookie}=`))?.slice(appearanceCookie.length + 1);

export function AppearanceProvider({ initial, children, restoreFromCookie = false }: { initial: Appearance; children: ReactNode; restoreFromCookie?: boolean }) {
  const savedCookie = useSyncExternalStore(subscribeToCookie, readAppearanceCookie, serverCookie);
  const [updatedAppearance, setAppearance] = useState<Appearance | null>(null);
  const appearance = updatedAppearance ?? (restoreFromCookie && savedCookie ? parseAppearance(savedCookie) : initial);
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
