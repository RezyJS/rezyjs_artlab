import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";
import ImageLoader from "./ImageLoader";
import StackList from "@/lib/structures";

export default function Container({ stacks }: { stacks: StackList }) {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="rounded-lg border md:min-w-[450px]"
    >
      <ResizablePanel defaultSize={50} minSize={20} className="flex flex-col justify-center" >
        <ImageLoader files={stacks} />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50} minSize={20}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel minSize={20} maxSize={20}>
            <div className="flex h-full items-center justify-start p-6">
              <span className="font-semibold">Groups of functions</span>
            </div>
          </ResizablePanel>
          <div className="w-full h-[0.5px] bg-white"></div>
          <ResizablePanel defaultSize={75} minSize={20}>
            <div className="flex h-full items-center justify-start p-6">
              <span className="font-semibold">Functions</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}