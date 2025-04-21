/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import FileElement from "@/lib/structures";
import ColorButtons from "../PhotoChangersButtons/ColorButtons";
import { Button } from "../ui/button";
import {
  ScrollArea,
  ScrollBar
} from "../ui/scroll-area";
import NoiseButtons from "../PhotoChangersButtons/NoiseButtons";
import { useHotkeys } from "react-hotkeys-hook";
import { useCallback } from "react";

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

  const handleButton = useCallback((component: React.ReactNode) => {
    setFunctions(component)
  }, [setFunctions])

  useHotkeys('ctrl+1', () => handleButton(<ColorButtons file={file} />), [handleButton]);
  useHotkeys('ctrl+2', () => handleButton(<NoiseButtons file={file} />), [handleButton]);

  return (
    <ScrollArea>
      <div className="flex gap-5">
        <div className="flex flex-col justify-center items-center gap-2">
          Ctrl+1
          <DefaultButton
            setFunctions={setFunctions}
            component={<ColorButtons file={file} />}
            text='Colors'
          />
        </div>
        <div className="flex flex-col justify-center items-center gap-2">
          Ctrl+2
          <DefaultButton
            setFunctions={setFunctions}
            component={<NoiseButtons file={file} />}
            text='Noises'
          />
        </div>
        <ScrollBar orientation="horizontal" />
      </div>
    </ScrollArea>
  );
}