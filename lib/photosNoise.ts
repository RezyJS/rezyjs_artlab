import { toast } from 'sonner';
import FileElement from './structures';
import { imageOperation } from './photosMain';
import { clamp } from './photosColor';

export const makeLowFreq = (core: 'H1' | 'H2' | 'H3', file: FileElement) => {
  if (file.isEmpty()) {
    toast.error('Error occurred!', {
      description: 'Load a photo to continue!'
    });
    return;
  }

  const image = file.getCurrentPhoto();
  if (image instanceof HTMLImageElement) {
    imageOperation(image, lowFreq, file, image.width, core);
  }
};

const lowFreq = (
  pixels: Uint8ClampedArray<ArrayBufferLike>,
  ...rest: [width: number, core: 'H1' | 'H2' | 'H3']
) => {
  const width = rest[0];
  const core = rest[1];

  switch (core) {
    case 'H1': {
      const step = width * 4;
      const lastLine = pixels.length - step - 4;
      for (let i = step + 4; i < lastLine; i += step) {
        for (let j = 0; j < step; ++j) {
          const upperLine =
            pixels[i + j - step - 4] +
            pixels[i + j - step] +
            pixels[i + j - step + 4];

          const middleLine =
            pixels[i + j - 4] + pixels[i + j] + pixels[i + j + 4];

          const lowerLine =
            pixels[i + j + step - 4] +
            pixels[i + j + step] +
            pixels[i + j + step + 4];

          pixels[i + j] = clamp((upperLine + middleLine + lowerLine) / 9);
        }
      }
    }
    case 'H2': {
      const step = width * 4;
      const lastLine = pixels.length - step - 4;
      for (let i = step + 4; i < lastLine; i += step) {
        for (let j = 0; j < step; ++j) {
          const upperLine =
            pixels[i + j - step - 4] +
            pixels[i + j - step] +
            pixels[i + j - step + 4];

          const middleLine =
            pixels[i + j - 4] + 2 * pixels[i + j] + pixels[i + j + 4];

          const lowerLine =
            pixels[i + j + step - 4] +
            pixels[i + j + step] +
            pixels[i + j + step + 4];

          pixels[i + j] = clamp((upperLine + middleLine + lowerLine) / 10);
        }
      }
    }
    case 'H3': {
      const step = width * 4;
      const lastLine = pixels.length - step - 4;
      for (let i = step + 4; i < lastLine; i += step) {
        for (let j = 0; j < step; ++j) {
          const upperLine =
            pixels[i + j - step - 4] +
            pixels[i + j - step] * 2 +
            pixels[i + j - step + 4];

          const middleLine =
            2 * pixels[i + j - 4] + 4 * pixels[i + j] + 2 * pixels[i + j + 4];

          const lowerLine =
            pixels[i + j + step - 4] +
            pixels[i + j + step] * 2 +
            pixels[i + j + step + 4];

          pixels[i + j] = clamp((upperLine + middleLine + lowerLine) / 16);
        }
      }
    }
  }
};

export const makeHighFreq = (core: 'H1' | 'H2' | 'H3', file: FileElement) => {
  if (file.isEmpty()) {
    toast.error('Error occurred!', {
      description: 'Load a photo to continue!'
    });
    return;
  }

  const image = file.getCurrentPhoto();
  if (image instanceof HTMLImageElement) {
    imageOperation(image, highFreq, file, image.width, core);
  }
};

const highFreq = (
  pixels: Uint8ClampedArray<ArrayBufferLike>,
  ...rest: [width: number, core: 'H1' | 'H2' | 'H3']
) => {
  const width = rest[0];
  const core = rest[1];

  switch (core) {
    case 'H1': {
      const step = width * 4;
      const lastLine = pixels.length - step - 4;
      for (let i = step + 4; i < lastLine; i += step) {
        for (let j = 0; j < step; ++j) {
          const upperLine =
            -1 * pixels[i + j - step - 4] +
            -1 * pixels[i + j - step] +
            -1 * pixels[i + j - step + 4];

          const middleLine =
            -1 * pixels[i + j - 4] + 9 * pixels[i + j] + -1 * pixels[i + j + 4];

          const lowerLine =
            -1 * pixels[i + j + step - 4] +
            -1 * pixels[i + j + step] +
            -1 * pixels[i + j + step + 4];

          pixels[i + j] = clamp(upperLine + middleLine + lowerLine);
        }
      }
    }
    case 'H2': {
      const step = width * 4;
      const lastLine = pixels.length - step - 4;
      for (let i = step + 4; i < lastLine; i += step) {
        for (let j = 0; j < step; ++j) {
          const upperLine =
            0 * pixels[i + j - step - 4] +
            -1 * pixels[i + j - step] +
            0 * pixels[i + j - step + 4];

          const middleLine =
            -1 * pixels[i + j - 4] + 5 * pixels[i + j] + -1 * pixels[i + j + 4];

          const lowerLine =
            0 * pixels[i + j + step - 4] +
            -1 * pixels[i + j + step] +
            0 * pixels[i + j + step + 4];

          pixels[i + j] = clamp(upperLine + middleLine + lowerLine);
        }
      }
    }
    case 'H3': {
      const step = width * 4;
      const lastLine = pixels.length - step - 4;
      for (let i = step + 4; i < lastLine; i += step) {
        for (let j = 0; j < step; ++j) {
          const upperLine =
            1 * pixels[i + j - step - 4] +
            -2 * pixels[i + j - step] +
            1 * pixels[i + j - step + 4];

          const middleLine =
            -2 * pixels[i + j - 4] + 5 * pixels[i + j] + -2 * pixels[i + j + 4];

          const lowerLine =
            1 * pixels[i + j + step - 4] +
            -2 * pixels[i + j + step] +
            1 * pixels[i + j + step + 4];

          pixels[i + j] = clamp(upperLine + middleLine + lowerLine);
        }
      }
    }
  }
};

export const makeMedianFilter = (windowWidth: number, file: FileElement) => {
  if (file.isEmpty()) {
    toast.error('Error occurred!', {
      description: 'Load a photo to continue!'
    });
    return;
  }

  const image = file.getCurrentPhoto();
  if (image instanceof HTMLImageElement) {
    imageOperation(image, medianFilter, file, image.width, windowWidth);
  }
};

const medianFilter = (
  pixels: Uint8ClampedArray<ArrayBufferLike>,
  ...rest: [width: number, windowSize: number]
) => {
  const width = rest[0];
  const windowSize = rest[1];

  const step = width * 4;
  let startStep = step;
  let lastLine = pixels.length - step;
  let offsetValue = 0;

  switch (windowSize) {
    case 3:
      lastLine -= 4;
      startStep += 4;
      offsetValue = 4;
      break;
    case 5:
      lastLine -= 4 * 2;
      startStep += 4 * 2;
      offsetValue = 8;
      break;
    case 7:
      lastLine -= 4 * 3;
      startStep += 4 * 3;
      offsetValue = 12;
      break;
    case 9:
      lastLine -= 4 * 4;
      startStep += 4 * 4;
      offsetValue = 16;
      break;
  }

  const _pixels = [...pixels];

  for (let i = startStep; i < lastLine; i += step) {
    for (let j = 0; j < step; ++j) {
      const arr: number[] = [];

      for (let sign = -1; sign < 2; ++sign) {
        for (let offset = -offsetValue; offset <= offsetValue; offset += 4) {
          arr.push(_pixels[i + j + sign * step + offset]);
        }
      }

      arr.sort();
      pixels[i + j] = arr[Math.floor(arr.length / 2)];
    }
  }
};
