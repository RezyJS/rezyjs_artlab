import { Stack } from "./structures";

/* eslint-disable @typescript-eslint/no-unsafe-function-type */
export const imageOperation = (image: HTMLImageElement, callback: Function | null, stack: Stack, setPicture: Function) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  canvas.width = image.width;
  canvas.height = image.height;

  ctx.drawImage(image, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  if (callback !== null) {
    callback(pixels);
  }

  ctx.putImageData(imageData, 0, 0);

  canvas.toBlob((blob: Blob | null) => {
    const url = URL.createObjectURL(blob!);
    const img = document.createElement('img');
    img.src = url;
    setPicture(url);
    if (callback !== null) stack.add(img);
  }, "image/jpeg")
}

export const processFile = (operation: string, stack: Stack, setPicture: Function) => {
  if (stack.isEmpty()) {
    alert('No photos loaded!');
    return;
  }

  const image = stack.getCurrentPhoto();
  if (image instanceof HTMLImageElement) {
    imageOperation(image, null, stack, setPicture);
  }
}

export const loadNewPhoto = (photo: File, stack: Stack, setPicture: Function) => {
  stack.makeNew();
  loadPhoto(photo, stack, setPicture);
}

export const loadPhoto = (photo: File, stack: Stack, setPicture: Function) => {
  const reader = new FileReader();

  reader.onload = (e) => {
    const image = new Image();

    image.onload = () => {
      stack.add(image);
      processFile("", stack, setPicture);
    }

    image.src = "" + e.target!.result;
  }

  reader.readAsDataURL(photo);
}