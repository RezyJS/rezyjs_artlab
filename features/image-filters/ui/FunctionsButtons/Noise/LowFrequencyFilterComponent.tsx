import { Button } from "@/shared/ui/button";
import { makeLowFreq } from "@/features/image-filters/model/photosNoise";
import { FileElement } from '@/entities/image';
import { MyButtonWithPopover } from "@/features/image-filters/ui/FunctionsButtons/Color/Buttons";

const FreqButton = ({ text, file }: { text: "H1" | "H2" | "H3", file: FileElement }) => (
  <Button
    onClick={() => makeLowFreq(text, file)}
  >
    {text}
  </Button>
)

export const LowFrequencyFilterComponent = ({ file }: { file: FileElement }) => {
  return (
    <div>
      <MyButtonWithPopover text={"Low Frequency filter"}>
        <FreqButton text={"H1"} file={file} />
        <FreqButton text={"H2"} file={file} />
        <FreqButton text={"H3"} file={file} />
      </MyButtonWithPopover>
    </div>
  );
}