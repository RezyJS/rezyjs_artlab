import {
  HorizontalView,
  VerticalView
} from '@/components/ResizableContainer/ResizableLayouts'
import FileElement from '@/lib/structures';

export default function Container({ file, picture }: { file: FileElement, picture: string }) {
  return (
    <div className="border rounded-lg w-full min-w-[99vw] max-w-[99vw] max-h-[99vh] min-h-[99vh]">
      <HorizontalView file={file} picture={picture} className="hidden md:flex" />
      <VerticalView file={file} picture={picture} className="flex md:hidden" />
    </div>
  )
}