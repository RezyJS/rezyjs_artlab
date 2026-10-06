import { applyCpu, histogram } from './cpu';
import { GpuProcessor, supportsGpu } from './gpu';
import { extractImageMetadata } from './metadata';
import { validCrop, validResize } from './geometry';
import type { ProcessingRequest, ProcessingResponse } from './types';

let gpu: GpuProcessor | null | undefined;
let queue = Promise.resolve();
async function process(request: ProcessingRequest): Promise<ProcessingResponse> {
  const { id, operation, args } = request;
  let bitmap = request.bitmap;
  let canvas: OffscreenCanvas | undefined;
  try {
    if (operation === 'metadata') return { id, metadata: request.blob ? await extractImageMetadata(request.blob) : [] };
    // Decode compressed input here, avoiding a full-size DOM bitmap copy on the UI thread.
    bitmap ??= await createImageBitmap(request.blob!);
    const { width, height } = bitmap;
    if (operation === 'pixel') {
      const [x, y] = args as number[];
      if (!Number.isInteger(x) || !Number.isInteger(y) || x < 0 || y < 0 || x >= width || y >= height) throw new Error('Pixel is outside the image');
      canvas = new OffscreenCanvas(1, 1);
      const pixelContext = canvas.getContext('2d', { willReadFrequently: true });
      if (!pixelContext) throw new Error('Offscreen canvas unavailable');
      pixelContext.drawImage(bitmap, x, y, 1, 1, 0, 0, 1, 1);
      const [red, green, blue, alpha] = pixelContext.getImageData(0, 0, 1, 1).data;
      return { id, color: { red, green, blue, alpha } };
    }
    const rotating = operation === 'rotate';
    const angle = args[0];
    if (rotating && angle !== 90 && angle !== -90) throw new Error('Rotation must be 90 or -90 degrees');
    if (operation === 'flip' && angle !== 'x' && angle !== 'y') throw new Error('Reflection axis must be x or y');
    let outputWidth = rotating ? height : width, outputHeight = rotating ? width : height;
    if (operation === 'resize') {
      [outputWidth, outputHeight] = args as number[];
      if (!validResize(outputWidth, outputHeight)) throw new Error('Image size must be 1–8192 pixels per side and at most 16 megapixels');
    }
    if (operation === 'crop') {
      const [x, y, cropWidth, cropHeight] = args as number[];
      if (!validCrop({ x, y, width: cropWidth, height: cropHeight }, width, height)) throw new Error('Crop must be inside the image');
      outputWidth = cropWidth; outputHeight = cropHeight;
    }
    canvas = new OffscreenCanvas(outputWidth, outputHeight);
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('Offscreen canvas unavailable');
    const format = operation === 'export' ? request.format ?? 'webp' : 'webp';
    const types = { webp: 'image/webp', png: 'image/png', jpeg: 'image/jpeg' };
    if (!(format in types)) throw new Error('Unsupported export format');
    if (operation === 'export' && request.quality !== undefined && (!Number.isFinite(request.quality) || request.quality < 0 || request.quality > 1)) throw new Error('Export quality must be between 0 and 1');
    if (format === 'jpeg') { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, width, height); }
    if (operation === 'resize') {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(bitmap, 0, 0, outputWidth, outputHeight);
    } else if (operation === 'crop') {
      const [x, y] = args as number[];
      ctx.drawImage(bitmap, x, y, outputWidth, outputHeight, 0, 0, outputWidth, outputHeight);
    } else if (rotating) {
      if (angle === 90) ctx.setTransform(0, 1, -1, 0, height, 0);
      else ctx.setTransform(0, -1, 1, 0, 0, width);
      ctx.drawImage(bitmap, 0, 0);
      ctx.resetTransform();
    } else if (operation === 'flip') {
      // X reverses horizontal coordinates; Y reverses vertical coordinates.
      ctx.translate(angle === 'x' ? width : 0, angle === 'y' ? height : 0);
      ctx.scale(angle === 'x' ? -1 : 1, angle === 'y' ? -1 : 1);
      ctx.drawImage(bitmap, 0, 0);
      ctx.resetTransform();
    } else ctx.drawImage(bitmap, 0, 0);
    const encode = async () => {
      const blob = await canvas!.convertToBlob({ type: types[format], quality: operation === 'export' ? request.quality ?? 0.95 : 1 });
      if (blob.type !== types[format]) throw new Error('This browser cannot encode the selected format');
      return blob;
    };
    const encoded = async (backend: 'cpu' | 'gpu'): Promise<ProcessingResponse> => {
      const blob = await encode();
      let thumbnail: Blob | undefined;
      if (operation !== 'export') {
        const scale = Math.min(1, 160 / canvas!.width, 120 / canvas!.height);
        const small = new OffscreenCanvas(Math.max(1, Math.round(canvas!.width * scale)), Math.max(1, Math.round(canvas!.height * scale)));
        try {
          const smallContext = small.getContext('2d');
          if (!smallContext) throw new Error('Thumbnail canvas unavailable');
          smallContext.drawImage(canvas!, 0, 0, small.width, small.height);
          thumbnail = await small.convertToBlob({ type: 'image/webp', quality: .8 });
        } finally { small.width = 0; small.height = 0; }
      }
      return { id, blob, thumbnail, width: canvas!.width, height: canvas!.height, backend };
    };
    if (operation === 'import' || operation === 'export' || operation === 'rotate' || operation === 'flip' || operation === 'resize' || operation === 'crop') return await encoded('cpu');
    const image = ctx.getImageData(0, 0, width, height);
    if (operation === 'histogram') return { id, histogram: histogram(image.data) };
    let output: Uint8ClampedArray<ArrayBuffer> | null = null;
    // GPU upload/readback has a cost: keep small images on the worker CPU.
    if (supportsGpu(operation) && request.backend !== 'cpu' && (request.backend === 'gpu' || width * height >= 262144)) {
      if (gpu === undefined) {
        try { gpu = new GpuProcessor(); } catch { gpu = null; }
      }
      try { output = gpu?.process(image.data, width, height, operation, args) ?? null; }
      catch { gpu?.dispose(); gpu = null; }
    }
    const backend = output ? 'gpu' : 'cpu';
    const pixels = output ?? applyCpu(image.data, width, height, operation, args);
    ctx.putImageData(new ImageData(pixels, width, height), 0, 0);
    return await encoded(backend);
  } catch (error) {
    return { id, error: error instanceof Error ? error.message : 'Image processing failed' };
  } finally { bitmap?.close(); if (canvas) { canvas.width = 0; canvas.height = 0; } }
}
self.onmessage = (event: MessageEvent<ProcessingRequest>) => {
  queue = queue.then(async () => { self.postMessage(await process(event.data)); });
};
