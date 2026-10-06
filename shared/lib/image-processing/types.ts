export type Operation = 'solarization' | 'pseudoColoring' | 'kvantation' | 'gammaFunc' | 'moreContrast' | 'lessContrast' | 'brightness' | 'negative' | 'binary' | 'grayScale' | 'lowFreq' | 'highFreq' | 'medianFilter' | 'edgeEmpower' | 'edgeByShift' | 'cross' | 'sobel' | 'pravit' | 'embossing' | 'kirsch' | 'rotate' | 'flip' | 'resize' | 'crop';
export type PixelColor = { red: number; green: number; blue: number; alpha: number };
export type Histogram = Array<{ pixel_id: number; red: number; green: number; blue: number }>;
export type Backend = 'gpu' | 'cpu';
export type ImageFormat = 'webp' | 'png' | 'jpeg';
export type ImageMetadata = Array<{ key: string; value: string | number | boolean; date?: boolean }>;
export type ProcessingRequest = { id: number; operation: Operation | 'histogram' | 'import' | 'export' | 'metadata' | 'pixel'; args: unknown[]; backend?: Backend; format?: ImageFormat; quality?: number } &
  ({ bitmap: ImageBitmap; blob?: never } | { blob: Blob; bitmap?: never });
export type ProcessingResponse = { id: number; blob: Blob; thumbnail?: Blob; width: number; height: number; backend: Backend } | { id: number; histogram: Histogram } | { id: number; metadata: ImageMetadata } | { id: number; color: PixelColor } | { id: number; error: string };
