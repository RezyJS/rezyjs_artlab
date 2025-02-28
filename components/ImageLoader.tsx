/* eslint-disable @next/next/no-img-element */

'use client'

import StackList from "@/lib/structures";
import { useEffect, useState } from "react";
import { imageOperation, loadNewPhoto } from "@/lib/photos";
import { toast } from "sonner";

export default function ImageLoader({ files }: { files: StackList }) {
  
  const [picture, setPicture] = useState<string>('/placeholder.jpg');

  useEffect(() => {
    if (files.currentFile()) {
      if (!files.currentFile()?.isEmpty()) {
        imageOperation(files.currentFile()!.getCurrentPhoto()!, null, files.currentFile()!, setPicture);
      } else {
        setPicture('/placeholder.jpg');
      }
    } else {
      setPicture('/placeholder.jpg')
    }
  }, [files])

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
              console.info('toasting')
              toast.error("Error occurred!", {
                description: "Create a File to continue!",
              });
              console.info(files.currentFile());
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