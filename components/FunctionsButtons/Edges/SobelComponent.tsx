import FileElement from "@/lib/structures";
import { MyDefaultButton } from "../Color/Buttons";
import { makeSobel } from "@/lib/photosEdges";

export const SobelComponent = ({ file }: { file: FileElement }) => {
  return (
    <div>
      <MyDefaultButton callback={() => { makeSobel(file) }} text="Sobel" />
    </div>
  );
}