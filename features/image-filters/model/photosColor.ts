import { toast } from 'sonner';
import { FileElement, imageOperation } from '@/entities/image';
export const makeSolarization = (k: number, stack: FileElement) => {
  if (stack.isEmpty()) {
    toast.error('Error occurred!', {
      description: 'Load a photo to continue!'
    });
    return;
  }

  const image = stack.getCurrentPhoto();
  if (image instanceof HTMLImageElement) {
    imageOperation(image, 'solarization', stack, k);
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
    imageOperation(image, 'pseudoColoring', stack, borders, colors);
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
    imageOperation(image, 'kvantation', stack, borders);
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
    return;
  }

  const image = stack.getCurrentPhoto();
  if (image instanceof HTMLImageElement) {
    imageOperation(image, 'gammaFunc', stack, gamma);
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
        imageOperation(image, 'moreContrast', stack, q1, q2);
        break;
      case 'less':
        imageOperation(image, 'lessContrast', stack, q1, q2);
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
    imageOperation(image, 'brightness', stack, brightnessValue);
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
    imageOperation(image, 'negative', stack, negativeValue);
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
    imageOperation(image, 'binary', stack, binaryValue);
  }
};

export const makeGrayScale = (stack: FileElement) => {
  if (stack.isEmpty()) {
    toast.error('Error occurred!', {
      description: 'Load a photo to continue!'
    });
    return;
  }

  const image = stack.getCurrentPhoto();
  if (image instanceof HTMLImageElement) {
    imageOperation(image, 'grayScale', stack);
  }
};
