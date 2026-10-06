'use client';

import { FileElement } from '@/entities/image';
import { useSyncExternalStore } from 'react';
import { InteractionLockProvider } from '@/shared/ui/interaction-lock';
import { DesktopEditor } from './DesktopEditor';

export default function Container({ file }: { file: FileElement }) {
  useSyncExternalStore(file.subscribe, file.getSnapshot, file.getServerSnapshot);
  const processing = file.isProcessing;
  return (
    <InteractionLockProvider value={processing}>
      <DesktopEditor file={file} />
    </InteractionLockProvider>
  )
}
