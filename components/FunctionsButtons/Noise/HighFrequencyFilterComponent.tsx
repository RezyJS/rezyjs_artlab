import { Button } from "@/components/ui/button";
import { makeHighFreq } from "@/lib/photosNoise";
import FileElement from "@/lib/structures";
import { MyButtonWithPopover } from "../Color/Buttons";

export const HighFrequencyFilterComponent = ({ file }: { file: FileElement }) => {
  return (
    <div>
      <MyButtonWithPopover text={"High Frequency filter"}>
        <Button
          onClick={() => makeHighFreq('H1', file)}
        >
          H1
        </Button>
        <Button
          onClick={() => makeHighFreq('H2', file)}
        >
          H2
        </Button>
        <Button
          onClick={() => makeHighFreq('H3', file)}
        >
          H3
        </Button>
      </MyButtonWithPopover>
    </div>
  );
}