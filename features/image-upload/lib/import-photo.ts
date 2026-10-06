import { FileElement, loadNewPhoto } from '@/entities/image';
import { translate } from '@/shared/lib/appearance';

async function preparePhoto(photo: File) {
  if (!photo.type.startsWith('image/') && !/\.(heic|heif)$/i.test(photo.name)) throw new Error(translate('Выберите файл изображения.', 'Please choose an image file.'));
  if (/image\/(heic|heif)/i.test(photo.type) || /\.(heic|heif)$/i.test(photo.name)) {
    const { default: heic2any } = await import('heic2any');
    const result = await heic2any({ blob: photo, toType: 'image/png' });
    const blob = Array.isArray(result) ? result[0] : result;
    return new File([blob], photo.name.replace(/\.(heic|heif)$/i, '.png'), { type: 'image/png' });
  }
  return photo;
}

/** File preparation, URL fetching and WebP normalization share one processing lock. */
export function importPhoto(source: File | URL, file: FileElement) {
  return loadNewPhoto(async () => {
    if (source instanceof File) return { file: await preparePhoto(source), original: source };
    if (!['http:', 'https:'].includes(source.protocol)) throw new Error(translate('Нужна ссылка HTTP или HTTPS.', 'Enter an HTTP or HTTPS URL.'));
    const response = await fetch(source.href, { mode: 'cors' });
    if (!response.ok) throw new Error(translate('Не удалось получить изображение по ссылке.', 'Could not fetch the image URL.'));
    const blob = await response.blob();
    const name = decodeURIComponent(source.pathname.split('/').pop() || 'image');
    const original = new File([blob], name, { type: blob.type });
    return { file: await preparePhoto(original), original, url: source.href };
  }, file);
}
