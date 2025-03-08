import FileElement from './structures';

/* eslint-disable @typescript-eslint/no-unsafe-function-type */
export const imageOperation = (
  image: HTMLImageElement,
  callback: Function | null,
  file: FileElement,
  ...rest: unknown[]
) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  canvas.width = image.width;
  canvas.height = image.height;

  ctx.drawImage(image, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  if (callback !== null) {
    callback(pixels, ...rest);
  }

  ctx.putImageData(imageData, 0, 0);

  canvas.toBlob((blob: Blob | null) => {
    const url = URL.createObjectURL(blob!);
    const img = document.createElement('img');
    img.src = url;
    file.setPicture(img);
    if (callback !== null) file.add(img);
  }, 'image/png');
};

export const loadNewPhoto = (photo: File, file: FileElement) => {
  file.newStack();
  loadPhoto(photo, file);
};

export const loadPhoto = (photo: File, file: FileElement) => {
  const reader = new FileReader();

  reader.onload = (e) => {
    const image = new Image();

    image.onload = () => {
      file.add(image);

      imageOperation(image, null, file);
    };

    image.src = '' + e.target!.result;
  };

  reader.readAsDataURL(photo);
};
