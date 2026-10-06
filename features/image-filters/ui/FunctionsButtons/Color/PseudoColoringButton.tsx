import { useState } from "react";
import { defaultButtonNeeds, MyButtonWithPopover } from "@/features/image-filters/ui/FunctionsButtons/Color/Buttons";
import { Input } from "@/shared/ui/input";
import { PseudoColoringDialog } from "@/features/image-filters/ui/FunctionsButtons/Color/PseudoColoringDialog";

export const PseudoColoringButton = ({ file }: defaultButtonNeeds) => {
  const [value, setValue] = useState(1);

  return (
    <MyButtonWithPopover text='Pseudo Coloring'>
      <p>Number of intervals: {value}</p>
      <Input type='number' onChange={
        (e) => {
          const val = +e.target.value;
          if (val > 0 && val < 256) {
            setValue(val);
          }
        }} />
      <PseudoColoringDialog bordersCount={value} file={file} />
    </MyButtonWithPopover >
  );
}