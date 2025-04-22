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
      for (let i = 0; i < 3; ++i) {
        pixels[line + px + i] = Math.abs(
          pixelSum3(pixelsCopy, w, line + px + i, Edge_Empower)
        );
      }
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
      for (let i = 0; i < 3; ++i) {
        pixels[line + px + i] = Math.abs(
          pixels[line + px + i] -
            pixelSum3(pixelsCopy, w, line + px + i, shifts[shift])
        );
      }
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
      for (let i = 0; i < 3; ++i) {
        const sum1 = Math.pow(
          pixelsCopy[line + px + i] - pixelsCopy[line + w + px + 4 + i],
          2
        );

        const sum2 = Math.pow(
          pixelsCopy[line + px + 4 + i] - pixelsCopy[line + w + px + i],
          2
        );

        pixels[line + px + i] = Math.max(
          0,
          Math.min(255, Math.sqrt(sum1 + sum2))
        );
      }
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
      for (let i = 0; i < 3; ++i) {
        pixels[line + px + i] = Math.sqrt(
          Math.pow(pixelSum3(pixelsCopy, w, line + px + i, Sobel_1), 2) +
            Math.pow(pixelSum3(pixelsCopy, w, line + px + i, Sobel_2), 2)
        );
      }
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
      for (let i = 0; i < 3; ++i) {
        pixels[line + px + i] = Math.max(
          pixelSum3(pixelsCopy, w, line + px + i, Pravit_1),
          pixelSum3(pixelsCopy, w, line + px + i, Pravit_2)
        );
      }
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
      for (let i = 0; i < 3; ++i) {
        pixels[line + px + i] = Math.max(
          0,
          Math.min(
            255,
            pixelSum3(pixelsCopy, w, line + px + i, embossingMatrix[type]) + 128
          )
        );
      }
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
        pixels[line + px + i] = Math.max(
          Math.abs(pixelSum3(pixelsCopy, w, line + px + i, Kirsch_1)),
          Math.abs(pixelSum3(pixelsCopy, w, line + px + i, Kirsch_2)),
          Math.abs(pixelSum3(pixelsCopy, w, line + px + i, Kirsch_3)),
          Math.abs(pixelSum3(pixelsCopy, w, line + px + i, Kirsch_4)),
          Math.abs(pixelSum3(pixelsCopy, w, line + px + i, Kirsch_5)),
          Math.abs(pixelSum3(pixelsCopy, w, line + px + i, Kirsch_6)),
          Math.abs(pixelSum3(pixelsCopy, w, line + px + i, Kirsch_7)),
          Math.abs(pixelSum3(pixelsCopy, w, line + px + i, Kirsch_8))
        );
      }
    }
  }
};
