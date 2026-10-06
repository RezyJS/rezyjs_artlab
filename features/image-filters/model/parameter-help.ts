import type { FilterDefinition } from './catalog';

export function parameterHelp(filter: FilterDefinition, tr: (ru: string, en: string) => string) {
  return {
    window: tr('Ширина и высота в пикселях: целые числа от 1 до 50. Большое окно сильнее сглаживает детали.', 'Width and height in pixels: integers from 1 to 50. Larger windows smooth more detail.'),
    value: filter.id === 'negative'
      ? tr('Порог инверсии: целое число от 0 до 255. При 0 инвертируются все цвета.', 'Inversion threshold: an integer from 0 to 255. At 0, all colours are inverted.')
      : filter.setting === 'brightness'
        ? tr('Сила осветления или затемнения: целое число от 0 до 255. 0 — без изменений.', 'How much to lighten or darken: an integer from 0 to 255. 0 makes no change.')
        : tr('Целое число от 0 до 255. Чем выше порог, тем больше чёрных участков.', 'An integer from 0 to 255. Higher thresholds produce more black areas.'),
    mode: filter.setting === 'brightness'
      ? tr('Осветление или затемнение на выбранную величину.', 'Lighten or darken by the selected amount.')
      : tr('Повысить — усилить разницу между светлым и тёмным. Понизить — сделать её мягче.', 'Increase makes the difference between light and dark stronger. Decrease makes it softer.'),
    low: tr('Нижняя граница яркости: целое число от 0 до 254, меньше верхней.', 'Lower brightness bound: an integer from 0 to 254, below the upper bound.'),
    high: tr('Верхняя граница яркости: целое число от 1 до 255, больше нижней.', 'Upper brightness bound: an integer from 1 to 255, above the lower bound.'),
    scalar: filter.setting === 'gamma'
      ? tr('Число больше 0, можно дробное. Меньше 1 — светлее, больше 1 — темнее. 1 — без изменений.', 'A number above 0; decimals allowed. Below 1 lightens, above 1 darkens. 1 makes no change.')
      : filter.setting === 'levels'
        ? tr('Целое число от 1 до 256. Меньше уровней — меньше оттенков и заметнее переходы между ними.', 'An integer from 1 to 256. Fewer levels mean fewer shades and sharper transitions.')
        : tr('Сила соляризации: любое число, включая дробные. При 0 и отрицательных значениях изображение чёрное.', 'Solarization strength: any number, including decimals. Zero and negative values produce a black image.'),
    kernel: filter.id === 'lowFreq'
      ? tr('H1 — равномерное размытие. H2 — больше деталей. H3 — мягкие переходы.', 'H1: uniform blur. H2: more detail. H3: smooth transitions.')
      : tr('H1 — сильное усиление резкости. H2 — умеренное. H3 — усиление тонких деталей.', 'H1: strong sharpening. H2: moderate sharpening. H3: fine-detail sharpening.'),
    direction: tr('Направление, в котором фильтр ищет границы: по горизонтали, вертикали или диагонали.', 'Direction used to detect edges: horizontal, vertical or diagonal.'),
    relief: tr('Меняет рельеф с выпуклого на вдавленный и обратно.', 'Switches between raised and recessed relief.'),
    palette: tr('От 1 до 255 цветовых интервалов. Границы — целые числа 1–254, по возрастанию. Смена количества сбрасывает границы.', '1–255 colour intervals. Bounds must be integers from 1 to 254, in increasing order. Changing the count resets the bounds.'),
  };
}

export function kernelOptions(lowPass: boolean, tr: (ru: string, en: string) => string) {
  return lowPass ? [
    { id: 'H1', name: tr('Равномерное размытие', 'Uniform blur') },
    { id: 'H2', name: tr('Сохранение деталей', 'Keep more detail') },
    { id: 'H3', name: tr('Мягкое размытие', 'Smooth blur') },
  ] : [
    { id: 'H1', name: tr('Сильная резкость', 'Strong sharpening') },
    { id: 'H2', name: tr('Умеренная резкость', 'Moderate sharpening') },
    { id: 'H3', name: tr('Тонкие детали', 'Fine details') },
  ];
}
