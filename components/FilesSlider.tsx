import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import Tab from '@/components/FileTab'

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export default function FilesSlider({ photos, setPhotos }: { photos: { file: string, id: number }[], setPhotos: Function }) {
  return (
    <ScrollArea className='border-white border p-2 h-14 rounded-lg whitespace-nowrap max-w-[90vw] w-full'>
      <div className='flex gap-4'>
        { 
          photos.filter(({ id }) => id !== undefined).map(({ id }, idx) => (<Tab idx={id} key={idx} setPhotos={setPhotos}/>))
        }
      </div>
      <ScrollBar orientation='horizontal' />
    </ScrollArea>
  )
}