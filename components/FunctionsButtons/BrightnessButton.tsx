import { Moon, Sun } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { defaultButtonNeeds, MyButtonWithPopover, MyDefaultButton } from "@/components/FunctionsButtons/Buttons";
import { makeBrighter } from "@/lib/photos";
import { useState } from "react";

export const BrightnessButton = ({ stacks, setPicture }: defaultButtonNeeds) => {
  const [value, setValue] = useState(10);

  return (
    <MyButtonWithPopover text='Brightness'>
      <p>Value: {value}</p>
      <Slider defaultValue={[value]} max={256} step={1} onValueChange={(val) => { setValue(val[0]) }} className="bg-white rounded-md" />
      <div className="flex justify-evenly">
        <MyDefaultButton
          text='Brighter'
          callback={() => {
            stacks.setCurrentFile(stacks.currentFileId);
            makeBrighter(value, stacks.currentFile()!, setPicture)
          }}
        >
          <Sun />
        </MyDefaultButton>
        <MyDefaultButton
          text='Darker'
          callback={() => makeBrighter(-value, stacks.currentFile()!, setPicture)}
        >
          <Moon />
        </MyDefaultButton>
      </div>
    </MyButtonWithPopover>
  );
}