'use client'

import Container from "@/components/ResizableContainer/ResizableContainer";
import { useCallback, useState } from "react";
import FileElement from "@/lib/structures";
import { useHotkeys } from 'react-hotkeys-hook'

export default function App() {

  const [picture, setPicture] = useState<string>('/placeholder.jpg');
  const [file,] = useState<FileElement>(new FileElement(setPicture));

  const handleUndo = useCallback(() => {
    if (!(file.isEmpty() || file.isFirst())) {
      file.revert();
    }
  }, [file]);

  const handleRedo = useCallback(() => {
    if (!(file.isEmpty() || file.isLast())) {
      file.undoRevert();
    }
  }, [file])

  const handleReset = useCallback(() => {
    if (!(file.isEmpty() || file.isFirst())) {
      file.reset();
    }
  }, [file])

  const handleDelete = useCallback(() => {
    if (!file.isEmpty()) {
      file.newStack();
    }
  }, [file])

  useHotkeys('ctrl+z', handleUndo, [handleUndo]);
  useHotkeys('ctrl+y', handleRedo, [handleRedo]);
  useHotkeys('ctrl+x', handleReset, [handleReset]);
  useHotkeys('ctrl+m', handleDelete, [handleDelete]);

  if (file === undefined) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  return (
    <Container
      file={file}
      picture={picture}
    />
  );
}