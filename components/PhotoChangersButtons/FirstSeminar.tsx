/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import StackList from "@/lib/structures";
import {
  GrayScaleButton,
  BrightnessButton,
  NegativeButton,
  BinarizationButton,
  HistogramButton
} from '@/components/Buttons'

export default function FirstSeminar({ stacks, setPicture }: { stacks: StackList, setPicture: Function }) {
  return (
    <div className="container grid w-max gap-5 p-6 h-full">
      <GrayScaleButton stacks={stacks} setPicture={setPicture} />
      <BrightnessButton stacks={stacks} setPicture={setPicture} />
      <NegativeButton stacks={stacks} setPicture={setPicture} />
      <BinarizationButton stacks={stacks} setPicture={setPicture} />
      {/* TODO: Contrast */}
      {/* <NegativeButton stacks={stacks} setPicture={setPicture} /> */}
      {/* TODO: Histogram */}
      {
        (stacks.currentFile() !== null && !stacks.currentFile()?.isEmpty()) ?
        <HistogramButton stacks={stacks} setPicture={setPicture} /> :
        <></>
      }
    </div>
  );
}
