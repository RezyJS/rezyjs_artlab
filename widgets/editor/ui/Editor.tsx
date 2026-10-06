'use client'

import Container from "./ResizableContainer";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { disposeProcessor } from '@/shared/lib/image-processing';
import { FileElement } from '@/entities/image';
import { useHotkeys } from 'react-hotkeys-hook'
import { useImagePaste } from '@/features/image-upload';

export default function Editor() {

  const [file] = useState(() => new FileElement());
  useImagePaste(file);
  useSyncExternalStore(file.subscribe, file.getSnapshot, file.getServerSnapshot);
  useEffect(() => () => { file.newStack(); disposeProcessor(); }, [file]);

  const handleUndo = useCallback(() => {
    if (!(file.isProcessing || file.isEmpty() || file.isFirst())) {
      file.revert();
    }
  }, [file]);

  const handleRedo = useCallback(() => {
    if (!(file.isProcessing || file.isEmpty() || file.isLast())) {
      file.undoRevert();
    }
  }, [file])

  const handleReset = useCallback(() => {
    if (!(file.isProcessing || file.isEmpty() || file.isFirst())) {
      file.reset();
    }
  }, [file])

  useHotkeys('ctrl+z', handleUndo, { preventDefault: true }, [handleUndo]);
  useHotkeys('ctrl+y', handleRedo, { preventDefault: true }, [handleRedo]);
  useHotkeys('ctrl+x', handleReset, { preventDefault: true }, [handleReset]);

  return (
    <Container
      file={file}
    />
  );
}
