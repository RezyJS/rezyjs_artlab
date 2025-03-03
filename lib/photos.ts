import { toast } from 'sonner';
import FileElement from './structures';

/* eslint-disable @typescript-eslint/no-unsafe-function-type */
export const imageOperation = (
  image: HTMLImageElement,
  callback: Function | null,
  file: FileElement,
  ...rest: (number | undefined | number[])[]
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
    file.setPicture(img);
    if (callback !== null) file.add(img);
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

const moreContrast = (
  pixels: Uint8ClampedArray<ArrayBufferLike>,
  ...rest: number[]
) => {
  const Q1 = rest[0];
  const Q2 = rest[1];

  for (let i = 0; i < pixels.length; i += 4) {
    const red = ((pixels[i] - Q1) * 255) / (Q2 - Q1);
    const green = ((pixels[i + 1] - Q1) * 255) / (Q2 - Q1);
    const blue = ((pixels[i + 2] - Q1) * 255) / (Q2 - Q1);
    // const alpha = pixels[i + 3];

    pixels[i] = red;
    pixels[i + 1] = green;
    pixels[i + 2] = blue;
  }
};

const lessContrast = (
  pixels: Uint8ClampedArray<ArrayBufferLike>,
  ...rest: number[]
) => {
  const Q1 = rest[0];
  const Q2 = rest[1];

  for (let i = 0; i < pixels.length; i += 4) {
    const red = ((Q1 + pixels[i]) * (Q2 - Q1)) / 255;
    const green = ((Q1 + pixels[i + 1]) * (Q2 - Q1)) / 255;
    const blue = ((Q1 + pixels[i + 2]) * (Q2 - Q1)) / 255;
    // const alpha = pixels[i + 3];

    pixels[i] = red;
    pixels[i + 1] = green;
    pixels[i + 2] = blue;
  }
};

const gammaFunc = (
  pixels: Uint8ClampedArray<ArrayBufferLike>,
  ...rest: number[]
) => {
  const gamma = rest[0];

  for (let i = 0; i < pixels.length; i += 4) {
    const red = 255 * Math.pow(pixels[i] / 255, gamma);
    const green = 255 * Math.pow(pixels[i + 1] / 255, gamma);
    const blue = 255 * Math.pow(pixels[i + 2] / 255, gamma);
    // const alpha = pixels[i + 3];

    pixels[i] = red;
    pixels[i + 1] = green;
    pixels[i + 2] = blue;
  }
};

const kvantation = (
  pixels: Uint8ClampedArray<ArrayBufferLike>,
  ...rest: [number[]]
) => {
  const borders = rest[0];
  const bordersStep = borders.length > 1 ? borders[1] - borders[0] : 256;

  if (bordersStep === 256) {
    brightness(pixels, 256);
    return;
  }

  // TODO: Make an array with arr[pixel_val] = color;
  const color: number[] = [];
  for (let i = 0; i < borders.length; ++i) {
    for (let j = 0; j < borders[i]; ++j) {
      color.push(borders[i]);
    }
  }

  for (let i = 0; i < pixels.length; i += 4) {
    const red = color[pixels[i]];
    const green = color[pixels[i + 1]];
    const blue = color[pixels[i + 2]];
    // const alpha = pixels[i + 3];

    pixels[i] = red;
    pixels[i + 1] = green;
    pixels[i + 2] = blue;
  }
};

export const makeKvantation = (borders: number, stack: FileElement) => {
  if (stack.isEmpty()) {
    toast.error('Error occurred!', {
      description: 'Create a File and Load a photo to continue!'
    });
    return;
  }

  if (borders <= 0) {
    toast.error('Wrong value', {
      description: 'You can only enter non-negative numbers'
    });
    return;
  }

  const myBorders: number[] = [];
  const step: number = +(256 / borders).toFixed();

  for (let i = step; i < 256; i += step) {
    myBorders.push(i);
  }

  if (myBorders[myBorders.length - 1] !== 255) {
    myBorders.push(255);
  }

  const image = stack.getCurrentPhoto();
  if (image instanceof HTMLImageElement) {
    imageOperation(image, kvantation, stack, myBorders);
  }
};

export const makeGamma = (gamma: number, stack: FileElement) => {
  if (stack.isEmpty()) {
    toast.error('Error occurred!', {
      description: 'Create a File and Load a photo to continue!'
    });
    return;
  }

  if (gamma <= 0) {
    toast.error('Value error', {
      description: 'Passed gamma was not a number or less than 0'
    });
  }

  const image = stack.getCurrentPhoto();
  if (image instanceof HTMLImageElement) {
    imageOperation(image, gammaFunc, stack, gamma);
  }
};

export const makeContrast = (
  q1: number,
  q2: number,
  operation: string,
  stack: FileElement
) => {
  if (stack.isEmpty()) {
    toast.error('Error occurred!', {
      description: 'Create a File and Load a photo to continue!'
    });
    return;
  }

  const image = stack.getCurrentPhoto();
  if (image instanceof HTMLImageElement) {
    switch (operation) {
      case 'more':
        imageOperation(image, moreContrast, stack, q1, q2);
        break;
      case 'less':
        imageOperation(image, lessContrast, stack, q1, q2);
        break;
    }
  }
};

export const makeBrighter = (brightnessValue: number, stack: FileElement) => {
  if (stack.isEmpty()) {
    toast.error('Error occurred!', {
      description: 'Create a File and Load a photo to continue!'
    });
    return;
  }

  const image = stack.getCurrentPhoto();
  if (image instanceof HTMLImageElement) {
    imageOperation(image, brightness, stack, brightnessValue);
  }
};

export const makeNegative = (negativeValue: number, stack: FileElement) => {
  if (stack.isEmpty()) {
    toast.error('Error occurred!', {
      description: 'Create a File and Load a photo to continue!'
    });
    return;
  }

  const image = stack.getCurrentPhoto();
  if (image instanceof HTMLImageElement) {
    imageOperation(image, negative, stack, negativeValue);
  }
};

export const makeBinary = (binaryValue: number, stack: FileElement) => {
  if (stack.isEmpty()) {
    toast.error('Error occurred!', {
      description: 'Create a File and Load a photo to continue!'
    });
    return;
  }

  const image = stack.getCurrentPhoto();
  if (image instanceof HTMLImageElement) {
    imageOperation(image, binary, stack, binaryValue);
  }
};

export const processFile = (operation: string, file: FileElement) => {
  if (file.isEmpty()) {
    toast.error('Error occurred!', {
      description: 'Load a photo to continue!'
    });
    return;
  }

  const image = file.getCurrentPhoto();

  if (image instanceof HTMLImageElement) {
    if (operation === 'grayScale') {
      imageOperation(image, grayScale, file);
    } else if (operation === 'brightness') {
      imageOperation(image, brightness, file);
    } else {
      imageOperation(image, null, file);
    }
  }
};

export const loadNewPhoto = (photo: File, file: FileElement) => {
  file.newStack();
  loadPhoto(photo, file);
};

export const loadPhoto = (photo: File, file: FileElement) => {
  const reader = new FileReader();

  reader.onload = (e) => {
    const image = new Image();

    image.onload = () => {
      file.add(image);
      processFile('', file);
    };

    image.src = '' + e.target!.result;
  };

  reader.readAsDataURL(photo);
};
