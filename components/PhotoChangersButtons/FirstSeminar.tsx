/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import StackList from "@/lib/structures";
import {
  GrayScaleButton,
  BrightnessButton,
  NegativeButton,
  BinarizationButton
} from '@/components/Buttons'

export default function FirstSeminar({ stacks, setPicture }: { stacks: StackList, setPicture: Function }) {
  return (
    <div className="grid grid-cols-3 gap-5">
      <GrayScaleButton stacks={stacks} setPicture={setPicture} />
      <BrightnessButton stacks={stacks} setPicture={setPicture} />
      <NegativeButton stacks={stacks} setPicture={setPicture} />
      <BinarizationButton stacks={stacks} setPicture={setPicture} />
      {/* TODO: Contrast */}
      <NegativeButton stacks={stacks} setPicture={setPicture} />
      {/* TODO: Histogram */}
      <NegativeButton stacks={stacks} setPicture={setPicture} />
    </div>
  );
}
