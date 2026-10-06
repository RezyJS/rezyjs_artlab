'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AppLogo } from '@/shared/ui/app-logo';
import { useAppearance } from '@/shared/ui/appearance-provider';
import { Button } from '@/shared/ui/button';
import { AppearanceControls } from '@/shared/ui/appearance-controls';
import { ComponentGallery } from './ComponentGallery';

export default function UiKit() {
  const { tr } = useAppearance();
  return <main className="kit-wrap kit-test-stand">
    <header className="kit-topbar">
      <Link href="/" className="kit-brand"><AppLogo className="app-logo" />ArtLab</Link>
      <Button variant="outline" asChild><Link href="/"><ArrowLeft />{tr('Редактор', 'Editor')}</Link></Button>
    </header>
    <div className="kit-intro"><h1>UI kit</h1></div>
    <AppearanceControls />
    <nav className="kit-test-nav" aria-label={tr('Компоненты', 'Components')}>
      {[
        ['buttons', tr('Кнопки', 'Buttons')],
        ['inputs', tr('Поля', 'Inputs')],
        ['controls', tr('Выбор', 'Controls')],
        ['collapses', tr('Коллапсы', 'Collapses')],
        ['loading', tr('Загрузка', 'Loading')],
        ['status', tr('Статусы', 'Status')],
        ['tokens', tr('Палитра', 'Palette')],
        ['dialogs', tr('Диалоги', 'Dialogs')],
        ['toasts', 'Sonner'],
      ].map(([id, label]) => <a key={id} href={'#kit-' + id}>{label}</a>)}
    </nav>
    <ComponentGallery />
  </main>;
}
