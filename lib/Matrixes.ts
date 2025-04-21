export function matrixExecution(
  imagePixels: Uint8ClampedArray,
  width: number,
  height: number,
  enlargeValue: number,
  callback: (
    originalPixels: Uint8ClampedArray,
    enlargedPixels: number[],
    enlargedWidth: number,
    enlargedHeight: number
  ) => number[]
): void {
  // Create a copy of the original pixels
  const originalCopy = new Uint8ClampedArray(imagePixels); // Use appropriate type if needed

  // Enlarge the copy
  const enlargedPixels = enlarge1D(originalCopy, width, height, enlargeValue);
  const enlargedWidth = width + 2 * enlargeValue;
  const enlargedHeight = height + 2 * enlargeValue;

  // Apply callback to get processed pixels (original size)
  const processedPixels = callback(
    imagePixels,
    enlargedPixels,
    enlargedWidth,
    enlargedHeight
  );

  // Validate the processed array length
  if (processedPixels.length !== width * 4 * height) {
    throw new Error('Callback must return an array of the original dimensions');
  }

  // Update the original imagePixels
  for (let i = 0; i < processedPixels.length; i++) {
    imagePixels[i] = processedPixels[i];
  }
}

export function pixelSum3(
  pixels: number[],
  width: number,
  id: number,
  matrix: number[]
) {
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

  return Math.max(0, Math.min(255, result));
}

function enlarge1D(
  originalPixels: Uint8ClampedArray,
  originalWidth: number,
  originalHeight: number,
  N: number
): number[] {
  // Step 1: Enlarge horizontally (add left/right padding)
  const horizontalEnlarged: number[] = [];
  for (let row = 0; row < originalHeight; row++) {
    const rowStart = row * originalWidth;
    const rowEnd = rowStart + originalWidth;
    const originalRow = originalPixels.slice(rowStart, rowEnd);

    const leftPad = Array(N).fill(originalRow[0]);
    const rightPad = Array(N).fill(originalRow[originalRow.length - 1]);
    const newRow = [...leftPad, ...originalRow, ...rightPad];

    horizontalEnlarged.push(...newRow);
  }

  // Step 2: Enlarge vertically (add top/bottom padding)
  const horizontalEnlargedWidth = originalWidth + 2 * N;
  const horizontalEnlargedHeight = originalHeight;

  const firstRow = horizontalEnlarged.slice(0, horizontalEnlargedWidth);
  const lastRow = horizontalEnlarged.slice(
    (horizontalEnlargedHeight - 1) * horizontalEnlargedWidth,
    horizontalEnlargedHeight * horizontalEnlargedWidth
  );

  const topPadding = Array.from({ length: N }, () => firstRow).flat();
  const bottomPadding = Array.from({ length: N }, () => lastRow).flat();

  return [...topPadding, ...horizontalEnlarged, ...bottomPadding];
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
