import {
  ResizablePanel,
  ResizableHandle,
} from '@/shared/ui/resizable';
import {
  ScrollArea,
  ScrollBar
} from '@/shared/ui/scroll-area';
import { useState } from 'react';
import { ButtonsList } from './ScrollMenuButtons';
import { FileElement } from '@/entities/image';
import { ControlPhoto } from '@/features/image-history';
import { ExportButton } from '@/features/image-export';

export const Horizontal = ({ file }: { file: FileElement }) => {
  const [functions, setFunctions] = useState<React.ReactNode>();

  return (
    <div className='w-full h-full flex flex-col justify-between'>
      <div className='relative flex justify-center items-center p-5 after:bg-white after:absolute after:bottom-0 after:w-full after:h-[1px]'>
        <ButtonsList file={file} setFunctions={setFunctions} />
      </div>
      <ScrollArea className="h-full w-full">
        {functions}
        <ScrollBar orientation="vertical" />
      </ScrollArea>
      <div className='relative flex justify-center items-center p-5 before:bg-white before:absolute before:top-0 before:w-full before:h-[1px]'>
        <ControlPhoto file={file} />
        <ExportButton file={file} />
      </div>
    </div>
  );
}

export const Vertical = ({ file }: { file: FileElement }) => {
  const [functions, setFunctions] = useState<React.ReactNode>();

  return (
    <>
      <ResizablePanel minSize="10%" maxSize="10%">
        <div className="flex gap-5 justify-center items-center h-full w-full">
          <ControlPhoto file={file} />
          <ExportButton file={file} />
        </div>
      </ResizablePanel>
      <div className="w-full h-[0.5px] bg-white"></div>
      <ResizablePanel minSize="10%" maxSize="10%">
        <div className="flex gap-5 justify-center items-center h-full w-full">
          <ButtonsList file={file} setFunctions={setFunctions} className='hidden' />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel minSize="20%">
        <ScrollArea className="h-full">
          {functions}
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </ResizablePanel>
    </>
  );
}
