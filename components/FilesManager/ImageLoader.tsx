/* eslint-disable @next/next/no-img-element */

'use client'

import { loadNewPhoto } from "@/lib/photosMain";
import { toast } from "sonner";
import FileElement from "@/lib/structures";

export default function ImageLoader({ file }: { file: FileElement, picture: string }) {
  return (
    <label
      className={`h-full flex flex-col justify-center items-center gap-1 cursor-pointer w-full object-contain ${file.isEmpty() ? 'p-10' : 'p-4'}`}
    >
      {
        file.isEmpty() ?
          <div className="flex flex-col text-center font-semibold text-lg">
            <p>Click to load image<br />&dArr;</p>
          </div>
          : <></>
      }
      <img
        src={file.getCurrentPhoto() ? file.getCurrentPhoto()!.src : '/placeholder.jpg'}
        alt="image"
        width={0}
        height={0}
        sizes="100vh"
        className='max-w-fit max-h-fit h-full w-full object-contain'
      />
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
  );
}