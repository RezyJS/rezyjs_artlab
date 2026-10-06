import type { ImageHistoryStep } from '@/entities/image';
import type { Operation } from '@/shared/lib/image-processing';

const labels: Record<Operation, [string, string]> = {
  grayScale: ['Оттенки серого', 'Grayscale'], brightness: ['Яркость', 'Brightness'],
  negative: ['Негатив', 'Negative'], binary: ['Бинаризация', 'Binarization'],
  moreContrast: ['Повышение контраста', 'Increase contrast'], lessContrast: ['Понижение контраста', 'Decrease contrast'],
  gammaFunc: ['Гамма-коррекция', 'Gamma correction'], kvantation: ['Квантование', 'Quantization'],
  pseudoColoring: ['Псевдоцвет', 'Pseudocolour'], solarization: ['Соляризация', 'Solarization'],
  lowFreq: ['Низкочастотный фильтр', 'Low-pass filter'], highFreq: ['Высокочастотный фильтр', 'High-pass filter'],
  medianFilter: ['Медианный фильтр', 'Median filter'], edgeEmpower: ['Усиление границ', 'Enhance edges'],
  edgeByShift: ['Сдвиг', 'Shift'], cross: ['Перекрёстный', 'Cross operator'], sobel: ['Собель', 'Sobel'],
  pravit: ['Превитт', 'Prewitt'], embossing: ['Тиснение', 'Emboss'], kirsch: ['Кирш', 'Kirsch'],
  rotate: ['Поворот', 'Rotate'], flip: ['Отражение', 'Flip'],
  resize: ['Изменение размера', 'Resize'], crop: ['Обрезка', 'Crop'],
};

export function historyLabel(step: ImageHistoryStep, locale: 'ru' | 'en') {
  if (!step.operation) return locale === 'ru' ? 'Исходное изображение' : 'Original image';
  if (step.operation === 'reset') return locale === 'ru' ? 'Сброс к оригиналу' : 'Reset to original';
  if (step.operation === 'restore') return (locale === 'ru' ? 'Возврат к шагу ' : 'Restore step ') + step.args[0];
  const label = labels[step.operation][locale === 'ru' ? 0 : 1];
  const args = step.args;
  switch (step.operation) {
    case 'resize': return label + ' · ' + args[0] + ' × ' + args[1];
    case 'crop': return label + ' · ' + args[2] + ' × ' + args[3];
    case 'medianFilter': return label + ' · ' + args[3] + ' × ' + args[2];
    case 'rotate': return label + ' · ' + args[0] + '°';
    case 'flip': return label + ' · ' + String(args[0]).toUpperCase();
    case 'lowFreq': case 'highFreq': return label + ' · ' + args[2];
    case 'brightness': case 'binary': case 'negative': case 'gammaFunc': case 'kvantation': case 'solarization': return label + ' · ' + args[0];
    case 'moreContrast': case 'lessContrast': return label + ' · ' + args[0] + '–' + args[1];
    default: return label;
  }
}
