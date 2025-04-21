import { toast } from 'sonner';
import FileElement from './structures';
import { imageOperation } from './photosMain';
import {
  H1_lowFreq,
  H2_lowFreq,
  H3_lowFreq,
  H1_highFreq,
  H2_highFreq,
  H3_highFreq,
  pixelSum3
} from './Matrixes';

export const makeLowFreq = (core: 'H1' | 'H2' | 'H3', file: FileElement) => {
  if (file.isEmpty()) {
    toast.error('Error occurred!', {
      description: 'Load a photo to continue!'
    });
    return;
  }

  const image = file.getCurrentPhoto();
  if (image instanceof HTMLImageElement) {
    imageOperation(image, lowFreq, file, image.width, image.height, core);
  }
};

const lowFreq = (
  pixels: Uint8ClampedArray<ArrayBufferLike>,
  ...rest: [width: number, height: number, core: 'H1' | 'H2' | 'H3']
) => {
  const [width, height, core] = rest;
  const w = width * 4,
    len = w * height;

  const pixelsCopy = [...pixels];

  const cores = { H1: H1_lowFreq, H2: H2_lowFreq, H3: H3_lowFreq };

  for (let line = w + 4; line < len - w; line += w) {
    for (let px = 4; px < w - 4; px += 4) {
      for (let i = 0; i < 3; ++i) {
        pixels[line + px + i] = pixelSum3(
          pixelsCopy,
          w,
          line + px + i,
          cores[core]
        );
      }
    }
  }
};

export const makeHighFreq = async (
  core: 'H1' | 'H2' | 'H3',
  file: FileElement
) => {
  if (file.isEmpty()) {
    toast.error('Error occurred!', {
      description: 'Load a photo to continue!'
    });
    return;
  }

  const image = file.getCurrentPhoto();
  if (image instanceof HTMLImageElement) {
    imageOperation(image, highFreq, file, image.width, image.height, core);
  }
};

const highFreq = (
  pixels: Uint8ClampedArray<ArrayBufferLike>,
  ...rest: [width: number, height: number, core: 'H1' | 'H2' | 'H3']
) => {
  const [width, height, core] = rest;
  const w = width * 4,
    len = w * height;

  const pixelsCopy = [...pixels];

  const cores = { H1: H1_highFreq, H2: H2_highFreq, H3: H3_highFreq };

  for (let line = w + 4; line < len - w; line += w) {
    for (let px = 4; px < w - 4; px += 4) {
      for (let i = 0; i < 3; ++i) {
        pixels[line + px + i] =
          pixelsCopy[line + px + i] -
          pixelSum3(pixelsCopy, w, line + px + i, cores[core]);
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

  for (let line = startStep; line < lastLine; line += step) {
    for (let px = offsetValue; px < step - offsetValue; ++px) {
      const arr: number[] = [];

      for (let sign = -1; sign <= 1; ++sign) {
        for (let offset = -offsetValue; offset <= offsetValue; offset += 4) {
          arr.push(_pixels[line + px + sign * step + offset]);
        }
      }

      arr.sort();
      pixels[line + px] = arr[Math.floor(arr.length / 2)];
    }
  }
};
