import { Button } from "@/components/ui/button";
import { makeLowFreq } from "@/lib/photosNoise";
import FileElement from "@/lib/structures";
import { MyButtonWithPopover } from "../Color/Buttons";

export const LowFrequencyFilterComponent = ({ file }: { file: FileElement }) => {
  return (
    <div>
      <MyButtonWithPopover text={"Low Frequency filter"}>
        <Button
          onClick={() => makeLowFreq('H1', file)}
        >
          H1
        </Button>
        <Button
          onClick={() => makeLowFreq('H2', file)}
        >
          H2
        </Button>
        <Button
          onClick={() => makeLowFreq('H3', file)}
        >
          H3
        </Button>
      </MyButtonWithPopover>
    </div>
  );
}