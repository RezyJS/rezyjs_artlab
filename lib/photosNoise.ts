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
  pixelSum3,
  pixelMedian
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

  for (let line = 0; line < len; line += w) {
    for (let px = 0; px < w; px += 4) {
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

  for (let line = 0; line < len; line += w) {
    for (let px = 0; px < w; px += 4) {
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

export const makeMedianFilter = (wh: number, ww: number, file: FileElement) => {
  if (file.isEmpty()) {
    toast.error('Error occurred!', {
      description: 'Load a photo to continue!'
    });
    return;
  }

  const image = file.getCurrentPhoto();
  if (image instanceof HTMLImageElement) {
    imageOperation(
      image,
      medianFilter,
      file,
      image.width,
      image.height,
      wh,
      ww
    );
  }
};

const medianFilter = (
  pixels: Uint8ClampedArray<ArrayBufferLike>,
  ...rest: [
    width: number,
    height: number,
    windowHeight: number,
    windowWidth: number
  ]
) => {
  const [width, height, wh, ww] = rest;

  const w = width * 4,
    len = w * height;

  const pixelsCopy = [...pixels];

  for (let line = 0; line < len; line += w) {
    for (let px = 0; px < w; px += 4) {
      for (let i = 0; i < 3; ++i) {
        pixels[line + px + i] = pixelMedian(
          pixelsCopy,
          w,
          line + px + i,
          wh,
          ww
        );
      }
    }
  }
};
