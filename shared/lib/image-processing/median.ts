/** Exact rectangular median using a sliding, two-level 8-bit histogram. */
export function medianFilter(pixels: Uint8ClampedArray, width: number, height: number, windowHeight: number, windowWidth: number) {
  const source = pixels.slice();
  const fine = new Uint32Array(3 * 256);
  const coarse = new Uint32Array(3 * 16);
  const left = Math.floor(windowWidth / 2);
  const top = Math.floor(windowHeight / 2);
  const rank = Math.floor(windowWidth * windowHeight / 2);
  const update = (index: number, delta: number) => {
    for (let channel = 0; channel < 3; channel++) {
      const value = source[index + channel];
      fine[channel * 256 + value] += delta;
      coarse[channel * 16 + (value >> 4)] += delta;
    }
  };
  const rows = new Uint32Array(windowHeight);
  for (let y = 0; y < height; y++) {
    fine.fill(0);
    coarse.fill(0);
    for (let ky = 0; ky < windowHeight; ky++) {
      rows[ky] = Math.max(0, Math.min(height - 1, y + ky - top)) * width * 4;
      for (let kx = 0; kx < windowWidth; kx++) {
        const x = Math.max(0, Math.min(width - 1, kx - left));
        update(rows[ky] + x * 4, 1);
      }
    }
    for (let x = 0; x < width; x++) {
      if (x > 0) {
        const leaving = Math.max(0, Math.min(width - 1, x - left - 1)) * 4;
        const entering = Math.max(0, Math.min(width - 1, x + windowWidth - left - 1)) * 4;
        for (let ky = 0; ky < windowHeight; ky++) {
          update(rows[ky] + leaving, -1);
          update(rows[ky] + entering, 1);
        }
      }
      const index = (y * width + x) * 4;
      for (let channel = 0; channel < 3; channel++) {
        let count = 0;
        let bucket = 0;
        while (count + coarse[channel * 16 + bucket] <= rank) count += coarse[channel * 16 + bucket++];
        let value = bucket * 16;
        while (count + fine[channel * 256 + value] <= rank) count += fine[channel * 256 + value++];
        pixels[index + channel] = value;
      }
      // Alpha is left unchanged, matching the other noise filters.
    }
  }
}
