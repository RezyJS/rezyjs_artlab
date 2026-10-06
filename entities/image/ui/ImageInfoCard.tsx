'use client';

import { useId, useState, useSyncExternalStore, type ReactNode } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAppearance } from '@/shared/ui/appearance-provider';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { CollapsibleSection } from '@/shared/ui/collapsible-section';
import type { ImageMetadata } from '@/shared/lib/image-processing';
import FileElement from '../model/history';
import { RenameImage } from './RenameImage';

const metadataLabels: Record<string, [string, string]> = {
  Make: ['Производитель', 'Manufacturer'], Model: ['Камера', 'Camera'],
  LensMake: ['Производитель объектива', 'Lens manufacturer'], LensModel: ['Объектив', 'Lens'],
  DateTimeOriginal: ['Дата съёмки', 'Date taken'], CreateDate: ['Дата создания', 'Date created'], ModifyDate: ['Дата изменения', 'Date modified'],
  ExposureTime: ['Выдержка', 'Exposure'], FNumber: ['Диафрагма', 'Aperture'], ISO: ['ISO', 'ISO'], ISOSpeedRatings: ['ISO', 'ISO'],
  FocalLength: ['Фокусное расстояние', 'Focal length'], FocalLengthIn35mmFormat: ['Фокусное расстояние (35 мм)', 'Focal length (35 mm)'],
  ExposureProgram: ['Режим экспозиции', 'Exposure program'], ExposureCompensation: ['Поправка экспозиции', 'Exposure compensation'],
  Flash: ['Вспышка', 'Flash'], WhiteBalance: ['Баланс белого', 'White balance'], Orientation: ['Исходная ориентация', 'Original orientation'],
  Software: ['Программа', 'Software'], Artist: ['Автор', 'Author'], Creator: ['Автор', 'Creator'], Copyright: ['Авторские права', 'Copyright'],
  ImageDescription: ['Описание', 'Description'], UserComment: ['Комментарий', 'Comment'], ColorSpace: ['Цветовое пространство', 'Colour space'],
  latitude: ['Широта', 'Latitude'], longitude: ['Долгота', 'Longitude'], ProfileDescription: ['Цветовой профиль', 'Colour profile'],
};

function InfoRows({ rows }: { rows: Array<[string, ReactNode]> }) {
  return <dl className="editor-info-rows">{rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>;
}

export function ImageInfoCard({ file }: { file: FileElement }) {
  const { appearance, tr } = useAppearance();
  useSyncExternalStore(file.subscribe, file.getSnapshot, file.getServerSnapshot);
  const [openSection, setOpenSection] = useState<'image' | 'source' | 'metadata' | null>('image');
  const [collapsed, setCollapsed] = useState(false);
  const contentId = useId();
  const image = file.getCurrentPhoto(), info = file.getCurrentInfo(), source = file.sourceInfo;
  if (!image) return null;
  const number = (value: number) => value.toLocaleString(appearance.locale, { maximumFractionDigits: 6 });
  const size = (bytes: number) => {
    const unit = Math.min(3, Math.floor(Math.log(Math.max(1, bytes)) / Math.log(1024)));
    return (bytes / 1024 ** unit).toLocaleString(appearance.locale, { maximumFractionDigits: unit ? 2 : 0 }) + ' ' + (appearance.locale === 'ru' ? ['Б', 'КБ', 'МБ', 'ГБ'] : ['B', 'KB', 'MB', 'GB'])[unit];
  };
  const date = (value: number | string) => new Date(value).toLocaleString(appearance.locale);
  const formatMetadata = (entry: ImageMetadata[number]) => {
    if (entry.date) return date(String(entry.value));
    if (typeof entry.value === 'boolean') return entry.value ? tr('Да', 'Yes') : tr('Нет', 'No');
    if (typeof entry.value !== 'number') return entry.value;
    if (entry.key === 'ExposureTime' && entry.value > 0 && entry.value < 1) return '1/' + number(Math.round(1 / entry.value)) + tr(' с', ' s');
    if (entry.key === 'FNumber') return 'ƒ/' + number(entry.value);
    if (entry.key === 'FocalLength') return number(entry.value) + tr(' мм', ' mm');
    return number(entry.value);
  };
  const currentRows: Array<[string, ReactNode]> = [
    [tr('Название', 'Name'), <RenameImage key="name" file={file} />],
    [tr('Разрешение', 'Resolution'), image.naturalWidth + ' × ' + image.naturalHeight],
  ];
  if (info) currentRows.splice(1, 0, [tr('Формат', 'Format'), info.mimeType === 'image/webp' ? 'WebP' : info.mimeType.replace('image/', '').toUpperCase()]);
  if (info) currentRows.push([tr('Размер', 'Size'), size(info.bytes)]);
  const sourceRows: Array<[string, ReactNode]> = source ? [
    [tr('Файл', 'File'), source.name],
    [tr('Тип', 'Type'), source.mimeType || tr('Не указан', 'Not specified')],
    [tr('Исходный размер', 'Original size'), size(source.bytes)],
  ] : [];
  if (source?.lastModified) sourceRows.push([tr('Изменён', 'Modified'), date(source.lastModified)]);
  if (source?.url) sourceRows.push([tr('Ссылка', 'URL'), <a key="url" href={source.url} target="_blank" rel="noopener noreferrer">{source.url}</a>]);
  const section = (id: 'image' | 'source' | 'metadata', title: string, content: ReactNode) => <CollapsibleSection className="editor-info-section" title={title} open={openSection === id} onToggle={() => setOpenSection(previous => previous === id ? null : id)}>{content}</CollapsibleSection>;
  const toggleLabel = collapsed ? tr('Развернуть данные изображения', 'Expand image information') : tr('Свернуть данные изображения', 'Collapse image information');
  return <Card className="editor-image-info kit-collapsible" data-open={!collapsed}><CardHeader><div className="editor-info-heading"><CardTitle>{tr('Данные изображения', 'Image information')}</CardTitle><Button variant="ghost" size="icon" aria-label={toggleLabel} title={toggleLabel} aria-expanded={!collapsed} aria-controls={contentId} onClick={() => setCollapsed(previous => !previous)}>{collapsed ? <Eye /> : <EyeOff />}</Button></div></CardHeader><div id={contentId} className="kit-collapsible-content" inert={collapsed}><div><CardContent>
    {section('image', tr('Изображение', 'Image'), <InfoRows rows={currentRows} />)}
    {source && section('source', tr('Источник', 'Source'), <InfoRows rows={sourceRows} />)}
    {section('metadata', tr('Метаданные', 'Metadata'), source?.metadata.length ? <dl className="editor-info-rows editor-metadata-rows">{source.metadata.map(entry => <div key={entry.key}><dt title={entry.key}>{metadataLabels[entry.key]?.[appearance.locale === 'ru' ? 0 : 1] ?? entry.key}</dt><dd>{formatMetadata(entry)}</dd></div>)}</dl> : <p className="editor-info-empty">{tr('Метаданные не найдены', 'No metadata found')}</p>)}
  </CardContent></div></div></Card>;
}
