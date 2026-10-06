import { toast } from 'sonner';
import { FileElement, imageOperation } from '@/entities/image';
export const makeLowFreq = (core: 'H1' | 'H2' | 'H3', file: FileElement) => {
  if (file.isEmpty()) {
    toast.error('Error occurred!', {
      description: 'Load a photo to continue!'
    });
    return;
  }

  const image = file.getCurrentPhoto();
  if (image instanceof HTMLImageElement) {
    imageOperation(image, 'lowFreq', file, image.width, image.height, core);
  }
};

export const makeHighFreq = async (
  core: 'H1' | 'H2' | 'H3',
  file: FileElement
) => {
  if (file.isEmpty()) {
    toast.error('Error occurred!', {
      description: 'Load a photo to continue!'
    });
    return;
  }

  const image = file.getCurrentPhoto();
  if (image instanceof HTMLImageElement) {
    imageOperation(image, 'highFreq', file, image.width, image.height, core);
  }
};

export const makeMedianFilter = (wh: number, ww: number, file: FileElement) => {
  if (file.isEmpty()) {
    toast.error('Error occurred!', {
      description: 'Load a photo to continue!'
    });
    return;
  }

  const image = file.getCurrentPhoto();
  if (image instanceof HTMLImageElement) {
    imageOperation(image, 'medianFilter',
      file,
      image.width,
      image.height,
      wh,
      ww
    );
  }
};
