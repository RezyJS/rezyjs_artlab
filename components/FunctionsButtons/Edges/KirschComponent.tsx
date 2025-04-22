import FileElement from "@/lib/structures";
import { MyDefaultButton } from "../Color/Buttons";
import { makeKirsch } from "@/lib/photosEdges";

export const KirschComponent = ({ file }: { file: FileElement }) => {
  return (
    <div>
      <MyDefaultButton text="Kirsch" callback={() => { makeKirsch(file) }} />
    </div>
  );
}