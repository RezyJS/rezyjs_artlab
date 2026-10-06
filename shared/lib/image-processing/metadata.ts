import { parse, sidecar } from 'exifr';
import type { ImageMetadata } from './types';

const options = { xmp: true, icc: true, iptc: true, jfif: false, ihdr: false, userComment: true };
const dimensions = new Set(['ImageWidth', 'ImageHeight', 'ExifImageWidth', 'ExifImageHeight', 'PixelXDimension', 'PixelYDimension']);

async function readTags(blob: Blob): Promise<unknown> {
  const header = new Uint8Array(await blob.slice(0, 12).arrayBuffer());
  const text = (bytes: Uint8Array) => String.fromCharCode(...bytes);
  if (text(header.subarray(0, 4)) !== 'RIFF' || text(header.subarray(8, 12)) !== 'WEBP') return parse(blob, options);
  // WebP stores EXIF/XMP in RIFF chunks; read only those chunks, not pixel data.
  let offset = 12;
  const tags: Record<string, unknown> = {};
  let chunks = 0;
  while (offset + 8 <= blob.size && chunks++ < 2048) {
    const chunkHeader = await blob.slice(offset, offset + 8).arrayBuffer();
    const name = text(new Uint8Array(chunkHeader, 0, 4));
    const size = new DataView(chunkHeader).getUint32(4, true);
    if (offset + 8 + size > blob.size) break;
    if (name === 'EXIF' || name === 'XMP ') {
      let chunk = blob.slice(offset + 8, offset + 8 + size);
      try {
        if (name === 'EXIF') {
          const prefix = new Uint8Array(await chunk.slice(0, 6).arrayBuffer());
          if (text(prefix) === 'Exif\0\0') chunk = chunk.slice(6);
          Object.assign(tags, await parse(chunk, options));
        } else Object.assign(tags, await sidecar(chunk, options, 'xmp'));
      } catch { /* A malformed metadata chunk must not prevent image import. */ }
    }
    offset += 8 + size + (size % 2);
  }
  return tags;
}

export async function extractImageMetadata(blob: Blob): Promise<ImageMetadata> {
  try {
    const tags = await readTags(blob);
    const entries: ImageMetadata = [];
    const visit = (value: unknown, key: string, depth: number) => {
      if (value == null || depth > 8 || dimensions.has(key)) return;
      if (value instanceof Date) {
        if (Number.isFinite(value.getTime())) entries.push({ key, value: value.toISOString(), date: true });
      } else if (typeof value === 'string' || typeof value === 'boolean' || (typeof value === 'number' && Number.isFinite(value))) {
        if (value !== '') entries.push({ key, value });
      } else if (Array.isArray(value) && value.every(item => ['string', 'number', 'boolean'].includes(typeof item))) {
        if (value.length) entries.push({ key, value: value.join(', ') });
      } else if (typeof value === 'object' && !ArrayBuffer.isView(value) && !(value instanceof ArrayBuffer)) {
        for (const [child, item] of Object.entries(value)) visit(item, key ? key + '.' + child : child, depth + 1);
      }
    };
    visit(tags, '', 0);
    return entries;
  } catch { return []; }
}
