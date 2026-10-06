export const MAX_RESIZE_SIDE = 8192;
export const MAX_RESIZE_PIXELS = 16_000_000;
export type CropRect = { x: number; y: number; width: number; height: number };

export function validResize(width: number, height: number) {
  return [width, height].every(value => Number.isInteger(value) && value >= 1 && value <= MAX_RESIZE_SIDE) && width * height <= MAX_RESIZE_PIXELS;
}
export function validCrop(rect: CropRect, width: number, height: number) {
  return Object.values(rect).every(Number.isInteger) && rect.x >= 0 && rect.y >= 0 && rect.width >= 1 && rect.height >= 1 && rect.x + rect.width <= width && rect.y + rect.height <= height;
}
