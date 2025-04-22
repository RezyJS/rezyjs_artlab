import FileElement from "@/lib/structures";
import { MyDefaultButton } from "../Color/Buttons";
import { makeEdgeEmpower } from "@/lib/photosEdges";

export const EdgeEmpowerComponent = ({ file }: { file: FileElement }) => {
  return (
    <div>
      <MyDefaultButton callback={() => { makeEdgeEmpower(file) }} text="Edge Empower" />
    </div>
  );
}