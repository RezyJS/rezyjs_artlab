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

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export default function Container({ stacks }: { stacks: StackList, setStacks: Function }) {

  const [picture, setPicture] = useState<string>('/placeholder.jpg');

  useEffect(() => {
    console.info('Files changed!')
    const currFile = stacks.currentFile();
    if (currFile === null || currFile.getCurrentPhoto() === null) setPicture('/placeholder.jpg');
    else setPicture(currFile.getCurrentPhoto()!.src)
  }, [stacks])      

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="rounded-lg border md:min-w-[450px]"
    >
      <ResizablePanel defaultSize={50} minSize={20} className="flex flex-col justify-center" >
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
                <div className="flex h-full items-start justify-start p-6 gap-5">
                  <FirstSeminar stacks={stacks} setPicture={setPicture} />
                </div>
                <ScrollBar orientation="vertical" />
              </ScrollArea>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}