import { Moon, Sun } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { defaultButtonNeeds, MyButtonWithPopover, MyDefaultButton } from "@/components/FunctionsButtons/Color/Buttons";
import { makeBrighter } from "@/lib/photosHandlers";
import { useState } from "react";

export const BrightnessButton = ({ file }: defaultButtonNeeds) => {
  const [value, setValue] = useState(10);

  return (
    <MyButtonWithPopover text='Brightness'>
      <p>Value: {value}</p>
      <Slider defaultValue={[value]} max={256} step={1} onValueChange={(val) => { setValue(val[0]) }} className="bg-white rounded-md" />
      <div className="flex justify-evenly">
        <MyDefaultButton
          text='Brighter'
          callback={() => {
            makeBrighter(value, file);
          }}
        >
          <Sun />
        </MyDefaultButton>
        <MyDefaultButton
          text='Darker'
          callback={() => {
            makeBrighter(-value, file)
          }
          }
        >
          <Moon />
        </MyDefaultButton>
      </div>
    </MyButtonWithPopover>
  );
}