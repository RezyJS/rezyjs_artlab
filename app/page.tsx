'use client'

import Container from "@/components/ResizableContainer/ResizableContainer";
import FilesSlider from "@/components/FilesManager/FilesSlider";
import { SquarePlus, SquareX } from "lucide-react";
import { useEffect, useState } from "react";
import StackList from "@/lib/structures";
import { toast } from "sonner";

export default function App() {

  const [stacks, setStacks] = useState<StackList>(() => {
    const stack = new StackList([]);
    stack.newFile();
    return new StackList(stack.getFiles());
  });

  useEffect(() => {
    if (!stacks.getFiles()) {
      const stack = new StackList([]);
      stack.newFile();
      setStacks(new StackList(stack.getFiles()))
    }
  }, [stacks])

  return (
    <div className="flex flex-1 flex-col h-full w-full gap-3">
      <div className="flex w-full justify-between">
        <FilesSlider
          stacks={stacks}
          setStacks={setStacks}
        />
        {/* TODO: Fix this shitty stackList system */}
        <SquarePlus className="w-12 h-12 my-auto ml-2 hover:text-green-500 cursor-pointer"
          onClick={() => {
            // stacks.newFile();
            // setStacks(new StackList(stacks.getFiles()));
            toast.info('WIP', {
              description: `Currently this shit is broken and I'm trying hard to fix it`
            })
          }
          } />
        <SquareX
          className="w-12 h-12 my-auto ml-2 hover:text-red-500 cursor-pointer"
          onClick={() => {
            const stack = new StackList([]);
            stack.newFile();
            setStacks(new StackList(stack.getFiles()))
          }}
        />
      </div>
      <Container
        stacks={stacks}
        setStacks={setStacks}
      />
    </div>
  );
}