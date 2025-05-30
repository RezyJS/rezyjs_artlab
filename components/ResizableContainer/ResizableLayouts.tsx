import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from '@/components/ui/resizable';
import dynamic from 'next/dynamic';

const ImageLoader = dynamic(() => import('@/components/FilesManager/ImageLoader'), { ssr: false });
import {
  Horizontal,
  Vertical
} from './ScrollMenuNavigation'
import FileElement from '@/lib/structures';

export const HorizontalView = (
  { file, className }: { file: FileElement, picture: string, className?: string }
) => (
  <div className={`h-full w-full flex ${className}`}>
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={50} minSize={20} className='flex flex-col justify-center' >
        <ImageLoader file={file} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={25} minSize={25}>
        <Horizontal file={file} />
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
)

export const VerticalView = (
  { file, className }: { file: FileElement, picture: string, className?: string }
) => (
  <div className={`w-full h-full flex ${className}`}>
    <ResizablePanelGroup direction="vertical">
      <ResizablePanel minSize={20}>
        <ImageLoader file={file} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <Vertical file={file} />
    </ResizablePanelGroup>
  </div>
)