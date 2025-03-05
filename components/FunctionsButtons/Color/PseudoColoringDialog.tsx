import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { ArrowLeft, ArrowRight, CircleCheck } from 'lucide-react';
import { MyDefaultButton } from './Buttons';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import FileElement from '@/lib/structures';
import { useState } from 'react';
import { ColorPicker } from '../../ui/color-picker';
import { makePseudoColoring } from '@/lib/photosHandlers';

export const PseudoColoringDialog = ({ bordersCount, file }: { bordersCount: number, file: FileElement }) => {

  const [borders, setBorders] = useState([0]);
  const [colors, setColors] = useState<Array<string>>([]);
  const [, setColor] = useState('#ffffff');
  const [currentBorder, setCurrentBorder] = useState(1);
  const [prevBorderVal, setPrevBorderVal] = useState(borders[0]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex justify-evenly">
          <MyDefaultButton
            text='Make'
            callback={() => { }}>
            <CircleCheck />
          </MyDefaultButton>
        </div>
      </DialogTrigger>
      <DialogContent>
        <ScrollArea className='flex flex-col gap-2 min-h-[10vh] max-h-[90vh] max-w-[90vw] justify-evenly overflow-hidden'>
          <DialogTitle >Intervals coloring</DialogTitle>
          <DialogDescription>Input right borders of your intervals</DialogDescription>
          <div className='flex flex-col justify-center items-center h-full w-full p-5 gap-5'>
            {
              currentBorder < bordersCount ?
                <div className='flex gap-5'>
                  <label className='flex w-fit items-center gap-5'>
                    <p>{currentBorder}:</p>
                    <p>from {
                      borders[currentBorder - 1] !== undefined ?
                        String(borders[currentBorder - 1]).padStart(3, '0')
                        : 'null'
                    } to</p>
                    <Input
                      type='number'
                      min={prevBorderVal}
                      max={255}
                      className='w-20'
                      onInput={(e) => {
                        const value = +e.currentTarget.value;
                        if (value > prevBorderVal && value < 256) {
                          borders[currentBorder] = value;
                          setBorders(borders);
                        }
                      }}
                    />
                  </label>
                  <ColorPicker
                    value={colors[currentBorder - 1]}
                    onChange={(curColor) => { setColor(curColor); colors[currentBorder - 1] = curColor; setColors(colors); }}
                  />
                </div>
                : currentBorder === bordersCount ?
                  <div className='flex gap-5'>
                    <label className='flex w-fit items-center gap-5'>
                      <p>{currentBorder}:</p>
                      <p>from {
                        borders[currentBorder - 1] !== undefined ?
                          String(borders[currentBorder - 1]).padStart(3, '0')
                          : 'null'
                      } to 255</p>
                    </label>
                    <ColorPicker
                      value={colors[currentBorder - 1]}
                      onChange={(curColor) => { setColor(curColor); colors[currentBorder - 1] = curColor; setColors(colors); }}
                    />
                  </div>
                  : <Button
                    disabled={borders.filter(item => item !== undefined).length - 1 !== bordersCount - 1}
                    onClick={() => {
                      borders.push(255);
                      setBorders(borders);
                      makePseudoColoring(borders, colors, file);
                    }}
                    className='w-full'
                  >
                    Confirm
                  </Button>
            }
            <div className='flex gap-5'>
              <Button
                disabled={currentBorder === 1}
                onClick={() => {
                  setCurrentBorder(prev => prev - 1);
                  setPrevBorderVal(borders[currentBorder - 2]);
                }}
              >
                <ArrowLeft />
              </Button>
              <Button
                disabled={currentBorder === bordersCount + 1}
                onClick={() => {
                  setCurrentBorder(prev => prev + 1);
                  setPrevBorderVal(borders[currentBorder]);
                  if (colors[currentBorder - 1] === undefined) {
                    colors[currentBorder - 1] = '#ffffff';
                    setColors(colors);
                  }
                }}
              >
                <ArrowRight />
              </Button>
            </div>
          </div>
          <ScrollBar orientation='vertical' />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
