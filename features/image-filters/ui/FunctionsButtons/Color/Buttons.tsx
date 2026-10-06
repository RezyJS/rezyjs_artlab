/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Button } from "@/shared/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/shared/ui/popover'
import { FileElement } from '@/entities/image';

export const MyDefaultButton = ({ text, callback, children }: { text?: string, callback: Function, children?: React.ReactNode }) => (
  <Button
    className="flex justify-center items-center font-semibold w-[130px]"
    onClick={() => callback()}
  >
    <p>{text}</p>
    {children}
  </Button>
);

export const MyButtonWithPopover = (
  { text, children }: { text?: string, children?: React.ReactNode }
) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="font-semibold w-[130px]"
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
  file: FileElement
}
