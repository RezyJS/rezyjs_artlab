import FileElement from "@/lib/structures";
import { MyDefaultButton } from "../Color/Buttons";
import { makePravit } from "@/lib/photosEdges";

export const PravitComponent = ({ file }: { file: FileElement }) => {
  return (
    <div>
      <MyDefaultButton callback={() => { makePravit(file) }} text="Pravit" />
    </div>
  );
}