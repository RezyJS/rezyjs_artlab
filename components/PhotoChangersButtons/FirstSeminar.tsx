import { GrayScaleButton } from "../FunctionsButtons/GrayScaleButton";
import { BrightnessButton } from "../FunctionsButtons/BrightnessButton";
import { NegativeButton } from "../FunctionsButtons/NegativeButton";
import { BinarizationButton } from "../FunctionsButtons/BinarizationButton";
import { HistogramButton } from "../FunctionsButtons/HistogramButton";
import { ContrastButton } from "../FunctionsButtons/ContrastButton";
import { GammaButton } from "../FunctionsButtons/GammaButton";
import { KvantationButton } from "../FunctionsButtons/KvantationButton";
import { PseudoColoringButton } from "../FunctionsButtons/PseudoColoringButton";
import FileElement from "@/lib/structures";

export default function FirstSeminar({ file }: { file: FileElement }) {
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
      </div>
    </div>
  );
}
