/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from '@/components/ui/resizable';
import ImageLoader from '@/components/FilesManager/ImageLoader';
import StackList from '@/lib/structures';
import {
  Horizontal,
  Vertical
} from './ScrollMenuNavigation'

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
        <Horizontal stacks={stacks} setPicture={setPicture} />
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
      <Vertical stacks={stacks} setPicture={setPicture} />
    </ResizablePanelGroup>
  </div>
)