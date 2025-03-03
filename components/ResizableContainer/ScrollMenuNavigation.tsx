/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import {
  ScrollArea,
  ScrollBar
} from '@/components/ui/scroll-area';
import { useState } from 'react';
import { ButtonsList } from './ScrollMenuButtons';
import FileElement from '@/lib/structures';

export const Horizontal = ({ file }: { file: FileElement }) => {
  const [functions, setFunctions] = useState<React.ReactNode>();

  return (
    <ResizablePanelGroup direction="vertical">
      <ResizablePanel minSize={20} maxSize={20}>
        <div className="flex justify-center items-center h-full w-full">
          <ButtonsList file={file} setFunctions={setFunctions} />
        </div>
      </ResizablePanel>
      <div className="w-full h-[0.5px] bg-white"></div>
      <ResizablePanel defaultSize={75} minSize={20}>
        <ScrollArea className="h-full">
          {functions}
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export const Vertical = ({ file }: { file: FileElement }) => {
  const [functions, setFunctions] = useState<React.ReactNode>();

  return (
    <>
      <ResizablePanel minSize={20}>
        <div className="flex gap-5 justify-center items-center h-full w-full">
          <ButtonsList file={file} setFunctions={setFunctions} />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel minSize={20}>
        <ScrollArea className="h-full">
          {functions}
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </ResizablePanel>
    </>
  );
}