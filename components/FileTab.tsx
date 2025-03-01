'use client'

import StackList from '@/lib/structures';
import { SquareX } from 'lucide-react'

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export default function Tab({ idx, stacks, setStacks }: { idx: number, setStacks: Function, stacks: StackList }) {
  return (
    <div 
      className='flex justify-between items-center border rounded-md py-[6px] pl-4 gap-2 cursor-pointer'
      onClick={() => { stacks.setCurrentFile(idx); setStacks(new StackList(stacks.getFiles(), idx))}}  
    >
      <div className='flex justify-center flex-1'>
        <p>File {idx}</p>
      </div>
      <div className='ml-2 flex h-full'>
        <div className='h-full w-[1px] bg-white'></div>
        <SquareX className='mx-2 hover:text-red-600 cursor-pointer' onClick={
          (e) => { e.stopPropagation(); stacks.delFile(idx); setStacks(new StackList(stacks.getFiles())); }
        } />
      </div>
    </div>
  );
}