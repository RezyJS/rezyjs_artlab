/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/components/ui/popover'
import StackList from "@/lib/structures";

export const MyDefaultButton = ({ text, callback, children }: { text: string, callback: Function, children?: React.ReactNode }) => (
  <Button
    variant={'outline'}
    className="flex justify-center items-center font-semibold"
    onClick={() => callback()}
  >
    <p>{text}</p>
    {children}
  </Button>
);

export const MyButtonWithPopover = (
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

export interface defaultButtonNeeds {
  stacks: StackList,
  setPicture: Function
}
