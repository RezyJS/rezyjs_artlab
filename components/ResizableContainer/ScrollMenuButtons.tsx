/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import StackList from "@/lib/structures";
import FirstSeminar from "../PhotoChangersButtons/FirstSeminar";
import { Button } from "../ui/button";
import {
  ScrollArea,
  ScrollBar
} from "../ui/scroll-area";

const DefaultButton = ({ setFunctions, component, text }: { setFunctions: Function, component: React.ReactNode, text: string }) => {
  return (
    <Button
      onClick={() => { setFunctions(component); }}
      variant={'outline'}
    >
      {text}
    </Button>
  );
}

export const ButtonsList = ({ stacks, setPicture, setFunctions }: { stacks: StackList, setPicture: Function, setFunctions: Function }) => {
  return (
    <ScrollArea>
      <div className="flex gap-5">
        <DefaultButton
          setFunctions={setFunctions}
          component={<FirstSeminar stacks={stacks} setPicture={setPicture} />}
          text='Colors'
        />
        <DefaultButton
          setFunctions={setFunctions}
          component={null}
          text='Noises'
        />
        <ScrollBar orientation="horizontal" />
      </div>
    </ScrollArea>
  );
}