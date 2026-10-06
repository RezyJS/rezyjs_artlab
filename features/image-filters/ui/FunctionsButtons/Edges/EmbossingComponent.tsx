import { FileElement } from '@/entities/image';
import { MyButtonWithPopover, MyDefaultButton } from "@/features/image-filters/ui/FunctionsButtons/Color/Buttons";
import { makeEmbossing } from "@/features/image-filters/model/photosEdges";

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