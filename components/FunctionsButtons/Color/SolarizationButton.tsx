import { makeSolarization } from "@/lib/photosColor";
import { Sun } from "lucide-react";
import { useState } from "react";
import { defaultButtonNeeds, MyButtonWithPopover, MyDefaultButton } from "./Buttons";
import { Input } from "@/components/ui/input";

export const SolarizationButton = ({ file }: defaultButtonNeeds) => {
  const [value, setValue] = useState(+(4 / 255).toFixed(8));

  return (
    <MyButtonWithPopover text='Solarization'>
      <p>Value: {value}</p>
      <Input type='number' onChange={(e) => {
        const val = +e.target.value;
        setValue(val);
      }} />
      <div className="flex justify-evenly">
        <MyDefaultButton
          text='Solarization'
          callback={() => makeSolarization(value, file)}
        >
          <Sun />
        </MyDefaultButton>
        <MyDefaultButton
          text='Clear'
          callback={() => setValue(+(4 / 255).toFixed(8))}
        >
          <Sun />
        </MyDefaultButton>
      </div>
    </MyButtonWithPopover>
  );
} 