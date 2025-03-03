import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import Tab from '@/components/FilesManager/FileTab'
import FilesContainer from '@/lib/structures';

export default function FilesSlider({ files }: { files: FilesContainer }) {
  return (
    <ScrollArea className='border-white border p-2 h-14 rounded-lg whitespace-nowrap max-w-[90vw] w-full'>
      <div className='flex gap-4'>
        {
          files.getFiles().map(({ id }, idx) => {
            return (
              <div key={idx} className='text-white'>
                <Tab idx={id} files={files} />
              </div>
            );
          })
        }
      </div>
      <ScrollBar orientation='horizontal' />
    </ScrollArea>
  )
}