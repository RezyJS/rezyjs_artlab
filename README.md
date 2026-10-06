<p align="center">
  <img src="app/icon.svg" width="64" height="64" alt="" />
</p>

<h1 align="center">ArtLab</h1>

<p align="center">Обработка изображений в браузере.</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.3.8-181322?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js 16.3.8" />
  <img src="https://img.shields.io/badge/React-19.3-181322?style=flat-square&logo=react&logoColor=61DAFB" alt="React 19.3" />
  <img src="https://img.shields.io/badge/TypeScript-6-181322?style=flat-square&logo=typescript&logoColor=3178C6" alt="TypeScript 6" />
</p>

## Запуск

Node.js 24+ и pnpm 12.9.1.

```sh
git clone https://github.com/RezyJS/rezyjs_artlab.git
cd rezyjs_artlab
pnpm install --frozen-lockfile
pnpm dev
```

## Функции

- Загрузка из файла, по ссылке, перетаскиванием и через `Ctrl + V`. Поддерживается HEIC/HEIF.
- Цвет: оттенки серого, яркость, негатив, бинаризация, контраст, гамма, квантование, псевдоцвет, соляризация.
- Шум: размытие, повышение резкости, медианный фильтр.
- Контуры: усиление границ, сдвиг, перекрёстный фильтр, Собель, Превитт, тиснение, Кирш.
- Поворот, отражение по X/Y, размер и обрезка.
- Масштаб, перемещение, полноэкранный просмотр и просмотр оригинала.
- Пипетка с HEX, RGB и копированием цвета.
- История с названиями операций, миниатюрами, отменой и повтором.
- RGB-гистограмма, данные файла и исходные метаданные.
- Переименование и экспорт в WebP, PNG или JPEG. Выбор качества и расчёт веса файла.

## Команды

| Команда | Назначение |
| :--- | :--- |
| `pnpm dev` | Разработка |
| `pnpm build` | Сборка |
| `pnpm start` | Запуск сборки |
| `pnpm lint` | ESLint, включая границы FSD |
| `pnpm typecheck` | Проверка типов |

## Горячие клавиши

| Сочетание | Действие |
| :--- | :--- |
| `Ctrl + V` | Загрузить фото из буфера |
| `Ctrl + Z` / `Ctrl + Y` | Отменить / повторить |
| `Ctrl + X` | Сбросить изменения |
| `Ctrl + M` | Подтверждение удаления |
| `Ctrl + 1 / 2 / 3` | Цвет / шум / контуры |

## Структура

Next.js App Router, React, TypeScript, Tailwind CSS, shadcn/ui, Radix UI, anime.js.

```text
app/                       маршруты / и /ui-kit
widgets/editor/            компоновка редактора
widgets/ui-kit/            стенд компонентов
features/image-upload/     загрузка
features/image-filters/    фильтры и гистограмма
features/image-history/    история и оригинал
features/image-export/     экспорт
features/image-geometry/   размер и обрезка
features/image-viewport/   масштаб, перемещение и пипетка
entities/image/            модель изображения и метаданные
shared/ui/                 общие компоненты и оформление
shared/lib/                обработка изображений и утилиты
scripts/fsd-rules.mjs       правила импортов FSD
```

## Обработка и ограничения

Обработка выполняется локально в Web Worker через OffscreenCanvas.
Часть фильтров использует WebGL2; без GPU они выполняются на CPU в воркере.
Фото не отправляется на сервер для обработки.

- После загрузки фото преобразуется в WebP. Внутреннее качество 100% не означает сжатие без потерь.
- Экспорт по умолчанию: WebP, качество 95%. Для WebP/JPEG доступны значения 1–100.
- WebP/PNG сохраняют прозрачность. В JPEG прозрачные области заполняются белым.
- Исходные EXIF-метаданные не переносятся в экспорт.
- Изменение размера: 1–8192 px по стороне, не больше 16 млн пикселей.
- Загрузка по ссылке требует разрешения CORS со стороны источника.
- Нужна поддержка Web Workers и OffscreenCanvas. WebGL2 необязателен.
- Фото и история сбрасываются при перезагрузке страницы.
