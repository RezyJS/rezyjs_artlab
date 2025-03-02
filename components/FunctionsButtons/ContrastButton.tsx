import { useState } from "react";
import { defaultButtonNeeds, MyButtonWithPopover, MyDefaultButton } from "./Buttons";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Input } from "../ui/input";
import { makeContrast } from "@/lib/photos";

export const ContrastButton = ({ stacks, setPicture }: defaultButtonNeeds) => {
  const [lowerValue, setLowerValue] = useState(0);
  const [upperValue, setUpperValue] = useState(256);

  return (
    <MyButtonWithPopover text='Contrast'>
      <p>Q1: {lowerValue}</p>
      <Input type='number' onChange={(e) => {
        const val = +e.target.value;
        if (val < upperValue && val >= 0) {
          setLowerValue(val);
        }
      }} />

      <p>Q2: {upperValue}</p>
      <Input type='number' onChange={(e) => {
        const val = +e.target.value;
        if (val > lowerValue && val <= 256) {
          setUpperValue(val);
        }
      }} />

      <div className="flex justify-evenly">
        <MyDefaultButton
          text='More'
          callback={() => makeContrast(lowerValue, upperValue, "more", stacks.currentFile()!, setPicture)}
        >
          <ArrowUp />
        </MyDefaultButton>
        <MyDefaultButton
          text='Less'
          callback={() => makeContrast(lowerValue, upperValue, "less", stacks.currentFile()!, setPicture)}
        >
          <ArrowDown />
        </MyDefaultButton>
      </div>
    </MyButtonWithPopover>
  );
}