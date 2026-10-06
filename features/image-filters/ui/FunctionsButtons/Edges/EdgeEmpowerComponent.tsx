import { FileElement } from '@/entities/image';
import { MyDefaultButton } from "@/features/image-filters/ui/FunctionsButtons/Color/Buttons";
import { makeEdgeEmpower } from "@/features/image-filters/model/photosEdges";

export const EdgeEmpowerComponent = ({ file }: { file: FileElement }) => {
  return (
    <div>
      <MyDefaultButton callback={() => { makeEdgeEmpower(file) }} text="Edge Empower" />
    </div>
  );
}