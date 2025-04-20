import { Button } from "@/components/ui/button";
import { makeHighFreq } from "@/lib/photosNoise";
import FileElement from "@/lib/structures";
import { MyButtonWithPopover } from "../Color/Buttons";

const FreqButton = ({ text, file }: { text: "H1" | "H2" | "H3", file: FileElement }) => (
  <Button
    onClick={() => makeHighFreq(text, file)}
  >
    {text}
  </Button>
)

export const HighFrequencyFilterComponent = ({ file }: { file: FileElement }) => {
  return (
    <div>
      <MyButtonWithPopover text={"High Frequency filter"}>
        <FreqButton text={"H1"} file={file} />
        <FreqButton text={"H2"} file={file} />
        <FreqButton text={"H3"} file={file} />
      </MyButtonWithPopover>
    </div>
  );
}