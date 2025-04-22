import FileElement from "@/lib/structures";
import { MyDefaultButton } from "../Color/Buttons";
import { makeCross } from "@/lib/photosEdges";

export const CrossComponent = ({ file }: { file: FileElement }) => {
  return (
    <div>
      <MyDefaultButton callback={() => { makeCross(file) }} text="Cross" />
    </div>
  );
}