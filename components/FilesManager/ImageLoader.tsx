/* eslint-disable @next/next/no-img-element */
'use client';

import { loadNewPhoto } from "@/lib/photosMain";
import { toast } from "sonner";
import FileElement from "@/lib/structures";
import { useState } from 'react';
import heic2any from "heic2any";

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
      // Process files from the file system
      const myFile = droppedFiles[0];
      await processFile(myFile, file);
    } else {
      // Process URL from the browser
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
          await processFile(myFile, file);
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

  const processFile = async (file: File, fileElement: FileElement) => {
    if (!file.type.startsWith('image') && file.type !== 'image/heic') {
      toast.error('Wrong format', {
        description: 'This file is not an image',
      });
      return;
    }

    let processedFile = file;

    // Convert HEIC files to JPEG
    if (file.type === 'image/heic') {
      try {
        const convertedBlob = (await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.8,
        })) as Blob;

        // Convert the Blob back to a File
        processedFile = new File([convertedBlob], file.name.replace('.heic', '.jpg'), {
          type: 'image/jpeg',
          lastModified: file.lastModified,
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error('Conversion error', {
          description: 'Failed to convert HEIC file',
        });
        return;
      }
    }

    // Create an HTMLImageElement from the processed File
    const image = await createImageFromBlob(processedFile);

    // Add the image to the FileElement stack
    fileElement.add(image);
    loadNewPhoto(processedFile, fileElement);
  };

  const createImageFromBlob = (blob: Blob): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(blob);
      img.onload = () => {
        URL.revokeObjectURL(url); // Clean up the object URL
        resolve(img);
      };
      img.onerror = (error) => {
        URL.revokeObjectURL(url); // Clean up the object URL
        reject(error);
      };
      img.src = url;
    });
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
        onInput={async (e) => {
          const files = e.currentTarget.files;
          if (!files) {
            toast.error("No data", { description: 'No images were provided' });
            return;
          }
          const myFile = files[0];
          await processFile(myFile, file);
        }}
      />
    </label>
  );
}