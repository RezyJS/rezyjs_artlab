import { useState } from "react";
import { defaultButtonNeeds, MyButtonWithPopover, MyDefaultButton } from "./Buttons";
import { Slider } from "../ui/slider";
import { Binary } from "lucide-react";
import { makeBinary } from "@/lib/photos";

export const BinarizationButton = ({ stacks, setPicture }: defaultButtonNeeds) => {
  const [value, setValue] = useState(10);

  return (
    <MyButtonWithPopover text='Binarization'>
      <p>Value: {value}</p>
      <Slider defaultValue={[value]} max={256} step={1} onValueChange={(val) => { setValue(val[0]) }} className="bg-white rounded-md" />
      <div className="flex justify-evenly">
        <MyDefaultButton
          text='Binarization'
          callback={() => makeBinary(value, stacks.currentFile()!, setPicture)}
        >
          <Binary />
        </MyDefaultButton>
      </div>
    </MyButtonWithPopover>
  );
}