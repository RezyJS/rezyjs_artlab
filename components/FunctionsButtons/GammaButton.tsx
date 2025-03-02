import { useState } from "react";
import { defaultButtonNeeds, MyButtonWithPopover, MyDefaultButton } from "./Buttons";
import { CircleCheck } from "lucide-react";
import { Input } from "../ui/input";
import { makeGamma } from "@/lib/photos";
import { toast } from "sonner";

export const GammaButton = ({ stacks, setPicture }: defaultButtonNeeds) => {
  const [value, setValue] = useState(0);

  return (
    <MyButtonWithPopover text='Gamma'>
      <p>Gamma: {value}</p>
      <Input type='number' onChange={(e) => {
        const val = +e.target.value;
        if (val > 0) {
          setValue(val);
        }
      }} />

      <div className="flex justify-evenly">
        <MyDefaultButton
          text='Make'
          callback={() => {
            if (value > 0)
              makeGamma(value, stacks.currentFile()!, setPicture);
            else
              toast.error('Value error', {
                description: 'Passed gamma was not a number or less than 0'
              });
          }}
        >
          <CircleCheck />
        </MyDefaultButton>
      </div>
    </MyButtonWithPopover >
  );
}