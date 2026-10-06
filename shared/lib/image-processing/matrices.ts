/** Sample RGB channels with clamped coordinates; never wrap into the next row. */
export function sample(pixels: ArrayLike<number>, stride: number, id: number, dx: number, dy: number): number {
  const width = stride / 4;
  const height = pixels.length / stride;
  const channel = id % 4;
  const x = Math.floor((id % stride) / 4);
  const y = Math.floor(id / stride);
  const nx = Math.max(0, Math.min(width - 1, x + dx));
  const ny = Math.max(0, Math.min(height - 1, y + dy));
  return pixels[ny * stride + nx * 4 + channel];
}
export function pixelSum3(pixels: ArrayLike<number>, stride: number, id: number, matrix: number[]): number {
  let result = 0;
  let i = 0;
  for (let y = -1; y <= 1; y++) for (let x = -1; x <= 1; x++) result += sample(pixels, stride, id, x, y) * matrix[i++];
  return result;
}
export const H1_lowFreq = [
  1 / 9,
  1 / 9,
  1 / 9,
  1 / 9,
  1 / 9,
  1 / 9,
  1 / 9,
  1 / 9,
  1 / 9
];
export const H2_lowFreq = [0.1, 0.1, 0.1, 0.1, 0.2, 0.1, 0.1, 0.1, 0.1];
export const H3_lowFreq = [
  0.0625, 0.125, 0.0625, 0.125, 0.25, 0.125, 0.0625, 0.125, 0.0625
];

export const H1_highFreq = [-1, -1, -1, -1, 9, -1, -1, -1, -1];
export const H2_highFreq = [0, -1, 0, -1, 5, -1, 0, -1, 0];
export const H3_highFreq = [1, -2, 1, -2, 5, -2, 1, -2, 1];

export const Edge_Empower = [0, 1, 0, 1, -4, 1, 0, 1, 0];

export const Shift_Vertical = [0, -1, 0, 0, 1, 0, 0, 0, 0];
export const Shift_Horizontal = [0, 0, 0, -1, 1, 0, 0, 0, 0];
export const Shift_Diagonal = [-1, 0, 0, 0, 1, 0, 0, 0, 0];

export const Sobel_1 = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
export const Sobel_2 = [1, 2, 1, 0, 0, 0, -1, -2, -1];

export const Pravit_1 = [1, 0, -1, 1, 0, -1, 1, 0, -1];
export const Pravit_2 = [-1, -1, -1, 0, 0, 0, 1, 1, 1];

export const Embossing_Out = [0, 1, 0, -1, 0, 1, 0, -1, 0];
export const Embossing_In = [0, -1, 0, 1, 0, -1, 0, 1, 0];

export const Kirsch_1 = [5, 5, 5, -3, 0, -3, -3, -3, -3];
export const Kirsch_2 = [-3, 5, 5, -3, 0, 5, -3, -3, -3];
export const Kirsch_3 = [-3, -3, 5, -3, 0, 5, -3, -3, 5];
export const Kirsch_4 = [-3, -3, -3, -3, 0, 5, -3, 5, 5];
export const Kirsch_5 = [5, 5, -3, 5, 0, -3, -3, -3, -3];
export const Kirsch_6 = [5, -3, -3, 5, 0, -3, 5, -3, -3];
export const Kirsch_7 = [-3, -3, -3, 5, 0, -3, 5, 5, -3];
export const Kirsch_8 = [-3, -3, -3, -3, 0, -3, 5, 5, 5];
