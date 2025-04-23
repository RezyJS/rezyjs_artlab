export function pixelSum3(
  pixels: number[],
  width: number,
  id: number,
  matrix: number[]
): number {
  let result = 0;
  let cnt = 0;

  for (let k = -width; k <= width; k += width) {
    for (let i = -4; i <= 4; i += 4) {
      const sum = pixels[id + k + i];
      if (sum === undefined) {
        result += pixels[id] * matrix[cnt++];
      } else {
        result += sum * matrix[cnt++];
      }
    }
  }

  return result;
}

export function pixelMedian(
  pixels: number[],
  width: number,
  id: number,
  windowSize: number
): number {
  const resultArray: number[] = [];

  for (let k = -width * windowSize; k <= width * windowSize; k += width) {
    for (let i = -4 * windowSize; i <= 4 * windowSize; i += 4) {
      const px = pixels[id + k + i];
      if (px === undefined) {
        resultArray.push(pixels[id]);
      } else {
        resultArray.push(px);
      }
    }
  }

  resultArray.sort((a, b) => a - b);
  return resultArray[Math.floor(resultArray.length / 2)];
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
