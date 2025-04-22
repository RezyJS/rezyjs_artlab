/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/components/ui/popover'
import FileElement from "@/lib/structures";

export const MyDefaultButton = ({ text, callback, children }: { text?: string, callback: Function, children?: React.ReactNode }) => (
  <Button
    className="flex justify-center items-center font-semibold min-w-max"
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
          className="font-semibold min-w-max"
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
