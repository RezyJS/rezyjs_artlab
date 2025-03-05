import { useState } from "react";
import { defaultButtonNeeds, MyButtonWithPopover, MyDefaultButton } from "./Buttons";
import { Slider } from "../../ui/slider";
import { ArrowDownUp } from "lucide-react";
import { makeNegative } from "@/lib/photosHandlers";

export const NegativeButton = ({ file }: defaultButtonNeeds) => {
  const [value, setValue] = useState(10);

  return (
    <MyButtonWithPopover text='Negative'>
      <p>Value: {value}</p>
      <Slider defaultValue={[value]} max={256} step={1} onValueChange={(val) => { setValue(val[0]) }} className="bg-white rounded-md" />
      <div className="flex justify-evenly">
        <MyDefaultButton
          text='Negative'
          callback={() => makeNegative(value, file)}
        >
          <ArrowDownUp />
        </MyDefaultButton>
      </div>
    </MyButtonWithPopover>
  );
}