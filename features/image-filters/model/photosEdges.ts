import { toast } from 'sonner';
import { FileElement, imageOperation } from '@/entities/image';
export const makeEdgeEmpower = (file: FileElement) => {
  if (file.isEmpty()) {
    toast.error('Error occurred!', {
      description: 'Load a photo to continue!'
    });
    return;
  }

  const image = file.getCurrentPhoto();
  if (image instanceof HTMLImageElement) {
    imageOperation(image, 'edgeEmpower', file, image.width, image.height);
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
    imageOperation(image, 'edgeByShift', file, image.width, image.height, shift);
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
    imageOperation(image, 'cross', file, image.width, image.height);
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
    imageOperation(image, 'sobel', file, image.width, image.height);
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
    imageOperation(image, 'pravit', file, image.width, image.height);
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
    imageOperation(image, 'embossing', file, image.width, image.height, type);
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
    imageOperation(image, 'kirsch', file, image.width, image.height);
  }
};
