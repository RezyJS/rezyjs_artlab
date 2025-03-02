/* eslint-disable @typescript-eslint/no-unsafe-function-type */

import { Button } from "@/components/ui/button";
import {
  processFile,
  makeBrighter,
  makeNegative,
  makeBinary,
} from "@/lib/photos";
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/components/ui/popover'
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import {
  Sun,
  Moon,
  ArrowDownUp,
  Binary,
  ChartColumnBig,
} from 'lucide-react'
import StackList from "@/lib/structures";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle
} from "@/components/ui/dialog";
import Histogram from "@/components/HistogramComponent";

const MyDefaultButton = ({ text, callback, children }: { text: string, callback: Function, children?: React.ReactNode }) => (
  <Button
    variant={'outline'}
    className="flex justify-center items-center font-semibold"
    onClick={() => callback()}
  >
    <p>{text}</p>
    {children}
  </Button>
);

const MyButtonWithPopover = (
  { text, children }: { text: string, children: React.ReactNode }
) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className="font-semibold"
        >
          <p>{text}</p>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col text-white font-semibold gap-3">
        {children}
      </PopoverContent>
    </Popover>
  );
}

interface defaultButtonNeeds {
  stacks: StackList,
  setPicture: Function
}

export const BrightnessButton = ({ stacks, setPicture }: defaultButtonNeeds) => {
  const [value, setValue] = useState(10);

  return (
    <MyButtonWithPopover text='Brightness'>
      <p>Value: {value}</p>
      <Slider defaultValue={[value]} max={256} step={1} onValueChange={(val) => { setValue(val[0]) }} className="bg-white rounded-md" />
      <div className="flex justify-evenly">
        <MyDefaultButton
          text='Brighter'
          callback={() => makeBrighter(value, stacks.currentFile()!, setPicture)}
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

export const GrayScaleButton = ({ stacks, setPicture }: defaultButtonNeeds) => (
  <MyDefaultButton
    text="GrayScale"
    callback={() => processFile('grayScale', stacks.currentFile()!, setPicture)}
  />
)

export const NegativeButton = ({ stacks, setPicture }: defaultButtonNeeds) => {
  const [value, setValue] = useState(10);

  return (
    <MyButtonWithPopover text='Negative'>
      <p>Value: {value}</p>
      <Slider defaultValue={[value]} max={256} step={1} onValueChange={(val) => { setValue(val[0]) }} className="bg-white rounded-md" />
      <div className="flex justify-evenly">
        <MyDefaultButton
          text='Negative'
          callback={() => makeNegative(value, stacks.currentFile()!, setPicture)}
        >
          <ArrowDownUp />
        </MyDefaultButton>
      </div>
    </MyButtonWithPopover>
  );
}

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

export const HistogramButton = ({ stacks }: defaultButtonNeeds) => (
  <Dialog>
    <DialogTrigger asChild>
      <div className='flex justify-evenly'>
        <MyDefaultButton
          text='Histogram'
          callback={() => { }}
        >
          <ChartColumnBig />
        </MyDefaultButton>
      </div>
    </DialogTrigger>
    <DialogContent className="min-w-[90vw] max-w-[90vw] h-[90vh] flex flex-col justify-center items-center">
      <DialogTitle>Histogram</DialogTitle>
      <Histogram stacks={stacks} />
    </DialogContent>
  </Dialog>
)