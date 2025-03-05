import { toast } from 'sonner';
import FileElement from './structures';

/* eslint-disable @typescript-eslint/no-unsafe-function-type */
export const imageOperation = (
  image: HTMLImageElement,
  callback: Function | null,
  file: FileElement,
  ...rest: unknown[]
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
  }, 'image/png');
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
  const brightnessValue = rest[0];

  for (let i = 0; i < pixels.length; i += 4) {
    const red = clamp(pixels[i] + brightnessValue);
    const green = clamp(pixels[i + 1] + brightnessValue);
    const blue = clamp(pixels[i + 2] + brightnessValue);

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
    const red = pixels[i];
    const green = pixels[i + 1];
    const blue = pixels[i + 2];

    const I = 0.3 * red + 0.59 * green + 0.11 * blue;

    pixels[i] = I >= binary ? 255 : 0;
    pixels[i + 1] = I >= binary ? 255 : 0;
    pixels[i + 2] = I >= binary ? 255 : 0;
    pixels[i + 3] = 255;
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

const clamp = (num: number) => Math.min(Math.max(num, 0), 255);

const kvantation = (
  pixels: Uint8ClampedArray<ArrayBufferLike>,
  ...rest: [number]
) => {
  const k = rest[0];

  const quants = [];
  const quantSize: number = Math.ceil(256 / k);

  for (let i = 0; i < k; ++i) {
    const c = clamp(quantSize - 1 + quantSize * i);

    const start = quantSize * i;
    const end = Math.min(quantSize + quantSize * i, 256);

    for (let j = start; j < end; ++j) {
      quants[j] = c;
    }
  }

  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i] = quants[pixels[i]];
    pixels[i + 1] = quants[pixels[i + 1]];
    pixels[i + 2] = quants[pixels[i + 2]];
  }
};

const getColors = (num: string) => {
  const answer: number[] = [];

  for (let i = 1; i < 6; i += 2) {
    answer.push(+('0x' + num.slice(i, i + 2)));
  }

  return { red: answer[0], green: answer[1], blue: answer[2] };
};

const pseudoColoring = (
  pixels: Uint8ClampedArray<ArrayBufferLike>,
  ...rest: [number[], string[]]
) => {
  const borders: number[] = rest[0];
  const colors: string[] = rest[1];

  const ranges: string[] = [];

  if (borders.length === 1) {
    for (let i = 0; i < 256; ++i) {
      ranges.push(colors[0]);
    }
  } else {
    for (let i = 0; i < borders.length - 1; ++i) {
      for (let j = borders[i]; j <= borders[i + 1]; ++j) {
        ranges[j] = colors[i];
      }
    }
  }

  for (let i = 0; i < pixels.length; i += 4) {
    const red = pixels[i];
    const green = pixels[i + 1];
    const blue = pixels[i + 2];

    const I = 0.3 * red + 0.59 * green + 0.11 * blue;

    pixels[i] = getColors(ranges[I]).red;
    pixels[i + 1] = getColors(ranges[I]).green;
    pixels[i + 2] = getColors(ranges[I]).blue;
  }
};

export const makePseudoColoring = (
  borders: number[],
  colors: string[],
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
    imageOperation(image, pseudoColoring, stack, borders, colors);
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

  const image = stack.getCurrentPhoto();
  if (image instanceof HTMLImageElement) {
    imageOperation(image, kvantation, stack, borders);
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
