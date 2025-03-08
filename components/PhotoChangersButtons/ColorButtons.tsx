import { GrayScaleButton } from "../FunctionsButtons/Color/GrayScaleButton";
import { BrightnessButton } from "../FunctionsButtons/Color/BrightnessButton";
import { NegativeButton } from "../FunctionsButtons/Color/NegativeButton";
import { BinarizationButton } from "../FunctionsButtons/Color/BinarizationButton";
import { HistogramButton } from "../FunctionsButtons/Color/HistogramButton";
import { ContrastButton } from "../FunctionsButtons/Color/ContrastButton";
import { GammaButton } from "../FunctionsButtons/Color/GammaButton";
import { KvantationButton } from "../FunctionsButtons/Color/KvantationButton";
import { PseudoColoringButton } from "../FunctionsButtons/Color/PseudoColoringButton";
import FileElement from "@/lib/structures";
import { SolarizationButton } from "../FunctionsButtons/Color/SolarizationButton";

export default function ColorButtons({ file }: { file: FileElement }) {
  return (
    <div className="@container">
      <div className="grid grid-cols-2 @md:grid-cols-3 @xl:grid-cols-4 @3xl:grid-cols-5 @4xl:grid-cols-6 @6xl:grid-cols-7 gap-5 p-6 h-full">
        <GrayScaleButton file={file} />
        <BrightnessButton file={file} />
        <NegativeButton file={file} />
        <BinarizationButton file={file} />
        <ContrastButton file={file} />
        <HistogramButton file={file} />
        <GammaButton file={file} />
        <KvantationButton file={file} />
        <PseudoColoringButton file={file} />
        <SolarizationButton file={file} />
      </div>
    </div>
  );
}
