/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import StackList from "@/lib/structures";
import { useEffect, useState } from "react";
import {
  HorizontalView,
  VerticalView
} from '@/components/ResizableLayouts'

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
      <VerticalView stacks={stacks} picture={picture} setPicture={setPicture} className="flex md:hidden" />
    </div>
  )
}