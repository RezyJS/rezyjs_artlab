import { toast } from 'sonner';
import { Stack } from './structures';

/* eslint-disable @typescript-eslint/no-unsafe-function-type */
export const imageOperation = (
  image: HTMLImageElement,
  callback: Function | null,
  stack: Stack,
  setPicture: Function,
  ...rest: (number | undefined)[]
) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  canvas.width = image.width;
  canvas.height = image.height;

  ctx.drawImage(image, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  if (callback !== null) {
    callback(pixels, ...rest);
  }

  ctx.putImageData(imageData, 0, 0);

  canvas.toBlob((blob: Blob | null) => {
    const url = URL.createObjectURL(blob!);
    const img = document.createElement('img');
    img.src = url;
    setPicture(url);
    if (callback !== null) stack.add(img);
  }, 'image/jpeg');
};

const grayScale = (pixels: Uint8ClampedArray<ArrayBufferLike>) => {
  for (let i = 0; i < pixels.length; i += 4) {
    const red = pixels[i];
    const green = pixels[i + 1];
    const blue = pixels[i + 2];

    const I = 0.3 * red + 0.59 * green + 0.11 * blue;
    pixels[i] = I;
    pixels[i + 1] = I;
    pixels[i + 2] = I;
  }
};

const brightness = (
  pixels: Uint8ClampedArray<ArrayBufferLike>,
  ...rest: number[]
) => {
  const clamp = (num: number) => Math.min(Math.max(num, 0), 255);

  const brightnessValue = rest[0];

  for (let i = 0; i < pixels.length; i += 4) {
    const red = clamp(pixels[i] + brightnessValue);
    const green = clamp(pixels[i + 1] + brightnessValue);
    const blue = clamp(pixels[i + 2] + brightnessValue);
    // const alpha = pixels[i + 3];

    pixels[i] = red;
    pixels[i + 1] = green;
    pixels[i + 2] = blue;
  }
};

const negative = (
  pixels: Uint8ClampedArray<ArrayBufferLike>,
  ...rest: number[]
) => {
  const negative = rest[0];

  for (let i = 0; i < pixels.length; i += 4) {
    const red = pixels[i] >= negative ? 255 - pixels[i] : pixels[i];
    const green =
      pixels[i + 1] >= negative ? 255 - pixels[i + 1] : pixels[i + 1];
    const blue =
      pixels[i + 2] >= negative ? 255 - pixels[i + 2] : pixels[i + 2];
    // const alpha = pixels[i + 3];

    pixels[i] = red;
    pixels[i + 1] = green;
    pixels[i + 2] = blue;
  }
};

const binary = (
  pixels: Uint8ClampedArray<ArrayBufferLike>,
  ...rest: number[]
) => {
  const binary = rest[0];

  for (let i = 0; i < pixels.length; i += 4) {
    const red = pixels[i] >= binary ? 255 : 0;
    const green = pixels[i + 1] >= binary ? 255 : 0;
    const blue = pixels[i + 2] >= binary ? 255 : 0;
    // const alpha = pixels[i + 3];

    pixels[i] = red;
    pixels[i + 1] = green;
    pixels[i + 2] = blue;
  }
};

export const makeBrighter = (
  brightnessValue: number,
  stack: Stack,
  setPicture: Function
) => {
  if (stack === null || stack.isEmpty()) {
    toast.error('Error occurred!', {
      description: 'Create a File and Load a photo to continue!'
    });
    return;
  }

  const image = stack.getCurrentPhoto();
  if (image instanceof HTMLImageElement) {
    imageOperation(image, brightness, stack, setPicture, brightnessValue);
  }
};

export const makeNegative = (
  negativeValue: number,
  stack: Stack,
  setPicture: Function
) => {
  if (stack === null || stack.isEmpty()) {
    toast.error('Error occurred!', {
      description: 'Create a File and Load a photo to continue!'
    });
    return;
  }

  const image = stack.getCurrentPhoto();
  if (image instanceof HTMLImageElement) {
    imageOperation(image, negative, stack, setPicture, negativeValue);
  }
};

export const makeBinary = (
  binaryValue: number,
  stack: Stack,
  setPicture: Function
) => {
  if (stack === null || stack.isEmpty()) {
    toast.error('Error occurred!', {
      description: 'Create a File and Load a photo to continue!'
    });
    return;
  }

  const image = stack.getCurrentPhoto();
  if (image instanceof HTMLImageElement) {
    imageOperation(image, binary, stack, setPicture, binaryValue);
  }
};

export const processFile = (
  operation: string,
  stack: Stack,
  setPicture: Function
) => {
  if (stack === null || stack.isEmpty()) {
    toast.error('Error occurred!', {
      description: 'Create a File and Load a photo to continue!'
    });
    return;
  }

  const image = stack.getCurrentPhoto();
  if (image instanceof HTMLImageElement) {
    if (operation === 'grayScale') {
      imageOperation(image, grayScale, stack, setPicture);
    } else if (operation === 'brightness') {
      imageOperation(image, brightness, stack, setPicture);
    } else {
      imageOperation(image, null, stack, setPicture);
    }
  }
};

export const loadNewPhoto = (
  photo: File,
  stack: Stack,
  setPicture: Function
) => {
  stack.makeNew();
  loadPhoto(photo, stack, setPicture);
};

export const loadPhoto = (photo: File, stack: Stack, setPicture: Function) => {
  const reader = new FileReader();

  reader.onload = (e) => {
    const image = new Image();

    image.onload = () => {
      stack.add(image);
      processFile('', stack, setPicture);
    };

    image.src = '' + e.target!.result;
  };

  reader.readAsDataURL(photo);
};
