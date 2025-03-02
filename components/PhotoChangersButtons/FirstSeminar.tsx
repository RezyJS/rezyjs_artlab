/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import StackList from "@/lib/structures";
import { GrayScaleButton } from "../FunctionsButtons/GrayScaleButton";
import { BrightnessButton } from "../FunctionsButtons/BrightnessButton";
import { NegativeButton } from "../FunctionsButtons/NegativeButton";
import { BinarizationButton } from "../FunctionsButtons/BinarizationButton";
import { HistogramButton } from "../FunctionsButtons/HistogramButton";
import { ContrastButton } from "../FunctionsButtons/ContrastButton";
import { GammaButton } from "../FunctionsButtons/GammaButton";

export default function FirstSeminar({ stacks, setPicture }: { stacks: StackList, setPicture: Function }) {
  return (
    <div className="@container">
      <div className="grid w-max grid-cols-2 @md:grid-cols-3 @xl:grid-cols-4 @3xl:grid-cols-5 @4xl:grid-cols-6 @6xl:grid-cols-7 gap-5 p-6 h-full">
        <GrayScaleButton stacks={stacks} setPicture={setPicture} />
        <BrightnessButton stacks={stacks} setPicture={setPicture} />
        <NegativeButton stacks={stacks} setPicture={setPicture} />
        <BinarizationButton stacks={stacks} setPicture={setPicture} />
        <ContrastButton stacks={stacks} setPicture={setPicture} />
        <HistogramButton stacks={stacks} setPicture={setPicture} />
        <GammaButton stacks={stacks} setPicture={setPicture} />
      </div>
    </div>
  );
}
