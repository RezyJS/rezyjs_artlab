/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import FileElement from "@/lib/structures";
import ColorButtons from "../PhotoChangersButtons/ColorButtons";
import { Button } from "../ui/button";
import {
  ScrollArea,
  ScrollBar
} from "../ui/scroll-area";
import NoiseButtons from "../PhotoChangersButtons/NoiseButtons";

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

export const ButtonsList = ({ file, setFunctions }: { file: FileElement, setFunctions: Function }) => {
  return (
    <ScrollArea>
      <div className="flex gap-5">
        <DefaultButton
          setFunctions={setFunctions}
          component={<ColorButtons file={file} />}
          text='Colors'
        />
        <DefaultButton
          setFunctions={setFunctions}
          component={<NoiseButtons file={file} />}
          text='Noises'
        />
        <ScrollBar orientation="horizontal" />
      </div>
    </ScrollArea>
  );
}