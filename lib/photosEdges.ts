import { toast } from 'sonner';
import { imageOperation } from './photosMain';
import FileElement from './structures';
import {
  Edge_Empower,
  Embossing_In,
  Embossing_Out,
  Kirsch_1,
  Kirsch_2,
  Kirsch_3,
  Kirsch_4,
  Kirsch_5,
  Kirsch_6,
  Kirsch_7,
  Kirsch_8,
  pixelSum3,
  Pravit_1,
  Pravit_2,
  Shift_Diagonal,
  Shift_Horizontal,
  Shift_Vertical,
  Sobel_1,
  Sobel_2
} from './Matrixes';
import { clamp } from './photosColor';

export const makeEdgeEmpower = (file: FileElement) => {
  if (file.isEmpty()) {
    toast.error('Error occurred!', {
      description: 'Load a photo to continue!'
    });
    return;
  }

  const image = file.getCurrentPhoto();
  if (image instanceof HTMLImageElement) {
    imageOperation(image, edgeEmpower, file, image.width, image.height);
  }
};

const edgeEmpower = (
  pixels: Uint8ClampedArray<ArrayBufferLike>,
  ...rest: [width: number, height: number]
) => {
  const [width, height] = rest;
  const w = width * 4;
  const len = w * height;

  const pixelsCopy = [...pixels];

  for (let line = 0; line < len; line += w) {
    for (let px = 0; px < w; px += 4) {
      const c = pixelSum3(pixelsCopy, w, line + px, Edge_Empower);
      pixels[line + px + 0] = clamp(Math.abs(c));
      pixels[line + px + 1] = clamp(Math.abs(c));
      pixels[line + px + 2] = clamp(Math.abs(c));
    }
  }
};

export const makeEdgeByShift = (
  file: FileElement,
  shift: 'vertical' | 'horizontal' | 'diagonal'
) => {
  if (file.isEmpty()) {
    toast.error('Error occurred!', {
      description: 'Load a photo to continue!'
    });
    return;
  }

  const image = file.getCurrentPhoto();
  if (image instanceof HTMLImageElement) {
    imageOperation(image, edgeByShift, file, image.width, image.height, shift);
  }
};

const edgeByShift = (
  pixels: Uint8ClampedArray<ArrayBufferLike>,
  ...rest: [
    width: number,
    height: number,
    shift: 'vertical' | 'horizontal' | 'diagonal'
  ]
) => {
  const [width, height, shift] = rest;
  const w = width * 4;
  const len = w * height;

  const pixelsCopy = [...pixels];

  const shifts = {
    vertical: Shift_Vertical,
    horizontal: Shift_Horizontal,
    diagonal: Shift_Diagonal
  };

  for (let line = 0; line < len; line += w) {
    for (let px = 0; px < w; px += 4) {
      const edge = pixelSum3(pixelsCopy, w, line + px, shifts[shift]);
      const c = pixels[line + px] - edge;

      pixels[line + px + 0] = clamp(Math.abs(c));
      pixels[line + px + 1] = clamp(Math.abs(c));
      pixels[line + px + 2] = clamp(Math.abs(c));
    }
  }
};

export const makeCross = (file: FileElement) => {
  if (file.isEmpty()) {
    toast.error('Error occurred!', {
      description: 'Load a photo to continue!'
    });
    return;
  }

  const image = file.getCurrentPhoto();
  if (image instanceof HTMLImageElement) {
    imageOperation(image, cross, file, image.width, image.height);
  }
};

const cross = (
  pixels: Uint8ClampedArray<ArrayBufferLike>,
  ...rest: [width: number, height: number]
) => {
  const [width, height] = rest;
  const w = width * 4;
  const len = w * height;

  const pixelsCopy = [...pixels];

  for (let line = 0; line < len; line += w) {
    for (let px = 0; px < w; px += 4) {
      const sum1 = Math.pow(
        pixelsCopy[line + px] - pixelsCopy[line + w + px + 4],
        2
      );

      const sum2 = Math.pow(
        pixelsCopy[line + px + 4] - pixelsCopy[line + w + px],
        2
      );

      pixels[line + px + 0] = clamp(Math.sqrt(sum1 + sum2));
      pixels[line + px + 1] = clamp(Math.sqrt(sum1 + sum2));
      pixels[line + px + 2] = clamp(Math.sqrt(sum1 + sum2));
    }
  }
};

export const makeSobel = (file: FileElement) => {
  if (file.isEmpty()) {
    toast.error('Error occurred!', {
      description: 'Load a photo to continue!'
    });
    return;
  }

  const image = file.getCurrentPhoto();
  if (image instanceof HTMLImageElement) {
    imageOperation(image, sobel, file, image.width, image.height);
  }
};

