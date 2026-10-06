'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Smartphone } from 'lucide-react';
import { AppLogo } from '@/shared/ui/app-logo';
import { useAppearance } from '@/shared/ui/appearance-provider';
import { Button } from '@/shared/ui/button';
import { AppearanceControls } from '@/shared/ui/appearance-controls';
import { ComponentGallery } from './ComponentGallery';
import { EditorExample } from './EditorExample';

export type DesignView = 'kit' | 'example' | 'mobile';
function MobilePreview() {
  const { appearance, tr } = useAppearance();
  const [width, setWidth] = useState(390);
  return <section className="kit-mobile-stage">
    <div className="kit-mobile-caption"><Smartphone size={18} /><span>{tr('Ширина экрана', 'Screen width')}</span><div className="kit-segment">{[360, 390, 430].map(size => <Button key={size} variant="ghost" size="sm" aria-pressed={width === size} onClick={() => setWidth(size)}>{size}</Button>)}</div></div>
    <div className="kit-phone" style={{ width: width + 24 }}><div className="kit-phone-speaker" /><iframe key={JSON.stringify(appearance)} src="/example?embed=1" title={tr('Мобильный пример ArtLab', 'ArtLab mobile example')} style={{ width }} /></div>
    <p className="text-center text-xs text-muted-foreground">{tr('Внутри — та же страница примера. Можно выбирать фильтры, открывать диалоги и проверять уведомления.', 'This is the same example page. Try filters, dialogs and notifications inside the phone.')}</p>
  </section>;
}

export default function UiKit({ view = 'kit', embedded = false }: { view?: DesignView; embedded?: boolean }) {
  const { tr } = useAppearance();
  const links = [{ view: 'kit', href: '/ui-kit', label: 'UI Kit' }, { view: 'example', href: '/example', label: tr('Пример', 'Example') }, { view: 'mobile', href: '/mobile', label: tr('Мобильный', 'Mobile') }];
  return <main className={'kit-wrap' + (embedded ? ' kit-embedded' : '')}>
    <header className="kit-topbar">
      <Link href={embedded ? '/example' : '/ui-kit'} className="kit-brand"><AppLogo className="app-logo" />ArtLab<span className="kit-brand-caption">{tr('Комикс', 'Comic')}</span></Link>
      {!embedded && <nav aria-label={tr('Страницы визуального стенда', 'Design lab pages')}>{links.map(link => <Link key={link.view} href={link.href} aria-current={view === link.view ? 'page' : undefined}>{link.label}</Link>)}</nav>}
      {embedded && <span className="kit-eyebrow">{tr('Маленькая лаборатория', 'Little image lab')}</span>}
    </header>
    {!embedded && <>
      <div className="kit-intro"><div><div className="kit-eyebrow mb-2">{tr('Визуальная лаборатория / Комикс', 'Design lab / Comic')}</div><h1>{view === 'kit' ? tr('Компоненты с характером.', 'Components with character.') : view === 'example' ? tr('Ваша картинка. Ваш эксперимент.', 'Your image. Your experiment.') : tr('Тот же характер. Меньше экран.', 'Same character. Smaller screen.')}</h1><p>{view === 'kit' ? tr('Рамки, смещённые тени и один акцент. Каждый компонент можно попробовать.', 'Bold borders, offset shadows and one accent. Every component is interactive.') : view === 'example' ? tr('Все двадцать функций доступны в трёх группах. Проверяем удобство нового оформления.', 'All twenty functions in three groups. Explore how the new design feels.') : tr('Отдельный стенд для проверки адаптивной версии на узком экране.', 'A dedicated preview for checking the responsive layout on a small screen.')}</p></div><Link href="/" className="kit-editor-link">{tr('Рабочий редактор', 'Working editor')} ↗</Link></div>
      <AppearanceControls />
    </>}
    <div className="kit-page-content">{view === 'kit' ? <ComponentGallery /> : view === 'example' ? <EditorExample /> : <MobilePreview />}</div>
    {!embedded && <footer className="kit-footer"><span>{tr('ArtLab / маленькая лаборатория изображения', 'ArtLab / a little image laboratory')}</span><span>{tr('Комикс · UI kit на shadcn/ui', 'Comic · UI kit built on shadcn/ui')}</span></footer>}
  </main>;
}
