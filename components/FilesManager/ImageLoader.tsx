/* eslint-disable @next/next/no-img-element */

'use client'

import StackList from "@/lib/structures";
import { loadNewPhoto } from "@/lib/photos";
import { toast } from "sonner";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem
} from '@/components/ui/context-menu';
import {
  RotateCcw,
  RotateCw,
  ArrowRightCircle,
  ArrowLeftCircle,
  Trash2,
  LucideX
} from 'lucide-react'

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export default function ImageLoader({ files, picture, setPicture }: { files: StackList, picture: string, setPicture: Function }) {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="h-full">
        <label className="h-full flex flex-col justify-center items-center gap-5 cursor-pointer w-full p-6 object-contain">
          <img src={picture} alt="image" width={0} height={0} sizes="100vh" className="max-w-fit max-h-fit h-full w-full object-contain" />
          <input
            type="file"
            name="input"
            id="input"
            className='hidden'
            onClick={
              (e) => {
                e.currentTarget.value = "";
              }
            }
            onInput={
              (e) => {
                if (!e.currentTarget.files) {
                  toast.error("No data", {
                    description: 'No images were provided'
                  });
                  return;
                }

                if (!files.currentFile()) {
                  e.currentTarget.value = "";
                  toast.error("No file", {
                    description: "Create a File to continue",
                  });
                  return;
                }

                const file = e.currentTarget.files[0];
                if (!file.type.startsWith('image')) {
                  toast.error('Wrong format', {
                    description: 'This file is not an image',
                  });
                  return;
                }

                loadNewPhoto(file, files.currentFile()!, setPicture);
              }
            }
          />
        </label>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          disabled={files.currentFile() === null || files.currentFile()!.isEmpty() || files.currentFile()!.isFirst()}
          onClick={() => {
            files.currentFile()!.revert();
            setPicture(files.currentFile()!.getCurrentPhoto()!.src)
          }}
          className="flex flex-row w-full justify-between gap-5"
        >
          Back
          <ArrowLeftCircle />
        </ContextMenuItem>
        <ContextMenuItem
          disabled={files.currentFile() === null || files.currentFile()!.isEmpty() || files.currentFile()!.isLast()}
          onClick={() => {
            files.currentFile()!.undoRevert();
            setPicture(files.currentFile()!.getCurrentPhoto()!.src)
          }}
          className="flex flex-row w-full justify-between gap-5"
        >
          Forward
          <ArrowRightCircle />
        </ContextMenuItem>
        <ContextMenuItem
          disabled={files.currentFile() === null || files.currentFile()!.isEmpty() || files.currentFile()!.isFirst()}
          onClick={() => {
            files.currentFile()!.reset();
            setPicture(files.currentFile()!.getCurrentPhoto()!.src)
          }}
          className="flex flex-row w-full justify-between gap-5"
        >
          Reset
          <Trash2 />
        </ContextMenuItem>
        <ContextMenuItem
          disabled={files.currentFile() === null || files.currentFile()!.isEmpty()}
          onClick={() => {
            files.currentFile()!.makeNew();
            setPicture('/placeholder.jpg')
          }}
          className="flex flex-row w-full justify-between gap-5"
        >
          Delete Photo
          <LucideX />
        </ContextMenuItem>
        <ContextMenuItem
          disabled={files.currentFile() === null || files.currentFile()!.isEmpty()}
          className="flex flex-row w-full justify-between gap-5"
          onClick={() => toast.info("WIP", { description: 'Work in Progress' })}
        >
          Rotate Left
          <RotateCcw />
        </ContextMenuItem>
        <ContextMenuItem
          disabled={files.currentFile() === null || files.currentFile()!.isEmpty()}
          className="flex flex-row w-full justify-between gap-5"
          onClick={() => toast.info("WIP", { description: 'Work in Progress' })}
        >
          Rotate Right
          <RotateCw />
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}