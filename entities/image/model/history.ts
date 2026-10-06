import { toast } from 'sonner';
import type { ImageFileInfo, ImageSourceInfo } from './info';
import type { Operation } from '@/shared/lib/image-processing';
import { imageBaseName, isValidImageName } from '@/shared/lib/image-name';
import { translate } from '@/shared/lib/appearance';
import { decodeImage } from '../lib/decode-image';

type HistoryOperation = { operation: Operation; args: readonly unknown[] };
export type ImageHistoryStep = {
  index: number;
  src: string;
  thumbnailSrc: string | null;
  current: boolean;
  operation: Operation | null;
  args: readonly unknown[];
};
type StoredStep = {
  src: string;
  thumbnailSrc: string | null;
  info: ImageFileInfo;
  operation: Operation | null;
  args: readonly unknown[];
};

/** Keep compressed WebP URLs for history, and decoded images only while in use. */
export default class FileElement {
  #stack: StoredStep[] = [];
  #currentPhoto: HTMLImageElement | null = null;
  #previewPhoto: HTMLImageElement | null = null;
  #pointer = -1;
  #version = 0;
  #epoch = 0;
  #pending = 0;
  fileName = 'image';
  sourceInfo: ImageSourceInfo | null = null;
  #listeners = new Set<() => void>();
  #queue: Promise<void> = Promise.resolve();
  subscribe = (listener: () => void) => {
    this.#listeners.add(listener);
    return () => { this.#listeners.delete(listener); };
  };
  getSnapshot = () => this.#version;
  getServerSnapshot = () => 0;
  get epoch() { return this.#epoch; }
  get isProcessing() { return this.#pending > 0; }
  get isPreviewing() { return this.#previewPhoto !== null; }
  get displayName() { return imageBaseName(this.fileName); }
  rename(name: string) {
    const next = imageBaseName(name);
    if (this.isEmpty() || this.isProcessing || !isValidImageName(next)) return false;
    this.fileName = next;
    this.#notify();
    return true;
  }
  #notify() {
    this.#version++;
    for (const listener of this.#listeners) listener();
  }
  #release(steps: StoredStep[]) {
    for (const step of steps) {
      if (step.src.startsWith('blob:')) URL.revokeObjectURL(step.src);
      if (step.thumbnailSrc) URL.revokeObjectURL(step.thumbnailSrc);
    }
  }
  #clearPreview() {
    this.#previewPhoto?.removeAttribute('src');
    this.#previewPhoto = null;
  }
  #setCurrent(photo: HTMLImageElement) {
    this.#clearPreview();
    this.#currentPhoto?.removeAttribute('src');
    this.#currentPhoto = photo;
  }
  add(photo: HTMLImageElement, info: ImageFileInfo, operation?: HistoryOperation, thumbnail?: Blob) {
    const entry: StoredStep = {
      src: photo.src, thumbnailSrc: thumbnail ? URL.createObjectURL(thumbnail) : null, info,
      operation: operation?.operation ?? null, args: operation ? structuredClone(operation.args) : [],
    };
    this.#release(this.#stack.splice(this.#pointer + 1));
    this.#stack.push(entry);
    this.#setCurrent(photo);
    this.#pointer = this.#stack.length - 1;
    this.#notify();
  }
  isLast() { return this.#pointer === this.#stack.length - 1; }
  isFirst() { return this.#pointer === 0; }
  isEmpty() { return this.#stack.length === 0; }
  getCurrentPhoto() { return this.#currentPhoto; }
  getDisplayedPhoto() { return this.#previewPhoto ?? this.#currentPhoto; }
  getHistory(): ImageHistoryStep[] {
    return this.#stack.map((entry, index) => ({
      index, src: entry.src, thumbnailSrc: entry.thumbnailSrc, current: index === this.#pointer,
      operation: entry.operation, args: structuredClone(entry.args),
    }));
  }
  async goTo(index: number): Promise<boolean> {
    if (this.isProcessing || !Number.isInteger(index) || index < 0 || index >= this.#stack.length) return false;
    if (index === this.#pointer) {
      this.#clearPreview();
      this.#notify();
      return true;
    }
    const entry = this.#stack[index];
    const epoch = ++this.#epoch;
    try {
      return await this.runProcessing(async () => {
        const photo = await decodeImage(entry.src);
        if (epoch !== this.#epoch) { photo.removeAttribute('src'); return false; }
        this.#setCurrent(photo);
        this.#pointer = index;
        this.#notify();
        return true;
      });
    } catch {
      if (epoch === this.#epoch) toast.error(translate('Не удалось открыть шаг истории', 'Could not open the history step'));
      return false;
    }
  }
  async togglePreview() {
    if (this.isProcessing || this.isEmpty()) return;
    if (this.isPreviewing) { this.#clearPreview(); this.#notify(); return; }
    if (this.isFirst()) return;
    const epoch = this.#epoch;
    try {
      await this.runProcessing(async () => {
        const photo = await decodeImage(this.#stack[0].src);
        if (epoch !== this.#epoch) { photo.removeAttribute('src'); return; }
        this.#previewPhoto = photo;
        this.#notify();
      });
    } catch {
      if (epoch === this.#epoch) toast.error(translate('Не удалось открыть оригинал', 'Could not open the original'));
    }
  }
  getCurrentInfo() { return this.#stack[this.#pointer]?.info ?? null; }
  newStack() {
    this.#epoch++;
    this.#clearPreview();
    this.#currentPhoto?.removeAttribute('src');
    this.#currentPhoto = null;
    this.#release(this.#stack);
    this.#stack = [];
    this.#pointer = -1;
    this.sourceInfo = null;
    this.fileName = 'image';
    this.#notify();
  }
  async reset() {
    if (this.isEmpty() || this.isProcessing) return;
    const initial = this.#stack[0];
    if (!await this.goTo(0) || this.#stack[0] !== initial || this.#pointer !== 0) return;
    this.#release(this.#stack.splice(1));
    this.#notify();
  }
  revert() { return this.goTo(this.#pointer - 1); }
  undoRevert() { return this.goTo(this.#pointer + 1); }
  async runProcessing<T>(operation: () => Promise<T>): Promise<T> {
    this.#pending++;
    this.#notify();
    try { return await operation(); }
    finally { this.#pending--; this.#notify(); }
  }
  /** Read the current source when work starts, so edits compose in order. */
  enqueue(operation: (image: HTMLImageElement, epoch: number) => Promise<void>) {
    const epoch = this.#epoch;
    this.#pending++;
    this.#notify();
    const task = this.#queue.then(async () => {
      const image = this.getCurrentPhoto();
      if (epoch === this.#epoch && image) await operation(image, epoch);
    }).finally(() => {
      this.#pending--;
      this.#notify();
    });
    this.#queue = task.catch(() => {});
    return task;
  }
}