const sobel = (
  pixels: Uint8ClampedArray<ArrayBufferLike>,
  ...rest: [width: number, height: number]
) => {
  const [width, height] = rest;
  const w = width * 4;
  const len = w * height;

  const pixelsCopy = [...pixels];

  for (let line = 0; line < len; line += w) {
    for (let px = 0; px < w; px += 4) {
      const c1 = pixelSum3(pixelsCopy, w, line + px, Sobel_1);
      const c2 = pixelSum3(pixelsCopy, w, line + px, Sobel_2);

      const res = clamp(Math.sqrt(Math.pow(c1, 2) + Math.pow(c2, 2)));

      pixels[line + px + 0] = res;
      pixels[line + px + 1] = res;
      pixels[line + px + 2] = res;
    }
  }
};

export const makePravit = (file: FileElement) => {
  if (file.isEmpty()) {
    toast.error('Error occurred!', {
      description: 'Load a photo to continue!'
    });
    return;
  }

  const image = file.getCurrentPhoto();
  if (image instanceof HTMLImageElement) {
    imageOperation(image, pravit, file, image.width, image.height);
  }
};

const pravit = (
  pixels: Uint8ClampedArray<ArrayBufferLike>,
  ...rest: [width: number, height: number]
) => {
  const [width, height] = rest;
  const w = width * 4;
  const len = w * height;

  const pixelsCopy = [...pixels];

  for (let line = 0; line < len; line += w) {
    for (let px = 0; px < w; px += 4) {
      const c1 = pixelSum3(pixelsCopy, w, line + px, Pravit_1);
      const c2 = pixelSum3(pixelsCopy, w, line + px, Pravit_2);

      pixels[line + px + 0] = Math.max(c1, c2);
      pixels[line + px + 1] = Math.max(c1, c2);
      pixels[line + px + 2] = Math.max(c1, c2);
    }
  }
};

export const makeEmbossing = (file: FileElement, type: 'in' | 'out') => {
  if (file.isEmpty()) {
    toast.error('Error occurred!', {
      description: 'Load a photo to continue!'
    });
    return;
  }

  const image = file.getCurrentPhoto();
  if (image instanceof HTMLImageElement) {
    imageOperation(image, embossing, file, image.width, image.height, type);
  }
};

const embossing = (
  pixels: Uint8ClampedArray<ArrayBufferLike>,
  ...rest: [width: number, height: number, type: 'in' | 'out']
) => {
  const [width, height, type] = rest;
  const w = width * 4;
  const len = w * height;

  const pixelsCopy = [...pixels];

  const embossingMatrix = {
    in: Embossing_In,
    out: Embossing_Out
  };

  for (let line = 0; line < len; line += w) {
    for (let px = 0; px < w; px += 4) {
      const c = clamp(
        pixelSum3(pixelsCopy, w, line + px, embossingMatrix[type]) + 128
      );

      pixels[line + px + 0] = c;
      pixels[line + px + 1] = c;
      pixels[line + px + 2] = c;
    }
  }
};

export const makeKirsch = (file: FileElement) => {
  if (file.isEmpty()) {
    toast.error('Error occurred!', {
      description: 'Load a photo to continue!'
    });
    return;
  }

  const image = file.getCurrentPhoto();
  if (image instanceof HTMLImageElement) {
    imageOperation(image, kirsch, file, image.width, image.height);
  }
};

const kirsch = (
  pixels: Uint8ClampedArray<ArrayBufferLike>,
  ...rest: [width: number, height: number]
) => {
  const [width, height] = rest;
  const w = width * 4;
  const len = w * height;

  const pixelsCopy = [...pixels];

  for (let line = 0; line < len; line += w) {
    for (let px = 0; px < w; px += 4) {
      for (let i = 0; i < 3; ++i) {
        const c1 = pixelSum3(pixelsCopy, w, line + px, Kirsch_1);
        const c2 = pixelSum3(pixelsCopy, w, line + px, Kirsch_2);
        const c3 = pixelSum3(pixelsCopy, w, line + px, Kirsch_3);
        const c4 = pixelSum3(pixelsCopy, w, line + px, Kirsch_4);
        const c5 = pixelSum3(pixelsCopy, w, line + px, Kirsch_5);
        const c6 = pixelSum3(pixelsCopy, w, line + px, Kirsch_6);
        const c7 = pixelSum3(pixelsCopy, w, line + px, Kirsch_7);
        const c8 = pixelSum3(pixelsCopy, w, line + px, Kirsch_8);

        const c = clamp(Math.max(c1, c2, c3, c4, c5, c6, c7, c8));

        pixels[line + px + 0] = c;
        pixels[line + px + 1] = c;
        pixels[line + px + 2] = c;
      }
    }
  }
};
