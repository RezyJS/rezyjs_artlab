export async function decodeImage(src: string) {
  const image = new Image();
  image.decoding = 'async';
  image.src = src;
  try { await image.decode(); return image; }
  catch (error) { image.removeAttribute('src'); throw error; }
}
