import { toast } from 'sonner';
import type { ImageFileInfo, ImageSourceInfo } from './info';
import type { Operation } from '@/shared/lib/image-processing';
import { imageBaseName, isValidImageName } from '@/shared/lib/image-name';
import { translate } from '@/shared/lib/appearance';
import { decodeImage } from '../lib/decode-image';

export const HISTORY_LIMIT = 10;
type HistoryAction = Operation | 'reset' | 'restore';
type HistoryOperation = { operation: HistoryAction; args: readonly unknown[] };
export type ImageHistoryStep = {
  id: number;
  index: number;
  src: string;
  thumbnailSrc: string | null;
  current: boolean;
  operation: HistoryAction | null;
  args: readonly unknown[];
};
type StoredStep = {
  id: number;
  src: string;
  thumbnailSrc: string | null;
  info: ImageFileInfo;
  operation: HistoryAction | null;
  args: readonly unknown[];
};

/** Keep the original separately and retain at most ten recent snapshots. */
export default class FileElement {
  #stack: StoredStep[] = [];
  #original: StoredStep | null = null;
  #nextId = 0;
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
  get isOriginal() { return this.#original !== null && this.#stack[this.#pointer]?.src === this.#original.src; }
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
    const retained = new Set<string>();
    for (const step of this.#original ? [...this.#stack, this.#original] : this.#stack) {
      retained.add(step.src);
      if (step.thumbnailSrc) retained.add(step.thumbnailSrc);
    }
    const removed = new Set<string>();
    for (const step of steps) {
      removed.add(step.src);
      if (step.thumbnailSrc) removed.add(step.thumbnailSrc);
    }
    // Restored snapshots share their compressed image and thumbnail URLs.
    for (const url of removed) if (url.startsWith('blob:') && !retained.has(url)) URL.revokeObjectURL(url);
  }
  #clearPreview() {
    this.#previewPhoto?.removeAttribute('src');
    this.#previewPhoto = null;
  }
  #setCurrent(photo: HTMLImageElement) {
    this.#clearPreview();
    if (this.#currentPhoto !== photo) this.#currentPhoto?.removeAttribute('src');
    this.#currentPhoto = photo;
  }
  #push(entry: Omit<StoredStep, 'id'>) {
    const stored = { ...entry, id: this.#nextId++ };
    this.#stack.push(stored);
    this.#original ??= stored;
  }
  #append(photo: HTMLImageElement, entry: Omit<StoredStep, 'id'>) {
    // After undo, record the chosen source before the new edit. This preserves
    // later steps and lets undo return to the image the edit actually used.
    if (!this.isLast()) {
      const source = this.#stack[this.#pointer];
      if (source) this.#push({ ...source, operation: 'restore', args: [source.id] });
    }
    this.#push(entry);
    this.#setCurrent(photo);
    // Prune only after both entries exist: either can reuse the oldest URL.
    const removed = this.#stack.splice(0, Math.max(0, this.#stack.length - HISTORY_LIMIT));
    this.#pointer = this.#stack.length - 1;
    this.#release(removed);
    this.#notify();
  }
  add(photo: HTMLImageElement, info: ImageFileInfo, operation?: HistoryOperation, thumbnail?: Blob) {
    this.#append(photo, {
      src: photo.src, thumbnailSrc: thumbnail ? URL.createObjectURL(thumbnail) : null, info,
      operation: operation?.operation ?? null, args: operation ? structuredClone(operation.args) : [],
    });
  }
  isLast() { return this.#pointer === this.#stack.length - 1; }
  isFirst() { return this.#pointer === 0; }
  isEmpty() { return this.#stack.length === 0; }
  getCurrentPhoto() { return this.#currentPhoto; }
  getDisplayedPhoto() { return this.#previewPhoto ?? this.#currentPhoto; }
  getHistory(): ImageHistoryStep[] {
    return this.#stack.map((entry, index) => ({
      id: entry.id, index, src: entry.src, thumbnailSrc: entry.thumbnailSrc, current: index === this.#pointer,
      operation: entry.operation, args: structuredClone(entry.args),
    }));
  }
  async #load(entry: StoredStep, apply: (photo: HTMLImageElement) => void): Promise<boolean> {
    const epoch = ++this.#epoch;
    try {
      return await this.runProcessing(async () => {
        const photo = await decodeImage(entry.src);
        if (epoch !== this.#epoch) { photo.removeAttribute('src'); return false; }
        apply(photo);
        return true;
      });
    } catch {
      if (epoch === this.#epoch) toast.error(translate('Не удалось восстановить изображение', 'Could not restore the image'));
      return false;
    }
  }
  /** Picking a saved snapshot appends a restoration action to the timeline. */
  goTo(index: number): Promise<boolean> {
    if (this.isProcessing || !Number.isInteger(index) || index < 0 || index >= this.#stack.length) return Promise.resolve(false);
    if (index === this.#pointer) {
      this.#clearPreview();
      this.#notify();
      return Promise.resolve(true);
    }
    const entry = this.#stack[index];
    return this.#load(entry, photo => this.#append(photo, { ...entry, operation: 'restore', args: [entry.id] }));
  }
  #navigate(index: number): Promise<boolean> {
    if (this.isProcessing || index < 0 || index >= this.#stack.length) return Promise.resolve(false);
    const entry = this.#stack[index];
    return this.#load(entry, photo => {
      this.#setCurrent(photo);
      this.#pointer = index;
      this.#notify();
    });
  }
  async togglePreview() {
    if (this.isProcessing || this.isEmpty() || !this.#original) return;
    if (this.isPreviewing) { this.#clearPreview(); this.#notify(); return; }
    if (this.isOriginal) return;
    const original = this.#original;
    const epoch = this.#epoch;
    try {
      await this.runProcessing(async () => {
        const photo = await decodeImage(original.src);
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
    const released = this.#original ? [...this.#stack, this.#original] : this.#stack;
    this.#stack = [];
    this.#original = null;
    this.#release(released);
    this.#pointer = -1;
    this.#nextId = 0;
    this.sourceInfo = null;
    this.fileName = 'image';
    this.#notify();
  }
  reset(): Promise<boolean> {
    if (this.isEmpty() || this.isProcessing || this.isOriginal || !this.#original) return Promise.resolve(false);
    const original = this.#original;
    return this.#load(original, photo => this.#append(photo, { ...original, operation: 'reset', args: [] }));
  }
  revert() { return this.#navigate(this.#pointer - 1); }
  undoRevert() { return this.#navigate(this.#pointer + 1); }
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
