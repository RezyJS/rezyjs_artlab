'use client'

import FilesContainer from '@/lib/structures';
import { SquareX } from 'lucide-react'

export default function Tab({ idx, files }: { idx: number, files: FilesContainer }) {
  return (
    <div
      className='flex justify-between items-center border rounded-md py-[6px] pl-4 gap-2 cursor-pointer'
      onClick={
        () => {
          files.setCurrentFile(idx);
        }}
    >
      <div className='flex justify-center flex-1'>
        <p>File {idx}</p>
      </div>
      <div className='ml-2 flex h-full'>
        <div className='h-full w-[1px] bg-white'></div>
        <SquareX className='mx-2 hover:text-red-600 cursor-pointer' onClick={
          (e) => {
            e.stopPropagation();
            files.delFile(idx);
          }
        } />
      </div>
    </div>
  );
}