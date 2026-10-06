import {
  H1_lowFreq,
  H2_lowFreq,
  H3_lowFreq,
  H1_highFreq,
  H2_highFreq,
  H3_highFreq,
  pixelSum3
} from './matrices.ts';
export const lowFreq = (
  pixels: Uint8ClampedArray<ArrayBufferLike>,
  ...rest: [width: number, height: number, core: 'H1' | 'H2' | 'H3']
) => {
  const [width, height, core] = rest;
  const w = width * 4,
    len = w * height;

  const pixelsCopy = pixels.slice();

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

export const highFreq = (
  pixels: Uint8ClampedArray<ArrayBufferLike>,
  ...rest: [width: number, height: number, core: 'H1' | 'H2' | 'H3']
) => {
  const [width, height, core] = rest;
  const w = width * 4,
    len = w * height;

  const pixelsCopy = pixels.slice();

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

export { medianFilter } from './median.ts';
