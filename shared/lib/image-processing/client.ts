import type { Backend, Histogram, ImageFormat, ImageMetadata, Operation, ProcessingRequest, ProcessingResponse } from './types';

let worker: Worker | null = null;
let workerUnavailable = false;
let nextId = 0;
const pending = new Map<number, { resolve: (value: ProcessingResponse) => void; reject: (error: Error) => void; timer: ReturnType<typeof setTimeout> }>();
const unavailable = () => new Error('Image processing is unavailable. Reload the page or use a browser with Web Workers and OffscreenCanvas support.');
function failWorker() {
  workerUnavailable = true;
  worker?.terminate();
  worker = null;
  for (const task of pending.values()) { clearTimeout(task.timer); task.reject(unavailable()); }
  pending.clear();
}
function getWorker() {
  if (workerUnavailable || typeof Worker === 'undefined' || typeof OffscreenCanvas === 'undefined') throw unavailable();
  if (!worker) {
    try {
      worker = new Worker(new URL('./processor.worker.ts', import.meta.url), { type: 'module' });
      worker.onmessage = (event: MessageEvent<ProcessingResponse>) => {
        const task = pending.get(event.data.id);
        if (!task) return;
        clearTimeout(task.timer);
        pending.delete(event.data.id);
        task.resolve(event.data);
      };
      worker.onerror = failWorker;
      worker.onmessageerror = failWorker;
    } catch { failWorker(); throw unavailable(); }
  }
  return worker;
}
async function request(blob: Blob, operation: ProcessingRequest['operation'], args: unknown[], backend?: Backend, format?: ImageFormat, quality?: number) {
  const current = getWorker();
  if (!current) throw unavailable();
  const id = ++nextId;
  return new Promise<ProcessingResponse>((resolve, reject) => {
    const timer = setTimeout(failWorker, 120000);
    pending.set(id, { resolve, reject, timer });
    const payload: ProcessingRequest = { id, blob, operation, args, backend, format, quality };
    try { current.postMessage(payload); }
    catch { failWorker(); }
  });
}
async function imageBlob(image: HTMLImageElement) {
  const response = await fetch(image.src);
  if (!response.ok) throw new Error('Unable to read the image');
  return response.blob();
}
function processed(response: ProcessingResponse) {
  if ('error' in response) throw new Error(response.error);
  if (!('blob' in response)) throw new Error('Unexpected processing response');
  return { blob: response.blob, thumbnail: response.thumbnail, width: response.width, height: response.height, backend: response.backend };
}
export async function processImage(image: HTMLImageElement, operation: Operation, args: unknown[], backend?: Backend) {
  return processed(await request(await imageBlob(image), operation, args, backend));
}
export async function normalizeImage(blob: Blob) {
  return processed(await request(blob, 'import', []));
}
export async function readImageMetadata(blob: Blob): Promise<ImageMetadata> {
  const response = await request(blob, 'metadata', []);
  return 'metadata' in response ? response.metadata : [];
}
export async function exportImage(image: HTMLImageElement, format: ImageFormat = 'webp', quality = 0.95) {
  return processed(await request(await imageBlob(image), 'export', [], undefined, format, quality)).blob;
}
export async function histogramImage(image: HTMLImageElement): Promise<Histogram> {
  const response = await request(await imageBlob(image), 'histogram', []);
  if ('error' in response) throw new Error(response.error);
  if (!('histogram' in response)) throw new Error('Unexpected histogram response');
  return response.histogram;
}
export async function sampleImageColor(image: HTMLImageElement, x: number, y: number) {
  const response = await request(await imageBlob(image), 'pixel', [x, y]);
  if ('error' in response) throw new Error(response.error);
  if (!('color' in response)) throw new Error('Unexpected pixel response');
  return response.color;
}
export function disposeProcessor() { failWorker(); workerUnavailable = false; }
