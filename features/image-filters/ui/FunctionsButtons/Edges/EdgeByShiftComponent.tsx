import { FileElement } from '@/entities/image';
import { MyButtonWithPopover, MyDefaultButton } from "@/features/image-filters/ui/FunctionsButtons/Color/Buttons";
import { makeEdgeByShift } from "@/features/image-filters/model/photosEdges";

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