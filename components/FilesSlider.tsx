import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import Tab from '@/components/FileTab'
import StackList from '@/lib/structures'

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export default function FilesSlider({ stacks, setStacks }: { stacks: StackList, setStacks: Function}) {
  return (
    <ScrollArea className='border-white border p-2 h-14 rounded-lg whitespace-nowrap max-w-[90vw] w-full'>
      <div className='flex gap-4'>
        {
          stacks.getFiles().map(({ id }, idx) => {
            return (
              <div key={idx} className='text-white'>
                <Tab idx={id} stacks={stacks} setStacks={setStacks}/>
              </div>
            );
          })
        }
      </div>
      <ScrollBar orientation='horizontal' />
    </ScrollArea>
  )
}