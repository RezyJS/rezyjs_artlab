/* eslint-disable @next/next/no-img-element */
'use client'

import { loadNewPhoto } from "@/lib/photosMain";
import { toast } from "sonner";
import FileElement from "@/lib/structures";
import { useState } from 'react';

export default function ImageLoader({ file }: { file: FileElement, picture: string }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const myFile = droppedFiles[0];
      if (!myFile.type.startsWith('image')) {
        toast.error('Wrong format', {
          description: 'This file is not an image',
        });
        return;
      }
      loadNewPhoto(myFile, file);
    }
  };

  return (
    <label
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`h-full flex flex-col justify-center items-center gap-1 cursor-pointer w-full object-contain ${isDragging ? 'border-2 border-dashed border-blue-500 bg-blue-100' : ''
        } ${file.isEmpty() ? 'p-10' : 'p-4'}`}
    >
      {file.isEmpty() && (
        <div className="flex flex-col text-center font-semibold text-lg">
          <p>Click to load image<br />&dArr;</p>
        </div>
      )}
      <img
        src={file.getCurrentPhoto()?.src || '/placeholder.jpg'}
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
        onClick={(e) => e.currentTarget.value = ""}
        onInput={(e) => {
          const files = e.currentTarget.files;
          if (!files) {
            toast.error("No data", { description: 'No images were provided' });
            return;
          }
          const myFile = files[0];
          if (!myFile.type.startsWith('image')) {
            toast.error('Wrong format', { description: 'This file is not an image' });
            return;
          }
          loadNewPhoto(myFile, file);
        }}
      />
    </label>
  );
}