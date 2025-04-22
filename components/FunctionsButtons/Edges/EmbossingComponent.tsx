import FileElement from "@/lib/structures";
import { MyButtonWithPopover, MyDefaultButton } from "../Color/Buttons";
import { makeEmbossing } from "@/lib/photosEdges";

export const EmbossingComponent = ({ file }: { file: FileElement }) => {
  return (
    <div>
      <MyButtonWithPopover text="Embossing">
        <MyDefaultButton text="In" callback={() => { makeEmbossing(file, 'in') }} />
        <MyDefaultButton text="Out" callback={() => { makeEmbossing(file, 'out') }} />
      </MyButtonWithPopover>
    </div>
  );
}