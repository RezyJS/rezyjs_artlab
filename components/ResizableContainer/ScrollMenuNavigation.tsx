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
import { ControlPhoto } from './ControlPhoto';

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
      <ResizablePanel defaultSize={55} minSize={20}>
        <ScrollArea className="h-full">
          {functions}
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </ResizablePanel>
      <div className="w-full h-[0.5px] bg-white"></div>
      <ResizablePanel minSize={20} maxSize={20}>
        <div className="flex justify-center items-center h-full w-full">
          <ControlPhoto file={file} />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export const Vertical = ({ file }: { file: FileElement }) => {
  const [functions, setFunctions] = useState<React.ReactNode>();

  return (
    <>
      <ResizablePanel minSize={10} maxSize={10}>
        <div className="flex gap-5 justify-center items-center h-full w-full">
          <ControlPhoto file={file} />
        </div>
      </ResizablePanel>
      <div className="w-full h-[0.5px] bg-white"></div>
      <ResizablePanel minSize={10} maxSize={10}>
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