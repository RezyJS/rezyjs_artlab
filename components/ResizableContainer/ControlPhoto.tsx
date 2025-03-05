import FileElement from "@/lib/structures";
import { Button } from "../ui/button";
import { ArrowLeftCircle, ArrowRightCircle, RotateCcw, Trash2 } from "lucide-react";

export const ControlPhoto = ({ file }: { file: FileElement }) => {
  return (
    <div className="flex justify-evenly items-center gap-3">
      <Button
        disabled={file.isEmpty() || file.isFirst()}
        onClick={() => {
          file.revert()
        }}
        className="flex flex-row w-full justify-between gap-5"
      >
        <ArrowLeftCircle />
      </Button>
      <Button disabled={file.isEmpty() || file.isLast()}
        onClick={() => {
          file.undoRevert()
        }}
        className="flex flex-row w-full justify-between gap-5"
      >
        <ArrowRightCircle />
      </Button>
      <Button disabled={file.isEmpty() || file.isFirst()}
        onClick={() => {
          file.reset()
        }}
        className="flex flex-row w-full justify-between gap-5"
      >
        <RotateCcw />
      </Button>
      <Button disabled={file.isEmpty()}
        onClick={() => {
          file.newStack();
        }}
        className="flex flex-row w-full justify-between gap-5"
      >
        <Trash2 />
      </Button>
    </div>
  );
}