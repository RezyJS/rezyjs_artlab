import { Button } from "@/shared/ui/button";
import { makeMedianFilter } from "@/features/image-filters/model/photosNoise";
import { FileElement } from '@/entities/image';
import { MyButtonWithPopover } from "@/features/image-filters/ui/FunctionsButtons/Color/Buttons";
import { Input } from "@/shared/ui/input";
import { useState } from "react";

const MedianButton = ({ file }: { file: FileElement }) => {

  const [w, setW] = useState(3);
  const [h, setH] = useState(3);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-5">
        <div className="flex flex-col gap-3">
          <p>Width</p>
          <Input aria-label="Window width" type="number" min={1} max={50} step={1} value={w} onChange={(e) => setW(+e.currentTarget.value)} />
        </div>
        <div className="flex flex-col gap-3">
          <p>Height</p>
          <Input aria-label="Window height" type="number" min={1} max={50} step={1} value={h} onChange={(e) => setH(+e.currentTarget.value)} />
        </div>
      </div>
      <Button
        disabled={[w, h].some(value => !Number.isInteger(value) || value < 1 || value > 50)}
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
