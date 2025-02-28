/* eslint-disable @next/next/no-img-element */

'use client'

import StackList from "@/lib/structures";
import { loadNewPhoto } from "@/lib/photos";
import { toast } from "sonner";

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export default function ImageLoader({ files, picture, setPicture }: { files: StackList, picture: string, setPicture: Function }) {
  return (
    <label className="flex h-full items-center justify-center p-6 max-h-[650px]">
      <img src={picture} alt="image" width={0} height={0} sizes="100vh" className="cursor-pointer max-w-fit max-h-fit h-full w-full object-contain"/>
      <input 
        type="file" 
        name="input"
        id="input" 
        className='hidden'
        onInputCapture={
          (e) => {
            if (!e.currentTarget.files) {
              toast("Error. No files provided!");
              console.error(`No files`)
              return;
            }

            if (!files.currentFile()) {
              toast.error("Error occurred!", {
                description: "Create a File to continue!",
              });
              return;
            }

            const file = e.currentTarget.files[0];
            if (!file.type.startsWith('image')) {
              alert('This file is not an image!')
              return;
            }

            loadNewPhoto(file, files.currentFile()!, setPicture);
          }
        }
      />
    </label>
  );
}