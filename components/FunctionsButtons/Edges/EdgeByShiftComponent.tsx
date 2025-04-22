import FileElement from "@/lib/structures";
import { MyButtonWithPopover, MyDefaultButton } from "../Color/Buttons";
import { makeEdgeByShift } from "@/lib/photosEdges";

export const EdgeByShiftComponent = ({ file }: { file: FileElement }) => {
  return (
    <div>
      <MyButtonWithPopover text="Shift Edge">
        <MyDefaultButton text="Vertical" callback={() => { makeEdgeByShift(file, 'vertical') }} />
        <MyDefaultButton text="Horizontal" callback={() => { makeEdgeByShift(file, 'horizontal') }} />
        <MyDefaultButton text="Diagonal" callback={() => { makeEdgeByShift(file, 'diagonal') }} />
      </MyButtonWithPopover>
    </div>
  );
}