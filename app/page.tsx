'use client'

import Container from "@/components/ResizableContainer";
import FilesSlider from "@/components/FilesSlider";
import { SquarePlus, SquareX } from "lucide-react";
import { useState } from "react";

export default function App() {

  const [fileId, setFileId] = useState<number>(1);
  // TODO: change file to File type
  const [photos, setPhotos] = useState<{ file: string, id: number }[]>([]);

  return (
    <div className="flex flex-1 flex-col h-full gap-3">
      <div className="flex w-full justify-between">
        <FilesSlider photos={photos} setPhotos={setPhotos} />
        <SquarePlus className="w-12 h-12 my-auto ml-2 hover:text-green-500" 
          onClick={() => {
            setPhotos([...photos, { file: 'test', id: fileId }]);
            setFileId(fileId + 1);
          }
        }/>
        <SquareX className="w-12 h-12 my-auto ml-2 hover:text-red-500" onClick={() => { setPhotos([]); setFileId(1) }} />
      </div>
      <Container />
    </div>
  );
}