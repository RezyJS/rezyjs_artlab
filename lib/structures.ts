/* eslint-disable @typescript-eslint/no-unsafe-function-type */
export default class FileElement {
  stack: HTMLImageElement[] = [];
  #pointer: number = -1;
  #setPicture: Function;

  constructor(setPicture: Function) {
    this.#setPicture = setPicture;
  }

  setPicture(image: HTMLImageElement) {
    this.#setPicture(image);
  }

  add(photo: HTMLImageElement) {
    if (this.#pointer < this.stack.length - 1) {
      this.stack.length = this.#pointer + 1;
    }

    this.stack.push(photo);
    this.#pointer++;
  }

  isLast(): boolean {
    return this.#pointer === this.stack.length - 1;
  }

  isFirst(): boolean {
    return this.#pointer === 0;
  }

  newStack() {
    this.stack.length = 0;
    this.#pointer = -1;
    this.#setPicture(this.getCurrentPhoto());
  }

  reset() {
    this.stack.length = 1;
    this.#pointer = 0;
    this.#setPicture(this.getCurrentPhoto());
  }

  revert() {
    if (this.#pointer > 0) {
      this.#pointer--;
    }
    this.#setPicture(this.getCurrentPhoto());
  }

  undoRevert() {
    if (this.#pointer < this.stack.length - 1) {
      this.#pointer++;
    }
    this.#setPicture(this.getCurrentPhoto());
  }

  getCurrentPhoto(): HTMLImageElement | null {
    if (this.#pointer > -1) {
      return this.stack[this.#pointer];
    }

    return null;
  }

  isEmpty(): boolean {
    return this.stack.length === 0;
  }
}
