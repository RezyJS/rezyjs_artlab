import { Button } from "@/components/ui/button";
import { makeMedianFilter } from "@/lib/photosNoise";
import FileElement from "@/lib/structures";
import { MyButtonWithPopover } from "../Color/Buttons";

export const MedianFilter = ({ file }: { file: FileElement }) => {
  return (
    <div>
      <MyButtonWithPopover text={"Median filter"}>
        <Button
          onClick={() => makeMedianFilter(3, file)}
        >
          3x3
        </Button>
        <Button
          onClick={() => makeMedianFilter(5, file)}
        >
          5x5
        </Button>
        <Button
          onClick={() => makeMedianFilter(7, file)}
        >
          7x7
        </Button>
        <Button
          onClick={() => makeMedianFilter(9, file)}
        >
          9x9
        </Button>
      </MyButtonWithPopover>
    </div>
  );
}