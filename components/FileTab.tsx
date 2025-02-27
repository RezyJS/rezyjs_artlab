'use client'

import { SquareX } from 'lucide-react'

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export default function Tab({ idx, setPhotos }: { idx: number, setPhotos: Function }) {
  return (
    <div className='flex justify-between items-center border rounded-md py-1 pl-4 gap-2'>
      <div className='flex justify-center flex-1'>
        <p>File {idx}</p>
      </div>
      <div className='ml-2 flex h-full'>
        <div className='h-full w-[1px] bg-white'></div>
        <SquareX className='mx-2 hover:text-red-600' onClick={
          () => setPhotos(( photos: { file: string, id: number }[] ) => photos.filter(({ id }) => id !== idx ))
        } />
      </div>
    </div>
  );
}