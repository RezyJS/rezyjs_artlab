import { toast } from 'sonner';
import FileElement from '../model/history';
import { processImage, histogramImage, normalizeImage, readImageMetadata } from '@/shared/lib/image-processing';
import type { Operation } from '@/shared/lib/image-processing';
import { translate } from '@/shared/lib/appearance';
import type { ImageImport } from '../model/info';
import { decodeImage } from './decode-image';

async function decodeBlob(blob: Blob) {
  const src = URL.createObjectURL(blob);
  try {
    return await decodeImage(src);
  } catch (error) {
    URL.revokeObjectURL(src);
    throw error;
  }
}

export function imageOperation(_image: HTMLImageElement, operation: Operation, file: FileElement, ...args: unknown[]) {
  if (file.isProcessing || file.isPreviewing) return Promise.resolve();
  const processingEpoch = file.epoch;
  return file.enqueue(async (image, epoch) => {
    const result = await processImage(image, operation, args);
    if (epoch !== file.epoch) return;
    const output = await decodeBlob(result.blob);
    if (epoch !== file.epoch) { URL.revokeObjectURL(output.src); return; }
    file.add(output, { bytes: result.blob.size, mimeType: result.blob.type }, { operation, args }, result.thumbnail);
  }).catch(error => {
    if (processingEpoch !== file.epoch) return;
    toast.error(translate('Не удалось обработать изображение', 'Image processing failed'), { description: error instanceof Error ? error.message : translate('Попробуйте ещё раз.', 'Please try again.') });
  });
}

export async function loadNewPhoto(source: File | (() => Promise<File | ImageImport>), file: FileElement) {
  if (file.isProcessing) return false;
  const epoch = file.epoch;
  try {
    return await file.runProcessing(async () => {
      const loaded = typeof source === 'function' ? await source() : source;
      const { file: photo, original, url } = loaded instanceof File ? { file: loaded, original: loaded, url: undefined } : loaded;
      if (epoch !== file.epoch) return false;
      const [metadata, { blob, thumbnail }] = await Promise.all([readImageMetadata(original), normalizeImage(photo)]);
      if (epoch !== file.epoch) return false;
      const image = await decodeBlob(blob);
      if (epoch !== file.epoch) { URL.revokeObjectURL(image.src); return false; }
      file.newStack();
      file.fileName = original.name;
      file.sourceInfo = { name: original.name, bytes: original.size, mimeType: original.type, url, lastModified: !url && original.lastModified > 0 ? original.lastModified : undefined, metadata };
      file.add(image, { bytes: blob.size, mimeType: blob.type }, undefined, thumbnail);
      return true;
    });
  } catch (error) {
    if (epoch !== file.epoch) return false;
    toast.error(translate('Не удалось загрузить изображение', 'Error loading image'), { description: error instanceof Error ? error.message : translate('Формат не поддерживается.', 'Unsupported image.') });
    return false;
  }
}
export const loadPhoto = loadNewPhoto;
export async function getHistogram(file: FileElement) {
  const image = file.getCurrentPhoto();
  return image ? histogramImage(image) : [];
}
