/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import FileElement from "@/lib/structures";
import ColorButtons from "../PhotoChangersButtons/ColorButtons";
import { Button } from "../ui/button";
import NoiseButtons from "../PhotoChangersButtons/NoiseButtons";
import { useHotkeys } from "react-hotkeys-hook";
import { useCallback } from "react";
import EdgesButtons from "../PhotoChangersButtons/EdgesButtons";

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

export const ButtonsList = ({ file, setFunctions, className }: { file: FileElement, setFunctions: Function, className?: string }) => {

  const handleButton = useCallback((component: React.ReactNode) => {
    setFunctions(component)
  }, [setFunctions])

  useHotkeys('ctrl+1', () => handleButton(<ColorButtons file={file} />), [handleButton]);
  useHotkeys('ctrl+2', () => handleButton(<NoiseButtons file={file} />), [handleButton]);
  useHotkeys('ctrl+3', () => handleButton(<EdgesButtons file={file} />), [handleButton]);

  return (
    <div className="flex gap-5">
      <div className="flex flex-col justify-center items-center gap-2">
        <p className={className}>Ctrl+1</p>
        <DefaultButton
          setFunctions={setFunctions}
          component={<ColorButtons file={file} />}
          text='Colors'
        />
      </div>
      <div className="flex flex-col justify-center items-center gap-2">
        <p className={className}>Ctrl+2</p>
        <DefaultButton
          setFunctions={setFunctions}
          component={<NoiseButtons file={file} />}
          text='Noises'
        />
      </div>
      <div className="flex flex-col justify-center items-center gap-2">
        <p className={className}>Ctrl+3</p>
        <DefaultButton
          setFunctions={setFunctions}
          component={<EdgesButtons file={file} />}
          text='Edges'
        />
      </div>
    </div>
  );
}