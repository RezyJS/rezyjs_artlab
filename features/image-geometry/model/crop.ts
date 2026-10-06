import type { CropRect } from '@/shared/lib/image-processing';

export type Point = { x: number; y: number };
export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function centredCrop(width: number, height: number, ratio: number): CropRect {
  const cropWidth = ratio ? Math.max(1, Math.min(width, Math.round(height * ratio))) : width;
  const cropHeight = ratio ? Math.max(1, Math.min(height, Math.round(cropWidth / ratio))) : height;
  return { x: Math.floor((width - cropWidth) / 2), y: Math.floor((height - cropHeight) / 2), width: cropWidth, height: cropHeight };
}

export function cropFromPoints(a: Point, b: Point, width: number, height: number, ratio: number): CropRect {
  const right = b.x >= a.x, down = b.y >= a.y;
  const availableWidth = right ? width - a.x : a.x;
  const availableHeight = down ? height - a.y : a.y;
  let w = Math.max(1, Math.min(Math.abs(b.x - a.x), availableWidth));
  let h = Math.max(1, Math.min(Math.abs(b.y - a.y), availableHeight));
  if (ratio) {
    if (w / h > ratio) h = w / ratio;
    else w = h * ratio;
    const scale = Math.min(1, availableWidth / w, availableHeight / h);
    w *= scale; h *= scale;
  }
  w = clamp(Math.round(w), 1, width);
  h = clamp(Math.round(h), 1, height);
  return { x: clamp(Math.round(right ? a.x : a.x - w), 0, width - w), y: clamp(Math.round(down ? a.y : a.y - h), 0, height - h), width: w, height: h };
}
