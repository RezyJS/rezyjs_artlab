/* eslint-disable @next/next/no-img-element */
'use client';

import { loadNewPhoto } from "@/lib/photosMain";
import { toast } from "sonner";
import FileElement from "@/lib/structures";
import { useState } from 'react';

export default function ImageLoader({ file }: { file: FileElement }) {
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

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;

    if (droppedFiles.length > 0) {
      // Обработка файлов из файловой системы
      const myFile = droppedFiles[0];
      if (!myFile.type.startsWith('image')) {
        toast.error('Wrong format', {
          description: 'This file is not an image',
        });
        return;
      }
      loadNewPhoto(myFile, file);
    } else {
      // Обработка URL изображения из браузера
      const url = e.dataTransfer.getData('URL') || e.dataTransfer.getData('text/uri-list');
      if (url) {
        try {
          const response = await fetch(url, { mode: 'cors' });
          if (!response.ok) throw new Error('Network response was not ok');
          const blob = await response.blob();
          if (!blob.type.startsWith('image')) {
            toast.error('Wrong format', {
              description: 'The URL does not point to an image',
            });
            return;
          }
          const filename = url.split('/').pop() || 'image.jpg';
          const myFile = new File([blob], filename, { type: blob.type || 'image/jpeg' });
          loadNewPhoto(myFile, file);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          toast.error('Error loading image', {
            description: 'Failed to load image from URL',
          });
        }
      } else {
        toast.error('No data', {
          description: 'No image was provided',
        });
      }
    }
  };

  return (
    <label
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`h-full flex flex-col justify-center items-center gap-1 cursor-pointer w-full ${isDragging ? 'border-2 border-dashed border-blue-500 bg-blue-100' : ''} ${file.isEmpty() ? 'p-10' : 'p-4'}`}
    >
      {file.isEmpty() && (
        <div className="flex flex-col text-center font-semibold text-lg">
          <p>Click to load image<br />&dArr;</p>
        </div>
      )}
      <img
        src={file.getCurrentPhoto()?.src || '/placeholder.jpg'}
        alt="image"
        className='max-w-full max-h-full object-contain'
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