export const grayScale = (pixels: Uint8ClampedArray<ArrayBufferLike>) => {
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

export const brightness = (
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

export const negative = (
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

export const binary = (
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

export const moreContrast = (
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

export const lessContrast = (
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

export const gammaFunc = (
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

export const kvantation = (
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

export const getColors = (num: string) => {
  const answer: number[] = [];

  for (let i = 1; i < 6; i += 2) {
    answer.push(+('0x' + num.slice(i, i + 2)));
  }

  return { red: answer[0], green: answer[1], blue: answer[2] };
};

export const pseudoColoring = (
  pixels: Uint8ClampedArray<ArrayBufferLike>,
  ...rest: [number[], string[]]
) => {
  const borders: number[] = rest[0];
  const colors: string[] = rest[1];

  const ranges: string[] = [];

  for (let i = 0; i < borders.length - 1; ++i) {
    for (let j = borders[i]; j <= borders[i + 1]; ++j) {
      ranges[j] = colors[i];
    }
  }

  for (let i = 0; i < pixels.length; i += 4) {
    const R = pixels[i];
    const G = pixels[i + 1];
    const B = pixels[i + 2];

    const I = +(0.3 * R + 0.59 * G + 0.11 * B).toFixed(0);
    const { red, green, blue } = getColors(ranges[I]);

    pixels[i] = red;
    pixels[i + 1] = green;
    pixels[i + 2] = blue;
  }
};

export const solarization = (
  pixels: Uint8ClampedArray<ArrayBufferLike>,
  ...rest: number[]
) => {
  const k = rest[0];

  for (let i = 0; i < pixels.length; i += 4) {
    const R = pixels[i];
    const G = pixels[i + 1];
    const B = pixels[i + 2];

    pixels[i] = k * R * (255 - R);
    pixels[i + 1] = k * G * (255 - G);
    pixels[i + 2] = k * B * (255 - B);
  }
};
