import FileElement from "@/lib/structures";
import { Button } from "../ui/button";
import { ArrowLeftCircle, ArrowRightCircle, RotateCcw, Trash2 } from "lucide-react";

export const ControlPhoto = ({ file }: { file: FileElement }) => {
  return (
    <div className="flex justify-evenly items-center gap-3">
      <div className="flex flex-col text-center w-full">
        Undo
        <Button
          disabled={file.isEmpty() || file.isFirst()}
          onClick={() => {
            file.revert()
          }}
          className="flex flex-col h-full w-full justify-center items-center"
        >
          <ArrowLeftCircle />
          {}Ctrl+Z
        </Button>
      </div>
      <div className="flex flex-col text-center w-full">
        Redo
        <Button disabled={file.isEmpty() || file.isLast()}
          onClick={() => {
            file.undoRevert()
          }}
          className="flex flex-col h-full w-full justify-center items-center"
        >
          <ArrowRightCircle />
          Ctrl+Y
        </Button>
      </div>
      <div className="flex flex-col text-center w-full">
        Reset
        <Button disabled={file.isEmpty() || file.isFirst()}
          onClick={() => {
            file.reset()
          }}
          className="flex flex-col h-full w-full justify-center items-center"
        >
          <RotateCcw />
          Ctrl+X
        </Button>
      </div>
      <div className="flex flex-col text-center w-full">
        Delete
        <Button disabled={file.isEmpty()}
          onClick={() => {
            file.newStack();
          }}
          className="flex flex-col h-full w-full justify-center items-center"
        >
          <Trash2 />
          Ctrl+M
        </Button>
      </div>
    </div>
  );
}