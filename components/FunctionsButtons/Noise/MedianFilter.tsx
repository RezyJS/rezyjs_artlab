import { Button } from "@/components/ui/button";
import { makeMedianFilter } from "@/lib/photosNoise";
import FileElement from "@/lib/structures";
import { MyButtonWithPopover } from "../Color/Buttons";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const MedianButton = ({ file }: { file: FileElement }) => {

  const [w, setW] = useState(3);
  const [h, setH] = useState(3);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-5">
        <div className="flex flex-col gap-3">
          <p>Width</p>
          <Input type="number" value={w} onChange={(e) => { if (+e.currentTarget.value > 0) setW(+e.currentTarget.value); }} />
        </div>
        <div className="flex flex-col gap-3">
          <p>Height</p>
          <Input type="number" value={h} onChange={(e) => { if (+e.currentTarget.value > 0) setH(+e.currentTarget.value); }} />
        </div>
      </div>
      <Button
        onClick={() => makeMedianFilter(h, w, file)}
      >
        Use filter
      </Button>
    </div>
  );
}

export const MedianFilter = ({ file }: { file: FileElement }) => {
  return (
    <div>
      <MyButtonWithPopover text={"Median filter"}>
        <MedianButton file={file} />
      </MyButtonWithPopover>
    </div>
  );
}