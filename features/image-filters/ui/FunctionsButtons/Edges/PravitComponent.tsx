import { FileElement } from '@/entities/image';
import { MyDefaultButton } from "@/features/image-filters/ui/FunctionsButtons/Color/Buttons";
import { makePravit } from "@/features/image-filters/model/photosEdges";

export const PravitComponent = ({ file }: { file: FileElement }) => {
  return (
    <div>
      <MyDefaultButton callback={() => { makePravit(file) }} text="Pravit" />
    </div>
  );
}