import { FileElement } from '@/entities/image';
import { MyDefaultButton } from "@/features/image-filters/ui/FunctionsButtons/Color/Buttons";
import { makeSobel } from "@/features/image-filters/model/photosEdges";

export const SobelComponent = ({ file }: { file: FileElement }) => {
  return (
    <div>
      <MyDefaultButton callback={() => { makeSobel(file) }} text="Sobel" />
    </div>
  );
}