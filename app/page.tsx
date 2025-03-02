'use client'

import Container from "@/components/ResizableContainer/ResizableContainer";
import FilesSlider from "@/components/FilesManager/FilesSlider";
import { SquarePlus, SquareX } from "lucide-react";
import { useState } from "react";
import StackList from "@/lib/structures";

export default function App() {

  const [stacks, setStacks] = useState<StackList>(new StackList([]));

  return (
    <div className="flex flex-1 flex-col h-full w-full gap-3">
      <div className="flex w-full justify-between">
        <FilesSlider
          stacks={stacks}
          setStacks={setStacks}
        />
        <SquarePlus className="w-12 h-12 my-auto ml-2 hover:text-green-500 cursor-pointer"
          onClick={() => {
            stacks.newFile();
            setStacks(new StackList(stacks.getFiles()));
          }
          } />
        <SquareX
          className="w-12 h-12 my-auto ml-2 hover:text-red-500 cursor-pointer"
          onClick={() => { setStacks(new StackList([])) }}
        />
      </div>
      <Container
        stacks={stacks}
        setStacks={setStacks}
      />
    </div>
  );
}