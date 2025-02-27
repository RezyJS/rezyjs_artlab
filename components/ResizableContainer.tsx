import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";

import Image from "next/image"; 

// TODO: Get image as args
export default function Container() {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="rounded-lg border md:min-w-[450px]"
    >
      <ResizablePanel defaultSize={50} minSize={10}>
        <div className="flex h-full items-center justify-center p-6 max-h-[650px]">
          <Image src={'/placeholder.jpg'} alt="image" width={0} height={0} sizes="100vh" className="cursor-pointer max-w-fit max-h-fit h-full w-full object-contain"/>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50} minSize={10}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={25} minSize={10}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Two</span>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={75} minSize={10}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Three</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}