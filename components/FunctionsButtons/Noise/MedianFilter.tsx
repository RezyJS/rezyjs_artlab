import { Button } from "@/components/ui/button";
import { makeMedianFilter } from "@/lib/photosNoise";
import FileElement from "@/lib/structures";
import { MyButtonWithPopover } from "../Color/Buttons";

const MedianButton = ({ text, num, file }: { text: number, num: number, file: FileElement }) => (
  <Button
    onClick={() => makeMedianFilter(num, file)}
  >
    {text}x{text}
  </Button>
)

export const MedianFilter = ({ file }: { file: FileElement }) => {
  return (
    <div>
      <MyButtonWithPopover text={"Median filter"}>
        <MedianButton text={3} num={1} file={file} />
        <MedianButton text={5} num={2} file={file} />
        <MedianButton text={7} num={3} file={file} />
        <MedianButton text={9} num={4} file={file} />
      </MyButtonWithPopover>
    </div>
  );
}