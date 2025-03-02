export class Stack {
  stack: HTMLImageElement[] = [];
  #pointer: number = -1;

  add(photo: HTMLImageElement) {
    if (this.#pointer < this.stack.length - 1) {
      this.stack.length = this.#pointer + 1;
    }

    this.stack.push(photo);
    this.#pointer++;
  }

  isLast() {
    return this.#pointer === this.stack.length - 1;
  }

  isFirst() {
    return this.#pointer === 0;
  }

  makeNew() {
    this.stack.length = 0;
    this.#pointer = -1;
  }

  reset() {
    this.stack.length = 1;
    this.#pointer = 0;
  }

  revert() {
    if (this.#pointer > 0) {
      this.#pointer--;
    }
  }

  undoRevert() {
    if (this.#pointer < this.stack.length - 1) {
      this.#pointer++;
    }
  }

  getCurrentPhoto() {
    if (this.#pointer > -1) {
      return this.stack[this.#pointer];
    }

    return null;
  }

  isEmpty() {
    return this.stack.length === 0;
  }
}

export interface IStackList {
  id: number;
  stack: Stack;
  color: string;
}

export default class StackList {
  stackList: IStackList[];
  #fileId: number = 1;
  #currentStack: number = -1;
  #maxLength: number = 20;

  constructor(files: IStackList[], ...rest: (number | undefined)[]) {
    this.stackList = files;
    if (files.length > 0) {
      this.#fileId = files[files.length - 1].id + 1;
      this.#currentStack = files.length - 1;
    } else {
      this.#fileId = 1;
      this.#currentStack = -1;
    }
    if (rest.length === 1) {
      this.setCurrentFile(rest[0]!);
    }
  }

  currentFile() {
    if (this.#currentStack === -1) {
      return null;
    }

    return this.stackList[this.#currentStack].stack;
  }

  get currentFileId() {
    return this.#currentStack;
  }

  setCurrentFile(id: number) {
    for (let i = 0; i < this.stackList.length; ++i) {
      if (this.stackList[i].id === id) {
        this.#currentStack = i;
      }
    }
  }

  newFile() {
    if (this.stackList.length < this.#maxLength) {
      this.#currentStack = this.stackList.length;
      this.stackList.push({
        id: this.#fileId++,
        stack: new Stack(),
        color: 'text-[var(--accent-color)]'
      });
    }
  }

  delFile(idx: number) {
    this.stackList = this.stackList.filter(({ id }) => id !== idx);
    this.#currentStack -= 1;
  }

  delFileAll() {
    this.stackList.length = 0;
    this.#fileId = 1;
    this.#currentStack = -1;
  }

  getFiles() {
    return this.stackList;
  }
}
