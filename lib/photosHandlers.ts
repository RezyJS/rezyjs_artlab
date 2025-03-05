/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { toast } from 'sonner';
import FileElement from './structures';
import {
  binary,
  brightness,
  gammaFunc,
  grayScale,
  kvantation,
  lessContrast,
  moreContrast,
  negative,
  pseudoColoring,
  solarization
} from './photosCallbacks';

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

export const makeSolarization = (k: number, stack: FileElement) => {
  if (stack.isEmpty()) {
    toast.error('Error occurred!', {
      description: 'Load a photo to continue!'
    });
    return;
  }

  const image = stack.getCurrentPhoto();
  if (image instanceof HTMLImageElement) {
    imageOperation(image, solarization, stack, k);
  }
};

export const makePseudoColoring = (
  borders: number[],
  colors: string[],
  stack: FileElement
) => {
  if (stack.isEmpty()) {
    toast.error('Error occurred!', {
      description: 'Load a photo to continue!'
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
      description: 'Load a photo to continue!'
    });
    return;
  }

  if (borders <= 0) {
    toast.error('Wrong value', {
      description: 'Passed value that was not a number or less than 0'
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
      description: 'Load a photo to continue!'
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
      description: 'Load a photo to continue!'
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
      description: 'Load a photo to continue!'
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
      description: 'Load a photo to continue!'
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
      description: 'Load a photo to continue!'
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
