import { FileElement } from '@/entities/image';
import { MyDefaultButton } from "@/features/image-filters/ui/FunctionsButtons/Color/Buttons";
import { makeCross } from "@/features/image-filters/model/photosEdges";

export const CrossComponent = ({ file }: { file: FileElement }) => {
  return (
    <div>
      <MyDefaultButton callback={() => { makeCross(file) }} text="Cross" />
    </div>
  );
}