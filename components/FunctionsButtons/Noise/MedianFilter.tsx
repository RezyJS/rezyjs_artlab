import { Button } from "@/components/ui/button";
import { makeMedianFilter } from "@/lib/photosNoise";
import FileElement from "@/lib/structures";
import { MyButtonWithPopover } from "../Color/Buttons";

const MedianButton = ({ num, file }: { num: number, file: FileElement }) => (
  <Button
    onClick={() => makeMedianFilter(num, file)}
  >
    {num}x{num}
  </Button>
)

export const MedianFilter = ({ file }: { file: FileElement }) => {
  return (
    <div>
      <MyButtonWithPopover text={"Median filter"}>
        <MedianButton num={1} file={file} />
        <MedianButton num={2} file={file} />
        <MedianButton num={3} file={file} />
        <MedianButton num={4} file={file} />
      </MyButtonWithPopover>
    </div>
  );
}