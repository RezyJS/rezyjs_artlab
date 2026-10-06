import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import { appearanceCookie, defaultAppearance, parseAppearance } from '@/shared/lib/appearance';
import { AppearanceProvider } from '@/shared/ui/appearance-provider';
import './globals.css';
import '@/shared/ui/artlab-theme.css';

const githubPages = process.env.NEXT_PUBLIC_GITHUB_PAGES === 'true';
const basePath = githubPages ? process.env.PAGES_BASE_PATH ?? '' : '';

export const metadata: Metadata = { title: 'ArtLab', description: 'Лаборатория обработки изображений: цвет, шум и контуры.', icons: { icon: `${basePath}/icon.svg`, shortcut: `${basePath}/icon.svg` } };
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', interactiveWidget: 'resizes-content' };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const appearance = githubPages ? defaultAppearance : parseAppearance((await cookies()).get(appearanceCookie)?.value);
  return <html lang={appearance.locale}><body className="antialiased min-h-dvh"><AppearanceProvider initial={appearance} restoreFromCookie={githubPages}>{children}</AppearanceProvider></body></html>;
}
