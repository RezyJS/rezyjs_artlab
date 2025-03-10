import { useState } from "react";
import { defaultButtonNeeds, MyButtonWithPopover, MyDefaultButton } from "./Buttons";
import { CircleCheck } from "lucide-react";
import { Input } from "../../ui/input";
import { makeKvantation } from "@/lib/photosColor";

export const KvantationButton = ({ file }: defaultButtonNeeds) => {
  const [value, setValue] = useState(1);

  return (
    <MyButtonWithPopover text='Kvantation'>
      <p>Number of kvants: {value}</p>
      <Input type='number' onChange={(e) => {
        const val = +e.target.value;
        if (val > 0 && val < 256) {
          setValue(val);
        }
      }} />

      <div className="flex justify-evenly">
        <MyDefaultButton
          text='Make'
          callback={() => {
            makeKvantation(value, file);
          }}
        >
          <CircleCheck />
        </MyDefaultButton>
      </div>
    </MyButtonWithPopover >
  );
}