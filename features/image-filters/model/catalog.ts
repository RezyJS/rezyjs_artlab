export type FilterSetting = 'none' | 'value' | 'brightness' | 'threshold' | 'contrast' | 'gamma' | 'levels' | 'palette' | 'coefficient' | 'kernel' | 'window' | 'direction' | 'histogram';
export type FilterDefinition = { id: string; label: string; description: string; setting: FilterSetting; icon: string };

const english: Record<string, [string, string]> = {
  grayScale: ['Grayscale', 'Removes colour and keeps shades of grey.'],
  brightness: ['Brightness', 'Lightens or darkens the image.'],
  negative: ['Negative', 'Inverts colours.'],
  binary: ['Binarization', 'Turns the image into black and white areas.'],
  contrast: ['Contrast', 'Increases or reduces the difference between light and dark.'],
  histogram: ['Histogram', 'Shows the brightness distribution for each colour.'],
  gammaFunc: ['Gamma', 'Adjusts midtone brightness.'],
  kvantation: ['Quantization', 'Reduces the number of shades.'],
  pseudoColoring: ['Pseudocolour', 'Replaces shades with selected colours.'],
  solarization: ['Solarization', 'Changes colours and darkens the brightest areas.'],
  lowFreq: ['Low-pass', 'Blurs the image.'],
  highFreq: ['High-pass', 'Sharpens the image.'],
  medianFilter: ['Median', 'Removes small specks and noise.'],
  edgeEmpower: ['Enhance edges', 'Highlights object edges.'],
  edgeByShift: ['Shift', 'Detects edges in the selected direction.'],
  cross: ['Cross operator', 'Detects edges with a cross filter.'],
  sobel: ['Sobel', 'Detects edges with the Sobel filter.'],
  pravit: ['Prewitt', 'Detects edges with the Prewitt filter.'],
  embossing: ['Emboss', 'Creates a raised or recessed relief effect.'],
  kirsch: ['Kirsch', 'Detects edges in multiple directions.'],
};

export function localizeFilter(filter: FilterDefinition, locale: 'ru' | 'en'): FilterDefinition {
  const translated = english[filter.id];
  return locale === 'en' && translated ? { ...filter, label: translated[0], description: translated[1] } : filter;
}

export const filterGroups: Array<{ id: string; label: string; filters: FilterDefinition[] }> = [
  { id: 'color', label: 'Цвет', filters: [
    { id: 'grayScale', label: 'Оттенки серого', description: 'Убирает цвет, оставляет оттенки серого.', setting: 'none', icon: 'contrast' },
    { id: 'brightness', label: 'Яркость', description: 'Осветляет или затемняет изображение.', setting: 'brightness', icon: 'sun' },
    { id: 'negative', label: 'Негатив', description: 'Инвертирует цвета.', setting: 'value', icon: 'invert' },
    { id: 'binary', label: 'Бинаризация', description: 'Делит изображение на чёрные и белые участки.', setting: 'threshold', icon: 'binary' },
    { id: 'contrast', label: 'Контраст', description: 'Усиливает или уменьшает разницу между светлым и тёмным.', setting: 'contrast', icon: 'sliders' },
    { id: 'histogram', label: 'Гистограмма', description: 'Показывает распределение яркости по цветам.', setting: 'histogram', icon: 'chart' },
    { id: 'gammaFunc', label: 'Гамма-коррекция', description: 'Меняет яркость полутонов.', setting: 'gamma', icon: 'curve' },
    { id: 'kvantation', label: 'Квантование', description: 'Уменьшает число оттенков.', setting: 'levels', icon: 'grid' },
    { id: 'pseudoColoring', label: 'Псевдоцвет', description: 'Заменяет оттенки выбранными цветами.', setting: 'palette', icon: 'palette' },
    { id: 'solarization', label: 'Соляризация', description: 'Меняет цвета и затемняет самые светлые участки.', setting: 'coefficient', icon: 'sparkles' },
  ] },
  { id: 'noise', label: 'Шум', filters: [
    { id: 'lowFreq', label: 'Низкочастотный', description: 'Размывает изображение.', setting: 'kernel', icon: 'drop' },
    { id: 'highFreq', label: 'Высокочастотный', description: 'Повышает резкость.', setting: 'kernel', icon: 'triangle' },
    { id: 'medianFilter', label: 'Медианный', description: 'Удаляет мелкие точки и шум.', setting: 'window', icon: 'grid' },
  ] },
  { id: 'edges', label: 'Контуры', filters: [
    { id: 'edgeEmpower', label: 'Усиление границ', description: 'Выделяет границы объектов.', setting: 'none', icon: 'triangle' },
    { id: 'edgeByShift', label: 'Сдвиг', description: 'Выделяет границы в выбранном направлении.', setting: 'direction', icon: 'shift' },
    { id: 'cross', label: 'Перекрёстный', description: 'Выделяет контуры перекрёстным фильтром.', setting: 'none', icon: 'cross' },
    { id: 'sobel', label: 'Собель', description: 'Выделяет контуры фильтром Собеля.', setting: 'none', icon: 'square' },
    { id: 'pravit', label: 'Превитт', description: 'Выделяет контуры фильтром Превитта.', setting: 'none', icon: 'lines' },
    { id: 'embossing', label: 'Тиснение', description: 'Создаёт эффект выпуклого или вдавленного рельефа.', setting: 'none', icon: 'layers' },
    { id: 'kirsch', label: 'Кирш', description: 'Выделяет границы в разных направлениях.', setting: 'none', icon: 'diamond' },
  ] },
];
