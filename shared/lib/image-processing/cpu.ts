import * as color from './photosColor.ts';
import * as noise from './photosNoise.ts';
import * as edges from './photosEdges.ts';
import type { Operation, Histogram } from './types.ts';

export const kernels = { ...color, ...noise, ...edges };
export const spatial = new Set<Operation>(['lowFreq', 'highFreq', 'medianFilter', 'edgeEmpower', 'edgeByShift', 'cross', 'sobel', 'pravit', 'embossing', 'kirsch']);

export function applyCpu<T extends ArrayBufferLike>(pixels: Uint8ClampedArray<T>, width: number, height: number, operation: Operation, args: unknown[]) {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || pixels.length !== width * height * 4) throw new Error('Invalid image dimensions');
  if (operation === 'rotate' || operation === 'flip' || operation === 'resize' || operation === 'crop' || !(operation in kernels)) throw new Error('Unknown filter');
  for (const arg of args) if (typeof arg === 'number' && !Number.isFinite(arg)) throw new Error('Filter values must be finite');
  if (operation === 'gammaFunc' && Number(args[0]) <= 0) throw new Error('Gamma must be positive');
  if (operation === 'kvantation' && (!Number.isInteger(args[0]) || Number(args[0]) < 1 || Number(args[0]) > 256)) throw new Error('Quantization levels must be between 1 and 256');
  if (operation === 'moreContrast' && Number(args[1]) <= Number(args[0])) throw new Error('Upper contrast boundary must exceed the lower boundary');
  if (operation === 'medianFilter' && (args.length !== 4 || args.slice(2).some(n => !Number.isInteger(n) || Number(n) < 1 || Number(n) > 50))) throw new Error('Median window values must be integers from 1 to 50');
  const actualArgs = spatial.has(operation) ? [width, height, ...args.slice(2)] : args;
  const kernel = kernels[operation] as (pixels: Uint8ClampedArray, ...args: unknown[]) => void;
  kernel(pixels, ...actualArgs);
  return pixels;
}

export function histogram(pixels: Uint8ClampedArray): Histogram {
  const bins = Array.from({ length: 256 }, (_, pixel_id) => ({ pixel_id, red: 0, green: 0, blue: 0 }));
  for (let i = 0; i < pixels.length; i += 4) {
    bins[pixels[i]].red++;
    bins[pixels[i + 1]].green++;
    bins[pixels[i + 2]].blue++;
  }
  return bins;
}
