/* eslint-disable @next/next/no-img-element */

'use client'

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
import FileElement from "@/lib/structures";

export default function ImageLoader({ file }: { file: FileElement, picture: string }) {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="h-full">
        <label className="h-full flex flex-col justify-center items-center gap-5 cursor-pointer w-full p-6 object-contain">
          <img src={file.getCurrentPhoto() ? file.getCurrentPhoto()!.src : '/placeholder.jpg'} alt="image" width={0} height={0} sizes="100vh" className="max-w-fit max-h-fit h-full w-full object-contain" />
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

                const myFile = e.currentTarget.files[0];
                if (!myFile.type.startsWith('image')) {
                  toast.error('Wrong format', {
                    description: 'This file is not an image',
                  });
                  return;
                }

                loadNewPhoto(myFile, file);
              }
            }
          />
        </label>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          disabled={file.isEmpty() || file.isFirst()}
          onClick={() => {
            file.revert()
          }}
          className="flex flex-row w-full justify-between gap-5"
        >
          Back
          <ArrowLeftCircle />
        </ContextMenuItem>
        <ContextMenuItem
          disabled={file.isEmpty() || file.isLast()}
          onClick={() => {
            file.undoRevert()
          }}
          className="flex flex-row w-full justify-between gap-5"
        >
          Forward
          <ArrowRightCircle />
        </ContextMenuItem>
        <ContextMenuItem
          disabled={file.isEmpty() || file.isFirst()}
          onClick={() => {
            file.reset()
          }}
          className="flex flex-row w-full justify-between gap-5"
        >
          Reset
          <Trash2 />
        </ContextMenuItem>
        <ContextMenuItem
          disabled={file.isEmpty()}
          onClick={() => {
            file.newStack();
          }}
          className="flex flex-row w-full justify-between gap-5"
        >
          Delete Photo
          <LucideX />
        </ContextMenuItem>
        <ContextMenuItem
          disabled={file.isEmpty()}
          className="flex flex-row w-full justify-between gap-5"
          onClick={() => toast.info("WIP", { description: 'Work in Progress' })}
        >
          Rotate Left
          <RotateCcw />
        </ContextMenuItem>
        <ContextMenuItem
          disabled={file.isEmpty()}
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