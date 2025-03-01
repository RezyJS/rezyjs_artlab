/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";
import ImageLoader from "./ImageLoader";
import StackList from "@/lib/structures";
import { useEffect, useState } from "react";
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import FirstSeminar from "./PhotoChangersButtons/FirstSeminar";

const HorizontalView = (
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

const VerticalView = (
  { stacks, picture, setPicture, className }: { stacks: StackList, picture: string, setPicture: Function, className?:string }
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

export default function Container({ stacks }: { stacks: StackList, setStacks: Function }) {

  const [picture, setPicture] = useState<string>('/placeholder.jpg');

  useEffect(() => {
    console.info('Files changed!')
    const currFile = stacks.currentFile();
    if (currFile === null || currFile.getCurrentPhoto() === null) setPicture('/placeholder.jpg');
    else setPicture(currFile.getCurrentPhoto()!.src)
  }, [stacks])      

  return (
    <div className="border rounded-lg w-full max-h-[90vh] min-h-[90vh]">
      <HorizontalView stacks={stacks} picture={picture} setPicture={setPicture} className="hidden md:flex" />
      <VerticalView stacks={stacks} picture={picture} setPicture={setPicture} className="sm:flex md:hidden" />
    </div>
  )
}