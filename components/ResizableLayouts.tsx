/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from '@/components/ui/resizable';
import ImageLoader from '@/components/ImageLoader';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import FirstSeminar from "./PhotoChangersButtons/FirstSeminar";
import StackList from '@/lib/structures';

export const HorizontalView = (
  { stacks, picture, setPicture, className }: { stacks: StackList, picture: string, setPicture: Function, className?: string }
) => (
  <div className={`h-full w-full flex ${className}`}>
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={50} minSize={20} className='flex flex-col justify-center' >
        <ImageLoader files={stacks} picture={picture} setPicture={setPicture} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50} minSize={20}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel minSize={20} maxSize={20}>
            <div className="flex h-full items-center justify-start p-6">
              <span className="font-semibold">Groups of functions</span>
            </div>
          </ResizablePanel>
          <div className="w-full h-[0.5px] bg-white"></div>
          <ResizablePanel defaultSize={75} minSize={20}>
            <ScrollArea className="h-full">
              <FirstSeminar stacks={stacks} setPicture={setPicture} />
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
)

export const VerticalView = (
  { stacks, picture, setPicture, className }: { stacks: StackList, picture: string, setPicture: Function, className?: string }
) => (
  <div className={`w-full h-full flex ${className}`}>

    <ResizablePanelGroup direction="vertical">
      <ResizablePanel minSize={20}>
        <ImageLoader files={stacks} picture={picture} setPicture={setPicture} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel minSize={20}>
        <div className="flex h-full items-center justify-start p-6">
          <span className="font-semibold">Groups of functions</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel minSize={20}>
        <ScrollArea className="h-full">
          <FirstSeminar stacks={stacks} setPicture={setPicture} />
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
)