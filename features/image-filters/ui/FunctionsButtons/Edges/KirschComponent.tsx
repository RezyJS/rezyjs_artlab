import { FileElement } from '@/entities/image';
import { MyDefaultButton } from "@/features/image-filters/ui/FunctionsButtons/Color/Buttons";
import { makeKirsch } from "@/features/image-filters/model/photosEdges";

export const KirschComponent = ({ file }: { file: FileElement }) => {
  return (
    <div>
      <MyDefaultButton text="Kirsch" callback={() => { makeKirsch(file) }} />
    </div>
  );
}